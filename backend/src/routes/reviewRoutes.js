// backend/src/routes/reviewRoutes.js

import express from 'express';
import {
  createReview,
  getMyReviews,
  getReviewById,
  getReviewByBooking,
  updateReview,
  deleteReview,
  toggleHelpful
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateReview } from '../middleware/reviewValidation.js';
import { canCreateReview, canModifyReview } from '../middleware/reviewPermission.js';

const router = express.Router();

// All routes require auth
router.use(protect);

// ✅ Get review by booking ID - MUST come BEFORE /:id
router.get('/booking/:bookingId', getReviewByBooking);

// Create review
router.post('/', validateReview, canCreateReview, createReview);

// Get my reviews
router.get('/my-reviews', getMyReviews);

// Get single review - MUST come AFTER /booking/:bookingId
router.get('/:id', getReviewById);

// Update review
router.put('/:id', validateReview, canModifyReview, updateReview);

// Delete review
router.delete('/:id', canModifyReview, deleteReview);

// Toggle helpful
router.post('/:id/helpful', toggleHelpful);

export default router;