package users

import (
	"auth-service/models"
	"auth-service/pkg/auth"
	"auth-service/pkg/database"
	"auth-service/pkg/utils"
	"auth-service/view"
	"context"
	"encoding/json"
	"log"
	"net/http"
	"regexp"

	"github.com/go-chi/chi/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func NewUsersRouter() *chi.Mux {
	r := chi.NewRouter()
	r.Get("/", GetUsers)
	r.Get("/{id}", GetUserByID)
	r.Get("/projects/{project_id}", GetUsersByProjectID)
	r.Patch("/{id}", PatchUser)
	r.Post("/{id}/reset-avatar", ResetAvatar)
	r.Get("/friends", GetUserFriends)
	r.Post("/friends/add", AddUserToFriends)
	r.Post("/friends/accept", AcceptUserToFriends)
	r.Post("/friends/reject", RejectUserToFriends)
	r.Post("/friends/remove", RemoveFriend)
	r.Get("/filter", GetUsersWithFilterQuery)
	return r
}

// GetUserByID retrieves a user by their ID
func GetUserByID(w http.ResponseWriter, r *http.Request) {
	isAuthenticated, err := auth.Authenticate(r)
	if !isAuthenticated {
		log.Printf("Unauthorized request from %s with error message %s", r.RemoteAddr, err)
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Extract user ID from URL path
	userID := chi.URLParam(r, "id")
	if userID == "" {
		http.Error(w, "User ID is required", http.StatusBadRequest)
		return
	}

	// Convert user ID string to MongoDB ObjectID
	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		http.Error(w, "Invalid user ID format", http.StatusBadRequest)
		return
	}

	client := database.GetDatabaseConnection()

	var user models.User
	collection := database.GetCollection(client, "Projects", "users")
	err = collection.FindOne(context.Background(), bson.M{"_id": objID}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(w, "User not found", http.StatusNotFound)
		} else {
			http.Error(w, "Error retrieving user", http.StatusInternalServerError)
		}
		return
	}

	userView := view.NewUserView(user)

	json.NewEncoder(w).Encode(userView)
	w.Header().Set("Content-Type", "application/json")
}

// GetUsers retrieves a list of all users
func GetUsers(w http.ResponseWriter, r *http.Request) {
	isAuthenticated, err := auth.Authenticate(r)
	if !isAuthenticated {
		log.Printf("Unauthorized request from %s with error message %s", r.RemoteAddr, err)
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	client := database.GetDatabaseConnection()

	var users []models.User
	collection := database.GetCollection(client, "Projects", "users")
	cursor, err := collection.Find(context.Background(), bson.M{}, options.Find())
	if err != nil {
		http.Error(w, "Error retrieving users", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var user models.User
		if err := cursor.Decode(&user); err != nil {
			http.Error(w, "Error decoding user", http.StatusInternalServerError)
			return
		}
		users = append(users, user)
	}

	if err := cursor.Err(); err != nil {
		http.Error(w, "Cursor error", http.StatusInternalServerError)
		return
	}

	usersView := make([]view.UserView, 0, len(users))
	for _, user := range users {
		usersView = append(usersView, view.NewUserView(user))
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(usersView)
}

func GetUsersByProjectID(w http.ResponseWriter, r *http.Request) {
	isAuthenticated, err := auth.Authenticate(r)
	if !isAuthenticated {
		log.Printf("Unauthorized request from %s with error message %s", r.RemoteAddr, err)
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	client := database.GetDatabaseConnection()

	projectID := chi.URLParam(r, "project_id")
	if projectID == "" {
		http.Error(w, "User ID is required", http.StatusBadRequest)
		return
	}

	isUserInProject, err := auth.IsUserInProject(r, projectID)
	if err != nil {
		http.Error(w, "Invalid project ID format", http.StatusBadRequest)
		return
	}
	if !isUserInProject {
		log.Printf("Unauthorized request from %s with error message %s", r.RemoteAddr, err)
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Convert user ID string to MongoDB ObjectID
	projectObjectID, err := primitive.ObjectIDFromHex(projectID)
	if err != nil {
		http.Error(w, "Invalid user ID format", http.StatusBadRequest)
		return
	}

	var projectDoc bson.M
	projectsCollection := database.GetCollection(client, "Projects", "projects")
	err = projectsCollection.FindOne(context.Background(), bson.M{"_id": projectObjectID}).Decode(&projectDoc)
	if err != nil {
		http.Error(w, "Project not found", http.StatusNotFound)
		return
	}

	// Extract the "members" array from the project document
	membersIDs, ok := projectDoc["members"].(bson.A)
	if !ok || len(membersIDs) == 0 {
		http.Error(w, "No members found in the project", http.StatusNotFound)
		return
	}

	var objectIDs []primitive.ObjectID
	for _, id := range membersIDs {
		objectID, ok := id.(primitive.ObjectID)
		if ok {
			objectIDs = append(objectIDs, objectID)
		} else {
			log.Printf("Invalid member ID found: %v", id)
		}
	}

	var users []models.User
	usersCollection := database.GetCollection(client, "Projects", "users")
	cursor, err := usersCollection.Find(context.Background(), bson.M{
		"_id": bson.M{"$in": objectIDs},
	})
	if err != nil {
		http.Error(w, "Error retrieving users", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.Background())

	// Decode the users from the cursor
	for cursor.Next(context.Background()) {
		var user models.User
		if err := cursor.Decode(&user); err != nil {
			http.Error(w, "Error decoding user", http.StatusInternalServerError)
			return
		}
		users = append(users, user)
	}

	if err := cursor.Err(); err != nil {
		http.Error(w, "Cursor error", http.StatusInternalServerError)
		return
	}

	// Create user views and return them as JSON
	usersView := make([]view.UserView, 0, len(users))
	for _, user := range users {
		usersView = append(usersView, view.NewUserView(user))
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(usersView)
}

func GetUsersWithFilterQuery(w http.ResponseWriter, r *http.Request) {
	isAuthenticated, err := auth.Authenticate(r)
	if !isAuthenticated {
		log.Printf("Unauthorized request from %s with error message %s", r.RemoteAddr, err)
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	client := database.GetDatabaseConnection()

	filter := r.URL.Query().Get("filter")

	var users []models.User
	collection := database.GetCollection(client, "Projects", "users")
	cursor, err := collection.Find(context.Background(), bson.M{
		"$or": []bson.M{
			{"username": bson.M{
				"$regex":   regexp.QuoteMeta(filter),
				"$options": "i",
			}},
			{"email": bson.M{
				"$regex":   regexp.QuoteMeta(filter),
				"$options": "i",
			}},
		},
	}, options.Find())
	if err != nil {
		http.Error(w, "Error retrieving users", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var user models.User
		if err := cursor.Decode(&user); err != nil {
			http.Error(w, "Error decoding user", http.StatusInternalServerError)
			return
		}
		users = append(users, user)
	}

	if err := cursor.Err(); err != nil {
		http.Error(w, "Cursor error", http.StatusInternalServerError)
		return
	}

	usersView := make([]view.UserView, 0, len(users))
	for _, user := range users {
		usersView = append(usersView, view.NewUserView(user))
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(usersView)
}

func UpdateUser(w http.ResponseWriter, r *http.Request) {
	isAuthenticated, err := auth.Authenticate(r)
	if !isAuthenticated {
		log.Printf("Unauthorized request from %s with error message %s", r.RemoteAddr, err)
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Extract user ID from URL path
	userID := chi.URLParam(r, "id")
	if userID == "" {
		http.Error(w, "User ID is required", http.StatusBadRequest)
		return
	}

	isSenderRealUser, err := auth.IsSenderRealUser(r, userID)
	if err != nil {
		http.Error(w, "Invalid user ID format", http.StatusBadRequest)
		return
	}

	if !isSenderRealUser {
		log.Printf("Unauthorized request from %s with error message %s", r.RemoteAddr, err)
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Convert user ID string to MongoDB ObjectID
	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		http.Error(w, "Invalid user ID format", http.StatusBadRequest)
		return
	}

	client := database.GetDatabaseConnection()

	var user models.User
	collection := database.GetCollection(client, "Projects", "users")
	err = collection.FindOne(context.Background(), bson.M{"_id": objID}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(w, "User not found", http.StatusNotFound)
		} else {
			http.Error(w, "Error retrieving user", http.StatusInternalServerError)
		}
		return
	}

	var userFromRequest view.UserView
	err = json.NewDecoder(r.Body).Decode(&userFromRequest)
	if err != nil {
		http.Error(w, "Error decoding request body", http.StatusBadRequest)
		return
	}

	// Update user fields
	userFromRequest.UpdateUserFields(&user)

	// Update user in database
	_, err = collection.ReplaceOne(context.Background(), bson.M{"_id": objID}, user)
	if err != nil {
		http.Error(w, "Error updating user", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func PatchUser(w http.ResponseWriter, r *http.Request) {
	isAuthenticated, err := auth.Authenticate(r)
	if !isAuthenticated {
		log.Printf("Unauthorized request from %s with error message %s", r.RemoteAddr, err)
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Extract user ID from URL path
	userID := chi.URLParam(r, "id")
	if userID == "" {
		http.Error(w, "User ID is required", http.StatusBadRequest)
		return
	}

	isSenderRealUser, err := auth.IsSenderRealUser(r, userID)
	if err != nil {
		http.Error(w, "Invalid user ID format", http.StatusBadRequest)
		return
	}

	if !isSenderRealUser {
		log.Printf("Unauthorized request from %s with error message %s", r.RemoteAddr, err)
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Convert user ID string to MongoDB ObjectID
	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		http.Error(w, "Invalid user ID format", http.StatusBadRequest)
		return
	}

	// Parse request body into a map
	var updates map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&updates); err != nil {
		http.Error(w, "Invalid JSON format", http.StatusBadRequest)
		return
	}

	// Prepare MongoDB update document
	update := bson.M{
		"$set": updates,
	}

	// Get database connection and collection
	client := database.GetDatabaseConnection()
	collection := database.GetCollection(client, "Projects", "users")

	// Update the user document
	result, err := collection.UpdateOne(context.Background(), bson.M{"_id": objID}, update)
	if err != nil {
		http.Error(w, "Error updating user", http.StatusInternalServerError)
		return
	}

	// Check if the user was found and updated
	if result.MatchedCount == 0 {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
	w.WriteHeader(http.StatusOK)
}

func ResetAvatar(w http.ResponseWriter, r *http.Request) {
	isAuthenticated, err := auth.Authenticate(r)
	if !isAuthenticated {
		log.Printf("Unauthorized request from %s with error message %s", r.RemoteAddr, err)
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	userID := chi.URLParam(r, "id")
	if userID == "" {
		http.Error(w, "User ID is required", http.StatusBadRequest)
		return
	}

	isSenderRealUser, err := auth.IsSenderRealUser(r, userID)
	if err != nil {
		http.Error(w, "Invalid user ID format", http.StatusBadRequest)
		return
	}

	if !isSenderRealUser {
		log.Printf("Unauthorized request from %s with error message %s", r.RemoteAddr, err)
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Convert user ID string to MongoDB ObjectID
	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		http.Error(w, "Invalid user ID format", http.StatusBadRequest)
		return
	}

	client := database.GetDatabaseConnection()

	var user models.User
	collection := database.GetCollection(client, "Projects", "users")
	err = collection.FindOne(context.Background(), bson.M{"_id": objID}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(w, "User not found", http.StatusNotFound)
		} else {
			http.Error(w, "Error retrieving user", http.StatusInternalServerError)
		}
		return
	}

	avatarURL := utils.GetAvatarURL(user.Username)

	// Prepare MongoDB update document
	result, err := collection.UpdateOne(context.Background(), bson.M{"_id": objID}, bson.M{"$set": bson.M{"avatarurl": avatarURL}})

	if err != nil {
		http.Error(w, "Error updating user", http.StatusInternalServerError)
		return
	}

	// Check if the user was found and updated
	if result.MatchedCount == 0 {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(avatarURL)
	w.WriteHeader(http.StatusOK)
}
