package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Messages struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Sender    string             `bson:"sender" json:"sender"`
	Receiver  string             `bson:"receiver" json:"receiver"`
	ChatRoomId string            `bson:"chatRoomId" json:"chatRoomId"`
	Content   string             `bson:"content" json:"content"`
}