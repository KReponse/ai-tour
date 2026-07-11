// frontend/src/services/aiService.js
// ✅ UPDATED - Added search, trending, featured methods

import axios from 'axios';
import API from './api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ===============================
// ✅ AI CHAT
// ===============================
export const getAIChat = async (data) => {
  try {
    const token = localStorage.getItem('token');
    
    const requestData = {
      message: data.message,
      language: data.language || 'English',
      context: data.context || 'general',
      chatHistory: data.history || [],
      sessionId: data.sessionId || null
    };

    if (data.userContext) {
      requestData.userContext = data.userContext;
    }

    const response = await axios.post(
      `${API_URL}/ai/chat`,
      requestData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ AI Chat error:', error);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('The AI is taking too long to respond. Please try again.');
    }
    if (error.response?.status === 429) {
      throw new Error('Too many requests. Please wait a moment and try again.');
    }
    throw error;
  }
};

// ===============================
// ✅ AI PLANNER
// ===============================
export const generateTripPlan = async (data) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!data.destination) {
      throw new Error('Destination is required');
    }
    if (!data.days || data.days < 1) {
      throw new Error('Please select at least 1 day');
    }
    if (!data.budget || data.budget < 10) {
      throw new Error('Please enter a valid budget');
    }

    const response = await axios.post(
      `${API_URL}/ai/planner`,
      {
        destination: data.destination,
        days: parseInt(data.days) || 3,
        budget: parseFloat(data.budget) || 500,
        travelers: parseInt(data.travelers) || 1,
        preferences: data.preferences || [],
        travelStyle: data.travelStyle || 'balanced',
        startDate: data.startDate || null,
        interests: data.interests || [],
        language: data.language || 'English'
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 45000
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ AI Planner error:', error);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Plan generation is taking too long. Please try again.');
    }
    if (error.response?.status === 429) {
      throw new Error('Too many requests. Please wait a moment and try again.');
    }
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
          category: params.category,
          sortBy: params.sortBy || 'relevance'
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 20000
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ AI Recommendations error:', error);
    throw error;
  }
};

// ===============================
// ✅ AI SEARCH - NEW
// ===============================
export const searchExperiences = async (params = {}) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.get(
      `${API_URL}/ai/search`,
      {
        params: {
          query: params.query || '',
          limit: params.limit || 20,
          page: params.page || 1,
          sortBy: params.sortBy || 'relevance',
          filters: params.filters ? JSON.stringify(params.filters) : undefined
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 15000
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ AI Search error:', error);
    throw error;
  }
};

// ===============================
// ✅ TRENDING EXPERIENCES - NEW
// ===============================
export const getTrendingExperiences = async (limit = 10) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.get(
      `${API_URL}/ai/trending`,
      {
        params: { limit },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Trending Experiences error:', error);
    throw error;
  }
};

// ===============================
// ✅ FEATURED EXPERIENCES - NEW
// ===============================
export const getFeaturedExperiences = async (limit = 10) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.get(
      `${API_URL}/ai/featured`,
      {
        params: { limit },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Featured Experiences error:', error);
    throw error;
  }
};

// ===============================
// ✅ AI SUGGESTIONS
// ===============================
export const getAISuggestions = async () => {
  try {
    const token = localStorage.getItem('token');
    
    const fallbackSuggestions = [
      "What are the best experiences in Kigali?",
      "Tell me about gorilla trekking",
      "Plan a 3-day trip to Rwanda",
      "What's the best time to visit?",
      "How much does a safari cost?",
      "Suggest cultural experiences"
    ];

    try {
      const response = await axios.get(
        `${API_URL}/ai/suggestions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 5000
        }
      );
      
      if (response.data?.success && response.data?.suggestions?.length > 0) {
        return response.data;
      }
    } catch (error) {
      console.warn('⚠️ Failed to fetch suggestions, using fallback');
    }

    return {
      success: true,
      suggestions: fallbackSuggestions,
      fallback: true
    };
  } catch (error) {
    console.error('❌ AI Suggestions error:', error);
    return {
      success: true,
      suggestions: [
        "What are the best experiences in Kigali?",
        "Tell me about gorilla trekking",
        "Plan a 3-day trip to Rwanda",
        "What's the best time to visit?",
        "How much does a safari cost?",
        "Suggest cultural experiences"
      ],
      fallback: true
    };
  }
};

// ===============================
// ✅ AI PROVIDER INFO
// ===============================
export const getAIProviderInfo = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${API_URL}/ai/provider-info`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ AI Provider Info error:', error);
    throw error;
  }
};

// ===============================
// ✅ SWITCH AI PROVIDER (Admin)
// ===============================
export const switchAIProvider = async (provider) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/ai/switch-provider`,
      { provider },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Switch AI Provider error:', error);
    throw error;
  }
};

// ===============================
// ✅ GENERATE ITINERARY (Alias)
// ===============================
export const generateItinerary = generateTripPlan;

// ===============================
// ✅ GET TRAVEL INSIGHTS
// ===============================
export const getTravelInsights = async (destination) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/ai/insights`,
      { destination },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Travel Insights error:', error);
    throw error;
  }
};

// ===============================
// ✅ SEND CHAT MESSAGE
// ===============================
export const sendChatMessage = async (message, sessionId, language = 'English') => {
  return getAIChat({
    message,
    sessionId,
    language,
    context: 'chat'
  });
};

// ===============================
// ✅ GET RECOMMENDATIONS BY INTERESTS
// ===============================
export const getRecommendationsByInterests = async (interests, limit = 10) => {
  return getAIRecommendations({
    query: interests.join(' '),
    limit
  });
};