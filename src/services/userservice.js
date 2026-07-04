// frontend/src/services/userservice.js
import api from './api';

class UserService {
  // =========================
  // GET CURRENT USER PROFILE
  // =========================
  async getProfile() {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  }

  // =========================
  // UPDATE PROFILE
  // =========================
  async updateProfile(data) {
    try {
      const response = await api.put('/users/me', data);
      // Update local storage
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  }

  // =========================
  // GET USER STATS
  // =========================
  async getStats() {
    try {
      const response = await api.get('/users/me/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  }

  // =========================
  // UPDATE PASSWORD
  // =========================
  async updatePassword(data) {
    try {
      const response = await api.put('/auth/update-password', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  }

  // =========================
  // UPLOAD AVATAR
  // =========================
  async uploadAvatar(file) {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await api.post('/users/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  }
}

export default new UserService();