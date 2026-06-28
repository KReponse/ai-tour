// src/services/adminService.js

import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api/admin";

/**
 * Helper: get token safely
 */
const getToken = () => localStorage.getItem("token");

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// =========================
// DASHBOARD
// =========================

export const getDashboardStats = async () => {
  try {
    const response = await axios.get(`${API}/dashboard`, authHeader());
    return response.data;
  } catch (error) {
    console.error("❌ Get dashboard stats error:", error);
    throw error;
  }
};

// =========================
// TOURS
// =========================

export const getAllTours = async () => {
  try {
    const response = await axios.get(`${API}/tours`, authHeader());
    return response.data;
  } catch (error) {
    console.error("❌ Get all tours error:", error);
    throw error;
  }
};

export const approveTour = async (id) => {
  try {
    const response = await axios.put(
      `${API}/tours/${id}/approve`,
      {},
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error("❌ Approve tour error:", error);
    throw error;
  }
};

export const rejectTour = async (id) => {
  try {
    const response = await axios.put(
      `${API}/tours/${id}/reject`,
      {},
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error("❌ Reject tour error:", error);
    throw error;
  }
};

export const deleteTour = async (id) => {
  try {
    const response = await axios.delete(`${API}/tours/${id}`, authHeader());
    return response.data;
  } catch (error) {
    console.error("❌ Delete tour error:", error);
    throw error;
  }
};

// =========================
// REQUESTS (User Trip Requests)
// =========================

export const getAllRequests = async () => {
  try {
    const response = await axios.get(`${API}/requests`, authHeader());
    return response.data;
  } catch (error) {
    console.error("❌ Get all requests error:", error);
    throw error;
  }
};

export const updateRequestStatus = async (id, status) => {
  try {
    const response = await axios.put(
      `${API}/requests/${id}/status`,
      { status },
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error("❌ Update request status error:", error);
    throw error;
  }
};

export const deleteRequest = async (id) => {
  try {
    const response = await axios.delete(`${API}/requests/${id}`, authHeader());
    return response.data;
  } catch (error) {
    console.error("❌ Delete request error:", error);
    throw error;
  }
};

// =========================
// ✅ PROVIDER REQUESTS - ADDED
// =========================

export const getProviderRequests = async () => {
  try {
    const response = await axios.get(`${API}/provider-requests`, authHeader());
    return response.data;
  } catch (error) {
    console.error("❌ Get provider requests error:", error);
    throw error;
  }
};

export const getProviderRequestById = async (id) => {
  try {
    const response = await axios.get(`${API}/provider-requests/${id}`, authHeader());
    return response.data;
  } catch (error) {
    console.error("❌ Get provider request by id error:", error);
    throw error;
  }
};

export const updateProviderRequest = async (id, status, adminNotes = "") => {
  try {
    const response = await axios.put(
      `${API}/provider-requests/${id}`,
      { status, adminNotes },
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error("❌ Update provider request error:", error);
    throw error;
  }
};

export const approveProviderRequest = async (id) => {
  try {
    const response = await axios.put(
      `${API}/provider-requests/${id}/approve`,
      {},
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error("❌ Approve provider request error:", error);
    throw error;
  }
};

export const rejectProviderRequest = async (id, adminNotes = "") => {
  try {
    const response = await axios.put(
      `${API}/provider-requests/${id}/reject`,
      { adminNotes },
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error("❌ Reject provider request error:", error);
    throw error;
  }
};

// =========================
// USERS
// =========================

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API}/users`, authHeader());
    return response.data;
  } catch (error) {
    console.error("❌ Get all users error:", error);
    throw error;
  }
};

export const updateUserRole = async (id, role) => {
  try {
    const response = await axios.put(
      `${API}/users/${id}/role`,
      { role },
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error("❌ Update user role error:", error);
    throw error;
  }
};

export const toggleUserStatus = async (id) => {
  try {
    const response = await axios.put(
      `${API}/users/${id}/toggle`,
      {},
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error("❌ Toggle user status error:", error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API}/users/${id}`, authHeader());
    return response.data;
  } catch (error) {
    console.error("❌ Delete user error:", error);
    throw error;
  }
};

// =========================
// BOOKINGS
// =========================

export const getAllBookings = async () => {
  try {
    const response = await axios.get(`${API}/bookings`, authHeader());
    return response.data;
  } catch (error) {
    console.error("❌ Get all bookings error:", error);
    throw error;
  }
};

export const updateBookingStatus = async (id, status) => {
  try {
    const response = await axios.put(
      `${API}/bookings/${id}/status`,
      { status },
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error("❌ Update booking status error:", error);
    throw error;
  }
};

// =========================
// NOTIFICATIONS
// =========================

export const getAdminNotifications = async () => {
  try {
    const response = await axios.get(`${API}/notifications`, authHeader());
    return response.data;
  } catch (error) {
    console.error("❌ Get admin notifications error:", error);
    throw error;
  }
};

export const markNotificationRead = async (id) => {
  try {
    const response = await axios.patch(
      `${API}/notifications/${id}/read`,
      {},
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error("❌ Mark notification read error:", error);
    throw error;
  }
};