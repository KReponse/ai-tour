// backend/src/routes/faqRoutes.js
// ✅ NEW - FAQ Routes

import express from 'express';
import {
  getFaqContent,
  updateFaqContent,
  resetFaqContent,
} from '../controllers/faqController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// ─── PUBLIC ROUTES ──────────────────────────────────────────────
router.get('/', getFaqContent);

// ─── ADMIN ROUTES ──────────────────────────────────────────────
router.put('/', protect, adminOnly, updateFaqContent);
router.post('/reset', protect, adminOnly, resetFaqContent);

export default router;