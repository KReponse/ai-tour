import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import './index.css';

import { ThemeProvider } from './contexts/ThemeContext';
import { BookingProvider } from './contexts/BookingContext';
import {  AuthProvider  } from './contexts/AuthContext';
import ScrollToTop from './components/ScrollToTop';


 

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
      </BookingProvider>
    </ThemeProvider>
  </AuthProvider>

</BrowserRouter>

     
  </React.StrictMode>
);