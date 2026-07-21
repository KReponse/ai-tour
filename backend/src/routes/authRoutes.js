// backend/src/routes/authRoutes.js
// ✅ FULLY FIXED - Added missing imports, all routes properly configured

import express from "express";
import rateLimit from "express-rate-limit";

// ✅ FIXED: Added missing imports
import User from "../models/User.js";
import { verifyToken, blacklistToken } from "../utils/tokenUtils.js";

import {
  registerUser,
  loginUser,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  refreshToken,
  logout,
  changePassword,
  getCurrentUser,
  updateProfile,
  introspectToken
} from "../controllers/authController.js";

import {
  protect,
  verifyEmailRequired,
  protectRefresh
} from "../middleware/authMiddleware.js";

const router = express.Router();

// =========================
// ✅ RATE LIMITING
// =========================

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
    code: "RATE_LIMIT_EXCEEDED"
  },
  standardHeaders: true,
  legacyHeaders: false
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
    code: "RATE_LIMIT_EXCEEDED"
  },
  standardHeaders: true,
  legacyHeaders: false
});

const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: "Too many refresh requests. Please try again later.",
    code: "RATE_LIMIT_EXCEEDED"
  },
  standardHeaders: true,
  legacyHeaders: false
});

// =========================
// ✅ PUBLIC ROUTES (No Auth Required)
// =========================

// ✅ Register
router.post("/register", authLimiter, registerUser);

// ✅ Verify Email
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", authLimiter, resendVerificationEmail);

// ✅ Login
router.post("/login", loginLimiter, loginUser);

// ✅ Refresh Token (enhanced)
router.post("/refresh-token", refreshLimiter, refreshToken);

// ✅ Forgot Password
router.post("/forgot-password", authLimiter, forgotPassword);

// ✅ Reset Password
router.post("/reset-password/:token", authLimiter, resetPassword);

// ✅ Token Introspection (Public - for debugging)
router.post("/introspect", introspectToken);

// =========================
// ✅ PROTECTED ROUTES (Auth Required)
// =========================

// All routes below require authentication
router.use(protect);

// ✅ Logout
router.post("/logout", logout);

// ✅ Change Password
router.put("/change-password", changePassword);

// ✅ Get Current User
router.get("/me", getCurrentUser);

// ✅ Update Profile
router.put("/profile", updateProfile);

// =========================
// ✅ EMAIL VERIFICATION REQUIRED ROUTES
// =========================

// Routes that require email verification
router.use(verifyEmailRequired);

// Add any routes that require email verification here
// Example: router.get("/bookings", verifyEmailRequired, getBookings);

// =========================
// ✅ TOKEN MANAGEMENT (Protected)
// =========================

/**
 * Revoke a specific token (logout specific device)
 * POST /api/auth/revoke-token
 */
router.post("/revoke-token", async (req, res) => {
  try {
    const { token } = req.body;
    const user = req.user;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is required",
        code: "TOKEN_REQUIRED"
      });
    }

    // ✅ Check if the token belongs to the user
    const decoded = verifyToken(token);
    if (!decoded.valid) {
      return res.status(400).json({
        success: false,
        message: "Invalid token",
        code: "INVALID_TOKEN"
      });
    }

    if (decoded.decoded.id !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Token does not belong to this user",
        code: "TOKEN_NOT_OWNED"
      });
    }

    // ✅ Blacklist the token
    const jti = decoded.decoded.jti;
    if (jti) {
      await user.blacklistToken(jti, 'user_revoked');
      await blacklistToken(jti, 7 * 24 * 60 * 60);
    }

    res.status(200).json({
      success: true,
      message: "Token revoked successfully"
    });
  } catch (error) {
    console.error("❌ Revoke Token Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to revoke token",
      code: "REVOKE_ERROR"
    });
  }
});

// =========================
// ✅ LOGOUT ALL DEVICES
// =========================

/**
 * Logout from all devices
 * POST /api/auth/logout-all
 */
router.post("/logout-all", async (req, res) => {
  try {
    const user = req.user;

    // ✅ Get user with refresh token fields
    const userWithTokens = await User.findById(user._id)
      .select("+refreshTokenId +refreshTokenHash");

    if (userWithTokens) {
      // ✅ Blacklist all tokens
      if (userWithTokens.refreshTokenId) {
        await userWithTokens.blacklistToken(
          userWithTokens.refreshTokenId,
          'logout_all'
        );
        await blacklistToken(
          userWithTokens.refreshTokenId,
          7 * 24 * 60 * 60
        );
      }
      
      // ✅ Clear refresh token
      await userWithTokens.clearRefreshToken();
      
      // ✅ Increment token version (invalidates all access tokens)
      await userWithTokens.incrementTokenVersion();
    }

    // ✅ Clear cookie if used
    res.clearCookie("token");

    res.status(200).json({
      success: true,
      message: "Logged out from all devices successfully"
    });
  } catch (error) {
    console.error("❌ Logout All Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to logout from all devices",
      code: "LOGOUT_ALL_ERROR"
    });
  }
});

// =========================
// ✅ GET SESSION INFO
// =========================

/**
 * Get current session information
 * GET /api/auth/session
 */
router.get("/session", (req, res) => {
  try {
    const user = req.user;
    
    // ✅ Extract token info
    const token = req.token;
    const decoded = req.tokenDecoded;

    res.status(200).json({
      success: true,
      data: {
        userId: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        tokenIssuedAt: decoded.iat ? new Date(decoded.iat * 1000).toISOString() : null,
        tokenExpiresAt: decoded.exp ? new Date(decoded.exp * 1000).toISOString() : null,
        tokenRemaining: decoded.exp ? Math.max(0, decoded.exp - Math.floor(Date.now() / 1000)) : null,
        tokenVersion: user.tokenVersion || 1
      }
    });
  } catch (error) {
    console.error("❌ Session Info Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to get session info",
      code: "SESSION_INFO_ERROR"
    });
  }
});

export default router;