package main

import (
	"Go_Chatapp/middleware"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/joho/godotenv"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var clients = make(map[string]*websocket.Conn)
var broadcast = make(chan []byte)

func main() {

	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	go handleMessages()
	router := gin.Default()
	router.GET("/ws", middleware.SocketMiddleware(), wsHandler)
	router.GET("/ws-backend", backendWsHandler)
	port := "8001"
	log.Printf("WebSocket server started on port %s", port)
	err = router.Run(":" + port)
	if err != nil {
		log.Fatalf("Server error: %v", err)
	}
}

func wsHandler(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		log.Println("User ID not found in context")
		return
	}

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("Upgrade error:", err)
		return
	}

	userId, exists := c.Get("user_id")
	if !exists {
		log.Println("Error: user id not found")
		conn.Close()
		return
	}

	userIdString, ok := userId.(string)
	if !ok {
		log.Println("Error: user id is of incorrect type")
		conn.Close()
		return
	}

	clients[userIdString] = conn
	log.Println("New User connected")

	defer func() {
		conn.Close()
		delete(clients, userIdString)
		log.Println("User disconnected")
	}()

	for {
		_, _, err := conn.ReadMessage()
		if err != nil {
			log.Println("Read error:", err)
			delete(clients, userIDStr)
			break
		}
	}
}

func backendWsHandler(c *gin.Context) {
	backendConn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("Backend upgrade error:", err)
		return
	}
	defer backendConn.Close()
	log.Println("Backend connected")

	for {
		_, msg, err := backendConn.ReadMessage()
		if err != nil {
			log.Println("Backend read error:", err)
			break
		}
		log.Printf("Received backend message: %s", msg)
		broadcast <- msg
	}
}

func handleMessages() {
	for {
		msg := <-broadcast
		for userId, client := range clients {
			err := client.WriteMessage(websocket.TextMessage, msg)
			if err != nil {
				log.Println("Write error:", err)
				client.Close()
				delete(clients, userId)
			}
		}
	}
}