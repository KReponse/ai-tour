// backend/src/utils/tokenUtils.js
// ✅ NEW - Centralized JWT token management with security best practices

import jwt from "jsonwebtoken";
import crypto from "crypto";

/**
 * Token Types
 */
export const TOKEN_TYPES = {
  ACCESS: 'access',
  REFRESH: 'refresh',
  VERIFICATION: 'verification',
  RESET: 'reset'
};

/**
 * Get the appropriate secret for each token type
 */
const getSecret = (type) => {
  switch (type) {
    case TOKEN_TYPES.ACCESS:
      return process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
    case TOKEN_TYPES.REFRESH:
      return process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
    case TOKEN_TYPES.VERIFICATION:
      return process.env.JWT_VERIFICATION_SECRET || process.env.JWT_SECRET;
    case TOKEN_TYPES.RESET:
      return process.env.JWT_RESET_SECRET || process.env.JWT_SECRET;
    default:
      return process.env.JWT_SECRET;
  }
};

/**
 * Get expiry for each token type
 */
const getExpiry = (type) => {
  switch (type) {
    case TOKEN_TYPES.ACCESS:
      return process.env.JWT_ACCESS_EXPIRY || '15m';
    case TOKEN_TYPES.REFRESH:
      return process.env.JWT_REFRESH_EXPIRY || '7d';
    case TOKEN_TYPES.VERIFICATION:
      return '24h';
    case TOKEN_TYPES.RESET:
      return '15m';
    default:
      return '15m';
  }
};

/**
 * Get issuer
 */
const getIssuer = () => {
  return process.env.JWT_ISSUER || 'aitour.rw';
};

/**
 * Get audience
 */
const getAudience = () => {
  return process.env.JWT_AUDIENCE || 'aitour-api';
};

/**
 * Get algorithm
 */
const getAlgorithm = () => {
  return process.env.JWT_ALGORITHM || 'HS256';
};

/**
 * Generate a random token (for verification, reset, etc.)
 */
export const generateRandomToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString('hex');
};

/**
 * Hash a token for secure storage
 */
export const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Generate a JWT token with security best practices
 */
export const generateToken = (payload, type = TOKEN_TYPES.ACCESS, options = {}) => {
  const secret = getSecret(type);
  const expiresIn = options.expiresIn || getExpiry(type);
  
  // ✅ Add required claims
  const claims = {
    ...payload,
    iss: getIssuer(),
    aud: getAudience(),
    iat: Math.floor(Date.now() / 1000),
    type: type
  };
  
  // ✅ Add optional claims
  if (options.jti) claims.jti = options.jti;
  if (options.nbf) claims.nbf = options.nbf;
  
  return jwt.sign(claims, secret, {
    algorithm: getAlgorithm(),
    expiresIn: expiresIn
  });
};

/**
 * Generate Access Token
 */
export const generateAccessToken = (user, options = {}) => {
  const payload = {
    id: user._id.toString(),
    role: user.role,
    email: user.email,
    verificationStatus: user.verificationStatus
  };
  
  return generateToken(payload, TOKEN_TYPES.ACCESS, options);
};

/**
 * Generate Refresh Token
 */
export const generateRefreshToken = (user, options = {}) => {
  const payload = {
    id: user._id.toString(),
    version: user.tokenVersion || 1
  };
  
  // ✅ Add jti (JWT ID) for refresh token tracking
  const jti = crypto.randomBytes(16).toString('hex');
  
  return generateToken(payload, TOKEN_TYPES.REFRESH, { ...options, jti });
};

/**
 * Generate Email Verification Token
 */
export const generateVerificationToken = (user) => {
  const token = generateRandomToken(32);
  const hashedToken = hashToken(token);
  
  return {
    token,
    hashedToken,
    expiresIn: 24 * 60 * 60 * 1000 // 24 hours
  };
};

/**
 * Generate Password Reset Token
 */
export const generateResetToken = (user) => {
  const token = generateRandomToken(32);
  const hashedToken = hashToken(token);
  
  return {
    token,
    hashedToken,
    expiresIn: 15 * 60 * 1000 // 15 minutes
  };
};

/**
 * Verify a JWT token with proper security checks
 */
export const verifyToken = (token, type = TOKEN_TYPES.ACCESS) => {
  const secret = getSecret(type);
  
  try {
    const decoded = jwt.verify(token, secret, {
      algorithms: [getAlgorithm()],
      issuer: getIssuer(),
      audience: getAudience()
    });
    
    // ✅ Verify token type matches
    if (decoded.type && decoded.type !== type) {
      throw new Error('Invalid token type');
    }
    
    return {
      valid: true,
      decoded,
      error: null
    };
  } catch (error) {
    let message = 'Invalid token';
    
    if (error.name === 'TokenExpiredError') {
      message = 'Token expired';
    } else if (error.name === 'JsonWebTokenError') {
      message = 'Invalid token signature';
    } else if (error.message === 'Invalid token type') {
      message = 'Invalid token type';
    } else if (error.message === 'jwt audience invalid') {
      message = 'Invalid token audience';
    } else if (error.message === 'jwt issuer invalid') {
      message = 'Invalid token issuer';
    }
    
    return {
      valid: false,
      decoded: null,
      error: message
    };
  }
};

/**
 * Decode token without verification (use only for inspection)
 */
export const decodeToken = (token) => {
  try {
    return jwt.decode(token, { complete: true });
  } catch {
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.payload || !decoded.payload.exp) {
    return true;
  }
  return Date.now() >= decoded.payload.exp * 1000;
};

/**
 * Get remaining time on token in seconds
 */
export const getTokenRemainingTime = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.payload || !decoded.payload.exp) {
    return 0;
  }
  const remaining = decoded.payload.exp - Math.floor(Date.now() / 1000);
  return Math.max(0, remaining);
};

/**
 * Check if token is about to expire (within 5 minutes)
 */
export const isTokenExpiringSoon = (token, thresholdSeconds = 300) => {
  const remaining = getTokenRemainingTime(token);
  return remaining > 0 && remaining < thresholdSeconds;
};

/**
 * Extract user ID from token
 */
export const getUserIdFromToken = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.payload || !decoded.payload.id) {
    return null;
  }
  return decoded.payload.id;
};

/**
 * Extract token type from token
 */
export const getTokenType = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.payload || !decoded.payload.type) {
    return null;
  }
  return decoded.payload.type;
};

/**
 * Blacklist token (for future implementation with Redis)
 */
export const blacklistToken = async (token, expiry) => {
  // This is a placeholder for token blacklisting
  // Implement with Redis or in-memory cache
  console.log(`⚫ Token blacklisted (will expire in ${expiry}s)`);
  return true;
};

/**
 * Check if token is blacklisted
 */
export const isTokenBlacklisted = async (token) => {
  // Placeholder for blacklist check
  return false;
};

// =========================
// ✅ DEFAULT EXPORT
// =========================

export default {
  TOKEN_TYPES,
  generateRandomToken,
  hashToken,
  generateToken,
  generateAccessToken,
  generateRefreshToken,
  generateVerificationToken,
  generateResetToken,
  verifyToken,
  decodeToken,
  isTokenExpired,
  getTokenRemainingTime,
  isTokenExpiringSoon,
  getUserIdFromToken,
  getTokenType,
  blacklistToken,
  isTokenBlacklisted
};