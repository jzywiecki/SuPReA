package models

import "gopkg.in/mgo.v2/bson"

type User struct {
	ID           bson.ObjectId `json:"id" bson:"_id,omitempty"`
	Username     string        `json:"username"`
	Email        string        `json:"email"`
	Password     string        `json:"-"`
	Token        string        `json:"token"`
	RefreshToken string        `json:"refresh_token"`
	Friends      []int         `json:"friends"`
	Projects     []int         `json:"projects"`
	AvatarURL    string        `json:"avatar_url"`
}

