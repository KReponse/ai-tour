// backend/src/models/Notification.js

import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: [
      // Booking related
      'booking_created',
      'booking_confirmed',
      'booking_cancelled',
      'booking_rejected',
      'booking_completed',      // ✅ For completeBooking
      'booking_update',          // ✅ For markInProgress
      
      // Payment related
      'payment_success',
      'payment_failed',
      'refund_processed',        // ✅ For refund handling
      
      // Review related
      'new_review',
      
      // Message related
      'new_message',
      
      // Tour/Listing related
      'tour_created',
      'tour_approved',
      'tour_rejected',
      'listing_created',
      'listing_approved',
      'listing_rejected',
      'listing_suspended',
      'listing_deleted',
      
      // Earning related
      'earning_credited',
      'withdrawal_requested',
      'withdrawal_completed',
      
      // System
      'system_alert'
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  link: {
    type: String
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for faster queries
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, read: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;