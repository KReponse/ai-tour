// backend/src/routes/bookingRoutes.js

import express from "express";
import {
  createBooking,
  getBookings,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getProviderBookings,
  getProviderTravelers,
  getProviderAnalytics,
  getProviderEarnings,
  confirmBooking,
  rejectBooking,
  completeBooking,
  markInProgress,
  getAllBookings,
  updateBookingStatus,
  checkDuplicateBooking
} from "../controllers/bookingController.js";
import {
  protect,
  providerOnly,
  adminOnly
} from "../middleware/authMiddleware.js";

const router = express.Router();

console.log('✅ Booking routes loading...');

// ============================================
// ✅ STATIC ROUTES (NO :id parameter)
// ============================================

// ── Provider Routes ──
router.get("/provider", protect, providerOnly, getProviderBookings);
console.log('✅ GET /provider registered');

router.get("/provider/travelers", protect, providerOnly, getProviderTravelers);
console.log('✅ GET /provider/travelers registered');

router.get("/provider/analytics", protect, providerOnly, getProviderAnalytics);
console.log('✅ GET /provider/analytics registered');

router.get("/provider/earnings", protect, providerOnly, getProviderEarnings);
console.log('✅ GET /provider/earnings registered');

// ── User Routes ──
router.get("/my-bookings", protect, getMyBookings);
console.log('✅ GET /my-bookings registered');

// ── Check Duplicate Booking ──
router.get("/check-duplicate/:entityId", protect, checkDuplicateBooking);
console.log('✅ GET /check-duplicate/:entityId registered');

// ── Create Booking ──
router.post("/", protect, createBooking);
console.log('✅ POST / registered');

// ============================================
// ✅ ADMIN ROUTES
// ============================================

// Admin: Get all bookings
router.get("/admin/all", protect, adminOnly, getAllBookings);
console.log('✅ GET /admin/all registered');

// Admin: Update booking status
router.put("/admin/:id/status", protect, adminOnly, updateBookingStatus);
console.log('✅ PUT /admin/:id/status registered');

// Admin: Get booking by ID
router.get("/admin/:id", protect, adminOnly, getBookingById);
console.log('✅ GET /admin/:id registered');

// ============================================
// ✅ DYNAMIC ROUTES (WITH :id parameter)
// ⚠️ MUST BE LAST - they will match ANY path
// ============================================

// ── Get single booking ──
router.get("/:id", protect, getBookingById);
console.log('✅ GET /:id registered');

// ── Booking Actions ──
router.put("/:id/cancel", protect, cancelBooking);
console.log('✅ PUT /:id/cancel registered');

router.put("/:id/confirm", protect, providerOnly, confirmBooking);
console.log('✅ PUT /:id/confirm registered');

router.put("/:id/reject", protect, providerOnly, rejectBooking);
console.log('✅ PUT /:id/reject registered');

router.put("/:id/complete", protect, providerOnly, completeBooking);
console.log('✅ PUT /:id/complete registered');

router.put("/:id/mark-in-progress", protect, providerOnly, markInProgress);
console.log('✅ PUT /:id/mark-in-progress registered');

console.log('✅ All booking routes registered');

export default router;