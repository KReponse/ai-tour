// src/services/reviewService.js

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ===============================
// ✅ GET TOUR REVIEWS
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
// ✅ CREATE REVIEW
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
// ✅ GET MY REVIEWS
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
// ✅ UPDATE REVIEW
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
// ✅ DELETE REVIEW
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
// ✅ TOGGLE HELPFUL (NEW)
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
// ✅ TOGGLE NOT HELPFUL (NEW)
// ===============================
export const toggleNotHelpful = async (reviewId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/reviews/${reviewId}/not-helpful`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Toggle not helpful error:', error);
    throw error;
  }
};

// ===============================
// ✅ CHECK HELPFUL STATUS (NEW)
// ===============================
export const checkHelpfulStatus = async (reviewId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${API_URL}/reviews/${reviewId}/helpful-status`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Check helpful status error:', error);
    throw error;
  }
};