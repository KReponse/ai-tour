// backend/src/routes/privacyRoutes.js
// ✅ NEW - Privacy Policy Routes

import express from 'express';
import {
  getPrivacyContent,
  updatePrivacyContent,
  resetPrivacyContent,
} from '../controllers/privacyController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// ─── PUBLIC ROUTES ──────────────────────────────────────────────
router.get('/', getPrivacyContent);

// ─── ADMIN ROUTES ──────────────────────────────────────────────
router.put('/', protect, adminOnly, updatePrivacyContent);
router.post('/reset', protect, adminOnly, resetPrivacyContent);

export default router;