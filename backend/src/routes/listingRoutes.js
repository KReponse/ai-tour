// backend/src/routes/listingRoutes.js
// ✅ UPDATED - Added coverMedia support

import express from "express";
import upload from "../middleware/upload.js";
import {
  createListing,
  getListings,
  getSingleListing,
  getProviderListings,
  getAllListings,
  getPendingListings,
  approveListing,
  rejectListing,
  deleteListing,
  deleteListingAdmin,
  toggleListingStatus,
  toggleLike,
  getLikes,
  checkLike,
  updateListing,
  suspendListing,
} from "../controllers/listingController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// =========================
// PUBLIC ROUTES
// =========================

router.get("/", getListings);

// =========================
// STATIC ROUTES
// =========================

router.get("/my", protect, getProviderListings);

// =========================
// LIKES ROUTES (Protected)
// =========================

router.post("/:id/like", protect, toggleLike);
router.get("/:id/likes", getLikes);
router.get("/:id/likes/check", protect, checkLike);

// =========================
// DYNAMIC ROUTES
// =========================

router.get("/:id", getSingleListing);

// =========================
// PROVIDER ROUTES (Protected)
// =========================

// ✅ CREATE LISTING - Updated with coverMedia
router.post(
  "/",
  protect,
  upload.fields([
    { name: "coverImage", maxCount: 1 },      // ✅ Backward compatibility
    { name: "coverMedia", maxCount: 1 },      // ✅ NEW: Cover Media
    { name: "coverMediaType", maxCount: 1 },  // ✅ NEW: Media type ('image' or 'video')
    { name: "galleryImages", maxCount: 15 },
    { name: "videos", maxCount: 3 },
  ]),
  createListing
);

// ✅ UPDATE LISTING - Updated with coverMedia
router.put(
  "/:id",
  protect,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "coverMedia", maxCount: 1 },      // ✅ NEW
    { name: "coverMediaType", maxCount: 1 },  // ✅ NEW
    { name: "galleryImages", maxCount: 15 },
    { name: "videos", maxCount: 3 },
  ]),
  updateListing
);

// Delete listing
router.delete("/:id", protect, deleteListing);

// Toggle status
router.patch("/:id/status", protect, toggleListingStatus);

// =========================
// ADMIN ROUTES (Protected + Admin Only)
// =========================

router.get("/admin/all", protect, adminOnly, getAllListings);
router.get("/admin/pending", protect, adminOnly, getPendingListings);
router.put("/admin/:id/approve", protect, adminOnly, approveListing);
router.put("/admin/:id/reject", protect, adminOnly, rejectListing);
router.put("/admin/:id/suspend", protect, adminOnly, suspendListing);
router.delete("/admin/:id", protect, adminOnly, deleteListingAdmin);

export default router;