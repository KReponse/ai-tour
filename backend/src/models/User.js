// backend/src/models/User.js
// ✅ UPDATED - Added security fields for JWT upgrade

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
  // ─── Basic Information ──────────────────────────────────────
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters"],
    maxlength: [50, "Name cannot exceed 50 characters"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters"],
    select: false
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[0-9]{10,15}$/, "Please enter a valid phone number"]
  },
  country: {
    type: String,
    trim: true,
    default: "Rwanda"
  },
  avatar: {
    type: String,
    default: ""
  },

  // ─── Role & Verification ────────────────────────────────────
  role: {
    type: String,
    enum: ["traveler", "provider", "admin"],
    default: "traveler"
  },
  verificationStatus: {
    type: String,
    enum: ["pending", "approved", "rejected", "needs_information"],
    default: "pending"
  },

  // ─── Account Status ─────────────────────────────────────────
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpire: Date,

  // ─── 🔐 JWT Security Fields (NEW) ───────────────────────────
  // ✅ Token version - increment on password change to invalidate all tokens
  tokenVersion: {
    type: Number,
    default: 1
  },
  
  // ✅ Hashed refresh token (not plain text)
  refreshTokenHash: {
    type: String,
    select: false
  },
  
  // ✅ Refresh token ID (jti) for tracking
  refreshTokenId: {
    type: String,
    select: false
  },
  
  // ✅ Refresh token expiry
  refreshTokenExpiry: {
    type: Date
  },
  
  // ✅ Token blacklist (for individual token revocation)
  tokenBlacklist: [{
    tokenId: {
      type: String,
      required: true
    },
    revokedAt: {
      type: Date,
      default: Date.now
    },
    reason: {
      type: String,
      enum: ['logout', 'password_change', 'admin_revoke', 'security_breach'],
      default: 'logout'
    }
  }],

  // ─── Security Fields (Existing) ─────────────────────────────
  lastPasswordChange: Date,
  passwordChangedAt: Date,

  // ─── Login Security ─────────────────────────────────────────
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date,
    default: null
  },
  lastLogin: Date,
  lastLoginIP: String,
  lastLoginLocation: {
    city: String,
    country: String
  },

  // ─── Provider Information ───────────────────────────────────
  providerApprovedDate: Date,
  businessName: String,
  businessDescription: String,

  // ─── Password Reset ─────────────────────────────────────────
  resetPasswordToken: {
    type: String,
    select: false
  },
  resetPasswordExpire: {
    type: Date,
    select: false
  },

  // ─── Profile ────────────────────────────────────────────────
  bio: {
    type: String,
    trim: true,
    maxlength: [500, "Bio cannot exceed 500 characters"]
  },
  location: String,
  socialLinks: {
    instagram: String,
    facebook: String,
    linkedin: String,
    tiktok: String,
    twitter: String,
    youtube: String
  }
},
{
  timestamps: true
});

// =========================
// ✅ INDEXES
// =========================

// Email index is auto-created by 'unique: true'
userSchema.index({ role: 1 });
userSchema.index({ verificationStatus: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ isEmailVerified: 1 });
userSchema.index({ refreshTokenId: 1 }); // ✅ For fast token lookup
userSchema.index({ role: 1, verificationStatus: 1 });
userSchema.index({ isActive: 1, role: 1 });

// =========================
// ✅ VIRTUAL FIELDS
// =========================

userSchema.virtual('isLocked').get(function() {
  return this.lockUntil && this.lockUntil > Date.now();
});

userSchema.virtual('isProvider').get(function() {
  return this.role === 'provider';
});

userSchema.virtual('isAdmin').get(function() {
  return this.role === 'admin';
});

// =========================
// ✅ METHODS
// =========================

/**
 * Increment login attempts and lock account if threshold exceeded
 */
userSchema.methods.incrementLoginAttempts = async function() {
  const MAX_LOGIN_ATTEMPTS = 5;
  const LOCK_TIME = 15 * 60 * 1000;

  if (this.lockUntil && this.lockUntil > Date.now()) {
    return;
  }

  this.loginAttempts += 1;

  if (this.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
    this.lockUntil = new Date(Date.now() + LOCK_TIME);
    this.loginAttempts = 0;
  }

  await this.save({ validateBeforeSave: false });
};

/**
 * Reset login attempts after successful login
 */
userSchema.methods.resetLoginAttempts = async function() {
  this.loginAttempts = 0;
  this.lockUntil = null;
  await this.save({ validateBeforeSave: false });
};

/**
 * Check if password was changed after token issuance
 */
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

/**
 * Update last login info
 */
userSchema.methods.updateLastLogin = async function(ip, location = null) {
  this.lastLogin = new Date();
  if (ip) this.lastLoginIP = ip;
  if (location) this.lastLoginLocation = location;
  await this.save({ validateBeforeSave: false });
};

// =========================
// ✅ 🔐 NEW JWT SECURITY METHODS
// =========================

/**
 * Store refresh token securely (hashed)
 */
userSchema.methods.setRefreshToken = async function(tokenId, hashedToken, expiry) {
  this.refreshTokenId = tokenId;
  this.refreshTokenHash = hashedToken;
  this.refreshTokenExpiry = expiry;
  await this.save({ validateBeforeSave: false });
};

/**
 * Check if refresh token matches stored hash
 */
userSchema.methods.verifyRefreshToken = function(hashedToken) {
  if (!this.refreshTokenHash || !hashedToken) {
    return false;
  }
  return this.refreshTokenHash === hashedToken;
};

/**
 * Clear refresh token (logout)
 */
userSchema.methods.clearRefreshToken = async function() {
  this.refreshTokenId = undefined;
  this.refreshTokenHash = undefined;
  this.refreshTokenExpiry = undefined;
  await this.save({ validateBeforeSave: false });
};

/**
 * Increment token version (invalidate all tokens)
 */
userSchema.methods.incrementTokenVersion = async function() {
  this.tokenVersion = (this.tokenVersion || 1) + 1;
  await this.save({ validateBeforeSave: false });
};

/**
 * Blacklist a specific token
 */
userSchema.methods.blacklistToken = async function(tokenId, reason = 'logout') {
  // ✅ Remove tokenId from refresh token if it matches
  if (this.refreshTokenId === tokenId) {
    this.refreshTokenId = undefined;
    this.refreshTokenHash = undefined;
    this.refreshTokenExpiry = undefined;
  }
  
  // ✅ Add to blacklist
  this.tokenBlacklist.push({
    tokenId,
    revokedAt: new Date(),
    reason
  });
  
  // ✅ Limit blacklist size (keep last 50)
  if (this.tokenBlacklist.length > 50) {
    this.tokenBlacklist = this.tokenBlacklist.slice(-50);
  }
  
  await this.save({ validateBeforeSave: false });
};

/**
 * Check if a token is blacklisted
 */
userSchema.methods.isTokenBlacklisted = function(tokenId) {
  return this.tokenBlacklist.some(entry => entry.tokenId === tokenId);
};

/**
 * Invalidate all refresh tokens for this user
 */
userSchema.methods.invalidateAllRefreshTokens = async function() {
  this.refreshTokenId = undefined;
  this.refreshTokenHash = undefined;
  this.refreshTokenExpiry = undefined;
  await this.save({ validateBeforeSave: false });
};

export default mongoose.model("User", userSchema);