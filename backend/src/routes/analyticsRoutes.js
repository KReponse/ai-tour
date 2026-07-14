// backend/src/routes/analyticsRoutes.js
// ✅ No changes needed - already uses updated controllers

import express from "express";
import {
  getOverview,
  getUserStats,
  getTourStats,
  getBookingStats,
  getRevenueStats,
  getProviderAnalytics,
  getGrowthStats,
  getTopPerformers
} from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { providerOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// All analytics routes are protected
router.use(protect);

// Admin routes
router.get("/overview", adminOnly, getOverview);
router.get("/users", adminOnly, getUserStats);
router.get("/tours", adminOnly, getTourStats);
router.get("/bookings", adminOnly, getBookingStats);
router.get("/revenue", adminOnly, getRevenueStats);
router.get("/growth", adminOnly, getGrowthStats);
router.get("/top-performers", adminOnly, getTopPerformers);

// Provider route
router.get("/provider", providerOnly, getProviderAnalytics);

export default router;