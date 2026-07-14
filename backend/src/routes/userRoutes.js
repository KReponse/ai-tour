// backend/src/routes/userRoutes.js
import express from "express";
import {
  getMe,
  updateMe,
  getMyStats,
  getAllUsers,
  getUserById,
  updateUserRole,
  toggleUserStatus,
  deleteUser
} from "../controllers/userController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// =========================
// PROTECTED ROUTES (USER)
// =========================

router.use(protect);

// Get current user
router.get("/me", getMe);

// Update profile
router.put("/me", updateMe);

// Get user stats
router.get("/me/stats", getMyStats);

// =========================
// ADMIN ROUTES
// =========================

router.get("/", adminOnly, getAllUsers);
router.get("/:id", adminOnly, getUserById);
router.put("/:id/role", adminOnly, updateUserRole);
router.put("/:id/toggle", adminOnly, toggleUserStatus);
router.delete("/:id", adminOnly, deleteUser);

export default router;