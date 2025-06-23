import React from 'react';
import './App.css';
import AuthForm from "./Pages/authform";
import Chat from "./Pages/Chat";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChatUIMobile from './Pages/mobilechatroom';
const App = () => {
  return (
    <Router>
      <div className='flex'>
        <div className='w-full'>
          <Routes>
            <Route path="/" element={<AuthForm />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/chat-mobile/:id" element={<ChatUIMobile />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;