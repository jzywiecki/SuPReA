package users

import (
	"auth-service/models"
	"auth-service/pkg/database"
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

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

	json.NewEncoder(w).Encode(friends)
	w.Header().Set("Content-Type", "application/json")
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

	if userId == friendId {
		http.Error(w, "User cannot be friends with themselves", http.StatusBadRequest)
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

	if objID == friendObjID {
		http.Error(w, "User cannot be friends with themselves", http.StatusBadRequest)
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

	w.WriteHeader(http.StatusOK)
}

func AcceptUserToFriends(w http.ResponseWriter, r *http.Request) {
	// if !auth.Authenticate(r) {
	// 	http.Error(w, "Unauthorized", http.StatusUnauthorized)
	// 	return
	// }

	client := database.GetDatabaseConnection()

	var requestBody struct {
		UserID   string `json:"user_id"`
		FriendID string `json:"friend_id"`
	}
	err := json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	userID := requestBody.UserID
	friendID := requestBody.FriendID

	if userID == "" || friendID == "" {
		http.Error(w, "User ID and Friend ID are required", http.StatusBadRequest)
		return
	}

	userObjID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		http.Error(w, "Invalid User ID format", http.StatusBadRequest)
		return
	}

	friendObjID, err := primitive.ObjectIDFromHex(friendID)
	if err != nil {
		http.Error(w, "Invalid Friend ID format", http.StatusBadRequest)
		return
	}

	collection := database.GetCollection(client, "Users", "users")

	// Update the friend relationship to accepted for both users
	_, err = collection.UpdateOne(context.Background(), bson.M{"_id": userObjID, "friends._id": friendObjID}, bson.M{
		"$set": bson.M{"friends.$.status": models.Accepted},
	})
	if err != nil {
		http.Error(w, "Error accepting friend request", http.StatusInternalServerError)
		return
	}

	_, err = collection.UpdateOne(context.Background(), bson.M{"_id": friendObjID, "friends._id": userObjID}, bson.M{
		"$set": bson.M{"friends.$.status": models.Accepted},
	})
	if err != nil {
		http.Error(w, "Error updating friend's friend list", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Friend request accepted"})
}

func RejectUserToFriends(w http.ResponseWriter, r *http.Request) {
	// if !auth.Authenticate(r) {
	// 	http.Error(w, "Unauthorized", http.StatusUnauthorized)
	// 	return
	// }

	client := database.GetDatabaseConnection()

	var requestBody struct {
		UserID   string `json:"user_id"`
		FriendID string `json:"friend_id"`
	}
	err := json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	userID := requestBody.UserID
	friendID := requestBody.FriendID

	if userID == "" || friendID == "" {
		http.Error(w, "User ID and Friend ID are required", http.StatusBadRequest)
		return
	}

	userObjID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		http.Error(w, "Invalid User ID format", http.StatusBadRequest)
		return
	}

	friendObjID, err := primitive.ObjectIDFromHex(friendID)
	if err != nil {
		http.Error(w, "Invalid Friend ID format", http.StatusBadRequest)
		return
	}

	collection := database.GetCollection(client, "Users", "users")

	// Remove the friend request from both users
	_, err = collection.UpdateOne(context.Background(), bson.M{"_id": userObjID}, bson.M{
		"$pull": bson.M{"friends": bson.M{"_id": friendObjID}},
	})
	if err != nil {
		http.Error(w, "Error rejecting friend request", http.StatusInternalServerError)
		return
	}

	_, err = collection.UpdateOne(context.Background(), bson.M{"_id": friendObjID}, bson.M{
		"$pull": bson.M{"friends": bson.M{"_id": userObjID}},
	})
	if err != nil {
		http.Error(w, "Error updating friend's friend list", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Friend request rejected"})
}

func RemoveFriend(w http.ResponseWriter, r *http.Request) {
	// if !auth.Authenticate(r) {
	// 	http.Error(w, "Unauthorized", http.StatusUnauthorized)
	// 	return
	// }

	client := database.GetDatabaseConnection()

	var requestBody struct {
		UserID   string `json:"user_id"`
		FriendID string `json:"friend_id"`
	}
	err := json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	userID := requestBody.UserID
	friendID := requestBody.FriendID

	if userID == "" || friendID == "" {
		http.Error(w, "User ID and Friend ID are required", http.StatusBadRequest)
		return
	}

	userObjID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		http.Error(w, "Invalid User ID format", http.StatusBadRequest)
		return
	}

	friendObjID, err := primitive.ObjectIDFromHex(friendID)
	if err != nil {
		http.Error(w, "Invalid Friend ID format", http.StatusBadRequest)
		return
	}

	collection := database.GetCollection(client, "Users", "users")

	// Remove the friend relationship from both users
	_, err = collection.UpdateOne(context.Background(), bson.M{"_id": userObjID}, bson.M{
		"$pull": bson.M{"friends": bson.M{"_id": friendObjID}},
	})
	if err != nil {
		http.Error(w, "Error removing friend", http.StatusInternalServerError)
		return
	}

	a, err := collection.UpdateOne(context.Background(), bson.M{"_id": friendObjID}, bson.M{
		"$pull": bson.M{"friends": bson.M{"_id": userObjID}},
	})
	if err != nil {
		http.Error(w, "Error updating friend's friend list", http.StatusInternalServerError)
		return
	}
	fmt.Println(a)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Friend removed"})
}
