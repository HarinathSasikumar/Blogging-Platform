import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#1a2235',
          color: '#f1f5f9',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          fontSize: '0.9rem',
          fontFamily: 'Inter, sans-serif',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#1a2235',
          },
        },
        error: {
          iconTheme: {
            primary: '#f87171',
            secondary: '#1a2235',
          },
        },
        duration: 4000,
      }}
    />
  </React.StrictMode>
);
