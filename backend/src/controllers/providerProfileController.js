// backend/src/controllers/providerProfileController.js
// ✅ UPDATED - Uses Listing instead of Tour

import ProviderProfile from "../models/ProviderProfile.js";
import ProviderRequest from "../models/ProviderRequest.js";
import User from "../models/User.js";
import Listing from "../models/Listing.js"; // ✅ Changed from Tour
import Review from "../models/Review.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── HELPERS ──────────────────────────────────────────────────────

/**
 * Safely parse JSON string, return fallback if invalid
 */
const safeParseJSON = (value, fallback = null) => {
  if (!value) return fallback;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

/**
 * Delete file from uploads folder if it exists
 */
const deleteFile = (filename) => {
  if (!filename) return;
  const filePath = path.join(__dirname, "..", "uploads", filename);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`✅ Deleted file: ${filename}`);
    } catch (error) {
      console.error(`❌ Failed to delete file: ${filename}`, error.message);
    }
  }
};

/**
 * Get uploads directory path
 */
const getUploadsPath = () => {
  return path.join(__dirname, "..", "uploads");
};

// ─── CREATE PROVIDER PROFILE FROM REQUEST ──────────────────────

export const createProviderProfileFromRequest = async (requestId, adminId) => {
  try {
    const request = await ProviderRequest.findById(requestId);

    if (!request) {
      throw new Error("Provider request not found");
    }

    const existing = await ProviderProfile.findOne({ userId: request.user });
    if (existing) {
      return existing;
    }

    const profile = await ProviderProfile.create({
      userId: request.user,
      businessName: request.businessName,
      businessType: request.businessType,
      description: request.description || "",
      country: request.country || "Rwanda",
      city: request.city || "",
      languages: request.languages || [],
      specializations: request.specializations || [],
      yearsOfExperience: request.yearsOfExperience || "",
      logo: request.logo || "",
      coverImage: request.coverImage || "",
      socialLinks: {
        facebook: request.facebook || "",
        instagram: request.instagram || "",
        twitter: request.twitter || "",
        linkedin: request.linkedin || "",
        youtube: request.youtube || "",
        tiktok: request.tiktok || "",
      },
      businessHours: request.businessHours || {},
      phone: request.phone || "",
      email: request.businessEmail || request.email || "",
      verified: true,
      status: "active",
    });

    return profile;
  } catch (error) {
    console.error("❌ Create provider profile error:", error);
    throw error;
  }
};

// ─── GET PUBLIC PROVIDER PROFILE ───────────────────────────────

export const getPublicProviderProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await ProviderProfile.findOne({
      userId: id,
      status: "active",
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Provider profile not found",
      });
    }

    const user = await User.findById(profile.userId).select(
      "name email phone profileImage"
    );

    // ✅ Use Listing instead of Tour
    const totalTours = await Listing.countDocuments({
      provider: profile.userId,
      status: "approved",
      businessType: { $in: ['tour_operator', 'guide', 'transport'] }
    });

    const listings = await Listing.find({ 
      provider: profile.userId,
      businessType: { $in: ['tour_operator', 'guide', 'transport'] }
    }).select("_id");
    
    const listingIds = listings.map((l) => l._id);

    const reviews = await Review.find({
      listing: { $in: listingIds }, // ✅ Changed from 'tour' to 'listing'
      status: "approved",
    });

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    res.json({
      success: true,
      profile: {
        ...profile.toJSON(),
        user: {
          name: user?.name || "",
          email: user?.email || "",
          phone: user?.phone || "",
          profileImage: user?.profileImage || "",
        },
        totalTours,
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
      },
    });
  } catch (error) {
    console.error("❌ Get public provider profile error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─── GET MY PROVIDER PROFILE ────────────────────────────────────

export const getMyProviderProfile = async (req, res) => {
  try {
    let profile = await ProviderProfile.findOne({ userId: req.user._id });

    if (!profile) {
      const request = await ProviderRequest.findOne({
        user: req.user._id,
        status: "approved",
      }).sort({ createdAt: -1 });

      if (request) {
        profile = await createProviderProfileFromRequest(request._id, req.user._id);
      }
    }

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Provider profile not found",
      });
    }

    const user = await User.findById(req.user._id).select(
      "name email phone profileImage role"
    );

    res.json({
      success: true,
      profile: {
        ...profile.toJSON(),
        user: {
          name: user?.name || "",
          email: user?.email || "",
          phone: user?.phone || "",
          profileImage: user?.profileImage || "",
          role: user?.role || "",
        },
      },
    });
  } catch (error) {
    console.error("❌ Get my provider profile error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─── UPDATE MY PROVIDER PROFILE ────────────────────────────────

export const updateMyProviderProfile = async (req, res) => {
  try {
    console.log("📁 ===== UPDATE PROVIDER PROFILE =====");
    console.log("📁 Body keys:", Object.keys(req.body));
    console.log("📁 Files:", req.files ? Object.keys(req.files) : "No files");

    // ─── 1. Find profile ──────────────────────────────────────────
    const profile = await ProviderProfile.findOne({ userId: req.user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Provider profile not found",
      });
    }

    // ─── 2. Non-editable fields ──────────────────────────────────
    const NON_EDITABLE = [
      "businessName",
      "businessType",
      "country",
      "verified",
      "status",
      "userId",
    ];

    // ─── 3. Parse request body ────────────────────────────────────
    const {
      description,
      city,
      languages,
      specializations,
      yearsOfExperience,
      phone,
      email,
      facebook,
      instagram,
      twitter,
      linkedin,
      youtube,
      tiktok,
      businessHours,
    } = req.body;

    // ─── 4. Update editable fields ──────────────────────────────
    if (description !== undefined && description !== null && description !== "") {
      profile.description = description;
    }

    if (city !== undefined && city !== null && city !== "") {
      profile.city = city;
    }

    if (phone !== undefined && phone !== null && phone !== "") {
      profile.phone = phone;
    }

    if (email !== undefined && email !== null && email !== "") {
      profile.email = email;
    }

    // ─── 5. Parse arrays ──────────────────────────────────────────
    if (languages !== undefined && languages !== null && languages !== "") {
      const parsed = safeParseJSON(languages, null);
      if (parsed !== null && Array.isArray(parsed)) {
        profile.languages = parsed;
      }
    }

    if (specializations !== undefined && specializations !== null && specializations !== "") {
      const parsed = safeParseJSON(specializations, null);
      if (parsed !== null && Array.isArray(parsed)) {
        profile.specializations = parsed;
      }
    }

    if (businessHours !== undefined && businessHours !== null && businessHours !== "") {
      const parsed = safeParseJSON(businessHours, null);
      if (parsed !== null && typeof parsed === "object") {
        profile.businessHours = parsed;
      }
    }

    if (yearsOfExperience !== undefined && yearsOfExperience !== null && yearsOfExperience !== "") {
      profile.yearsOfExperience = yearsOfExperience;
    }

    // ─── 6. Update social links ──────────────────────────────────
    const socialLinks = {};

    if (facebook !== undefined && facebook !== null && facebook !== "") {
      socialLinks.facebook = facebook;
    }
    if (instagram !== undefined && instagram !== null && instagram !== "") {
      socialLinks.instagram = instagram;
    }
    if (twitter !== undefined && twitter !== null && twitter !== "") {
      socialLinks.twitter = twitter;
    }
    if (linkedin !== undefined && linkedin !== null && linkedin !== "") {
      socialLinks.linkedin = linkedin;
    }
    if (youtube !== undefined && youtube !== null && youtube !== "") {
      socialLinks.youtube = youtube;
    }
    if (tiktok !== undefined && tiktok !== null && tiktok !== "") {
      socialLinks.tiktok = tiktok;
    }

    if (Object.keys(socialLinks).length > 0) {
      profile.socialLinks = {
        ...profile.socialLinks,
        ...socialLinks,
      };
    }

    // ─── 7. Handle Logo upload ───────────────────────────────────
    if (req.files?.logo && req.files.logo[0]) {
      const newLogo = req.files.logo[0].filename;
      console.log(`✅ New logo uploaded: ${newLogo}`);

      if (profile.logo && profile.logo !== newLogo) {
        deleteFile(profile.logo);
      }

      profile.logo = newLogo;
    }

    // ─── 8. Handle Cover Image upload ────────────────────────────
    if (req.files?.coverImage && req.files.coverImage[0]) {
      const newCover = req.files.coverImage[0].filename;
      console.log(`✅ New cover image uploaded: ${newCover}`);

      if (profile.coverImage && profile.coverImage !== newCover) {
        deleteFile(profile.coverImage);
      }

      profile.coverImage = newCover;
    }

    // ─── 9. Save profile ─────────────────────────────────────────
    await profile.save();

    console.log(`✅ Profile updated for user: ${req.user._id}`);

    // ─── 10. Return response ─────────────────────────────────────
    const updatedProfile = await ProviderProfile.findOne({ userId: req.user._id });
    const user = await User.findById(req.user._id).select("name email phone");

    res.json({
      success: true,
      message: "Profile updated successfully",
      profile: {
        ...updatedProfile.toJSON(),
        user: {
          name: user?.name || "",
          email: user?.email || "",
          phone: user?.phone || "",
        },
      },
    });
  } catch (error) {
    console.error("❌ Update provider profile error:", error);
    console.error("❌ Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update profile",
    });
  }
};