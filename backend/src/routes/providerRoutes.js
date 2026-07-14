// backend/src/routes/providerRoutes.js
// ✅ UPDATED - Uses updated controllers with Listing

import express from "express";
import {
  getProviderProfile,
  updateProviderProfile,
  getPublicProviderProfile,
  getPublicProviderTours,
  getPublicProviderReviews
} from "../controllers/providerController.js";
import {
  getProviderBookings,
  getProviderTravelers,
  getProviderAnalytics,
  getProviderEarnings
} from "../controllers/bookingController.js";
import { protect, providerOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ===============================
// PUBLIC ROUTES
// ===============================

// ✅ GET public provider profile
router.get("/:id/public", getPublicProviderProfile);

// ✅ GET public provider tours (experiences)
router.get("/:id/tours", getPublicProviderTours);

// ✅ GET public provider reviews
router.get("/:id/reviews", getPublicProviderReviews);

// ===============================
// PROVIDER PROFILE
// ===============================

router.get("/profile", protect, providerOnly, getProviderProfile);
router.put("/profile", protect, providerOnly, updateProviderProfile);

// ===============================
// PROVIDER BOOKINGS
// ===============================

router.get("/bookings", protect, providerOnly, getProviderBookings);

// ===============================
// PROVIDER TRAVELERS
// ===============================

router.get("/travelers", protect, providerOnly, getProviderTravelers);

// ===============================
// PROVIDER ANALYTICS
// ===============================

router.get("/analytics", protect, providerOnly, getProviderAnalytics);

// ===============================
// PROVIDER EARNINGS
// ===============================

router.get("/earnings", protect, providerOnly, getProviderEarnings);

export default router;