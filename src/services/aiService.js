// src/services/aiService.js

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ===============================
// ✅ AI CHAT
// ===============================
export const getAIChat = async (data) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/ai/chat`,
      {
        message: data.message,
        language: data.language || 'English',
        context: data.context || 'general',
        history: data.history || [],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ AI Chat error:', error);
    throw error;
  }
};

// ===============================
// ✅ AI PLANNER (Generate Trip Plan)
// ===============================
export const generateTripPlan = async (data) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/ai/planner`,
      {
        destination: data.destination,
        days: data.days || 3,
        budget: data.budget || 500,
        travelers: data.travelers || 1,
        preferences: data.preferences || [],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ AI Planner error:', error);
    throw error;
  }
};

// ===============================
// ✅ AI RECOMMENDATIONS
// ===============================
export const getAIRecommendations = async (params = {}) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${API_URL}/ai/recommendations`,
      {
        params: {
          query: params.query || '',
          limit: params.limit || 10,
          minPrice: params.minPrice,
          maxPrice: params.maxPrice,
          location: params.location,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ AI Recommendations error:', error);
    throw error;
  }
};

// ===============================
// ✅ AI SUGGESTIONS (Quick Questions)
// ===============================
export const getAISuggestions = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${API_URL}/ai/suggestions`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ AI Suggestions error:', error);
    throw error;
  }
};