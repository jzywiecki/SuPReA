package utils

const (
	avatarsURL = "https://cat-avatars.vercel.app/api/cat?name="
)

func GetAvatarURL(username string) string {
	return avatarsURL + username
}
