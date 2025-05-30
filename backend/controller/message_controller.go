package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateMessage(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "Message created successfully"})
}

func GetMessages(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"messages": []string{}})
}