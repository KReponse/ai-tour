import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import './index.css';

import { ThemeProvider } from './contexts/ThemeContext';
import { BookingProvider } from './contexts/BookingContext';

ReactDOM.createRoot(
  document.getElementById('root')
).render(
  <React.StrictMode>
    <BrowserRouter>

      <ThemeProvider>

        <BookingProvider>
          <App />
        </BookingProvider>

      </ThemeProvider>

    </BrowserRouter>
  </React.StrictMode>
);