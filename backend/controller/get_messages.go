
package controller

import (
	"net/http"
	"Go_Chatapp/service"
	"github.com/gin-gonic/gin"
)

func GetMessages(c *gin.Context) {
	messages, err := service.GetMessages()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"messages": messages})
}