// src/services/reviewService.js

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ===============================
// PUBLIC - Get tour reviews
// ===============================
export const getTourReviews = async (tourId) => {
  try {
    const response = await axios.get(`${API_URL}/reviews/tour/${tourId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Get tour reviews error:', error);
    throw error;
  }
};

// ===============================
// TRAVELER - Get my reviews
// ===============================
export const getMyReviews = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/reviews/my-reviews`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('❌ Get my reviews error:', error);
    throw error;
  }
};

// ===============================
// TRAVELER - Create review
// ===============================
export const createReview = async (data) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/reviews`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('❌ Create review error:', error);
    throw error;
  }
};

// ===============================
// TRAVELER - Update review
// ===============================
export const updateReview = async (id, data) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/reviews/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('❌ Update review error:', error);
    throw error;
  }
};

// ===============================
// TRAVELER - Delete my review
// ===============================
export const deleteReview = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_URL}/reviews/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('❌ Delete review error:', error);
    throw error;
  }
};

// ===============================
// TRAVELER - Toggle helpful
// ===============================
export const toggleHelpful = async (reviewId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/reviews/${reviewId}/helpful`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Toggle helpful error:', error);
    throw error;
  }
};

// ===============================
// PROVIDER - Get provider reviews
// ===============================
export const getProviderReviews = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/reviews/provider/reviews`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('❌ Get provider reviews error:', error);
    throw error;
  }
};

// ===============================
// PROVIDER - Get provider review stats
// ===============================
export const getProviderReviewStats = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/reviews/provider/reviews/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('❌ Get provider review stats error:', error);
    throw error;
  }
};

// ===============================
// PROVIDER - Reply to review
// ===============================
export const replyToReview = async (id, reply) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/reviews/${id}/reply`,
      { reply },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Reply to review error:', error);
    throw error;
  }
};

// ===============================
// ADMIN - Get all reviews (with filters)
// ===============================
export const getAdminReviews = async (params = {}) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/reviews/admin/all`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return response.data;
  } catch (error) {
    console.error('❌ Get admin reviews error:', error);
    throw error;
  }
};

// ===============================
// ADMIN - Update review status
// ===============================
export const updateReviewStatus = async (id, status) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${API_URL}/reviews/admin/${id}/status`,
      { status },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Update review status error:', error);
    throw error;
  }
};

// ===============================
// ADMIN - Delete review
// ===============================
export const deleteReviewAdmin = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_URL}/reviews/admin/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('❌ Delete review admin error:', error);
    throw error;
  }
};