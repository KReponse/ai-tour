// backend/src/controllers/authController.js
// ✅ STABILIZED v1 - Fast, secure, production-ready authentication

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
 * Sanitize User for Response - Optimized to only essential fields
 */
const sanitizeUser = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    country: user.country,
    avatar: user.avatar,
    isEmailVerified: user.isEmailVerified,
    verificationStatus: user.verificationStatus,
    isActive: user.isActive,
    bio: user.bio,
    location: user.location,
    socialLinks: user.socialLinks,
    createdAt: user.createdAt
  };
};

/**
 * Send email asynchronously (fire and forget) - Non-blocking
 */
const sendEmailAsync = async (to, subject, html) => {
  sendEmail(to, subject, html)
    .then(() => {
      console.log(`📧 [Async] Email sent to ${to}`);
    })
    .catch((error) => {
      console.error(`❌ [Async] Email failed to ${to}:`, error.message);
    });
};

// =========================
// ✅ REGISTER USER - STABILIZED
// =========================
// Changes:
// - No login session created
// - No access/refresh tokens generated
// - Only creates user, stores verification token, sends email
// - Returns registration success message only

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
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ─── Generate verification token ─────────────────────────────
    const verification = generateVerificationToken();
    const verificationExpiry = Date.now() + 24 * 60 * 60 * 1000;

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

    // ─── Send verification email (async - non-blocking) ────────
    if (process.env.NODE_ENV !== "development") {
      const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verification.token}`;
      
      sendEmailAsync(
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
    } else {
      console.log(`📧 [DEV MODE] User created with auto-verified email: ${user.email}`);
    }

    // ─── Response - NO login session created ──────────────────
    res.status(201).json({
      success: true,
      message: "Registration successful. Please check your email for verification.",
      // ✅ No accessToken, no refreshToken, no user object
      // Frontend should redirect to login page
      requiresVerification: true
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
// ✅ VERIFY EMAIL - STABILIZED
// =========================
// Changes:
// - Clean, simple verification
// - No unnecessary operations
// - Single atomic update

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

    // ✅ Single atomic update
    await User.findByIdAndUpdate(user._id, {
      isEmailVerified: true,
      emailVerificationToken: undefined,
      emailVerificationExpire: undefined
    });

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
// ✅ RESEND VERIFICATION EMAIL - STABILIZED
// =========================
// Changes:
// - This is the ONLY endpoint that generates verification emails
// - Login no longer generates verification emails

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

    // ✅ Single atomic update
    await User.findByIdAndUpdate(user._id, {
      emailVerificationToken: verification.hashedToken,
      emailVerificationExpire: Date.now() + 24 * 60 * 60 * 1000
    });

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verification.token}`;

    // ✅ Async email - non-blocking
    sendEmailAsync(
      user.email,
      "AI Tour - Resend Verification",
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
// ✅ LOGIN USER - STABILIZED
// =========================
// Changes:
// - Under 500ms response time
// - No verification email sent on login
// - No new verification token generated on login
// - Only returns 403 with requiresVerification: true
// - Single atomic updates

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // ─── Find user ──────────────────────────────────────────────
    const user = await User.findOne({ 
      email: email.toLowerCase() 
    }).select("+password +refreshTokenHash +refreshTokenId +tokenVersion");

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
      const MAX_LOGIN_ATTEMPTS = 5;
      const LOCK_TIME = 15 * 60 * 1000;
      
      const newAttempts = (user.loginAttempts || 0) + 1;
      let updateData = { loginAttempts: newAttempts };
      
      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
        updateData = {
          loginAttempts: 0,
          lockUntil: new Date(Date.now() + LOCK_TIME)
        };
      }
      
      // ✅ Single atomic update
      await User.findByIdAndUpdate(user._id, updateData);
      
      const remainingAttempts = Math.max(0, MAX_LOGIN_ATTEMPTS - newAttempts);
      
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

    // ─── Check if email is verified ─────────────────────────────
    // ✅ NO email sent, NO new token generated - just return 403
    if (!user.isEmailVerified && process.env.NODE_ENV !== "development") {
      return res.status(403).json({
        success: false,
        message: "Please verify your email address first.",
        requiresVerification: true,
        // ✅ Frontend will show "Resend Verification" button
        email: user.email // ✅ For frontend to send resend request
      });
    }

    // ─── Reset login attempts (single update) ──────────────────
    const clientIP = getClientIP(req);
    
    // ✅ Single atomic update for all login tracking
    await User.findByIdAndUpdate(user._id, {
      loginAttempts: 0,
      lockUntil: null,
      lastLogin: new Date(),
      lastLoginIP: clientIP
    });

    // ─── Check for existing refresh token (reuse detection) ────
    if (user.refreshTokenId) {
      const isBlacklisted = await isTokenBlacklisted(user.refreshTokenId);
      if (!isBlacklisted) {
        await Promise.all([
          blacklistToken(user.refreshTokenId, 7 * 24 * 60 * 60),
          User.findByIdAndUpdate(user._id, {
            $push: {
              tokenBlacklist: {
                tokenId: user.refreshTokenId,
                revokedAt: new Date(),
                reason: 'login_reuse'
              }
            }
          })
        ]);
      }
    }

    // ─── Generate new tokens ─────────────────────────────────────
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // ─── Store refresh token (single update) ────────────────────
    const hashedRefreshToken = hashToken(refreshToken);
    const decodedRefresh = verifyToken(refreshToken, TOKEN_TYPES.REFRESH);
    const refreshTokenId = decodedRefresh.valid ? decodedRefresh.decoded.jti : null;
    
    await User.findByIdAndUpdate(user._id, {
      refreshTokenId,
      refreshTokenHash: hashedRefreshToken,
      refreshTokenExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

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
// ✅ REFRESH TOKEN - STABILIZED
// =========================
// Changes:
// - Kept existing implementation
// - Only verifies expiration, blacklist, token version, rotation
// - No redesign

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

    const user = await User.findById(decoded.id)
      .select("+refreshTokenHash +refreshTokenId +refreshTokenExpiry +tokenVersion");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Please log in again.",
        code: "USER_NOT_FOUND"
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Your account has been deactivated.",
        code: "ACCOUNT_DEACTIVATED"
      });
    }

    if (decoded.version && user.tokenVersion && decoded.version !== user.tokenVersion) {
      return res.status(401).json({
        success: false,
        message: "Token version mismatch. Please log in again.",
        code: "TOKEN_VERSION_MISMATCH"
      });
    }

    const hashedToken = hashToken(token);
    if (!user.verifyRefreshToken(hashedToken)) {
      await User.findByIdAndUpdate(user._id, {
        $push: {
          tokenBlacklist: {
            tokenId: decoded.jti,
            revokedAt: new Date(),
            reason: 'reuse_attempt'
          }
        }
      });
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token. Please log in again.",
        code: "INVALID_REFRESH_TOKEN"
      });
    }

    if (user.refreshTokenExpiry && user.refreshTokenExpiry < new Date()) {
      return res.status(401).json({
        success: false,
        message: "Refresh token expired. Please log in again.",
        code: "REFRESH_TOKEN_EXPIRED"
      });
    }

    await Promise.all([
      User.findByIdAndUpdate(user._id, {
        $push: {
          tokenBlacklist: {
            tokenId: decoded.jti,
            revokedAt: new Date(),
            reason: 'refresh_used'
          }
        }
      }),
      blacklistToken(decoded.jti, 7 * 24 * 60 * 60)
    ]);

    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    const hashedNewRefreshToken = hashToken(newRefreshToken);
    const decodedNewRefresh = verifyToken(newRefreshToken, TOKEN_TYPES.REFRESH);
    const newRefreshTokenId = decodedNewRefresh.valid ? decodedNewRefresh.decoded.jti : null;
    
    await User.findByIdAndUpdate(user._id, {
      refreshTokenId: newRefreshTokenId,
      refreshTokenHash: hashedNewRefreshToken,
      refreshTokenExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

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
// ✅ LOGOUT - STABILIZED
// =========================
// Changes:
// - Kept existing implementation
// - Removes refresh token, updates blacklist, clears cookie if applicable

export const logout = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
        code: "NOT_AUTHENTICATED"
      });
    }

    const user = await User.findById(req.user._id)
      .select("+refreshTokenId");

    if (user) {
      if (user.refreshTokenId) {
        await Promise.all([
          User.findByIdAndUpdate(user._id, {
            $push: {
              tokenBlacklist: {
                tokenId: user.refreshTokenId,
                revokedAt: new Date(),
                reason: 'logout'
              }
            }
          }),
          blacklistToken(user.refreshTokenId, 7 * 24 * 60 * 60)
        ]);
      }
      
      await User.findByIdAndUpdate(user._id, {
        refreshTokenId: undefined,
        refreshTokenHash: undefined,
        refreshTokenExpiry: undefined
      });
    }

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
// ✅ FORGOT PASSWORD - STABILIZED
// =========================
// Changes:
// - Kept existing implementation
// - Async email, single update

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

    const reset = generateResetToken();

    await User.findByIdAndUpdate(user._id, {
      resetPasswordToken: reset.hashedToken,
      resetPasswordExpire: Date.now() + 15 * 60 * 1000
    });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${reset.token}`;

    sendEmailAsync(
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
// ✅ RESET PASSWORD - STABILIZED
// =========================
// Changes:
// - Kept existing implementation
// - Single atomic update with all changes

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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ Single atomic update with all changes
    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      passwordChangedAt: new Date(),
      resetPasswordToken: undefined,
      resetPasswordExpire: undefined,
      refreshTokenId: undefined,
      refreshTokenHash: undefined,
      refreshTokenExpiry: undefined,
      $inc: { tokenVersion: 1 }
    });

    sendEmailAsync(
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
// ✅ CHANGE PASSWORD - STABILIZED
// =========================
// Changes:
// - Kept existing implementation
// - Single atomic update

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

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // ✅ Single atomic update
    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      passwordChangedAt: new Date(),
      refreshTokenId: undefined,
      refreshTokenHash: undefined,
      refreshTokenExpiry: undefined,
      $inc: { tokenVersion: 1 }
    });

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
// Changes:
// - Kept existing implementation

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
// Changes:
// - Kept existing implementation

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
// ✅ INTROSPECT TOKEN
// =========================
// Changes:
// - Kept existing implementation

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