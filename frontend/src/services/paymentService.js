// frontend/src/services/paymentService.js
// ✅ UPDATED - Multi-provider payment support

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ===============================
// ✅ GET PAYMENT PROVIDERS
// ===============================
export const getPaymentProviders = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required. Please login.');
    }

    const response = await axios.get(
      `${API_URL}/payments/providers`,
      {
        headers: { 
          Authorization: `Bearer ${token}` 
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Get providers error:', error);
    throw error;
  }
};

// ===============================
// ✅ GET PROVIDER METHODS
// ===============================
export const getProviderMethods = async (providerId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required. Please login.');
    }

    const response = await axios.get(
      `${API_URL}/payments/providers/${providerId}/methods`,
      {
        headers: { 
          Authorization: `Bearer ${token}` 
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Get provider methods error:', error);
    throw error;
  }
};

// ===============================
// ✅ CREATE CHECKOUT SESSION (Multi-Provider)
// ===============================
export const createCheckout = async (bookingId, providerId = 'stripe', options = {}) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required. Please login.');
    }

    const response = await axios.post(
      `${API_URL}/payments/checkout`,
      { 
        bookingId,
        providerId,
        ...options 
      },
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

// ===============================
// ✅ REQUEST REFUND
// ===============================
export const requestRefund = async (bookingId, reason = '') => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required. Please login.');
    }

    const response = await axios.post(
      `${API_URL}/payments/${bookingId}/refund`,
      { reason },
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Request refund error:', error);
    throw error;
  }
};

// ===============================
// ✅ GET WALLET BALANCE
// ===============================
export const getWalletBalance = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required. Please login.');
    }

    const response = await axios.get(
      `${API_URL}/payments/wallet/balance`,
      {
        headers: { 
          Authorization: `Bearer ${token}` 
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Get wallet balance error:', error);
    throw error;
  }
};

// ===============================
// ✅ GET PROVIDER WALLET SUMMARY
// ===============================
export const getProviderWalletSummary = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required. Please login.');
    }

    // Check if user is a provider
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'provider' && user.role !== 'admin') {
      throw new Error('Provider access required');
    }

    const response = await axios.get(
      `${API_URL}/payments/wallet/provider-summary`,
      {
        headers: { 
          Authorization: `Bearer ${token}` 
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Get provider wallet summary error:', error);
    throw error;
  }
};

// ===============================
// ✅ REQUEST WITHDRAWAL (Provider)
// ===============================
export const requestWithdrawal = async (data) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required. Please login.');
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'provider' && user.role !== 'admin') {
      throw new Error('Provider access required');
    }

    const response = await axios.post(
      `${API_URL}/payments/wallet/withdraw`,
      data,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Request withdrawal error:', error);
    throw error;
  }
};

// ===============================
// ✅ GET TRANSACTION HISTORY
// ===============================
export const getTransactionHistory = async (params = {}) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required. Please login.');
    }

    const { page = 1, limit = 20, type, status } = params;
    let url = `${API_URL}/payments/transactions?page=${page}&limit=${limit}`;
    if (type) url += `&type=${type}`;
    if (status) url += `&status=${status}`;

    const response = await axios.get(
      url,
      {
        headers: { 
          Authorization: `Bearer ${token}` 
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Get transaction history error:', error);
    throw error;
  }
};

// ===============================
// ✅ GET WITHDRAWAL HISTORY (Provider)
// ===============================
export const getWithdrawalHistory = async (params = {}) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required. Please login.');
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'provider' && user.role !== 'admin') {
      throw new Error('Provider access required');
    }

    const { page = 1, limit = 20, status } = params;
    let url = `${API_URL}/payments/wallet/withdrawals?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;

    const response = await axios.get(
      url,
      {
        headers: { 
          Authorization: `Bearer ${token}` 
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Get withdrawal history error:', error);
    throw error;
  }
};

// ===============================
// ✅ LEGACY ALIASES (Backward Compatibility)
// ===============================

// @deprecated - Use createCheckout with providerId parameter
export const createCheckoutSession = createCheckout;

export default {
  getPaymentProviders,
  getProviderMethods,
  createCheckout,
  createCheckoutSession,
  verifyPayment,
  getPaymentById,
  getMyPayments,
  getProviderPayments,
  requestRefund,
  getWalletBalance,
  getProviderWalletSummary,
  requestWithdrawal,
  getTransactionHistory,
  getWithdrawalHistory,
};