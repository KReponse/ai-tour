// backend/src/routes/aboutRoutes.js
// ✅ NEW - About Routes

import express from 'express';
import {
  getAboutContent,
  updateAboutContent,
  resetAboutContent,
} from '../controllers/aboutController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// ─── PUBLIC ROUTES ──────────────────────────────────────────────
router.get('/', getAboutContent);

// ─── ADMIN ROUTES ──────────────────────────────────────────────
router.put('/', protect, adminOnly, updateAboutContent);
router.post('/reset', protect, adminOnly, resetAboutContent);

export default router;