// src/services/aiService.js

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ===============================
// AI TOUR COLORS
// ===============================
// Teal  : #0D9488
// Gold  : #F59E0B
// Slate : #374151
// White : #FFFFFF
// ===============================

// ✅ Generate trip plan
export const generateTripPlan = async (data) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/ai/generate-trip`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ AI Service Error (generateTripPlan):', error);
    throw error;
  }
};

// ✅ AI Chat (NEW)
export const getAIChat = async (data) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/ai/chat`,
      {
        message: data.message,
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
    console.error('❌ AI Service Error (getAIChat):', error);
    throw error;
  }
};

// ✅ Get AI recommendations
export const getAIRecommendations = async (query) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${API_URL}/ai/recommendations`,
      {
        params: { query },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ AI Service Error (getAIRecommendations):', error);
    throw error;
  }
};

// ✅ Get AI suggestions (quick questions)
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
    console.error('❌ AI Service Error (getAISuggestions):', error);
    throw error;
  }
};