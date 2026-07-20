// backend/src/routes/helpRoutes.js
// ✅ NEW - Help Center Routes

import express from 'express';
import {
  getHelpContent,
  getArticleBySlug,
  updateHelpContent,
  resetHelpContent,
} from '../controllers/helpController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// ─── PUBLIC ROUTES ──────────────────────────────────────────────
router.get('/', getHelpContent);
router.get('/article/:slug', getArticleBySlug);

// ─── ADMIN ROUTES ──────────────────────────────────────────────
router.put('/', protect, adminOnly, updateHelpContent);
router.post('/reset', protect, adminOnly, resetHelpContent);

export default router;