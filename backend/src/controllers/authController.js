// backend/src/controllers/authController.js
// ✅ UPDATED - Secure token management with tokenUtils

import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import sendEmail from "../config/services/emailService.js";
import {
  generateAccessToken,
  generateRefreshToken,
  generateVerificationToken,
  generateResetToken,
  hashToken,
  verifyToken,
  TOKEN_TYPES,
  isTokenBlacklisted,
  blacklistToken
} from "../utils/tokenUtils.js";

// =========================
// ✅ HELPERS
// =========================

/**
 * Get Client IP
 */
const getClientIP = (req) => {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket?.remoteAddress ||
    req.ip ||
    "unknown"
  );
};

/**
 * Sanitize User for Response
 */
const sanitizeUser = (user) => {
  const userObj = user.toObject ? user.toObject() : { ...user };
  delete userObj.password;
  delete userObj.refreshTokenHash;
  delete userObj.refreshTokenId;
  delete userObj.resetPasswordToken;
  delete userObj.resetPasswordExpire;
  delete userObj.tokenBlacklist;
  delete userObj.__v;
  return userObj;
};

// =========================
// ✅ REGISTER USER
// =========================

export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      country = "Rwanda"
    } = req.body;

    // ─── Validation ──────────────────────────────────────────────
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters"
      });
    }

    // ─── Check if user exists ────────────────────────────────────
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    // ─── Hash password ───────────────────────────────────────────
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ─── Generate email verification token ──────────────────────
    const verification = generateVerificationToken();
    const verificationExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // ─── Create user ─────────────────────────────────────────────
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: phone || undefined,
      country: country || "Rwanda",
      role: "traveler",
      verificationStatus: "approved",
      isEmailVerified: process.env.NODE_ENV === "development" ? true : false,
      emailVerificationToken: process.env.NODE_ENV === "development" ? undefined : verification.hashedToken,
      emailVerificationExpire: process.env.NODE_ENV === "development" ? undefined : verificationExpiry,
      passwordChangedAt: new Date(),
      tokenVersion: 1
    });

    // ─── Send verification email (only in production) ──────────
    if (process.env.NODE_ENV !== "development") {
      const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verification.token}`;

      try {
        await sendEmail(
          user.email,
          "AI Tour - Verify Your Email",
          `
          <h2>Welcome to AI Tour Rwanda! 🇷🇼</h2>
          <p>Hi ${user.name},</p>
          <p>Thank you for registering. Please verify your email address to get started.</p>
          <p>
            <a href="${verificationUrl}" style="
              display: inline-block;
              padding: 12px 30px;
              background: #0D9488;
              color: white;
              text-decoration: none;
              border-radius: 8px;
            ">
              Verify Email
            </a>
          </p>
          <p>This link expires in 24 hours.</p>
          <p>If you didn't create an account, please ignore this email.</p>
          <p>Best regards,<br>AI Tour Rwanda Team</p>
        `
        );
        console.log(`📧 Verification email sent to ${user.email}`);
      } catch (emailError) {
        console.error("❌ Email error:", emailError.message);
      }
    } else {
      console.log(`📧 [DEV MODE] User created with auto-verified email: ${user.email}`);
    }

    // ─── Generate tokens ─────────────────────────────────────────
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // ─── Store refresh token securely (hashed) ──────────────────
    const hashedRefreshToken = hashToken(refreshToken);
    const decodedRefresh = verifyToken(refreshToken, TOKEN_TYPES.REFRESH);
    const refreshTokenId = decodedRefresh.valid ? decodedRefresh.decoded.jti : null;
    
    await user.setRefreshToken(
      refreshTokenId,
      hashedRefreshToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    );

    // ─── Response ────────────────────────────────────────────────
    res.status(201).json({
      success: true,
      message: process.env.NODE_ENV === "development" 
        ? "Registration successful (auto-verified in development mode)" 
        : "Registration successful. Please check your email for verification.",
      accessToken,
      refreshToken,
      user: sanitizeUser(user)
    });

  } catch (error) {
    console.error("❌ Register Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// =========================
// ✅ VERIFY EMAIL
// =========================

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token is required"
      });
    }

    const hashedToken = hashToken(token);

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token"
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now log in."
    });

  } catch (error) {
    console.error("❌ Verify Email Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// =========================
// ✅ RESEND VERIFICATION EMAIL
// =========================

export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified"
      });
    }

    // ─── Generate new token ──────────────────────────────────────
    const verification = generateVerificationToken();

    user.emailVerificationToken = verification.hashedToken;
    user.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    // ─── Send email ──────────────────────────────────────────────
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verification.token}`;

    await sendEmail(
      user.email,
      "AI Tour - Verify Your Email",
      `
        <h2>Resend Verification Email</h2>
        <p>Hi ${user.name},</p>
        <p>Please verify your email address to get started.</p>
        <p>
          <a href="${verificationUrl}" style="
            display: inline-block;
            padding: 12px 30px;
            background: #0D9488;
            color: white;
            text-decoration: none;
            border-radius: 8px;
          ">
            Verify Email
          </a>
        </p>
        <p>This link expires in 24 hours.</p>
      `
    );

    res.status(200).json({
      success: true,
      message: "Verification email sent successfully"
    });

  } catch (error) {
    console.error("❌ Resend Verification Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// =========================
// ✅ LOGIN USER
// =========================

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // ─── Find user with password ─────────────────────────────────
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password +refreshTokenHash +refreshTokenId +tokenVersion");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // ─── Check if account is locked ─────────────────────────────
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const remainingMinutes = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(401).json({
        success: false,
        message: `Account locked. Please try again in ${remainingMinutes} minutes.`
      });
    }

    // ─── Check password ──────────────────────────────────────────
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      await user.incrementLoginAttempts();
      const remainingAttempts = 5 - user.loginAttempts;

      if (remainingAttempts > 0) {
        return res.status(401).json({
          success: false,
          message: `Invalid credentials. ${remainingAttempts} attempts remaining.`
        });
      }

      return res.status(401).json({
        success: false,
        message: "Account locked due to too many failed attempts. Try again in 15 minutes."
      });
    }

    // ─── Check if email is verified (skip in dev) ──────────────
    if (!user.isEmailVerified && process.env.NODE_ENV !== "development") {
      const verification = generateVerificationToken();
      user.emailVerificationToken = verification.hashedToken;
      user.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000;
      await user.save({ validateBeforeSave: false });

      const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verification.token}`;

      try {
        await sendEmail(
          user.email,
          "AI Tour - Verify Your Email",
          `
            <h2>Please Verify Your Email</h2>
            <p>Hi ${user.name},</p>
            <p>Please verify your email address to access your account.</p>
            <p>
              <a href="${verificationUrl}" style="
                display: inline-block;
                padding: 12px 30px;
                background: #0D9488;
                color: white;
                text-decoration: none;
                border-radius: 8px;
              ">
                Verify Email
              </a>
            </p>
          `
        );
      } catch (emailError) {
        console.error("❌ Email error:", emailError.message);
      }

      return res.status(403).json({
        success: false,
        message: "Please verify your email address first. A new verification link has been sent to your email.",
        requiresVerification: true
      });
    }

    // ─── Reset login attempts ────────────────────────────────────
    await user.resetLoginAttempts();

    // ─── Update last login ──────────────────────────────────────
    const clientIP = getClientIP(req);
    await user.updateLastLogin(clientIP);

    // ─── Check for existing refresh token (reuse detection) ─────
    // If user has an existing valid refresh token, this could be a replay attack
    if (user.refreshTokenId) {
      // Check if the token is blacklisted (reuse detection)
      const isBlacklisted = await isTokenBlacklisted(user.refreshTokenId);
      if (!isBlacklisted) {
        // ✅ Token is still valid - blacklist it to prevent reuse
        await blacklistToken(user.refreshTokenId, 7 * 24 * 60 * 60); // 7 days
        await user.blacklistToken(user.refreshTokenId, 'login_reuse');
      }
    }

    // ─── Generate new tokens ─────────────────────────────────────
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // ─── Store refresh token securely (hashed) ──────────────────
    const hashedRefreshToken = hashToken(refreshToken);
    const decodedRefresh = verifyToken(refreshToken, TOKEN_TYPES.REFRESH);
    const refreshTokenId = decodedRefresh.valid ? decodedRefresh.decoded.jti : null;
    
    await user.setRefreshToken(
      refreshTokenId,
      hashedRefreshToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    );

    // ─── Response ────────────────────────────────────────────────
    res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
      user: sanitizeUser(user)
    });

  } catch (error) {
    console.error("❌ Login Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// =========================
// ✅ REFRESH TOKEN
// =========================

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
        code: "REFRESH_TOKEN_REQUIRED"
      });
    }

    // ─── Verify refresh token using tokenUtils ──────────────────
    const verification = verifyToken(token, TOKEN_TYPES.REFRESH);

    if (!verification.valid) {
      return res.status(401).json({
        success: false,
        message: verification.error === 'Token expired' 
          ? "Refresh token expired. Please log in again."
          : "Invalid refresh token. Please log in again.",
        code: verification.error === 'Token expired' 
          ? "REFRESH_TOKEN_EXPIRED" 
          : "INVALID_REFRESH_TOKEN"
      });
    }

    const decoded = verification.decoded;

    // ─── Find user with refresh token fields ────────────────────
    const user = await User.findById(decoded.id)
      .select("+refreshTokenHash +refreshTokenId +refreshTokenExpiry +tokenVersion");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Please log in again.",
        code: "USER_NOT_FOUND"
      });
    }

    // ─── Check if user is active ─────────────────────────────────
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Your account has been deactivated.",
        code: "ACCOUNT_DEACTIVATED"
      });
    }

    // ─── Check token version ─────────────────────────────────────
    if (decoded.version && user.tokenVersion && decoded.version !== user.tokenVersion) {
      return res.status(401).json({
        success: false,
        message: "Token version mismatch. Please log in again.",
        code: "TOKEN_VERSION_MISMATCH"
      });
    }

    // ─── Verify refresh token matches stored hash ───────────────
    const hashedToken = hashToken(token);
    if (!user.verifyRefreshToken(hashedToken)) {
      // ✅ Token doesn't match - possible reuse attack
      await user.blacklistToken(decoded.jti, 'reuse_attempt');
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token. Please log in again.",
        code: "INVALID_REFRESH_TOKEN"
      });
    }

    // ─── Check refresh token expiry ──────────────────────────────
    if (user.refreshTokenExpiry && user.refreshTokenExpiry < new Date()) {
      return res.status(401).json({
        success: false,
        message: "Refresh token expired. Please log in again.",
        code: "REFRESH_TOKEN_EXPIRED"
      });
    }

    // ─── Blacklist the used refresh token (prevent reuse) ──────
    await user.blacklistToken(decoded.jti, 'refresh_used');
    await blacklistToken(decoded.jti, 7 * 24 * 60 * 60); // 7 days

    // ─── Generate new tokens ─────────────────────────────────────
    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // ─── Store new refresh token securely ────────────────────────
    const hashedNewRefreshToken = hashToken(newRefreshToken);
    const decodedNewRefresh = verifyToken(newRefreshToken, TOKEN_TYPES.REFRESH);
    const newRefreshTokenId = decodedNewRefresh.valid ? decodedNewRefresh.decoded.jti : null;
    
    await user.setRefreshToken(
      newRefreshTokenId,
      hashedNewRefreshToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    );

    res.status(200).json({
      success: true,
      accessToken,
      refreshToken: newRefreshToken,
      message: "Token refreshed successfully"
    });

  } catch (error) {
    console.error("❌ Refresh Token Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to refresh token",
      code: "REFRESH_ERROR"
    });
  }
};

// =========================
// ✅ LOGOUT
// =========================

export const logout = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
        code: "NOT_AUTHENTICATED"
      });
    }

    // ─── Get user with refresh token fields ─────────────────────
    const user = await User.findById(req.user._id)
      .select("+refreshTokenId");

    if (user) {
      // ─── Blacklist the refresh token ───────────────────────────
      if (user.refreshTokenId) {
        await user.blacklistToken(user.refreshTokenId, 'logout');
        await blacklistToken(user.refreshTokenId, 7 * 24 * 60 * 60); // 7 days
      }

      // ─── Clear refresh token ────────────────────────────────────
      await user.clearRefreshToken();
    }

    // ─── Clear cookie if used ────────────────────────────────────
    res.clearCookie("token");

    res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });

  } catch (error) {
    console.error("❌ Logout Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to logout",
      code: "LOGOUT_ERROR"
    });
  }
};

// =========================
// ✅ FORGOT PASSWORD
// =========================

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // ─── Generate reset token ────────────────────────────────────
    const reset = generateResetToken();

    user.resetPasswordToken = reset.hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save({ validateBeforeSave: false });

    // ─── Send reset email ────────────────────────────────────────
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${reset.token}`;

    await sendEmail(
      user.email,
      "AI Tour - Password Reset",
      `
        <h2>Password Reset</h2>
        <p>Hi ${user.name},</p>
        <p>We received a request to reset your password.</p>
        <p>
          <a href="${resetUrl}" style="
            display: inline-block;
            padding: 12px 30px;
            background: #0D9488;
            color: white;
            text-decoration: none;
            border-radius: 8px;
          ">
            Reset Password
          </a>
        </p>
        <p>This link expires in 15 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    );

    res.status(200).json({
      success: true,
      message: "Password reset email sent"
    });

  } catch (error) {
    console.error("❌ Forgot Password Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// =========================
// ✅ RESET PASSWORD
// =========================

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Reset token is required"
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters"
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match"
      });
    }

    // ─── Find user with valid reset token ────────────────────────
    const hashedToken = hashToken(token);
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token"
      });
    }

    // ─── Hash new password ───────────────────────────────────────
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ─── Update user ─────────────────────────────────────────────
    user.password = hashedPassword;
    user.passwordChangedAt = new Date();
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    // ✅ Invalidate all refresh tokens
    await user.invalidateAllRefreshTokens();
    
    // ✅ Increment token version to invalidate all access tokens
    await user.incrementTokenVersion();

    await user.save();

    // ─── Notify user ─────────────────────────────────────────────
    await sendEmail(
      user.email,
      "AI Tour - Password Changed",
      `
        <h2>Password Changed</h2>
        <p>Hi ${user.name},</p>
        <p>Your password has been changed successfully.</p>
        <p>If you didn't make this change, please contact us immediately.</p>
      `
    );

    res.status(200).json({
      success: true,
      message: "Password reset successful. Please log in with your new password."
    });

  } catch (error) {
    console.error("❌ Reset Password Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// =========================
// ✅ CHANGE PASSWORD
// =========================

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required"
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters"
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match"
      });
    }

    // ─── Get user with password ──────────────────────────────────
    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // ─── Verify current password ─────────────────────────────────
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    // ─── Hash new password ───────────────────────────────────────
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.passwordChangedAt = new Date();
    
    // ✅ Invalidate all refresh tokens
    await user.invalidateAllRefreshTokens();
    
    // ✅ Increment token version to invalidate all access tokens
    await user.incrementTokenVersion();

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully"
    });

  } catch (error) {
    console.error("❌ Change Password Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// =========================
// ✅ GET CURRENT USER
// =========================

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password -refreshTokenHash -refreshTokenId -resetPasswordToken -resetPasswordExpire -tokenBlacklist -__v");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      user: sanitizeUser(user)
    });

  } catch (error) {
    console.error("❌ Get Current User Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// =========================
// ✅ UPDATE PROFILE
// =========================

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, country, bio, location, socialLinks } = req.body;

    const updates = {};
    if (name) updates.name = name.trim();
    if (phone) updates.phone = phone;
    if (country) updates.country = country;
    if (bio) updates.bio = bio.trim();
    if (location) updates.location = location.trim();
    if (socialLinks) updates.socialLinks = socialLinks;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select("-password -refreshTokenHash -refreshTokenId -resetPasswordToken -resetPasswordExpire -tokenBlacklist -__v");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: sanitizeUser(user)
    });

  } catch (error) {
    console.error("❌ Update Profile Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// =========================
// ✅ INTROSPECT TOKEN (for token validation)
// =========================

export const introspectToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is required",
        code: "TOKEN_REQUIRED"
      });
    }

    const verification = verifyToken(token, TOKEN_TYPES.ACCESS);
    
    let user = null;
    let isBlacklisted = false;

    if (verification.valid) {
      const decoded = verification.decoded;
      
      // Check blacklist if jti exists
      if (decoded.jti) {
        isBlacklisted = await isTokenBlacklisted(decoded.jti);
      }
      
      user = await User.findById(decoded.id)
        .select("-password -refreshTokenHash -resetPasswordToken -resetPasswordExpire")
        .lean();
    }

    res.json({
      success: true,
      data: {
        valid: verification.valid && !isBlacklisted && !!user,
        active: verification.valid && !isBlacklisted && !!user && user?.isActive,
        user: user ? {
          id: user._id,
          email: user.email,
          role: user.role,
          name: user.name
        } : null,
        blacklisted: isBlacklisted,
        error: verification.error
      }
    });
  } catch (error) {
    console.error("❌ Introspect Token Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to introspect token",
      code: "INTROSPECTION_ERROR"
    });
  }
};