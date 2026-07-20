// backend/src/middleware/authMiddleware.js
// ✅ UPDATED - Enhanced JWT security with tokenUtils

import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { 
  verifyToken, 
  TOKEN_TYPES, 
  isTokenBlacklisted,
  getTokenType
} from "../utils/tokenUtils.js";

// =========================
// ✅ PROTECT - Authenticate User (Enhanced)
// =========================

export const protect = async (req, res, next) => {
  try {
    let token;

    // ✅ Extract token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // ✅ Check for token in cookies (optional)
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Please log in."
      });
    }

    // ✅ Verify token using tokenUtils with enhanced security
    const verification = verifyToken(token, TOKEN_TYPES.ACCESS);

    if (!verification.valid) {
      // ✅ Handle specific error cases with appropriate messages
      if (verification.error === 'Token expired') {
        return res.status(401).json({
          success: false,
          message: "Token expired. Please refresh your token or log in again.",
          code: "TOKEN_EXPIRED"
        });
      }
      
      if (verification.error === 'Invalid token type') {
        return res.status(401).json({
          success: false,
          message: "Invalid token type. Please use an access token.",
          code: "INVALID_TOKEN_TYPE"
        });
      }
      
      if (verification.error === 'Invalid token issuer' || verification.error === 'Invalid token audience') {
        return res.status(401).json({
          success: false,
          message: "Invalid token claims. Please log in again.",
          code: "INVALID_TOKEN_CLAIMS"
        });
      }
      
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please log in again.",
        code: "INVALID_TOKEN"
      });
    }

    const decoded = verification.decoded;

    // ✅ Get user with sensitive fields excluded
    const user = await User.findById(decoded.id)
      .select("-password -refreshTokenHash -resetPasswordToken -resetPasswordExpire -tokenBlacklist")
      .lean();

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Please log in again.",
        code: "USER_NOT_FOUND"
      });
    }

    // ✅ Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Your account has been deactivated. Please contact support.",
        code: "ACCOUNT_DEACTIVATED"
      });
    }

    // ✅ Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const remainingMinutes = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(401).json({
        success: false,
        message: `Account locked. Please try again in ${remainingMinutes} minutes.`,
        code: "ACCOUNT_LOCKED",
        remainingMinutes
      });
    }

    // ✅ Check if password was changed after token was issued
    if (user.passwordChangedAt) {
      const changedTimestamp = parseInt(user.passwordChangedAt.getTime() / 1000, 10);
      if (decoded.iat < changedTimestamp) {
        return res.status(401).json({
          success: false,
          message: "Password was changed recently. Please log in again.",
          code: "PASSWORD_CHANGED"
        });
      }
    }

    // ✅ Check token version (for revoked tokens)
    if (decoded.version && user.tokenVersion && decoded.version !== user.tokenVersion) {
      return res.status(401).json({
        success: false,
        message: "Token version mismatch. Please log in again.",
        code: "TOKEN_VERSION_MISMATCH"
      });
    }

    // ✅ Check if token is blacklisted (if jti exists)
    if (decoded.jti) {
      const isBlacklisted = await isTokenBlacklisted(decoded.jti);
      if (isBlacklisted) {
        return res.status(401).json({
          success: false,
          message: "Token has been revoked. Please log in again.",
          code: "TOKEN_REVOKED"
        });
      }
    }

    // ✅ Attach user to request
    req.user = user;
    req.userId = user._id;
    req.token = token;
    req.tokenDecoded = decoded;

    // ✅ Log successful authentication (debug mode only)
    if (process.env.DEBUG === "true") {
      console.log(`🔐 User authenticated: ${user.email} (${user.role})`);
    }

    next();
  } catch (error) {
    console.error("❌ Auth Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Not authorized. Please log in again.",
      code: "AUTH_ERROR"
    });
  }
};

// =========================
// ✅ REFRESH PROTECT - For refresh token endpoints
// =========================

export const protectRefresh = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is required",
        code: "REFRESH_TOKEN_REQUIRED"
      });
    }

    // ✅ Verify refresh token
    const verification = verifyToken(token, TOKEN_TYPES.REFRESH);

    if (!verification.valid) {
      if (verification.error === 'Token expired') {
        return res.status(401).json({
          success: false,
          message: "Refresh token expired. Please log in again.",
          code: "REFRESH_TOKEN_EXPIRED"
        });
      }
      
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token. Please log in again.",
        code: "INVALID_REFRESH_TOKEN"
      });
    }

    const decoded = verification.decoded;

    // ✅ Get user with refresh token fields
    const user = await User.findById(decoded.id)
      .select("+refreshTokenHash +refreshTokenId +refreshTokenExpiry +tokenVersion");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Please log in again.",
        code: "USER_NOT_FOUND"
      });
    }

    // ✅ Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Your account has been deactivated.",
        code: "ACCOUNT_DEACTIVATED"
      });
    }

    // ✅ Check refresh token expiry
    if (user.refreshTokenExpiry && user.refreshTokenExpiry < new Date()) {
      return res.status(401).json({
        success: false,
        message: "Refresh token expired. Please log in again.",
        code: "REFRESH_TOKEN_EXPIRED"
      });
    }

    // ✅ Check token version
    if (decoded.version && user.tokenVersion && decoded.version !== user.tokenVersion) {
      return res.status(401).json({
        success: false,
        message: "Token version mismatch. Please log in again.",
        code: "TOKEN_VERSION_MISMATCH"
      });
    }

    // ✅ Attach user and decoded token to request
    req.user = user;
    req.userId = user._id;
    req.refreshTokenDecoded = decoded;

    next();
  } catch (error) {
    console.error("❌ Refresh Auth Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid refresh token. Please log in again.",
      code: "REFRESH_AUTH_ERROR"
    });
  }
};

// =========================
// ✅ ADMIN ONLY
// =========================

export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
      code: "NOT_AUTHENTICATED"
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required. You do not have permission.",
      code: "ADMIN_REQUIRED"
    });
  }

  next();
};

// =========================
// ✅ PROVIDER ONLY
// =========================

export const providerOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
      code: "NOT_AUTHENTICATED"
    });
  }

  if (req.user.role !== "provider") {
    return res.status(403).json({
      success: false,
      message: "Provider access required.",
      code: "PROVIDER_REQUIRED"
    });
  }

  // ✅ Check verification status
  if (req.user.verificationStatus !== "approved") {
    return res.status(403).json({
      success: false,
      message: "Provider account pending approval. Please wait for verification.",
      code: "PROVIDER_NOT_VERIFIED"
    });
  }

  next();
};

// =========================
// ✅ TRAVELER ONLY
// =========================

export const travelerOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
      code: "NOT_AUTHENTICATED"
    });
  }

  if (req.user.role !== "traveler") {
    return res.status(403).json({
      success: false,
      message: "Traveler access required.",
      code: "TRAVELER_REQUIRED"
    });
  }

  next();
};

// =========================
// ✅ PROVIDER OR ADMIN
// =========================

export const providerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
      code: "NOT_AUTHENTICATED"
    });
  }

  if (req.user.role !== "provider" && req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Provider or Admin access required.",
      code: "PROVIDER_OR_ADMIN_REQUIRED"
    });
  }

  next();
};

// =========================
// ✅ ROLE CHECK GENERIC
// =========================

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
      code: "NOT_AUTHENTICATED"
    });
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: `Access denied. Required roles: ${roles.join(', ')}`,
      code: "ROLE_REQUIRED"
    });
  }

  next();
};

// =========================
// ✅ VERIFY EMAIL
// =========================

export const verifyEmailRequired = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
      code: "NOT_AUTHENTICATED"
    });
  }

  if (!req.user.isEmailVerified) {
    return res.status(403).json({
      success: false,
      message: "Please verify your email address first.",
      code: "EMAIL_NOT_VERIFIED",
      requireEmailVerification: true
    });
  }

  next();
};

// =========================
// ✅ OPTIONAL AUTH
// =========================

export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (token) {
      const verification = verifyToken(token, TOKEN_TYPES.ACCESS);
      
      if (verification.valid) {
        const decoded = verification.decoded;
        const user = await User.findById(decoded.id)
          .select("-password -refreshTokenHash -resetPasswordToken -resetPasswordExpire")
          .lean();

        if (user && user.isActive) {
          req.user = user;
          req.userId = user._id;
        }
      }
    }

    next();
  } catch (error) {
    // ✅ Continue without authentication
    next();
  }
};

// =========================
// ✅ TOKEN INTROSPECTION (for token validation)
// =========================

export const introspectToken = async (req, res, next) => {
  try {
    const token = req.query.token || req.body.token;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is required",
        code: "TOKEN_REQUIRED"
      });
    }

    const verification = verifyToken(token, TOKEN_TYPES.ACCESS);
    
    let user = null;
    let decoded = null;
    let isBlacklisted = false;

    if (verification.valid) {
      decoded = verification.decoded;
      user = await User.findById(decoded.id)
        .select("-password -refreshTokenHash -resetPasswordToken -resetPasswordExpire")
        .lean();
      
      // Check blacklist if jti exists
      if (decoded.jti) {
        isBlacklisted = await isTokenBlacklisted(decoded.jti);
      }
    }

    res.json({
      success: true,
      data: {
        valid: verification.valid && !isBlacklisted && !!user,
        active: verification.valid && !isBlacklisted && !!user && user.isActive,
        user: user ? {
          id: user._id,
          email: user.email,
          role: user.role,
          name: user.name
        } : null,
        decoded: decoded ? {
          id: decoded.id,
          role: decoded.role,
          email: decoded.email,
          iat: decoded.iat,
          exp: decoded.exp,
          version: decoded.version
        } : null,
        blacklisted: isBlacklisted,
        error: verification.error,
        type: verification.valid ? getTokenType(token) : null
      }
    });
  } catch (error) {
    console.error("❌ Token Introspection Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to introspect token",
      code: "INTROSPECTION_ERROR"
    });
  }
};