package routes

import (
	"Go_Chatapp/controller"
	"Go_Chatapp/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine) {
	r.POST("/register", controller.Register)
	r.POST("/login", controller.Login)
	r.POST("/message", middleware.AuthMiddleware(), controller.CreateMessage)
	r.GET("/users", middleware.AuthMiddleware(), controller.RetrieveAllUsers)
	r.GET("/messages-get", middleware.AuthMiddleware(), controller.GetMessages)
}
