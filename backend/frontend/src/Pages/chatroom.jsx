import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatUI = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
          '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join(''));
        const decodedData = JSON.parse(jsonPayload);
        setUserId(decodedData.user_id);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, [token]);

  useEffect(() => {
    const connectWebSocket = () => {
      if (!user?.id) {
        console.error('User or user.id is null');
        return;
      }

      const ws = new WebSocket(`ws://localhost:8001/ws?token=${token}`);

      ws.onopen = () => console.log('WebSocket connection established');
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if ([`${userId}_${user.id}`, `${user.id}_${userId}`].includes(message.chatRoomId)) {
          setMessages(prevMessages => [...prevMessages, {
            from: message.sender === userId ? 'me' : 'other',
            text: message.content
          }]);
        }
      };
      ws.onerror = (error) => console.error('WebSocket error:', error);
      ws.onclose = () => console.log('WebSocket connection closed');

      return () => ws.close();
    };

    const fetchMessages = async () => {
      if (!user?.id) {
        console.error('User or user.id is null');
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/messages-get`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          const filteredMessages = data.messages.filter(msg => 
            [`${userId}_${user.id}`, `${user.id}_${userId}`].includes(msg.chatRoomId)
          );
          setMessages(filteredMessages.map(msg => ({
            from: msg.sender === userId ? 'me' : 'other',
            text: msg.content
          })));
        } else {
          console.error('Failed to fetch messages:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    if (token && userId) {
      connectWebSocket();
      fetchMessages();
    }
  }, [token, userId, user]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && user?.id) {
      const messageData = {
        sender: userId,
        receiver: user.id,
        chatRoomId: `${userId}_${user.id}`,
        content: newMessage
      };

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/message`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(messageData)
        });
        
        if (response.ok) {
          setMessages([...messages, { from: 'me', text: newMessage }]);
          setNewMessage('');
        } else {
          console.error('Failed to send message:', response.statusText);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="w-full bg-gray-800 rounded-2xl shadow-lg flex flex-col h-screen text-white">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-700 bg-gray-900">
        <img
          src={user?.img || "https://cdn.vectorstock.com/i/1000v/66/92/error-404-page-not-found-website-web-failure-vector-24176692.avif"}
          alt={user?.name || "Profile"}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h2 className="font-semibold">{user?.name || "No User Registered"}</h2>
          <p className={`text-sm ${user?.name ? 'text-green-500' : 'text-gray-500'}`}>{user?.name ? "Online" : "Offline"}</p>
        </div>
        <div className="ml-auto text-xl cursor-pointer" onClick={handleLogout}>[➔</div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-gray-800">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm ${msg.from === 'me'
                ? 'bg-blue-500 text-white rounded-br-none'
                : 'bg-gray-700 text-gray-300 rounded-bl-none'
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-gray-700 flex items-center gap-2 bg-gray-900">
        <input
          type="text"
          placeholder="Type a message"
          className="flex-1 p-2 pl-10 rounded-full border bg-gray-700 text-gray-300 focus:outline-none"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="text-blue-600 text-3xl" onClick={handleSendMessage}>
          <span className="transform rotate-120">➤</span>
        </button>
      </div>
    </div>
  );
};

export default ChatUI;