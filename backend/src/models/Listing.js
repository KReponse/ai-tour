// backend/src/models/Listing.js
// ✅ UPDATED - Added Cover Media fields (image + video support)

import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    // =========================
    // BASIC INFORMATION
    // =========================
    title: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    // =========================
    // LISTING TYPE
    // =========================
    businessType: {
      type: String,
      enum: [
        "tour_operator",
        "guide",
        "hotel",
        "lodge",
        "restaurant",
        "cafe",
        "transport",
        "events",
        "shop",
        "other",
      ],
      required: true,
      index: true,
    },

    listingType: {
      type: String,
      required: true,
      trim: true,
    },

    // =========================
    // SHARED FIELDS
    // =========================
    duration: {
      type: String,
      default: "",
    },

    capacity: {
      type: Number,
      default: 1,
      min: 1,
    },

    highlights: {
      type: String,
      default: "",
    },

    included: {
      type: String,
      default: "",
    },

    excluded: {
      type: String,
      default: "",
    },

    meetingPoint: {
      type: String,
      default: "",
    },

    cancellationPolicy: {
      type: String,
      default: "",
    },

    requirements: {
      type: String,
      default: "",
    },

    // =========================
    // BUSINESS-SPECIFIC FIELDS
    // =========================
    amenities: {
      type: String,
      default: "",
    },

    menu: {
      type: String,
      default: "",
    },

    cuisine: {
      type: String,
      default: "",
    },

    vehicleType: {
      type: String,
      default: "",
    },

    seats: {
      type: Number,
      default: 0,
    },

    // =========================
    // DYNAMIC FIELDS
    // =========================
    dynamicFields: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // =========================
    // MEDIA
    // =========================
    // ✅ NEW: Cover Media (Image or Video)
    coverMedia: {
      type: String,
      default: "",
    },

    // ✅ NEW: Cover Media Type ('image' or 'video')
    coverMediaType: {
      type: String,
      enum: ['image', 'video'],
      default: 'image',
    },

    // ✅ Keep for backward compatibility
    coverImage: {
      type: String,
      default: "",
    },

    galleryImages: [
      {
        type: String,
      },
    ],

    videos: [
      {
        type: String,
      },
    ],

    // =========================
    // STATUS
    // =========================
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "suspended"],
      default: "pending",
      index: true,
    },

    // =========================
    // ADMIN TRACKING
    // =========================
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    approvedAt: {
      type: Date,
    },

    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    rejectedAt: {
      type: Date,
    },

    rejectReason: {
      type: String,
      default: "",
      trim: true,
    },

    suspendedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    suspendedAt: {
      type: Date,
    },

    suspendReason: {
      type: String,
      default: "",
      trim: true,
    },

    // =========================
    // RELATIONSHIPS
    // =========================
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // =========================
    // RATING & REVIEWS
    // =========================
    averageRating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    // =========================
    // LIKES
    // =========================
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    likesCount: {
      type: Number,
      default: 0,
    },

    // =========================
    // BOOKING STATS
    // =========================
    totalBookings: {
      type: Number,
      default: 0,
    },

    totalRevenue: {
      type: Number,
      default: 0,
    },

    // =========================
    // SEO & META
    // =========================
    slug: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },

    metaTitle: {
      type: String,
      trim: true,
    },

    metaDescription: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// =========================
// ✅ INDEXES (No duplicate)
// =========================
listingSchema.index({ businessType: 1, status: 1, createdAt: -1 });
listingSchema.index({ provider: 1, createdAt: -1 });
listingSchema.index({ location: 1 });
listingSchema.index({ averageRating: -1 });
listingSchema.index({ likesCount: -1 });
listingSchema.index({ price: 1 });

// ✅ NEW: Index for coverMediaType for filtering
listingSchema.index({ coverMediaType: 1 });

// ✅ REMOVE duplicate slug index - unique: true already creates it

// =========================
// VIRTUAL: Full address
// =========================
listingSchema.virtual("fullAddress").get(function () {
  return this.location || "Location not specified";
});

// =========================
// VIRTUAL: Is approved
// =========================
listingSchema.virtual("isApproved").get(function () {
  return this.status === "approved";
});

// =========================
// VIRTUAL: Is pending
// =========================
listingSchema.virtual("isPending").get(function () {
  return this.status === "pending";
});

// ✅ NEW: Virtual to check if cover media is video
listingSchema.virtual("isCoverVideo").get(function () {
  return this.coverMediaType === 'video' && this.coverMedia;
});

// ✅ NEW: Virtual to check if cover media is image
listingSchema.virtual("isCoverImage").get(function () {
  return this.coverMediaType === 'image' && this.coverMedia;
});

// ✅ NEW: Virtual to get the actual cover media (prefer coverMedia over coverImage)
listingSchema.virtual("coverMediaUrl").get(function () {
  return this.coverMedia || this.coverImage || "";
});

// =========================
// INSTANCE METHODS
// =========================
listingSchema.methods.toggleLike = async function (userId) {
  const index = this.likes.indexOf(userId);
  if (index > -1) {
    this.likes.splice(index, 1);
    this.likesCount--;
  } else {
    this.likes.push(userId);
    this.likesCount++;
  }
  await this.save();
  return this;
};

listingSchema.methods.isLikedBy = function (userId) {
  return this.likes.includes(userId);
};

listingSchema.methods.updateBookingStats = async function (amount) {
  this.totalBookings++;
  this.totalRevenue += amount;
  await this.save();
  return this;
};

// ✅ NEW: Method to get cover media for display
listingSchema.methods.getCoverMedia = function () {
  return {
    url: this.coverMedia || this.coverImage || "",
    type: this.coverMediaType || 'image',
    isVideo: this.coverMediaType === 'video',
    isImage: this.coverMediaType === 'image',
  };
};

// =========================
// STATIC METHODS
// =========================
listingSchema.statics.getPopular = async function (limit = 10) {
  return this.find({ status: "approved" })
    .sort({ likesCount: -1 })
    .limit(limit)
    .populate("provider", "name email");
};

listingSchema.statics.getTopRated = async function (limit = 10) {
  return this.find({ status: "approved" })
    .sort({ averageRating: -1 })
    .limit(limit)
    .populate("provider", "name email");
};

listingSchema.statics.getByLocation = async function (location) {
  return this.find({
    status: "approved",
    location: { $regex: location, $options: "i" },
  }).populate("provider", "name email");
};

listingSchema.statics.getByBusinessType = async function (businessType, limit = 20) {
  return this.find({
    status: "approved",
    businessType,
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("provider", "name email");
};

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;