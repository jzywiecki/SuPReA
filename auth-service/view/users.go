package view

import "auth-service/models"

type UserView struct {
	ID           string `json:"id"`
	Username     string `json:"username"`
	Email        string `json:"email"`
	AvatarURL    string `json:"avatar_url"`
	Name         string `json:"name"`
	Description  string `json:"description"`
	Readme       string `json:"readme"`
	Organization string `json:"organization"`
	Location     string `json:"location"`
	Website      string `json:"website"`
}

func NewUserView(user models.User) UserView {
	return UserView{
		ID:           user.ID.Hex(),
		Username:     user.Username,
		Email:        user.Email,
		AvatarURL:    user.AvatarURL,
		Name:         user.Name,
		Description:  user.Description,
		Readme:       user.Readme,
		Organization: user.Organization,
		Location:     user.Location,
		Website:      user.Website,
	}
}
