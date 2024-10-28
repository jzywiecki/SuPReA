package users

import (
	"auth-service/models"
	"auth-service/pkg/auth"
	"auth-service/pkg/database"
	"context"
	"encoding/json"
	"log"
	"net/http"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	mongo "go.mongodb.org/mongo-driver/mongo"
)

func GetUserFriends(w http.ResponseWriter, r *http.Request) {
	isAuthenticated, err := auth.Authenticate(r)
	if !isAuthenticated {
		log.Printf("Unauthorized request from %s with error message %s", r.RemoteAddr, err)
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

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

	collection := database.GetCollection(client, "Projects", "users")

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
	isAuthenticated, err := auth.Authenticate(r)
	if !isAuthenticated {
		log.Printf("Unauthorized request from %s with error message %s", r.RemoteAddr, err)
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	client := database.GetDatabaseConnection()
	session, err := client.StartSession()
	if err != nil {
		http.Error(w, "Cannot start session", http.StatusInternalServerError)
		return
	}
	defer session.EndSession(context.Background())

	err = mongo.WithSession(context.Background(), session, func(sc mongo.SessionContext) error {
		if err := session.StartTransaction(); err != nil {
			return err
		}

		userId := r.URL.Query().Get("user_id")
		if userId == "" {
			http.Error(w, "User ID is required", http.StatusBadRequest)
			return nil
		}

		friendId := r.URL.Query().Get("friend_id")
		if friendId == "" {
			http.Error(w, "Friend ID is required", http.StatusBadRequest)
			return nil
		}

		if userId == friendId {
			http.Error(w, "User cannot be friends with themselves", http.StatusBadRequest)
			return nil
		}

		objID, err := primitive.ObjectIDFromHex(userId)
		if err != nil {
			http.Error(w, "Invalid user ID format", http.StatusBadRequest)
			return nil
		}

		friendObjID, err := primitive.ObjectIDFromHex(friendId)
		if err != nil {
			http.Error(w, "Invalid friend ID format", http.StatusBadRequest)
			return nil
		}

		if objID == friendObjID {
			http.Error(w, "User cannot be friends with themselves", http.StatusBadRequest)
			return nil
		}

		collection := database.GetCollection(client, "Projects", "users")

		// Check if user and friend exist
		var user models.User
		err = collection.FindOne(context.Background(), bson.M{"_id": objID}).Decode(&user)
		if err != nil {
			http.Error(w, "Error retrieving user", http.StatusInternalServerError)
			return nil
		}

		var friend models.User
		err = collection.FindOne(context.Background(), bson.M{"_id": friendObjID}).Decode(&friend)
		if err != nil {
			http.Error(w, "Error retrieving friend", http.StatusInternalServerError)
			return nil
		}

		// Check if user is already friends with the friend
		for _, friend := range user.Friends {
			if friend.ID == friendObjID {
				http.Error(w, "User is already friends with this user", http.StatusBadRequest)
				return nil
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
			session.AbortTransaction(sc)
			return err
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
			session.AbortTransaction(sc)
			return err
		}

		err = session.CommitTransaction(sc)
		if err != nil {
			session.AbortTransaction(sc)
			return err
		}

		w.WriteHeader(http.StatusOK)
		return nil
	})

	if err != nil {
		http.Error(w, "Transaction failed", http.StatusInternalServerError)
	}

}

func AcceptUserToFriends(w http.ResponseWriter, r *http.Request) {
	isAuthenticated, err := auth.Authenticate(r)
	if !isAuthenticated {
		log.Printf("Unauthorized request from %s with error message %s", r.RemoteAddr, err)
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	client := database.GetDatabaseConnection()
	session, err := client.StartSession()
	if err != nil {
		http.Error(w, "Cannot start session", http.StatusInternalServerError)
		return
	}
	defer session.EndSession(context.Background())

	err = mongo.WithSession(context.Background(), session, func(sc mongo.SessionContext) error {
		if err := session.StartTransaction(); err != nil {
			return err
		}

		var requestBody struct {
			UserID   string `json:"user_id"`
			FriendID string `json:"friend_id"`
		}
		err := json.NewDecoder(r.Body).Decode(&requestBody)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return nil
		}

		userID := requestBody.UserID
		friendID := requestBody.FriendID

		if userID == "" || friendID == "" {
			http.Error(w, "User ID and Friend ID are required", http.StatusBadRequest)
			return nil
		}

		userObjID, err := primitive.ObjectIDFromHex(userID)
		if err != nil {
			http.Error(w, "Invalid User ID format", http.StatusBadRequest)
			return nil
		}

		friendObjID, err := primitive.ObjectIDFromHex(friendID)
		if err != nil {
			http.Error(w, "Invalid Friend ID format", http.StatusBadRequest)
			return nil
		}

		collection := database.GetCollection(client, "Projects", "users")

		_, err = collection.UpdateOne(sc, bson.M{"_id": userObjID, "friends._id": friendObjID}, bson.M{
			"$set": bson.M{"friends.$.status": models.Accepted},
		})
		if err != nil {
			session.AbortTransaction(sc)
			return err
		}

		_, err = collection.UpdateOne(sc, bson.M{"_id": friendObjID, "friends._id": userObjID}, bson.M{
			"$set": bson.M{"friends.$.status": models.Accepted},
		})
		if err != nil {
			session.AbortTransaction(sc)
			return err
		}

		err = session.CommitTransaction(sc)
		if err != nil {
			session.AbortTransaction(sc)
			return err
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		return nil
	})

	if err != nil {
		http.Error(w, "Transaction failed", http.StatusInternalServerError)
	}
}

func RejectUserToFriends(w http.ResponseWriter, r *http.Request) {
	isAuthenticated, err := auth.Authenticate(r)
	if !isAuthenticated {
		log.Printf("Unauthorized request from %s with error message %s", r.RemoteAddr, err)
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	client := database.GetDatabaseConnection()
	session, err := client.StartSession()
	if err != nil {
		http.Error(w, "Cannot start session", http.StatusInternalServerError)
		return
	}
	defer session.EndSession(context.Background())

	err = mongo.WithSession(context.Background(), session, func(sc mongo.SessionContext) error {
		if err := session.StartTransaction(); err != nil {
			return err
		}

		var requestBody struct {
			UserID   string `json:"user_id"`
			FriendID string `json:"friend_id"`
		}
		err := json.NewDecoder(r.Body).Decode(&requestBody)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return nil
		}

		userID := requestBody.UserID
		friendID := requestBody.FriendID

		if userID == "" || friendID == "" {
			http.Error(w, "User ID and Friend ID are required", http.StatusBadRequest)
			return nil
		}

		userObjID, err := primitive.ObjectIDFromHex(userID)
		if err != nil {
			http.Error(w, "Invalid User ID format", http.StatusBadRequest)
			return nil
		}

		friendObjID, err := primitive.ObjectIDFromHex(friendID)
		if err != nil {
			http.Error(w, "Invalid Friend ID format", http.StatusBadRequest)
			return nil
		}

		collection := database.GetCollection(client, "Projects", "users")

		_, err = collection.UpdateOne(sc, bson.M{"_id": userObjID}, bson.M{
			"$pull": bson.M{"friends": bson.M{"_id": friendObjID}},
		})
		if err != nil {
			session.AbortTransaction(sc)
			return err
		}

		_, err = collection.UpdateOne(sc, bson.M{"_id": friendObjID}, bson.M{
			"$pull": bson.M{"friends": bson.M{"_id": userObjID}},
		})
		if err != nil {
			session.AbortTransaction(sc)
			return err
		}

		err = session.CommitTransaction(sc)
		if err != nil {
			session.AbortTransaction(sc)
			return err
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{"message": "Friend request rejected"})
		return nil
	})

	if err != nil {
		http.Error(w, "Transaction failed", http.StatusInternalServerError)
	}
}

func RemoveFriend(w http.ResponseWriter, r *http.Request) {
	isAuthenticated, err := auth.Authenticate(r)
	if !isAuthenticated {
		log.Printf("Unauthorized request from %s with error message %s", r.RemoteAddr, err)
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	client := database.GetDatabaseConnection()
	session, err := client.StartSession()
	if err != nil {
		http.Error(w, "Cannot start session", http.StatusInternalServerError)
		return
	}
	defer session.EndSession(context.Background())

	var requestBody struct {
		UserID   string `json:"user_id"`
		FriendID string `json:"friend_id"`
	}
	err = json.NewDecoder(r.Body).Decode(&requestBody)
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

	collection := database.GetCollection(client, "Projects", "users")

	// Start the transaction
	err = mongo.WithSession(context.Background(), session, func(sc mongo.SessionContext) error {
		err := session.StartTransaction()
		if err != nil {
			return err
		}

		result, err := collection.UpdateOne(sc, bson.M{"_id": userObjID}, bson.M{
			"$pull": bson.M{"friends": bson.M{"_id": friendObjID}},
		})

		if result.ModifiedCount == 0 {
			session.AbortTransaction(sc)
			http.Error(w, "Friend not found", http.StatusNotFound)
			return nil
		}

		if err != nil {
			session.AbortTransaction(sc)
			return err
		}

		result, err = collection.UpdateOne(sc, bson.M{"_id": friendObjID}, bson.M{
			"$pull": bson.M{"friends": bson.M{"_id": userObjID}},
		})

		if result.ModifiedCount == 0 {
			session.AbortTransaction(sc)
			http.Error(w, "Friend not found", http.StatusNotFound)
			return nil
		}

		if err != nil {
			session.AbortTransaction(sc)
			return err
		}

		err = session.CommitTransaction(sc)
		if err != nil {
			session.AbortTransaction(sc)
			return err
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		return nil
	})

	if err != nil {
		http.Error(w, "Transaction failed", http.StatusInternalServerError)
		return
	}

}
