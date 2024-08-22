package users

import (
	"auth-service/models"
	"auth-service/pkg/database"
	"auth-service/view"
	"context"
	"encoding/json"
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
	// if !auth.Authenticate(r) {
	// 	http.Error(w, "Unauthorized", http.StatusUnauthorized)
	// 	return
	// }

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
	collection := database.GetCollection(client, "Users", "users")
	err = collection.FindOne(context.Background(), bson.M{"_id": objID}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			http.Error(w, "User not found", http.StatusNotFound)
		} else {
			http.Error(w, "Error retrieving user", http.StatusInternalServerError)
		}
		return
	}

	userView := view.User{
		ID:        user.ID.Hex(),
		Username:  user.Username,
		Email:     user.Email,
		AvatarURL: user.AvatarURL,
	}

	json.NewEncoder(w).Encode(userView)

	w.Header().Set("Content-Type", "application/json")
}

// GetUsers retrieves a list of all users
func GetUsers(w http.ResponseWriter, r *http.Request) {
	// if !auth.Authenticate(r) {
	// 	http.Error(w, "Unauthorized", http.StatusUnauthorized)
	// 	return
	// }

	client := database.GetDatabaseConnection()

	var users []models.User
	collection := database.GetCollection(client, "Users", "users")
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

	usersView := make([]view.User, 0, len(users))
	for _, user := range users {
		usersView = append(usersView, view.User{
			ID:        user.ID.Hex(),
			Username:  user.Username,
			Email:     user.Email,
			AvatarURL: user.AvatarURL,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(usersView)
}

func GetUsersWithFilterQuery(w http.ResponseWriter, r *http.Request) {
	// if !auth.Authenticate(r) {
	// 	http.Error(w, "Unauthorized", http.StatusUnauthorized)
	// 	return
	// }

	client := database.GetDatabaseConnection()

	userID := r.URL.Query().Get("user_id")

	filter := r.URL.Query().Get("filter")

	var users []models.User
	collection := database.GetCollection(client, "Users", "users")
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

	usersView := make([]view.User, 0, len(users))
	for _, user := range users {
		if userID != "" && user.ID.Hex() == userID {
			continue
		}
		usersView = append(usersView, view.User{
			ID:        user.ID.Hex(),
			Username:  user.Username,
			Email:     user.Email,
			AvatarURL: user.AvatarURL,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(usersView)
}
