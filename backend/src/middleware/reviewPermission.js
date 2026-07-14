// backend/src/middleware/reviewPermission.js

import Booking from '../models/Booking.js';
import Review from '../models/Review.js';

export const canCreateReview = async (req, res, next) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if booking belongs to traveler
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only review your own bookings'
      });
    }

    // Check booking status
    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Booking must be completed before reviewing'
      });
    }

    // Check payment status
    if (booking.paymentStatus !== 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Payment must be confirmed before reviewing'
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You already reviewed this booking'
      });
    }

    // Check review deadline (30 days after completion)
    const reviewDeadline = new Date(booking.updatedAt);
    reviewDeadline.setDate(reviewDeadline.getDate() + 30);

    if (new Date() > reviewDeadline) {
      return res.status(400).json({
        success: false,
        message: 'Review window has expired (30 days after completion)'
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const canModifyReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if review belongs to traveler
    if (review.traveler.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only modify your own reviews'
      });
    }

    // Check if can edit/delete (7 day window)
    if (req.method === 'PUT' && !review.canEdit) {
      return res.status(400).json({
        success: false,
        message: 'Review can only be edited within 7 days of submission'
      });
    }

    if (req.method === 'DELETE' && !review.canDelete) {
      return res.status(400).json({
        success: false,
        message: 'Review can only be deleted within 7 days of submission'
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const canRespondToReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if provider owns this review
    if (review.provider.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only respond to reviews for your own listings'
      });
    }

    // Check if review is published
    if (review.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: 'Can only respond to published reviews'
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};