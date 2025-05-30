package service

import (
	"context"
	"time"

	"Go_Chatapp/dbconnect"
	"Go_Chatapp/models"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/bson"
)

var usersCollection *mongo.Collection

func init() {
	dbconnect.DBConnection()
	usersCollection = dbconnect.GetCollection("users")
}

func GetUsers() ([]models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	cursor, err := usersCollection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	var users []models.User
	if err = cursor.All(ctx, &users); err != nil {
		return nil, err
	}
	return users, nil
}