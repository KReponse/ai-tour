// backend/src/routes/adminReviewRoutes.js

import express from 'express';
import {
  getAllReviews,
  getReviewById,
  updateReviewStatus,
  deleteReview,
  restoreReview,
  getReviewReports,
  resolveReport
} from '../controllers/adminReviewController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/', getAllReviews);
router.get('/:id', getReviewById);
router.put('/:id/status', updateReviewStatus);
router.delete('/:id', deleteReview);
router.post('/:id/restore', restoreReview);
router.get('/reports', getReviewReports);
router.put('/reports/:id/resolve', resolveReport);

export default router;