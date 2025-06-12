package controller

import (
	"Go_Chatapp/models"
	"encoding/json"
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

func CreateMessage(c *gin.Context) {
	var message models.Messages
	if err := c.ShouldBindJSON(&message); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	messageBytes, err := json.Marshal(message)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to encode message"})
		return
	}

	err = models.WebsocketConn.WriteMessage(websocket.TextMessage, messageBytes)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send message over WebSocket"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Message sent successfully"})
}