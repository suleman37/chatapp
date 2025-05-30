package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Register(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "User registered successfully"})
}

func Login(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "User logged in successfully"})
}

func GetAllUsers(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"users": []string{}})
}