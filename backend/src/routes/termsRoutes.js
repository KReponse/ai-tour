// backend/src/routes/termsRoutes.js
// ✅ NEW - Terms & Conditions Routes

import express from 'express';
import {
  getTermsContent,
  updateTermsContent,
  resetTermsContent,
} from '../controllers/termsController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// ─── PUBLIC ROUTES ──────────────────────────────────────────────
router.get('/', getTermsContent);

// ─── ADMIN ROUTES ──────────────────────────────────────────────
router.put('/', protect, adminOnly, updateTermsContent);
router.post('/reset', protect, adminOnly, resetTermsContent);

export default router;