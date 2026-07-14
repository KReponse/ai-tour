import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import './index.css';

import { ThemeProvider } from './contexts/ThemeContext';
import { BookingProvider } from './contexts/BookingContext';
import {  AuthProvider  } from './contexts/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from "react-hot-toast";

 

ReactDOM.createRoot(
  document.getElementById('root')
).render(
  <React.StrictMode>
    <BrowserRouter>

  <ScrollToTop />

 <AuthProvider>
  <ThemeProvider>
    <BookingProvider>

      <App />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#374151",
            color: "#fff",
            borderRadius: "16px",
          },
          success: {
            style: {
              background: "#0D9488",
            },
          },
          error: {
            style: {
              background: "#DC2626",
            },
          },
        }}
      />

    </BookingProvider>
  </ThemeProvider>
</AuthProvider>

</BrowserRouter>

     
  </React.StrictMode>
);