// backend/src/routes/blogRoutes.js
// ✅ NEW - Blog Routes

import express from 'express';
import {
  getBlogContent,
  getPublishedPosts,
  getPostBySlug,
  updateBlogContent,
  resetBlogContent,
} from '../controllers/blogController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// ─── PUBLIC ROUTES ──────────────────────────────────────────────
router.get('/', getBlogContent);
router.get('/posts', getPublishedPosts);
router.get('/post/:slug', getPostBySlug);

// ─── ADMIN ROUTES ──────────────────────────────────────────────
router.put('/', protect, adminOnly, updateBlogContent);
router.post('/reset', protect, adminOnly, resetBlogContent);

export default router;