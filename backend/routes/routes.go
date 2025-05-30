package routes

import (
	"Go_Chatapp/controller"
	"Go_Chatapp/middleware"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine) {
	r.POST("/register", controller.Register)
	r.POST("/login", controller.Login)
	auth := r.Group("/")
	auth.Use(middleware.JWTAuthMiddleware())
	auth.GET("/users", controller.GetAllUsers)
	auth.POST("/message", controller.CreateMessage)
	auth.GET("/messages-get", controller.GetMessages)
}