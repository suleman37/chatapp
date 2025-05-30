package service

import (
	"context"
	"time"

	"Go_Chatapp/dbconnect"
	"Go_Chatapp/models"
	"go.mongodb.org/mongo-driver/mongo"
)

var messageCollection *mongo.Collection

func init() {
	dbconnect.DBConnection()
	messageCollection = dbconnect.GetCollection("messages")
}

func SendMessage(message models.Messages) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	_, err := messageCollection.InsertOne(ctx, message)
	return err
}