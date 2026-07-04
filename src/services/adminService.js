// src/services/adminService.js

import axios from 'axios';

// ===============================
// API URL CONFIGURATION
// ===============================
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ===============================
// GET PROVIDER REQUESTS (ADMIN)
// ===============================
export const getProviderRequests = async (page = 1, limit = 20, status = '', search = '') => {
  try {
    const token = localStorage.getItem('token');
    
    // ✅ Check if token exists
    if (!token) {
      throw new Error('No authentication token found');
    }

    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    if (status && status !== 'all') params.append('status', status);
    if (search) params.append('search', search);

    const response = await axios.get(`${API_URL}/requests/provider-requests?${params.toString()}`, {
      headers: { 
        Authorization: `Bearer ${token}` 
      },
    });
    return response.data;
  } catch (error) {
    console.error('❌ Get provider requests error:', error);
    throw error;
  }
};

// ===============================
// GET PROVIDER REQUEST BY ID (ADMIN)
// ===============================
export const getProviderRequestById = async (id) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get(`${API_URL}/requests/provider-requests/${id}`, {
      headers: { 
        Authorization: `Bearer ${token}` 
      },
    });
    return response.data;
  } catch (error) {
    console.error('❌ Get provider request by id error:', error);
    throw error;
  }
};

// ===============================
// UPDATE PROVIDER REQUEST (ADMIN)
// ===============================
export const updateProviderRequest = async (id, status, adminNotes = '') => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.put(
      `${API_URL}/requests/provider-requests/${id}`,
      { status, adminNotes },
      {
        headers: { 
          Authorization: `Bearer ${token}` 
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Update provider request error:', error);
    throw error;
  }
};