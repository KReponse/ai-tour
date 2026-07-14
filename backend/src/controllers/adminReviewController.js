// backend/src/controllers/adminReviewController.js

import Review from '../models/Review.js';
import ReviewReport from '../models/ReviewReport.js';
import { createNotification } from '../utils/notificationService.js';

export const getAllReviews = async (req, res) => {
  try {
    const {
      status,
      rating,
      search,
      page = 1,
      limit = 20,
      sort = 'latest'
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (rating) filter.rating = parseInt(rating);
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { comment: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = {
      latest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      highest: { rating: -1 },
      lowest: { rating: 1 }
    };

    const reviews = await Review.find(filter)
      .populate('traveler', 'name email')
      .populate('provider', 'name businessName')
      .populate('listing', 'title slug')
      .populate('tour', 'title slug')
      .sort(sortOptions[sort] || { createdAt: -1 })
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
      .populate('traveler', 'name email')
      .populate('provider', 'name businessName')
      .populate('listing', 'title slug')
      .populate('tour', 'title slug')
      .populate('moderatedBy', 'name')
      .lean();

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateReviewStatus = async (req, res) => {
  try {
    const { status, moderationNotes } = req.body;
    const review = await Review.findById(req.params.id)
      .populate('traveler', 'name email')
      .populate('provider', 'name');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    review.status = status;
    review.moderationNotes = moderationNotes;
    review.moderatedBy = req.user.id;
    review.moderatedAt = new Date();
    await review.save();

    // Notify traveler about moderation
    if (status === 'hidden' || status === 'deleted') {
      await createNotification({
        recipient: review.traveler._id,
        sender: req.user.id,
        type: 'review_moderated',
        title: 'Your Review Has Been Moderated',
        message: `Your review has been ${status}. Reason: ${moderationNotes || 'No reason provided'}`,
        data: { reviewId: review._id }
      });
    }

    res.json({
      success: true,
      message: `Review ${status} successfully`,
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

export const restoreReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    review.status = 'published';
    review.isDeleted = false;
    review.deletedAt = null;
    review.deletedBy = null;
    await review.save();

    res.json({
      success: true,
      message: 'Review restored successfully',
      review
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getReviewReports = async (req, res) => {
  try {
    const { status = 'pending', page = 1, limit = 20 } = req.query;

    const reports = await ReviewReport.find({ status })
      .populate('review')
      .populate('reporter', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const total = await ReviewReport.countDocuments({ status });

    res.json({
      success: true,
      reports,
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

export const resolveReport = async (req, res) => {
  try {
    const { action, reviewedBy } = req.body;
    const report = await ReviewReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    report.status = 'reviewed';
    report.reviewedAt = new Date();
    report.action = action;
    report.reviewedBy = req.user.id;
    await report.save();

    // If action is hide or delete, update review
    const review = await Review.findById(report.review);
    if (review && (action === 'hide' || action === 'delete')) {
      review.status = action === 'hide' ? 'hidden' : 'deleted';
      review.moderationNotes = `Reported and ${action}ed`;
      review.moderatedBy = req.user.id;
      review.moderatedAt = new Date();
      await review.save();
    }

    res.json({
      success: true,
      message: 'Report resolved successfully',
      report
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};