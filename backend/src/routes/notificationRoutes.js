// src/routes/notificationRoutes.js
import express from 'express';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllRead
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All notification routes are protected
router.use(protect);

// Get notifications
router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);

// Mark as read
router.put('/:id/read', markAsRead);
router.put('/read-all', markAllAsRead);

// Delete
router.delete('/:id', deleteNotification);
router.delete('/read/all', deleteAllRead);

export default router;