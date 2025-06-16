import React, { useState, useEffect } from 'react';
import User_img from "../assets/empty-user.jpg"

const MessageSidebar = ({ onChatSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [chats, setChats] = useState([]);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      try {
        const base64Url = storedToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const decodedData = JSON.parse(jsonPayload);
        setUserId(decodedData.user_id);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchChats = async () => {
      if (!token) {
        console.error('Token is not available');
        return;
      }
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        console.log("test data:::", data);
        const formattedChats = data.users.map(user => ({
          name: user.id === userId ? `${user.username} (You)` : user.username,
          id: user.id,
          msg: 'No message available',
          time: 'N/A',
          tags: [],
          img: User_img,
        }));
        setChats(formattedChats);
        const youChat = formattedChats.find(chat => chat.name.includes('(You)'));
        if (youChat) {
          onChatSelect(youChat);
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, [userId, onChatSelect, token]);

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChatClick = (chat) => {
    onChatSelect(chat);
  };

  return (
    <div className="w-full max-w-xs h-screen border-r border-gray-600 bg-gray-800 text-white">
      <div className="p-5 border-b border-gray-600 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">Messages</h2>
        <button className="text-blue-500 text-xl">+</button>
      </div>

      <div className="px-4 py-2">
        <input
          type="text"
          placeholder="search"
          className="w-full p-2 rounded-md border border-gray-600 bg-gray-700 text-white focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-y-auto h-[calc(100vh-128px)] scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent" >
        {filteredChats.map((chat, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-700 ${chat.active ? 'bg-blue-700 rounded-md' : ''
              }`}
            onClick={() => handleChatClick(chat)}
          >
            <img
              src={chat.img}
              alt={chat.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-sm text-white">{chat.name}</h4>
                <span className="text-xs text-gray-400">{chat.time}</span>
              </div>
              <p className="text-sm text-gray-400 truncate">{chat.msg}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {chat.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-0.5 bg-gray-700 rounded-full text-white"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageSidebar;