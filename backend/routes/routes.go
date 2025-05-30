package routes

import (
	"Go_Chatapp/controller"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine) {
	r.POST("/register", controller.Register)
	r.POST("/login", controller.Login)
	r.POST("/message", controller.CreateMessage)
	// auth.GET("/users", controller.GetAllUsers)
	// auth.GET("/messages-get", controller.GetMessages)
}