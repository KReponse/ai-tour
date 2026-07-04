// frontend/src/services/notification.service.js
import api from './api';

class NotificationService {
  // =========================
  // GET NOTIFICATIONS
  // =========================
  async getNotifications(page = 1, limit = 20, read = null) {
    try {
      const params = { page, limit };
      if (read !== null) params.read = read;
      
      const response = await api.get('/notifications', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  }

  // =========================
  // GET UNREAD COUNT
  // =========================
  async getUnreadCount() {
    try {
      const response = await api.get('/notifications/unread-count');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  }

  // =========================
  // MARK AS READ
  // =========================
  async markAsRead(id) {
    try {
      const response = await api.put(`/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  }

  // =========================
  // MARK ALL AS READ
  // =========================
  async markAllAsRead() {
    try {
      const response = await api.put('/notifications/read-all');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  }

  // =========================
  // DELETE NOTIFICATION
  // =========================
  async deleteNotification(id) {
    try {
      const response = await api.delete(`/notifications/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  }

  // =========================
  // DELETE ALL READ
  // =========================
  async deleteAllRead() {
    try {
      const response = await api.delete('/notifications/read/all');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  }
}

export default new NotificationService();