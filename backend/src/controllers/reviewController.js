// backend/src/controllers/reviewController.js

import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import { createNotification } from '../utils/notificationService.js';

export const createReview = async (req, res) => {
  try {
    const { bookingId, rating, title, comment, images } = req.body;

    // Validate booking
    const booking = await Booking.findById(bookingId)
      .populate('listing')
      .populate('tour')
      .populate('provider');

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

    // Check if booking is completed
    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Booking must be completed before reviewing'
      });
    }

    // Check payment
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

    // Calculate review deadline (30 days after completion)
    const reviewDeadline = new Date(booking.updatedAt);
    reviewDeadline.setDate(reviewDeadline.getDate() + 30);

    if (new Date() > reviewDeadline) {
      return res.status(400).json({
        success: false,
        message: 'Review window has expired (30 days after completion)'
      });
    }

    // Get entity (listing or tour)
    const entity = booking.listing || booking.tour;
    if (!entity) {
      return res.status(400).json({
        success: false,
        message: 'No experience associated with this booking'
      });
    }

    // Create review
    const review = await Review.create({
      traveler: req.user.id,
      provider: booking.provider._id,
      booking: booking._id,
      listing: booking.listing?._id,
      tour: booking.tour?._id,
      rating,
      title,
      comment,
      images: images || [],
      isVerifiedBooking: true,
      reviewDeadline,
      status: 'pending'
    });

    // Update booking review status
    booking.canReview = false;
    booking.reviewSubmitted = true;
    await booking.save();

    // Send notification to provider
    await createNotification({
      recipient: booking.provider._id,
      sender: req.user.id,
      type: 'new_review',
      title: 'New Review Received',
      message: `${req.user.name} left a ${rating}-star review on your experience "${entity.title}"`,
      data: { reviewId: review._id },
      link: `/provider/reviews`
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review
    });

  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getMyReviews = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const filter = { traveler: req.user.id };
    if (status) filter.status = status;

    const reviews = await Review.find(filter)
      .populate('listing', 'title slug')
      .populate('tour', 'title slug')
      .populate('provider', 'name businessName')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const total = await Review.countDocuments(filter);

    res.json({
      success: true,
      reviews,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('traveler', 'name avatar')
      .populate('provider', 'name businessName')
      .populate('listing', 'title slug')
      .populate('tour', 'title slug')
      .lean();

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check permission
    const isOwner = review.traveler._id.toString() === req.user.id;
    const isProvider = review.provider._id.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isProvider && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this review'
      });
    }

    res.json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { rating, title, comment, images } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if can edit (7 day window)
    if (!review.canEdit) {
      return res.status(400).json({
        success: false,
        message: 'Review can only be edited within 7 days of submission'
      });
    }

    // Update fields
    if (rating) review.rating = rating;
    if (title) review.title = title;
    if (comment) review.comment = comment;
    if (images) review.images = images;

    await review.save();

    res.json({
      success: true,
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if can delete (7 day window)
    if (!review.canDelete) {
      return res.status(400).json({
        success: false,
        message: 'Review can only be deleted within 7 days of submission'
      });
    }

    review.status = 'deleted';
    review.isDeleted = true;
    review.deletedAt = new Date();
    review.deletedBy = req.user.id;
    await review.save();

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleHelpful = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    const userId = req.user.id;
    const index = review.helpfulUsers.indexOf(userId);

    if (index > -1) {
      review.helpfulUsers.splice(index, 1);
      review.helpfulCount--;
    } else {
      review.helpfulUsers.push(userId);
      review.helpfulCount++;
    }

    await review.save();

    res.json({
      success: true,
      helpfulCount: review.helpfulCount,
      isHelpful: index === -1
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// ✅ GET REVIEW BY BOOKING ID (ADD THIS)
// =========================
export const getReviewByBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: 'Booking ID is required'
      });
    }

    // Find review by booking ID
    const review = await Review.findOne({ booking: bookingId })
      .populate('traveler', 'name profileImage')
      .populate('provider', 'name businessName')
      .populate('listing', 'title location')
      .populate('tour', 'title location');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'No review found for this booking'
      });
    }

    // Check if user has permission
    const isOwner = review.traveler._id.toString() === req.user.id;
    const isProvider = review.provider._id.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isProvider && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this review'
      });
    }

    res.json({
      success: true,
      review
    });
  } catch (error) {
    console.error('❌ Get review by booking error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};