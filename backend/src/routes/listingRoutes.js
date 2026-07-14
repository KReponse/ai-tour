// backend/src/routes/listingRoutes.js

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

// Get all approved listings (with optional filters)
router.get("/", getListings);

// =========================
// STATIC ROUTES
// =========================

// ✅ Get my listings (Provider) - STATIC ROUTE
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

// Get single listing by ID
router.get("/:id", getSingleListing);

// =========================
// PROVIDER ROUTES (Protected)
// =========================

// ✅ CREATE LISTING - MUST have upload.fields()
router.post(
  "/",
  protect,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 15 },
    { name: "videos", maxCount: 3 },
  ]),
  createListing
);

// Update listing
router.put(
  "/:id",
  protect,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
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