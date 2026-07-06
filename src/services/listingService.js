// src/services/listingService.js

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ===============================
// ✅ GET ALL LISTINGS (Public - with optional auth)
// ===============================
export const getListings = async (params = {}) => {
  try {
    const token = localStorage.getItem("token");
    const config = {};

    if (token) {
      config.headers = { Authorization: `Bearer ${token}` };
    }

    const response = await axios.get(`${API_URL}/listings`, {
      ...config,
      params,
    });
    return response.data;
  } catch (error) {
    // If 401, try again without auth (public access)
    if (error.response?.status === 401) {
      try {
        const response = await axios.get(`${API_URL}/listings`, { params });
        return response.data;
      } catch (retryError) {
        console.error("❌ Get listings error (public fallback):", retryError);
        throw retryError;
      }
    }
    console.error("❌ Get listings error:", error);
    throw error;
  }
};

// ===============================
// ✅ GET LISTING BY ID (Public)
// ===============================
export const getListingById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/listings/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ Get listing by id error:", error);
    throw error;
  }
};

// ===============================
// ✅ GET MY LISTINGS (Provider - Requires Auth)
// ===============================
export const getMyListings = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/listings/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Get my listings error:", error);
    throw error;
  }
};

// ===============================
// ✅ CREATE LISTING (Provider - Requires Auth)
// ===============================
export const createListing = async (data, token, onProgress) => {
  try {
    const response = await axios.post(`${API_URL}/listings`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progress) => {
        if (onProgress) {
          const percent = Math.round((progress.loaded * 100) / progress.total);
          onProgress(percent);
        }
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Create listing error:", error);
    throw error;
  }
};

// ===============================
// ✅ UPDATE LISTING (Provider - Requires Auth)
// ===============================
export const updateListing = async (id, data, token, onProgress) => {
  try {
    const response = await axios.put(`${API_URL}/listings/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progress) => {
        if (onProgress) {
          const percent = Math.round((progress.loaded * 100) / progress.total);
          onProgress(percent);
        }
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Update listing error:", error);
    throw error;
  }
};

// ===============================
// ✅ DELETE LISTING (Provider - Requires Auth)
// ===============================
export const deleteListing = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/listings/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Delete listing error:", error);
    throw error;
  }
};

// ===============================
// ✅ TOGGLE LISTING STATUS (Provider - Requires Auth)
// ===============================
export const toggleListingStatus = async (id, token) => {
  try {
    const response = await axios.patch(
      `${API_URL}/listings/${id}/status`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("❌ Toggle listing status error:", error);
    throw error;
  }
};

// ===============================
// ✅ TOGGLE LIKE
// ===============================
export const toggleLike = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/listings/${id}/like`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("❌ Toggle like error:", error);
    throw error;
  }
};

// ===============================
// ✅ GET LISTING LIKES
// ===============================
export const getListingLikes = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/listings/${id}/likes`);
    return response.data;
  } catch (error) {
    console.error("❌ Get listing likes error:", error);
    throw error;
  }
};

// ===============================
// ✅ CHECK IF USER LIKED
// ===============================
export const checkLikeStatus = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/listings/${id}/likes/check`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Check like status error:", error);
    throw error;
  }
};

// ===============================
// ✅ GET PROVIDER LISTINGS (Provider - Requires Auth)
// ===============================
export const getProviderListings = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/listings/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Get provider listings error:", error);
    throw error;
  }
};