// frontend/src/services/api.js
// ✅ UPDATED - Enhanced with payment-specific interceptors

import axios from "axios";

// ===============================
// ✅ API CONFIGURATION
// ===============================

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// ===============================
// ✅ REQUEST INTERCEPTOR
// ===============================

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ Log requests in development
    if (import.meta.env.DEV) {
      console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
      if (config.data) {
        // Don't log sensitive data
        const logData = { ...config.data };
        if (logData.password) logData.password = '***';
        if (logData.currentPassword) logData.currentPassword = '***';
        if (logData.newPassword) logData.newPassword = '***';
        console.log(`📦 Data:`, logData);
      }
    }

    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// ===============================
// ✅ RESPONSE INTERCEPTOR
// ===============================

API.interceptors.response.use(
  (response) => {
    // ✅ Log responses in development
    if (import.meta.env.DEV) {
      console.log(`📥 ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    // ✅ Enhanced error logging
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;
    const url = error.config?.url;

    console.error(`❌ API Error [${status}]: ${message}`);
    console.error(`📌 URL: ${url}`);

    if (error.response?.data) {
      console.error(`📦 Response:`, error.response.data);
    }

    // ✅ Handle 401 - Unauthorized (Token expired or invalid)
    if (status === 401) {
      console.warn("⚠️ Session expired. Attempting to refresh token...");
      
      // Check if we have a refresh token
      const refreshToken = localStorage.getItem("refreshToken");
      
      // If we're not already trying to refresh, and we have a refresh token
      if (refreshToken && !error.config._retry) {
        error.config._retry = true;
        
        // Attempt to refresh the token
        return refreshAccessToken(error);
      }
      
      // If no refresh token, redirect to login
      if (!refreshToken) {
        console.warn("⚠️ No refresh token available. Redirecting to login...");
        clearAuthAndRedirect();
      }
    }

    // ✅ Handle 403 - Forbidden
    if (status === 403) {
      console.warn("⚠️ Access denied. You don't have permission.");
      
      // Provider-specific error messages
      if (error.response?.data?.message?.includes('Provider account pending')) {
        console.warn("⏳ Provider account pending approval");
      }
      if (error.response?.data?.message?.includes('Admin access')) {
        console.warn("🔒 Admin access required");
      }
    }

    // ✅ Handle 404 - Not Found
    if (status === 404) {
      console.warn("⚠️ Resource not found:", url);
    }

    // ✅ Handle 409 - Conflict (Duplicate booking, etc.)
    if (status === 409) {
      console.warn("⚠️ Conflict:", error.response?.data?.message);
    }

    // ✅ Handle 429 - Too Many Requests (Rate Limiting)
    if (status === 429) {
      console.warn("⏳ Too many requests. Please slow down.");
    }

    // ✅ Handle 500 - Server Error
    if (status >= 500) {
      console.error("⚠️ Server error:", error.response?.data?.message);
    }

    // ✅ Handle Network Errors
    if (error.code === 'ECONNABORTED') {
      console.error("⏰ Request timeout. Please try again.");
    }

    if (error.message === 'Network Error') {
      console.error("🌐 Network error. Please check your connection.");
    }

    return Promise.reject(error);
  }
);

// ===============================
// ✅ REFRESH TOKEN
// ===============================

let isRefreshing = false;
let refreshSubscribers = [];

const refreshAccessToken = async (originalError) => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    // If already refreshing, queue the request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshSubscribers.push({ resolve, reject });
      });
    }

    isRefreshing = true;

    const response = await axios.post(
      `${API_URL}/auth/refresh-token`,
      { refreshToken }
    );

    if (response.data.accessToken) {
      // Save new tokens
      localStorage.setItem("token", response.data.accessToken);
      if (response.data.refreshToken) {
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }

      // Resolve all queued requests
      refreshSubscribers.forEach(({ resolve }) => {
        resolve(response.data.accessToken);
      });
      refreshSubscribers = [];

      // Retry the original request
      originalError.config.headers.Authorization = `Bearer ${response.data.accessToken}`;
      return API(originalError.config);
    }

    throw new Error("Token refresh failed");

  } catch (error) {
    console.error("❌ Token refresh failed:", error.message);
    
    // Reject all queued requests
    refreshSubscribers.forEach(({ reject }) => {
      reject(error);
    });
    refreshSubscribers = [];

    // Clear auth and redirect
    clearAuthAndRedirect();
    throw error;

  } finally {
    isRefreshing = false;
  }
};

// ===============================
// ✅ CLEAR AUTH AND REDIRECT
// ===============================

const clearAuthAndRedirect = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  
  if (!window.location.pathname.includes("/login")) {
    window.location.href = "/login";
  }
};

// ===============================
// ✅ PAYMENT SPECIFIC INTERCEPTORS
// ===============================

// Add a payment-specific interceptor for Stripe webhook responses
API.interceptors.response.use(
  (response) => {
    // Check for payment-related responses
    if (response.config.url?.includes('/payments/')) {
      if (response.data?.success === false) {
        console.warn('⚠️ Payment error:', response.data?.message);
      }
      if (response.data?.url) {
        console.log('🔗 Redirecting to payment provider:', response.data.url);
      }
    }
    return response;
  },
  (error) => {
    // Handle payment-specific errors
    if (error.config?.url?.includes('/payments/')) {
      if (error.response?.status === 402) {
        console.error('💳 Payment required');
      }
      if (error.response?.data?.message?.includes('already paid')) {
        console.warn('✅ Payment already completed');
      }
    }
    return Promise.reject(error);
  }
);

// ===============================
// ✅ EXPORT
// ===============================

export default API;