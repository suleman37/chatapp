import React from 'react';
import './App.css';
import AuthForm from "./Pages/authform";
import Chat from "./Pages/Chat";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
const App = () => {
  return (
    <Router>
      <div className='flex'>
        <div className='w-full'>
          <Routes>
            <Route path="/" element={<AuthForm />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;