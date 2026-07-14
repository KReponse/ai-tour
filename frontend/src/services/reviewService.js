// frontend/src/services/reviewService.js

import API from './api';

// ===============================
// PUBLIC ENDPOINTS (No Auth)
// ===============================

export const getPublicReviews = async (params = {}) => {
  try {
    const response = await API.get('/public/reviews', { params });
    return response.data;
  } catch (error) {
    console.error('Get public reviews error:', error);
    throw error;
  }
};

export const getPublicReviewById = async (id) => {
  try {
    const response = await API.get(`/public/reviews/${id}`);
    return response.data;
  } catch (error) {
    console.error('Get public review error:', error);
    throw error;
  }
};

export const getListingReviews = async (listingId, params = {}) => {
  try {
    const response = await API.get(`/public/listings/${listingId}/reviews`, { params });
    return response.data;
  } catch (error) {
    console.error('Get listing reviews error:', error);
    throw error;
  }
};

export const getReviewStats = async (entityType, entityId) => {
  try {
    const response = await API.get(`/public/stats/${entityType}/${entityId}`);
    return response.data;
  } catch (error) {
    console.error('Get review stats error:', error);
    throw error;
  }
};

// ===============================
// TRAVELER ENDPOINTS (Auth Required)
// ===============================

export const createReview = async (data) => {
  try {
    const response = await API.post('/reviews', data);
    return response.data;
  } catch (error) {
    console.error('Create review error:', error);
    throw error;
  }
};

export const getMyReviews = async (params = {}) => {
  try {
    const response = await API.get('/reviews/my-reviews', { params });
    return response.data;
  } catch (error) {
    console.error('Get my reviews error:', error);
    throw error;
  }
};

export const getReviewById = async (id) => {
  try {
    const response = await API.get(`/reviews/${id}`);
    return response.data;
  } catch (error) {
    console.error('Get review error:', error);
    throw error;
  }
};

// ✅ Get review by booking ID
export const getReviewByBooking = async (bookingId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await API.get(`/reviews/booking/${bookingId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    // If 404, no review exists - that's fine
    if (error.response?.status === 404) {
      return { review: null };
    }
    console.error('❌ Get review by booking error:', error);
    throw error;
  }
};

// ===============================
// TRAVELER - Update review
// ===============================
export const updateReview = async (id, data) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    console.log('📤 Updating review:', id, data);

    // ✅ Only send the fields that are allowed to be updated
    const updateData = {
      rating: data.rating,
      title: data.title,
      comment: data.comment,
    };

    // ✅ Remove undefined fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const response = await API.put(`/reviews/${id}`, updateData);
    console.log('✅ Review updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Update review error:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};
export const deleteReview = async (id) => {
  try {
    const response = await API.delete(`/reviews/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete review error:', error);
    throw error;
  }
};

export const toggleHelpful = async (id) => {
  try {
    const response = await API.post(`/reviews/${id}/helpful`);
    return response.data;
  } catch (error) {
    console.error('Toggle helpful error:', error);
    throw error;
  }
};

// ===============================
// PROVIDER ENDPOINTS
// ===============================

export const getProviderReviews = async (params = {}) => {
  try {
    const response = await API.get('/provider/reviews', { params });
    return response.data;
  } catch (error) {
    console.error('Get provider reviews error:', error);
    throw error;
  }
};


// ===============================
// PROVIDER - Reply to review
// ===============================
export const respondToReview = async (id, comment, token) => {
  try {
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await API.post(
      `/provider/reviews/${id}/respond`,
      { comment },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Reply to review error:', error);
    throw error;
  }
};

// ===============================
// PROVIDER - Edit response
// ===============================
export const editResponse = async (id, comment, token) => {
  try {
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await API.put(
      `/provider/reviews/${id}/respond`,
      { comment },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Edit response error:', error);
    throw error;
  }
};

// ===============================
// PROVIDER - Get provider review stats
// ===============================
export const getProviderReviewStats = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await API.get('/provider/reviews/stats', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('❌ Get provider review stats error:', error);
    throw error;
  }
};

// ===============================
// ADMIN ENDPOINTS
// ===============================

export const getAdminReviews = async (params = {}) => {
  try {
    const response = await API.get('/admin/reviews', { params });
    return response.data;
  } catch (error) {
    console.error('Get admin reviews error:', error);
    throw error;
  }
};

export const updateReviewStatus = async (id, status, moderationNotes) => {
  try {
    const response = await API.put(`/admin/reviews/${id}/status`, { status, moderationNotes });
    return response.data;
  } catch (error) {
    console.error('Update review status error:', error);
    throw error;
  }
};

export const deleteReviewAdmin = async (id) => {
  try {
    const response = await API.delete(`/admin/reviews/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete review error:', error);
    throw error;
  }
};

export const restoreReview = async (id) => {
  try {
    const response = await API.post(`/admin/reviews/${id}/restore`);
    return response.data;
  } catch (error) {
    console.error('Restore review error:', error);
    throw error;
  }
};

// ===============================
// LEGACY FUNCTIONS (Keep for backward compatibility)
// ===============================

export const getTourReviews = async (tourId) => {
  try {
    const response = await API.get(`/public/listings/${tourId}/reviews`);
    return response.data;
  } catch (error) {
    console.error('Get tour reviews error:', error);
    throw error;
  }
};

export const replyToReview = async (id, reply) => {
  try {
    const response = await API.post(`/provider/reviews/${id}/respond`, { comment: reply });
    return response.data;
  } catch (error) {
    console.error('Reply to review error:', error);
    throw error;
  }
};