package controller

import (
	"net/http"
	"Go_Chatapp/service"
	"github.com/gin-gonic/gin"
)

func RetrieveAllUsers(c *gin.Context) {
	users, err := service.GetUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"users": users})
}