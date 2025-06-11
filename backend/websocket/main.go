package main

import (
	"log"
	"net/http"

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
	http.HandleFunc("/ws", wsHandler)
	http.HandleFunc("/ws-backend", backendWsHandler)
	port := "8001"
	log.Printf("WebSocket server started on port %s", port)
	err := http.ListenAndServe(":"+port, nil)
	if err != nil {
		log.Fatalf("Server error: %v", err)
	}
}

func wsHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
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

func backendWsHandler(w http.ResponseWriter, r *http.Request) {
	backendConn, err := upgrader.Upgrade(w, r, nil)
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
