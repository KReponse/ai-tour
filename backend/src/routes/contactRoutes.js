// backend/src/routes/contactRoutes.js
// ✅ NEW - Contact Routes

import express from 'express';
import {
  getContactContent,
  updateContactContent,
  resetContactContent,
} from '../controllers/contactController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// ─── PUBLIC ROUTES ──────────────────────────────────────────────
router.get('/', getContactContent);

// ─── ADMIN ROUTES ──────────────────────────────────────────────
router.put('/', protect, adminOnly, updateContactContent);
router.post('/reset', protect, adminOnly, resetContactContent);

export default router;