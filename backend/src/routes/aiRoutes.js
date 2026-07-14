// backend/src/routes/aiRoutes.js
// ✅ FIXED - Moved provider-info to PUBLIC routes

import express from 'express';
import {
  aiChat,
  aiPlanner,
  aiRecommendations,
  aiSearch,
  getTrendingExperiences,
  getFeaturedExperiences,
  switchAIProvider,
  getAIProviderInfo
} from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

// =========================
// ✅ PUBLIC ROUTES (No Auth Required)
// =========================

// ✅ AI Provider Info - Public (moved here)
router.get('/provider-info', getAIProviderInfo);

// AI Chat - Get personalized responses with Experiences
router.post('/chat', aiChat);

// AI Planner - Plan trips using Experiences
router.post('/planner', aiPlanner);
router.post('/generate-trip', aiPlanner); // Alias

// AI Search - Search across all Listings
router.get('/search', aiSearch);

// AI Suggestions - Quick suggestions (alias)
router.get('/suggestions', aiRecommendations);

// =========================
// ✅ PROTECTED ROUTES (Auth Required)
// =========================

// AI Recommendations - Get personalized Experience recommendations
router.get('/recommendations', protect, aiRecommendations);

// Trending Experiences - Most popular right now
router.get('/trending', protect, getTrendingExperiences);

// Featured Experiences - Curated top picks
router.get('/featured', protect, getFeaturedExperiences);

// =========================
// ✅ ADMIN ROUTES (Auth + Admin Role)
// =========================

// Switch AI provider
router.post('/switch-provider', protect, adminOnly, switchAIProvider);

export default router;