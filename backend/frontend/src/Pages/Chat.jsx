import React, { useState } from 'react';
import Chat from "./chatroom";
import Sidebar from "../Components/sidebar";

const ChatFunc = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className='flex w-full'>
      <Sidebar onChatSelect={setSelectedUser} />
      <Chat user={selectedUser} />
    </div>
  );
};

export default ChatFunc;