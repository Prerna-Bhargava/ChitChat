import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ToastContainer } from 'react-toastify';
import ChatProvider from './context/ChatProvider';
import { BrowserRouter } from 'react-router-dom';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <BrowserRouter>
      <ChatProvider>
        <ToastContainer autoClose={3000} />
        <App />
      </ChatProvider>
    </BrowserRouter>
  </>
);

