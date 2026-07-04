// src/services/providerService.js

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ===============================
// ✅ CREATE PROVIDER REQUEST
// ===============================
export const createProviderRequest = async (formData) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${API_URL}/requests/provider`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        // ✅ Content-Type is automatically set by axios for FormData
      },
    }
  );

  return response.data;
};

// ===============================
// ✅ GET MY PROVIDER REQUEST
// ===============================
export const getMyProviderRequest = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${API_URL}/requests/provider/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Get my provider request error:', error);
    throw error;
  }
};

// ===============================
// ✅ GET PROVIDER STATS
// ===============================
export const getProviderStats = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${API_URL}/requests/provider/stats`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Get provider stats error:', error);
    throw error;
  }
};

// ===============================
// ✅ GET RECENT REQUESTS
// ===============================
export const getRecentRequests = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${API_URL}/requests/provider/recent`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Get recent requests error:', error);
    throw error;
  }
};

// ===============================
// ✅ GET PUBLIC PROVIDER PROFILE
// ===============================
export const getPublicProviderProfile = async (providerId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${API_URL}/providers/${providerId}/public`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Get public provider profile error:', error);
    throw error;
  }
};

// ===============================
// ✅ GET PROVIDER TOURS (Public)
// ===============================
export const getPublicProviderTours = async (providerId, page = 1, limit = 10) => {
  try {
    const response = await axios.get(
      `${API_URL}/providers/${providerId}/tours`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Get public provider tours error:', error);
    throw error;
  }
};

// ===============================
// ✅ GET PROVIDER REVIEWS (Public)
// ===============================
export const getPublicProviderReviews = async (providerId, page = 1, limit = 10) => {
  try {
    const response = await axios.get(
      `${API_URL}/providers/${providerId}/reviews`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Get public provider reviews error:', error);
    throw error;
  }
};