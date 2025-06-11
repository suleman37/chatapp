package main

import (
	"log"
	"os"

	"Go_Chatapp/dbconnect"
	"Go_Chatapp/middleware"
	"Go_Chatapp/routes"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	dbconnect.DBConnection()

	router := gin.Default()
	router.Use(middleware.CORSMiddleware())
	routes.RegisterRoutes(router)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}
	log.Printf("HTTP server running on port %s", port)
	router.Run(":" + port)
}