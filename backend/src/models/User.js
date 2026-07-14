// backend/src/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true  // ← This creates an index
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  country: {
    type: String
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
  providerApprovedDate: {
    type: Date
  },
  lastLogin: {
    type: Date
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpire: {
    type: Date
  },
  bio: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
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
// INDEXES - Remove duplicate email index
// =========================

// Only add indexes that are NOT already defined in schema
userSchema.index({ role: 1 });
userSchema.index({ verificationStatus: 1 });
// email index is already created by 'unique: true'
// No need for: userSchema.index({ email: 1 });

export default mongoose.model("User", userSchema);