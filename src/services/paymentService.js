// src/services/paymentService.js

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ===============================
// ✅ CREATE CHECKOUT SESSION
// ===============================
export const createCheckout = async (bookingId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/payments/checkout`,
      { bookingId },
      { headers: { Authorization: `Bearer ${token}` } }
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
    const response = await axios.get(`${API_URL}/payments/verify/${sessionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('❌ Verify payment error:', error);
    throw error;
  }
};

// ===============================
// ✅ GET PAYMENT BY ID
// ===============================
export const getPaymentById = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/payments/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('❌ Get payment error:', error);
    throw error;
  }
};

// ===============================
// ✅ GET MY PAYMENTS
// ===============================
export const getMyPayments = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/payments/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('❌ Get my payments error:', error);
    throw error;
  }
};