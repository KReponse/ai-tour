// backend/src/routes/newsletterRoutes.js
// ✅ NEW - Newsletter Routes

import express from 'express';
import {
  subscribe,
  unsubscribe,
  getSubscribers,
  getStats,
  exportSubscribers,
} from '../controllers/newsletterController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// ─── PUBLIC ROUTES ──────────────────────────────────────────────
router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);

// ─── ADMIN ROUTES ──────────────────────────────────────────────
router.get('/subscribers', protect, adminOnly, getSubscribers);
router.get('/stats', protect, adminOnly, getStats);
router.get('/export', protect, adminOnly, exportSubscribers);

export default router;