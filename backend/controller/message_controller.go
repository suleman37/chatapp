package controller

import (
	"net/http"
	"Go_Chatapp/models"
	"Go_Chatapp/service"
	"github.com/gin-gonic/gin"
)

func CreateMessage(c *gin.Context) {
	var message models.Messages
	if err := c.ShouldBindJSON(&message); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	if err := service.SendMessage(message); err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Message sent successfully"})
}