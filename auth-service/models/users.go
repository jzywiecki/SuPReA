package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID           primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Username     string             `json:"username"`
	Email        string             `json:"email"`
	Password     string             `json:"-"`
	Token        string             `json:"token"`
	RefreshToken string             `json:"refresh_token"`
	Friends      []Friend           `json:"friends"`
	Projects     []int              `json:"projects"`
	AvatarURL    string             `json:"avatar_url"`
}

type Friend struct {
	ID     primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Status FriendshipStatus   `json:"status"`
}

type FriendshipStatus string

const (
	Accepted        FriendshipStatus = "accepted"
	InvitedByUser   FriendshipStatus = "invited_by_user"
	InvitedByFriend FriendshipStatus = "invited_by_friend"
)

type FriendDetails struct {
	ID        primitive.ObjectID `json:"id"`
	Username  string             `json:"username"`
	Email     string             `json:"email"`
	AvatarURL string             `json:"avatar_url"`
	Status    FriendshipStatus   `json:"status"`
}
