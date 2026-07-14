// frontend/src/services/bookingService.js
// ✅ UPDATED - Minor improvements and consistency

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// =========================
// ✅ CREATE BOOKING
// =========================
export const createBooking = async (bookingData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required. Please login.');
    }

    console.log('📤 Creating booking:', bookingData);

    const response = await axios.post(
      `${API_URL}/bookings`,
      bookingData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Booking created:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Create booking error:');
    console.error('  - Status:', error.response?.status);
    console.error('  - Message:', error.response?.data?.message);
    console.error('  - Data:', error.response?.data);
    throw error;
  }
};

// =========================
// ✅ GET MY BOOKINGS
// =========================
export const getMyBookings = async (token) => {
  try {
    if (!token) {
      throw new Error('Authentication token is required');
    }

    const response = await axios.get(`${API_URL}/bookings/my-bookings`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('❌ Get my bookings error:');
    console.error('  - Status:', error.response?.status);
    console.error('  - Message:', error.response?.data?.message);
    throw error;
  }
};

// =========================
// ✅ GET BOOKING BY ID
// =========================
export const getBookingById = async (id, token) => {
  try {
    // ✅ Validate ID - MUST be a valid MongoDB ObjectId (24 hex characters)
    if (!id || id === 'undefined' || id === 'null' || id === ':id') {
      console.error('❌ getBookingById: Invalid ID provided:', id);
      throw new Error('Invalid booking ID. Please go back and try again.');
    }

    // ✅ Check if ID is a valid MongoDB ObjectId format (24 hex characters)
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      console.error('❌ getBookingById: ID is not a valid ObjectId:', id);
      throw new Error('Invalid booking ID format. Please go back and try again.');
    }

    if (!token) {
      throw new Error('Authentication token is required');
    }

    console.log('📤 Fetching booking with ID:', id);

    const response = await axios.get(`${API_URL}/bookings/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Booking fetched:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Get booking by id error:');
    console.error('  - ID:', id);
    console.error('  - Status:', error.response?.status);
    console.error('  - Message:', error.response?.data?.message);
    throw error;
  }
};

// =========================
// ✅ CANCEL BOOKING
// =========================
export const cancelBooking = async (id, token, reason) => {
  try {
    if (!token) {
      throw new Error('Authentication token is required');
    }

    console.log('📤 Cancelling booking:', id);

    const response = await axios.put(
      `${API_URL}/bookings/${id}/cancel`,
      { reason: reason || 'User requested cancellation' },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Booking cancelled:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Cancel booking error:');
    console.error('  - Status:', error.response?.status);
    console.error('  - Message:', error.response?.data?.message);
    throw error;
  }
};

// =========================
// ✅ GET PROVIDER BOOKINGS
// =========================
export const getProviderBookings = async (token) => {
  try {
    if (!token) {
      throw new Error('Authentication token is required');
    }

    const response = await axios.get(`${API_URL}/bookings/provider`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('❌ Get provider bookings error:');
    console.error('  - Status:', error.response?.status);
    console.error('  - Message:', error.response?.data?.message);
    throw error;
  }
};

// =========================
// ✅ CONFIRM BOOKING
// =========================
export const confirmBooking = async (id, token) => {
  try {
    if (!token) {
      throw new Error('Authentication token is required');
    }

    console.log('📤 Confirming booking:', id);

    const response = await axios.put(
      `${API_URL}/bookings/${id}/confirm`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Booking confirmed:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Confirm booking error:');
    console.error('  - Status:', error.response?.status);
    console.error('  - Message:', error.response?.data?.message);
    console.error('  - Data:', error.response?.data);
    throw error;
  }
};

// =========================
// ✅ REJECT BOOKING
// =========================
export const rejectBooking = async (id, token, reason) => {
  try {
    if (!token) {
      throw new Error('Authentication token is required');
    }

    console.log('📤 Rejecting booking:', id, 'Reason:', reason);

    const response = await axios.put(
      `${API_URL}/bookings/${id}/reject`,
      { reason: reason || 'No reason provided' },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Booking rejected:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Reject booking error:');
    console.error('  - Status:', error.response?.status);
    console.error('  - Message:', error.response?.data?.message);
    console.error('  - Data:', error.response?.data);
    throw error;
  }
};

// =========================
// ✅ COMPLETE BOOKING
// =========================
export const completeBooking = async (id, token) => {
  try {
    if (!token) {
      throw new Error('Authentication token is required');
    }

    console.log('📤 Completing booking:', id);

    const response = await axios.put(
      `${API_URL}/bookings/${id}/complete`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Booking completed:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Complete booking error:');
    console.error('  - Status:', error.response?.status);
    console.error('  - Message:', error.response?.data?.message);
    console.error('  - Data:', error.response?.data);
    throw error;
  }
};

// =========================
// ✅ MARK IN PROGRESS
// =========================
export const markInProgress = async (id, token) => {
  try {
    if (!token) {
      throw new Error('Authentication token is required');
    }

    console.log('📤 Marking booking in progress:', id);

    const response = await axios.put(
      `${API_URL}/bookings/${id}/mark-in-progress`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Booking marked in progress:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Mark in progress error:');
    console.error('  - Status:', error.response?.status);
    console.error('  - Message:', error.response?.data?.message);
    console.error('  - Data:', error.response?.data);
    throw error;
  }
};

// =========================
// ✅ GET PROVIDER ANALYTICS
// =========================
export const getProviderAnalytics = async (token) => {
  try {
    if (!token) {
      throw new Error('Authentication token is required');
    }

    const response = await axios.get(`${API_URL}/bookings/provider/analytics`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('❌ Get provider analytics error:');
    console.error('  - Status:', error.response?.status);
    console.error('  - Message:', error.response?.data?.message);
    throw error;
  }
};

// =========================
// ✅ GET PROVIDER EARNINGS
// =========================
export const getProviderEarnings = async (token) => {
  try {
    if (!token) {
      throw new Error('Authentication token is required');
    }

    const response = await axios.get(`${API_URL}/bookings/provider/earnings`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('❌ Get provider earnings error:');
    console.error('  - Status:', error.response?.status);
    console.error('  - Message:', error.response?.data?.message);
    throw error;
  }
};

// =========================
// ✅ GET PROVIDER TRAVELERS
// =========================
export const getProviderTravelers = async (token) => {
  try {
    if (!token) {
      throw new Error('Authentication token is required');
    }

    const response = await axios.get(`${API_URL}/bookings/provider/travelers`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('❌ Get provider travelers error:');
    console.error('  - Status:', error.response?.status);
    console.error('  - Message:', error.response?.data?.message);
    throw error;
  }
};

// =========================
// ✅ CHECK DUPLICATE BOOKING
// =========================
export const checkDuplicateBooking = async (entityId, entityType = 'listing') => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required. Please login.');
    }

    const response = await axios.get(
      `${API_URL}/bookings/check-duplicate/${entityId}?entityType=${entityType}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Check duplicate booking error:');
    console.error('  - Status:', error.response?.status);
    console.error('  - Message:', error.response?.data?.message);
    throw error;
  }
};

// =========================
// ✅ GET ALL BOOKINGS (Admin)
// =========================
export const getAllBookings = async (token, status = null, page = 1, limit = 20) => {
  try {
    if (!token) {
      throw new Error('Authentication token is required');
    }

    let url = `${API_URL}/bookings/admin/all?page=${page}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('❌ Get all bookings error:');
    console.error('  - Status:', error.response?.status);
    console.error('  - Message:', error.response?.data?.message);
    throw error;
  }
};

// =========================
// ✅ UPDATE BOOKING STATUS (Admin)
// =========================
export const updateBookingStatus = async (id, status, token) => {
  try {
    if (!token) {
      throw new Error('Authentication token is required');
    }

    console.log('📤 Updating booking status:', id, 'to', status);

    const response = await axios.put(
      `${API_URL}/bookings/admin/${id}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Booking status updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Update booking status error:');
    console.error('  - Status:', error.response?.status);
    console.error('  - Message:', error.response?.data?.message);
    throw error;
  }
};

// =========================
// ✅ GET BOOKING BY BOOKING CODE (NEW)
// =========================
export const getBookingByCode = async (bookingCode, token) => {
  try {
    if (!token) {
      throw new Error('Authentication token is required');
    }

    const response = await axios.get(`${API_URL}/bookings/code/${bookingCode}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('❌ Get booking by code error:');
    console.error('  - Status:', error.response?.status);
    console.error('  - Message:', error.response?.data?.message);
    throw error;
  }
};

