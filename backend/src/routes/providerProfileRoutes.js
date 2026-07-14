// backend/src/routes/providerProfileRoutes.js
// ✅ No changes needed - already uses updated controller

import express from "express";
import upload from "../middleware/upload.js";
import {
  getPublicProviderProfile,
  getMyProviderProfile,
  updateMyProviderProfile,
} from "../controllers/providerProfileController.js";
import { protect, providerOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// =========================
// PUBLIC ROUTES
// =========================

// ✅ Get public provider profile by user ID
router.get("/public/:id", getPublicProviderProfile);

// =========================
// PROTECTED ROUTES (Provider only)
// =========================

// ✅ Get my own provider profile
router.get("/me", protect, providerOnly, getMyProviderProfile);

// ✅ Update my provider profile (with file uploads)
router.put(
  "/me",
  protect,
  providerOnly,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  updateMyProviderProfile
);

export default router;