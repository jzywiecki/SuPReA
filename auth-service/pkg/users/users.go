package users

import (
	"auth-service/models"
	"auth-service/pkg/database"
	"auth-service/view"
	"context"
	"encoding/json"
	"fmt"
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
	r.Post("/friends", AddUserToFriends)
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

	filter := r.URL.Query().Get("filter")
	fmt.Println(filter)

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

func GetUserFriends(w http.ResponseWriter, r *http.Request) {
	// if !auth.Authenticate(r) {
	// 	http.Error(w, "Unauthorized", http.StatusUnauthorized)
	// 	return
	// }

	client := database.GetDatabaseConnection()

	userId := r.URL.Query().Get("id")
	if userId == "" {
		http.Error(w, "User ID is required", http.StatusBadRequest)
		return
	}

	objID, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		http.Error(w, "Invalid user ID format", http.StatusBadRequest)
		return
	}

	collection := database.GetCollection(client, "Users", "users")

	var user models.User
	err = collection.FindOne(context.Background(), bson.M{"_id": objID}).Decode(&user)
	if err != nil {
		http.Error(w, "Error retrieving user", http.StatusInternalServerError)
		return
	}

	// Retrieve friends' details
	friendIDs := make([]primitive.ObjectID, len(user.Friends))
	friendStatusMap := make(map[primitive.ObjectID]models.FriendshipStatus)
	for i, friend := range user.Friends {
		friendIDs[i] = friend.ID
		friendStatusMap[friend.ID] = friend.Status
	}

	filter := bson.M{"_id": bson.M{"$in": friendIDs}}
	cursor, err := collection.Find(context.Background(), filter)
	if err != nil {
		http.Error(w, "Error retrieving friends", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.Background())

	var friends []models.FriendDetails
	for cursor.Next(context.Background()) {
		var friendUser models.User
		if err := cursor.Decode(&friendUser); err != nil {
			http.Error(w, "Error decoding friend data", http.StatusInternalServerError)
			return
		}

		friendDetails := models.FriendDetails{
			ID:        friendUser.ID,
			Username:  friendUser.Username,
			Email:     friendUser.Email,
			AvatarURL: friendUser.AvatarURL,
			Status:    friendStatusMap[friendUser.ID],
		}
		friends = append(friends, friendDetails)
	}

	if err := cursor.Err(); err != nil {
		http.Error(w, "Error during cursor iteration", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(friends)
}

func AddUserToFriends(w http.ResponseWriter, r *http.Request) {
	// if !auth.Authenticate(r) {
	// 	http.Error(w, "Unauthorized", http.StatusUnauthorized)
	// 	return
	// }

	client := database.GetDatabaseConnection()

	userId := r.URL.Query().Get("user_id")
	if userId == "" {
		http.Error(w, "User ID is required", http.StatusBadRequest)
		return
	}

	friendId := r.URL.Query().Get("friend_id")
	if friendId == "" {
		http.Error(w, "Friend ID is required", http.StatusBadRequest)
		return
	}

	objID, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		http.Error(w, "Invalid user ID format", http.StatusBadRequest)
		return
	}

	friendObjID, err := primitive.ObjectIDFromHex(friendId)
	if err != nil {
		http.Error(w, "Invalid friend ID format", http.StatusBadRequest)
		return
	}

	collection := database.GetCollection(client, "Users", "users")

	// Check if user and friend exist
	var user models.User
	err = collection.FindOne(context.Background(), bson.M{"_id": objID}).Decode(&user)
	if err != nil {
		http.Error(w, "Error retrieving user", http.StatusInternalServerError)
		return
	}

	var friend models.User
	err = collection.FindOne(context.Background(), bson.M{"_id": friendObjID}).Decode(&friend)
	if err != nil {
		http.Error(w, "Error retrieving friend", http.StatusInternalServerError)
		return
	}

	// Check if user is already friends with the friend
	for _, friend := range user.Friends {
		if friend.ID == friendObjID {
			http.Error(w, "User is already friends with this user", http.StatusBadRequest)
			return
		}
	}

	// Add friend to user's friends list
	_, err = collection.UpdateOne(context.Background(), bson.M{"_id": objID}, bson.M{
		"$push": bson.M{"friends": bson.M{
			"_id":    friendObjID,
			"status": models.InvitedByUser,
		}},
	})
	if err != nil {
		http.Error(w, "Error adding friend to user's friends list", http.StatusInternalServerError)
		return
	}

	// Add user to friend's friends list
	_, err = collection.UpdateOne(context.Background(), bson.M{"_id": friendObjID}, bson.M{
		"$push": bson.M{"friends": bson.M{
			"_id":    objID,
			"status": models.InvitedByFriend,
		}},
	})
	if err != nil {
		http.Error(w, "Error adding user to friend's friends list", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
