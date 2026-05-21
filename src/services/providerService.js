// src/services/providerService.js

import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// ADD TOKEN AUTOMATICALLY
API.interceptors.request.use((req) => {

  const token = localStorage.getItem('token');

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// DASHBOARD STATS
export const getProviderStats = async () => {
  const response = await API.get(
    '/provider/stats'
  );

  return response.data;
};

// RECENT REQUESTS
export const getRecentRequests =
  async () => {

    const response =
      await API.get(
        '/provider/requests/recent'
      );

    return response.data;
  };

// ALL BOOKINGS
export const getProviderBookings =
  async () => {

    const response =
      await API.get(
        '/provider/bookings'
      );

    return response.data;
  };

// ALL TRAVELERS
export const getProviderTravelers =
  async () => {

    const response =
      await API.get(
        '/provider/travelers'
      );

    return response.data;
  };