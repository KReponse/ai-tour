// backend/src/routes/providerReviewRoutes.js

import express from 'express';
import {
  getProviderReviews,
  respondToReview,
  editResponse,
  getProviderReviewStats  // ✅ ADD THIS
} from '../controllers/providerReviewController.js';
import { protect, providerOnly } from '../middleware/authMiddleware.js';
import { canRespondToReview } from '../middleware/reviewPermission.js';

const router = express.Router();

router.use(protect, providerOnly);

// ✅ GET provider reviews
router.get('/', getProviderReviews);

// ✅ GET provider review stats
router.get('/stats', getProviderReviewStats);  // ✅ ADD THIS ROUTE

// ✅ Respond to review
router.post('/:id/respond', canRespondToReview, respondToReview);

// ✅ Edit response
router.put('/:id/respond', canRespondToReview, editResponse);

export default router;