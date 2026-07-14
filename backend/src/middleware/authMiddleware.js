// backend/src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// =========================
// PROTECT USER
// =========================

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if user is active
    if (req.user.isActive === false) {
      return res.status(401).json({
        success: false,
        message: "Your account has been deactivated"
      });
    }

    next();
  } catch (error) {
    console.error("❌ Auth Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Not authorized"
    });
  }
};

// backend/src/middleware/authMiddleware.js

// =========================
// ADMIN ONLY
// =========================

export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated"
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access only"
    });
  }

  next();
};

// =========================
// PROVIDER ONLY
// =========================

export const providerOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required"
    });
  }

  if (req.user.role !== "provider") {
    return res.status(403).json({
      success: false,
      message: "Provider access only"
    });
  }

  // Check verification status
  if (req.user.verificationStatus !== "approved") {
    return res.status(403).json({
      success: false,
      message: "Provider account pending approval"
    });
  }

  next();
};

// =========================
// TRAVELER ONLY
// =========================

export const travelerOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required"
    });
  }

  if (req.user.role !== "traveler") {
    return res.status(403).json({
      success: false,
      message: "Traveler access only"
    });
  }

  next();
};

// =========================
// PROVIDER OR ADMIN
// =========================

export const providerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated"
    });
  }

  if (req.user.role !== "provider" && req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Provider or Admin access required"
    });
  }

  next();
};

// =========================
// ROLE CHECK GENERIC
// =========================

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated"
    });
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Access denied"
    });
  }

  next();
};