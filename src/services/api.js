// frontend/src/services/api.js

import axios from "axios";

// ===============================
// ✅ API CONFIGURATION
// ===============================

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_URL,
  timeout: 30000, // ✅ 30 second timeout
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
    console.error("❌ API Error:", error.response?.status, error.message);
    console.error("❌ URL:", error.config?.url);
    console.error("❌ Data:", error.response?.data);

    // ✅ Handle 401 - Unauthorized
    if (error.response?.status === 401) {
      console.warn("⚠️ Session expired. Redirecting to login...");
      
      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Redirect to login (if not already there)
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    // ✅ Handle 403 - Forbidden
    if (error.response?.status === 403) {
      console.warn("⚠️ Access denied. You don't have permission.");
    }

    // ✅ Handle 404 - Not Found
    if (error.response?.status === 404) {
      console.warn("⚠️ Resource not found:", error.config?.url);
    }

    // ✅ Handle 500 - Server Error
    if (error.response?.status >= 500) {
      console.error("⚠️ Server error:", error.response?.data?.message);
    }

    return Promise.reject(error);
  }
);

export default API;