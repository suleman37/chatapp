package middleware

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func GenerateJWT(userId, email, username string) (string, error) {
	claims := jwt.MapClaims{
		"user_id":  userId,
		"email":    email,
		"username": username,
		"exp":      time.Now().Add(time.Hour * 86).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	secretKey := []byte(os.Getenv("JWT_SECRET"))
	return token.SignedString(secretKey)
}