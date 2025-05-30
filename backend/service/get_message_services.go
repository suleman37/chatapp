package service

import (
	"context"
	"time"

	"Go_Chatapp/dbconnect"
	"Go_Chatapp/models"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/bson"
)

var messagesCollection *mongo.Collection

func init() {
	dbconnect.DBConnection()
	messagesCollection = dbconnect.GetCollection("messages")
}

func GetMessages() ([]models.Messages, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	cursor, err := messagesCollection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	var messages []models.Messages
	if err = cursor.All(ctx, &messages); err != nil {
		return nil, err
	}
	return messages, nil
}