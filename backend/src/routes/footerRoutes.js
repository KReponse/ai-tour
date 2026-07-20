// backend/src/routes/footerRoutes.js
// ✅ NEW - Footer Routes

import express from "express";
import {
  getFooterContent,
  updateFooterContent,
  resetFooterContent,
} from "../controllers/footerController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ─── PUBLIC ROUTES ──────────────────────────────────────────────
router.get("/", getFooterContent);

// ─── ADMIN ROUTES ──────────────────────────────────────────────
router.put("/", protect, adminOnly, updateFooterContent);
router.post("/reset", protect, adminOnly, resetFooterContent);

export default router;