// backend/src/routes/careersRoutes.js
// ✅ NEW - Careers Routes

import express from 'express';
import {
  getCareersContent,
  updateCareersContent,
  resetCareersContent,
} from '../controllers/careersController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// ─── PUBLIC ROUTES ──────────────────────────────────────────────
router.get('/', getCareersContent);

// ─── ADMIN ROUTES ──────────────────────────────────────────────
router.put('/', protect, adminOnly, updateCareersContent);
router.post('/reset', protect, adminOnly, resetCareersContent);

export default router;