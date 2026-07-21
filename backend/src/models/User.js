// backend/src/models/User.js
// ✅ FULLY FIXED - Compound indexes, methods use findByIdAndUpdate

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
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

  tokenVersion: {
    type: Number,
    default: 1
  },
  refreshTokenHash: {
    type: String,
    select: false
  },
  refreshTokenId: {
    type: String,
    select: false
  },
  refreshTokenExpiry: {
    type: Date
  },
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

  lastPasswordChange: Date,
  passwordChangedAt: Date,

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

  providerApprovedDate: Date,
  businessName: String,
  businessDescription: String,

  resetPasswordToken: {
    type: String,
    select: false
  },
  resetPasswordExpire: {
    type: Date,
    select: false
  },

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
// ✅ OPTIMIZED INDEXES
// =========================

userSchema.index({ role: 1 });
userSchema.index({ verificationStatus: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ isEmailVerified: 1 });
userSchema.index({ refreshTokenId: 1 });

// ✅ COMPOUND INDEXES for faster authentication
userSchema.index({ email: 1, isActive: 1, isEmailVerified: 1 });
userSchema.index({ role: 1, verificationStatus: 1 });
userSchema.index({ isActive: 1, role: 1 });
userSchema.index({ refreshTokenId: 1, refreshTokenExpiry: 1 });
userSchema.index({ emailVerificationToken: 1, emailVerificationExpire: 1 });
userSchema.index({ resetPasswordToken: 1, resetPasswordExpire: 1 });

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
// ✅ METHODS - All use findByIdAndUpdate
// =========================

/**
 * Increment login attempts - ✅ Uses findByIdAndUpdate
 */
userSchema.methods.incrementLoginAttempts = async function() {
  const MAX_LOGIN_ATTEMPTS = 5;
  const LOCK_TIME = 15 * 60 * 1000;

  if (this.lockUntil && this.lockUntil > Date.now()) {
    return this;
  }

  const newAttempts = (this.loginAttempts || 0) + 1;
  let updateData = { loginAttempts: newAttempts };
  
  if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
    updateData = {
      loginAttempts: 0,
      lockUntil: new Date(Date.now() + LOCK_TIME)
    };
  }
  
  const updated = await this.constructor.findByIdAndUpdate(
    this._id, 
    updateData, 
    { new: true }
  );
  
  if (updated) {
    this.loginAttempts = updated.loginAttempts;
    this.lockUntil = updated.lockUntil;
  }
  
  return this;
};

/**
 * Reset login attempts - ✅ Uses findByIdAndUpdate
 */
userSchema.methods.resetLoginAttempts = async function() {
  const updated = await this.constructor.findByIdAndUpdate(
    this._id,
    {
      loginAttempts: 0,
      lockUntil: null
    },
    { new: true }
  );
  
  if (updated) {
    this.loginAttempts = updated.loginAttempts;
    this.lockUntil = updated.lockUntil;
  }
  
  return this;
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
 * Update last login - ✅ Uses findByIdAndUpdate
 */
userSchema.methods.updateLastLogin = async function(ip, location = null) {
  const updateData = {
    lastLogin: new Date()
  };
  if (ip) updateData.lastLoginIP = ip;
  if (location) updateData.lastLoginLocation = location;
  
  const updated = await this.constructor.findByIdAndUpdate(
    this._id,
    updateData,
    { new: true }
  );
  
  if (updated) {
    this.lastLogin = updated.lastLogin;
    this.lastLoginIP = updated.lastLoginIP;
    this.lastLoginLocation = updated.lastLoginLocation;
  }
  
  return this;
};

// =========================
// ✅ JWT SECURITY METHODS - All use findByIdAndUpdate
// =========================

/**
 * Store refresh token securely
 */
userSchema.methods.setRefreshToken = async function(tokenId, hashedToken, expiry) {
  await this.constructor.findByIdAndUpdate(
    this._id,
    {
      refreshTokenId: tokenId,
      refreshTokenHash: hashedToken,
      refreshTokenExpiry: expiry
    }
  );
  
  this.refreshTokenId = tokenId;
  this.refreshTokenHash = hashedToken;
  this.refreshTokenExpiry = expiry;
  
  return this;
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
 * Clear refresh token
 */
userSchema.methods.clearRefreshToken = async function() {
  await this.constructor.findByIdAndUpdate(
    this._id,
    {
      refreshTokenId: undefined,
      refreshTokenHash: undefined,
      refreshTokenExpiry: undefined
    }
  );
  
  this.refreshTokenId = undefined;
  this.refreshTokenHash = undefined;
  this.refreshTokenExpiry = undefined;
  
  return this;
};

/**
 * Increment token version
 */
userSchema.methods.incrementTokenVersion = async function() {
  const newVersion = (this.tokenVersion || 1) + 1;
  
  await this.constructor.findByIdAndUpdate(
    this._id,
    { tokenVersion: newVersion }
  );
  
  this.tokenVersion = newVersion;
  
  return this;
};

/**
 * Blacklist a specific token - ✅ Uses findByIdAndUpdate with $push
 */
userSchema.methods.blacklistToken = async function(tokenId, reason = 'logout') {
  await this.constructor.findByIdAndUpdate(
    this._id,
    {
      $push: {
        tokenBlacklist: {
          tokenId,
          revokedAt: new Date(),
          reason
        }
      }
    }
  );
  
  this.tokenBlacklist.push({
    tokenId,
    revokedAt: new Date(),
    reason
  });
  
  if (this.refreshTokenId === tokenId) {
    await this.constructor.findByIdAndUpdate(
      this._id,
      {
        refreshTokenId: undefined,
        refreshTokenHash: undefined,
        refreshTokenExpiry: undefined
      }
    );
    this.refreshTokenId = undefined;
    this.refreshTokenHash = undefined;
    this.refreshTokenExpiry = undefined;
  }
  
  return this;
};

/**
 * Check if a token is blacklisted
 */
userSchema.methods.isTokenBlacklisted = function(tokenId) {
  return this.tokenBlacklist.some(entry => entry.tokenId === tokenId);
};

/**
 * Invalidate all refresh tokens
 */
userSchema.methods.invalidateAllRefreshTokens = async function() {
  await this.constructor.findByIdAndUpdate(
    this._id,
    {
      refreshTokenId: undefined,
      refreshTokenHash: undefined,
      refreshTokenExpiry: undefined
    }
  );
  
  this.refreshTokenId = undefined;
  this.refreshTokenHash = undefined;
  this.refreshTokenExpiry = undefined;
  
  return this;
};

export default mongoose.model("User", userSchema);