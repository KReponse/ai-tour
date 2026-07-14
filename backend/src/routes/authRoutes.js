import express from "express";

import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getCurrentUser,
} from "../controllers/authController.js";


import {
  protect,
} from "../middleware/authMiddleware.js";


const router = express.Router();


// =========================
// REGISTER
// =========================

router.post(
  "/register",
  registerUser
);



// =========================
// LOGIN
// =========================

router.post(
  "/login",
  loginUser
);



// =========================
// FORGOT PASSWORD
// =========================

router.post(
  "/forgot-password",
  forgotPassword
);



// =========================
// RESET PASSWORD
// =========================

router.post(
  "/reset-password/:token",
  resetPassword
);



// =========================
// CURRENT USER
// =========================

router.get(
  "/me",
  protect,
  getCurrentUser
);



export default router;