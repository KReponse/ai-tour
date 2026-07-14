// backend/src/controllers/listingController.js

import Listing from "../models/Listing.js";
import User from "../models/User.js";
import ProviderProfile from "../models/ProviderProfile.js";
import { createNotification } from "../utils/notificationService.js";

/* ================= CREATE LISTING ================= */

export const createListing = async (req, res) => {
  try {
    console.log("📁 ===== CREATE LISTING =====");
    console.log("📁 Body:", JSON.stringify(req.body, null, 2));
    console.log("📁 Files:", req.files ? Object.keys(req.files) : "No files");
    console.log("📁 Content-Type:", req.headers['content-type']);

    // ✅ Check if body is empty
    if (!req.body || Object.keys(req.body).length === 0) {
      console.error("❌ Request body is empty!");
      return res.status(400).json({
        success: false,
        message: "No data received. Please check the request format.",
      });
    }

    const {
      title,
      location,
      price,
      duration,
      capacity,
      description,
      businessType,
      listingType,
      category,
      highlights,
      included,
      excluded,
      meetingPoint,
      cancellationPolicy,
      requirements,
      amenities,
      menu,
      cuisine,
      vehicleType,
      seats,
      dynamicFields,
    } = req.body;

    // ✅ Log each field to see what's missing
    console.log("📁 Title:", title);
    console.log("📁 Location:", location);
    console.log("📁 Price:", price);
    console.log("📁 Description:", description);
    console.log("📁 Business Type:", businessType);
    console.log("📁 Listing Type:", listingType);
    console.log("📁 Category:", category);

    // ✅ Validate required fields with specific error messages
    const missingFields = [];
    if (!title) missingFields.push("title");
    if (!location) missingFields.push("location");
    if (!price) missingFields.push("price");
    if (!description) missingFields.push("description");
    if (!businessType) missingFields.push("businessType");
    if (!listingType) missingFields.push("listingType");

    if (missingFields.length > 0) {
      console.error("❌ Missing required fields:", missingFields);
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
        missingFields,
      });
    }

    // ✅ Validate businessType enum
    const validBusinessTypes = [
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
    ];
    
    if (!validBusinessTypes.includes(businessType)) {
      console.error("❌ Invalid businessType:", businessType);
      return res.status(400).json({
        success: false,
        message: `Invalid businessType: ${businessType}. Must be one of: ${validBusinessTypes.join(", ")}`,
      });
    }

    // ✅ If category is missing, use businessType as fallback
    const finalCategory = category || businessType;

    // ✅ Handle file uploads
    const coverImage = req.files?.coverImage?.[0]?.filename || "";
    const galleryImages = req.files?.galleryImages
      ? req.files.galleryImages.map((file) => file.filename)
      : [];
    const videos = req.files?.videos
      ? req.files.videos.map((file) => file.filename)
      : [];

    console.log("✅ Cover Image:", coverImage);
    console.log("✅ Gallery Images:", galleryImages.length);
    console.log("✅ Videos:", videos.length);

    // ✅ Parse dynamic fields if provided
    let parsedDynamicFields = {};
    if (dynamicFields) {
      try {
        parsedDynamicFields =
          typeof dynamicFields === "string"
            ? JSON.parse(dynamicFields)
            : dynamicFields;
      } catch (e) {
        parsedDynamicFields = {};
      }
    }

    // ✅ Create listing
    const listing = await Listing.create({
      title,
      location,
      price: Number(price),
      duration: duration || "",
      capacity: capacity ? Number(capacity) : 1,
      description,
      businessType,
      listingType,
      category: finalCategory,
      highlights: highlights || "",
      included: included || "",
      excluded: excluded || "",
      meetingPoint: meetingPoint || "",
      cancellationPolicy: cancellationPolicy || "",
      requirements: requirements || "",
      amenities: amenities || "",
      menu: menu || "",
      cuisine: cuisine || "",
      vehicleType: vehicleType || "",
      seats: seats ? Number(seats) : 0,
      dynamicFields: parsedDynamicFields,
      coverImage,
      galleryImages,
      videos,
      provider: req.user._id,
      status: "pending",
    });

    console.log("✅ Listing created:", listing._id);

    // Send notification to admin about new listing
    const admins = await User.find({ role: "admin" });
    for (const admin of admins) {
      await createNotification({
        recipient: admin._id,
        sender: req.user._id,
        type: "listing_created",
        title: "New Listing Created 📋",
        message: `${req.user.name} created a new listing: "${listing.title}"`,
        data: { listingId: listing._id },
        link: `/admin/listings/${listing._id}`,
      });
    }

    const io = req.app.get("io");
    if (io) {
      for (const admin of admins) {
        io.to(admin._id.toString()).emit("newNotification", {
          title: "New Listing Created 📋",
          message: `${req.user.name} created a new listing: "${listing.title}"`,
          type: "listing_created",
          data: { listingId: listing._id },
        });
      }
    }

    res.status(201).json({
      success: true,
      message: "Listing created successfully",
      listing,
    });
  } catch (error) {
    console.error("❌ CREATE LISTING ERROR:", error);
    console.error("❌ Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* ================= GET PUBLIC LISTINGS ================= */

export const getListings = async (req, res) => {
  try {
    const { businessType, limit = 20, page = 1 } = req.query;

    const filter = { status: "approved" };
    if (businessType) {
      filter.businessType = businessType;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // ✅ FIXED: Populate provider with profileImage and verified
    const listings = await Listing.find(filter)
      .populate("provider", "name email profileImage verified")  // ✅ Added fields
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Listing.countDocuments(filter);

    res.json({
      success: true,
      count: listings.length,
      total,
      page: parseInt(page),
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      listings,
    });
  } catch (error) {
    console.error("❌ GET LISTINGS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET SINGLE LISTING ================= */

export const getSingleListing = async (req, res) => {
  try {
    // ✅ FIXED: Populate provider with profileImage and verified
    const listing = await Listing.findById(req.params.id)
      .populate("provider", "name email profileImage verified");  // ✅ Added fields

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    res.json({
      success: true,
      listing,
    });
  } catch (error) {
    console.error("❌ GET SINGLE LISTING ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* ================= GET PROVIDER LISTINGS ================= */

export const getProviderListings = async (req, res) => {
  try {
    console.log("🔍 getProviderListings called");
    console.log("👤 User:", req.user?._id);

    if (!req.user || !req.user._id) {
      console.error("❌ User not authenticated");
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    console.log(`🔍 Querying listings for provider: ${req.user._id}`);

    let listings = [];
    try {
      listings = await Listing.find({ provider: req.user._id })
        .sort({ createdAt: -1 })
        .lean();

      console.log(`✅ Found ${listings.length} listings for provider`);
    } catch (dbError) {
      console.error("❌ Database error in getProviderListings:", dbError);
      console.error("❌ Error stack:", dbError.stack);

      // ✅ If the error is about the provider field, try an alternative approach
      if (dbError.message.includes('provider') || dbError.message.includes('CastError')) {
        console.warn("⚠️ Provider field issue, trying alternative query");
        try {
          // Try to find all listings and filter manually
          const allListings = await Listing.find({})
            .sort({ createdAt: -1 })
            .lean();

          const userId = req.user._id.toString();
          listings = allListings.filter(l =>
            l.provider && l.provider.toString() === userId
          );

          console.log(`✅ Found ${listings.length} listings via fallback`);
        } catch (fallbackError) {
          console.error("❌ Fallback query also failed:", fallbackError);
          return res.status(500).json({
            success: false,
            message: "Database error while fetching listings",
          });
        }
      } else {
        throw dbError;
      }
    }

    res.json({
      success: true,
      count: listings.length,
      listings: listings || [],
    });
  } catch (error) {
    console.error("❌ GET PROVIDER LISTINGS ERROR:", error);
    console.error("❌ Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch listings",
    });
  }
};
/* ================= UPDATE LISTING ================= */

export const updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      location,
      price,
      duration,
      capacity,
      description,
      businessType,
      listingType,
      highlights,
      included,
      excluded,
      meetingPoint,
      cancellationPolicy,
      requirements,
      amenities,
      menu,
      cuisine,
      vehicleType,
      seats,
      dynamicFields,
    } = req.body;

    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    // ✅ Check if user owns this listing
    if (listing.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this listing",
      });
    }

    // ✅ Update fields
    listing.title = title || listing.title;
    listing.location = location || listing.location;
    listing.price = price ? Number(price) : listing.price;
    listing.duration = duration || listing.duration;
    listing.capacity = capacity ? Number(capacity) : listing.capacity;
    listing.description = description || listing.description;
    listing.businessType = businessType || listing.businessType;
    listing.listingType = listingType || listing.listingType;
    listing.highlights = highlights || listing.highlights;
    listing.included = included || listing.included;
    listing.excluded = excluded || listing.excluded;
    listing.meetingPoint = meetingPoint || listing.meetingPoint;
    listing.cancellationPolicy = cancellationPolicy || listing.cancellationPolicy;
    listing.requirements = requirements || listing.requirements;
    listing.amenities = amenities || listing.amenities;
    listing.menu = menu || listing.menu;
    listing.cuisine = cuisine || listing.cuisine;
    listing.vehicleType = vehicleType || listing.vehicleType;
    listing.seats = seats ? Number(seats) : listing.seats;

    if (dynamicFields) {
      try {
        listing.dynamicFields =
          typeof dynamicFields === "string"
            ? JSON.parse(dynamicFields)
            : dynamicFields;
      } catch (e) {
        listing.dynamicFields = {};
      }
    }

    // ✅ Handle file uploads
    if (req.files?.coverImage?.[0]) {
      listing.coverImage = req.files.coverImage[0].filename;
    }

    if (req.files?.galleryImages) {
      const newGallery = req.files.galleryImages.map((file) => file.filename);
      listing.galleryImages = [...listing.galleryImages, ...newGallery];
    }

    if (req.files?.videos) {
      const newVideos = req.files.videos.map((file) => file.filename);
      listing.videos = [...listing.videos, ...newVideos];
    }

    await listing.save();

    res.json({
      success: true,
      message: "Listing updated successfully",
      listing,
    });
  } catch (error) {
    console.error("❌ UPDATE LISTING ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= DELETE LISTING ================= */

export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    // ✅ Check if user owns this listing
    if (listing.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this listing",
      });
    }

    await listing.deleteOne();

    res.json({
      success: true,
      message: "Listing deleted successfully",
    });
  } catch (error) {
    console.error("❌ DELETE LISTING ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= TOGGLE LISTING STATUS ================= */

export const toggleListingStatus = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    // ✅ Check if user owns this listing
    if (listing.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this listing",
      });
    }

    // ✅ Toggle between pending and approved (if already approved, keep approved)
    if (listing.status === "pending") {
      listing.status = "approved";
    } else if (listing.status === "approved") {
      listing.status = "pending";
    } else {
      // Rejected or other status -> set to pending
      listing.status = "pending";
    }

    await listing.save();

    res.json({
      success: true,
      message: `Listing status updated to ${listing.status}`,
      listing,
    });
  } catch (error) {
    console.error("❌ TOGGLE LISTING STATUS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= TOGGLE LIKE ================= */

export const toggleLike = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    const liked = listing.likes.includes(req.user._id);

    if (liked) {
      listing.likes = listing.likes.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
      listing.likesCount--;
    } else {
      listing.likes.push(req.user._id);
      listing.likesCount++;
    }

    await listing.save();

    if (!liked && listing.provider.toString() !== req.user._id.toString()) {
      await createNotification({
        recipient: listing.provider,
        sender: req.user._id,
        type: "system_alert",
        title: "Listing Liked ❤️",
        message: `${req.user.name} liked your listing "${listing.title}"`,
        data: { listingId: listing._id },
        link: `/listings/${listing._id}`,
      });

      const io = req.app.get("io");
      if (io) {
        io.to(listing.provider.toString()).emit("newNotification", {
          title: "Listing Liked ❤️",
          message: `${req.user.name} liked your listing "${listing.title}"`,
          type: "system_alert",
          data: { listingId: listing._id },
        });
      }
    }

    res.json({
      success: true,
      liked: !liked,
      likesCount: listing.likesCount,
      message: liked ? "Listing unliked" : "Listing liked",
    });
  } catch (error) {
    console.error("❌ TOGGLE LIKE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET LIKES ================= */

export const getLikes = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate("likes", "name profileImage");

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    res.json({
      success: true,
      likesCount: listing.likesCount,
      likes: listing.likes,
    });
  } catch (error) {
    console.error("❌ GET LIKES ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= CHECK IF USER LIKED ================= */

export const checkLike = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    const liked = listing.likes.includes(req.user._id);

    res.json({
      success: true,
      liked,
    });
  } catch (error) {
    console.error("❌ CHECK LIKE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= ADMIN: GET ALL LISTINGS ================= */

export const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate("provider", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: listings.length,
      listings,
    });
  } catch (error) {
    console.error("❌ GET ALL LISTINGS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= ADMIN: GET PENDING LISTINGS ================= */

export const getPendingListings = async (req, res) => {
  try {
    const listings = await Listing.find({ status: "pending" })
      .populate("provider", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: listings.length,
      listings,
    });
  } catch (error) {
    console.error("❌ GET PENDING LISTINGS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= ADMIN: APPROVE LISTING ================= */

export const approveListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    listing.status = "approved";
    listing.approvedBy = req.user._id;
    listing.approvedAt = new Date();
    await listing.save();

    await createNotification({
      recipient: listing.provider,
      sender: req.user._id,
      type: "listing_approved",
      title: "Listing Approved ✅",
      message: `Your listing "${listing.title}" has been approved and is now visible to travelers.`,
      data: { listingId: listing._id },
      link: `/provider/listings/${listing._id}`,
    });

    const io = req.app.get("io");
    if (io) {
      io.to(listing.provider.toString()).emit("newNotification", {
        title: "Listing Approved ✅",
        message: `Your listing "${listing.title}" has been approved and is now visible to travelers.`,
        type: "listing_approved",
        data: { listingId: listing._id },
      });
    }

    res.json({
      success: true,
      message: "Listing approved successfully",
      listing,
    });
  } catch (error) {
    console.error("❌ APPROVE LISTING ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= ADMIN: REJECT LISTING ================= */

export const rejectListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    const { reason } = req.body;

    listing.status = "rejected";
    listing.rejectedBy = req.user._id;
    listing.rejectedAt = new Date();
    listing.rejectReason = reason || "No reason provided";

    await listing.save();

    await createNotification({
      recipient: listing.provider,
      sender: req.user._id,
      type: "listing_rejected",
      title: "Listing Rejected ❌",
      message: `Your listing "${listing.title}" has been rejected. ${reason ? `Reason: ${reason}` : ""}`,
      data: { listingId: listing._id },
      link: `/provider/listings/${listing._id}`,
    });

    const io = req.app.get("io");
    if (io) {
      io.to(listing.provider.toString()).emit("newNotification", {
        title: "Listing Rejected ❌",
        message: `Your listing "${listing.title}" has been rejected.`,
        type: "listing_rejected",
        data: { listingId: listing._id },
      });
    }

    res.json({
      success: true,
      message: "Listing rejected successfully",
      listing,
    });
  } catch (error) {
    console.error("❌ REJECT LISTING ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= ADMIN: SUSPEND LISTING ================= */

export const suspendListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    const { reason } = req.body;

    listing.status = "suspended";
    listing.suspendedBy = req.user._id;
    listing.suspendedAt = new Date();
    listing.suspendReason = reason || "No reason provided";

    await listing.save();

    await createNotification({
      recipient: listing.provider,
      sender: req.user._id,
      type: "listing_suspended",
      title: "Listing Suspended ⛔",
      message: `Your listing "${listing.title}" has been suspended. ${reason ? `Reason: ${reason}` : ""}`,
      data: { listingId: listing._id },
      link: `/provider/listings/${listing._id}`,
    });

    const io = req.app.get("io");
    if (io) {
      io.to(listing.provider.toString()).emit("newNotification", {
        title: "Listing Suspended ⛔",
        message: `Your listing "${listing.title}" has been suspended.`,
        type: "listing_suspended",
        data: { listingId: listing._id },
      });
    }

    res.json({
      success: true,
      message: "Listing suspended successfully",
      listing,
    });
  } catch (error) {
    console.error("❌ SUSPEND LISTING ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= ADMIN: DELETE LISTING ================= */

export const deleteListingAdmin = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    // ✅ Store provider info for notification before deleting
    const providerId = listing.provider;
    const listingTitle = listing.title;

    // ✅ Delete the listing
    await listing.deleteOne();

    // ✅ Notify provider about deletion
    await createNotification({
      recipient: providerId,
      sender: req.user._id,
      type: "listing_deleted",
      title: "Listing Deleted 🗑️",
      message: `Your listing "${listingTitle}" has been deleted by an administrator.`,
      data: { listingId: listing._id },
      link: `/provider/listings`,
    });

    const io = req.app.get("io");
    if (io) {
      io.to(providerId.toString()).emit("newNotification", {
        title: "Listing Deleted 🗑️",
        message: `Your listing "${listingTitle}" has been deleted by an administrator.`,
        type: "listing_deleted",
        data: { listingId: listing._id },
      });
    }

    res.json({
      success: true,
      message: "Listing deleted successfully by admin",
    });
  } catch (error) {
    console.error("❌ ADMIN DELETE LISTING ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};