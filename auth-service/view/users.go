package view

import "auth-service/models"

type UserView struct {
	ID           string `json:"id"`
	Username     string `json:"username"`
	Email        string `json:"email"`
	AvatarURL    string `json:"avatarurl"`
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

func (userView *UserView) UpdateUserFields(user *models.User) {
	if userView.Username != "" {
		user.Username = userView.Username
	}

	if userView.Email != "" {
		user.Email = userView.Email
	}

	if userView.Name != "" {
		user.Name = userView.Name
	}

	if userView.Description != "" {
		user.Description = userView.Description
	}

	if userView.Readme != "" {
		user.Readme = userView.Readme
	}

	if userView.Organization != "" {
		user.Organization = userView.Organization
	}

	if userView.Location != "" {
		user.Location = userView.Location
	}

	if userView.Website != "" {
		user.Website = userView.Website
	}

	if userView.AvatarURL != "" {
		user.AvatarURL = userView.AvatarURL
	}
}
