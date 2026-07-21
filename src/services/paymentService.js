// src/services/paymentService.js

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ===============================
// ✅ CREATE CHECKOUT SESSION
// ===============================
export const createCheckout = async (bookingId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required. Please login.');
    }

    const response = await axios.post(
      `${API_URL}/payments/checkout`,
      { bookingId },
      { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Create checkout error:', error);
    throw error;
  }
};

// ===============================
// ✅ VERIFY PAYMENT
// ===============================
export const verifyPayment = async (sessionId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required. Please login.');
    }

    console.log('📤 Verifying payment:', sessionId);

    const response = await axios.get(
      `${API_URL}/payments/verify/${sessionId}`,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Verification response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Verify payment error:');
    console.error('  - Status:', error.response?.status);
    console.error('  - Message:', error.response?.data?.message);
    console.error('  - Data:', error.response?.data);
    throw error;
  }
};

// ===============================
// ✅ GET PAYMENT BY ID
// ===============================
export const getPaymentById = async (id) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required. Please login.');
    }

    const response = await axios.get(
      `${API_URL}/payments/${id}`,
      {
        headers: { 
          Authorization: `Bearer ${token}` 
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Get payment error:', error);
    throw error;
  }
};

// ===============================
// ✅ GET MY PAYMENTS
// ===============================
export const getMyPayments = async (page = 1, limit = 20) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required. Please login.');
    }

    const response = await axios.get(
      `${API_URL}/payments/my?page=${page}&limit=${limit}`,
      {
        headers: { 
          Authorization: `Bearer ${token}` 
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Get my payments error:', error);
    throw error;
  }
};

// ===============================
// ✅ GET PROVIDER PAYMENTS
// ===============================
export const getProviderPayments = async (page = 1, limit = 20) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required. Please login.');
    }

    const response = await axios.get(
      `${API_URL}/payments/provider?page=${page}&limit=${limit}`,
      {
        headers: { 
          Authorization: `Bearer ${token}` 
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Get provider payments error:', error);
    throw error;
  }
};