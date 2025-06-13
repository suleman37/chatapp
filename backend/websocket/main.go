package main

import (
	"Go_Chatapp/middleware"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var clients = make(map[string]*websocket.Conn)
var broadcast = make(chan []byte)

func main() {
	go handleMessages()
	router := gin.Default()
	router.GET("/ws", middleware.AuthMiddleware(), wsHandler)
	router.GET("/ws-backend", backendWsHandler)
	port := "8001"
	log.Printf("WebSocket server started on port %s", port)
	err := router.Run(":" + port)
	if err != nil {
		log.Fatalf("Server error: %v", err)
	}
}

func wsHandler(c *gin.Context) {

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("Upgrade error:", err)
		return
	}
	defer conn.Close()
	clients["user_id"] = conn
	log.Println("New User connected")

	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			log.Println("Read error:", err)
			delete(clients, "user_id")
			break
		}
		log.Printf("Received message: %s", msg)
		broadcast <- msg
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
		for _, client := range clients {
			err := client.WriteMessage(websocket.TextMessage, msg)
			if err != nil {
				log.Println("Write error:", err)
				client.Close()
				delete(clients, "user_id")
			}
		}
	}
}
