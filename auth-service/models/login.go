package models

import (
	"errors"
	"regexp"
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token string `json:"token"`
}

func (l *LoginRequest) Validate() error {
	if l.Email == "" || l.Password == "" {
		return errors.New("email and password must be provided")
	}

	emailRegex := regexp.MustCompile(`^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$`)
	if !emailRegex.MatchString(l.Email) {
		return errors.New("invalid email format")
	}

	return nil
}
