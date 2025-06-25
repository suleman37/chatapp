package main

import (
	"log"
	"os"

	"Go_Chatapp/dbconnect"
	"Go_Chatapp/middleware"
	"Go_Chatapp/models"
	"Go_Chatapp/routes"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	dbconnect.DBConnection()

	wsURL := "ws://websocket:8001/ws-backend"
	models.WebsocketConn, _, err = websocket.DefaultDialer.Dial(wsURL, nil)
	if err != nil {
		log.Fatalf("Failed to connect to WebSocket backend: %v", err)
	}
	defer models.WebsocketConn.Close()
	log.Println("Connected to WebSocket backend")

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
