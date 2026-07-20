// backend/src/controllers/providerController.js

import ProviderRequest from "../models/ProviderRequest.js";
import User from "../models/User.js";
import Listing from "../models/Listing.js"; // ✅ Changed from Tour
import Review from "../models/Review.js";
import { createNotification } from "../utils/notificationService.js";
import { createProviderProfileFromRequest } from "./providerProfileController.js";

/* ================= CREATE PROVIDER REQUEST ================= */

export const createProviderRequest = async (req, res) => {
  try {
    console.log("📁 ===== CREATE PROVIDER REQUEST =====");
    console.log("📁 Body fields:", Object.keys(req.body));
    console.log("📁 Files:", req.files ? Object.keys(req.files) : "No files");

    // ✅ Clean up empty objects from request body
    const cleanBody = { ...req.body };
    
    // ✅ Remove empty objects from file fields
    ['logo', 'coverImage', 'nationalId', 'passport', 'rdbCertificate', 
     'tinCertificate', 'tourismLicense', 'businessRegistration', 'insurance']
      .forEach(field => {
        if (cleanBody[field] && typeof cleanBody[field] === 'object' && Object.keys(cleanBody[field]).length === 0) {
          delete cleanBody[field];
        }
      });
    
    // ✅ Parse JSON strings for array fields
    let languages = [];
    let specializations = [];
    let businessHours = {};
    
    if (cleanBody.languages) {
      try {
        languages = typeof cleanBody.languages === 'string' 
          ? JSON.parse(cleanBody.languages) 
          : cleanBody.languages;
      } catch (e) { languages = []; }
    }
    
    if (cleanBody.specializations) {
      try {
        specializations = typeof cleanBody.specializations === 'string'
          ? JSON.parse(cleanBody.specializations)
          : cleanBody.specializations;
      } catch (e) { specializations = []; }
    }
    
    if (cleanBody.businessHours) {
      try {
        businessHours = typeof cleanBody.businessHours === 'string'
          ? JSON.parse(cleanBody.businessHours)
          : cleanBody.businessHours;
      } catch (e) { businessHours = {}; }
    }

    // ✅ Handle file uploads
    let logo = "";
    let coverImage = "";
    let nationalIdFile = "";
    let passportFile = "";
    let rdbCertificateFile = "";
    let tinCertificateFile = "";
    let tourismLicenseFile = "";
    let businessRegistrationFile = "";
    let insuranceFile = "";
    
    if (req.files) {
      if (req.files.logo && req.files.logo[0]) {
        logo = req.files.logo[0].filename;
        console.log("✅ Logo uploaded:", logo);
      }
      if (req.files.coverImage && req.files.coverImage[0]) {
        coverImage = req.files.coverImage[0].filename;
        console.log("✅ Cover uploaded:", coverImage);
      }
      if (req.files.nationalId && req.files.nationalId[0]) {
        nationalIdFile = req.files.nationalId[0].filename;
      }
      if (req.files.passport && req.files.passport[0]) {
        passportFile = req.files.passport[0].filename;
      }
      if (req.files.rdbCertificate && req.files.rdbCertificate[0]) {
        rdbCertificateFile = req.files.rdbCertificate[0].filename;
      }
      if (req.files.tinCertificate && req.files.tinCertificate[0]) {
        tinCertificateFile = req.files.tinCertificate[0].filename;
      }
      if (req.files.tourismLicense && req.files.tourismLicense[0]) {
        tourismLicenseFile = req.files.tourismLicense[0].filename;
      }
      if (req.files.businessRegistration && req.files.businessRegistration[0]) {
        businessRegistrationFile = req.files.businessRegistration[0].filename;
      }
      if (req.files.insurance && req.files.insurance[0]) {
        insuranceFile = req.files.insurance[0].filename;
      }
    }

    // ✅ Build COMPLETE provider request data
    const providerRequestData = {
      user: req.user._id,
      
      // =========================
      // PERSONAL INFORMATION
      // =========================
      fullName: cleanBody.fullName || "",
      email: cleanBody.email || cleanBody.businessEmail || "",
      phone: cleanBody.phone || "",
      whatsapp: cleanBody.whatsapp || "",
      nationality: cleanBody.nationality || "",
      businessEmail: cleanBody.businessEmail || "",
      alternatePhone: cleanBody.alternatePhone || "",
      
      // =========================
      // BUSINESS INFORMATION
      // =========================
      businessName: cleanBody.businessName || "",
      businessType: cleanBody.businessType || "other",
      description: cleanBody.description || "",
      country: cleanBody.country || "Rwanda",
      province: cleanBody.province || "",
      district: cleanBody.district || "",
      city: cleanBody.city || "",
      street: cleanBody.street || "",
      googleMaps: cleanBody.googleMaps || "",
      businessAddress: cleanBody.businessAddress || "",
      businessPhone: cleanBody.businessPhone || "",
      
      // =========================
      // PRICING
      // =========================
      price: cleanBody.price ? Number(cleanBody.price) : 0,
      currency: cleanBody.currency || "USD",
      availability: cleanBody.availability || "Monday-Friday",
      
      // =========================
      // DOCUMENTS
      // =========================
      nationalId: cleanBody.nationalId || "",
      tinNumber: cleanBody.tinNumber || "",
      rdbRegistration: cleanBody.rdbRegistration || "",
      tourismLicense: cleanBody.tourismLicense || "",
      nationalIdFile: nationalIdFile,
      passportFile: passportFile,
      rdbCertificateFile: rdbCertificateFile,
      tinCertificateFile: tinCertificateFile,
      tourismLicenseFile: tourismLicenseFile,
      businessRegistrationFile: businessRegistrationFile,
      insuranceFile: insuranceFile,
      
      // =========================
      // BUSINESS DETAILS
      // =========================
      website: cleanBody.website || "",
      languages: languages,
      specializations: specializations,
      yearsOfExperience: cleanBody.yearsOfExperience || "",
      employees: cleanBody.employees ? Number(cleanBody.employees) : 0,
      businessHours: businessHours,
      
      // =========================
      // SOCIAL MEDIA
      // =========================
      facebook: cleanBody.facebook || "",
      instagram: cleanBody.instagram || "",
      twitter: cleanBody.twitter || "",
      linkedin: cleanBody.linkedin || "",
      youtube: cleanBody.youtube || "",
      tiktok: cleanBody.tiktok || "",
      
      // =========================
      // BRANDING
      // =========================
      logo: logo,
      coverImage: coverImage,
      
      // =========================
      // PAYMENT INFORMATION
      // =========================
      paymentMethod: cleanBody.paymentMethod || "mobile_money",
      bankName: cleanBody.bankName || "",
      accountName: cleanBody.accountName || "",
      accountNumber: cleanBody.accountNumber || "",
      swiftCode: cleanBody.swiftCode || "",
      mobileMoney: cleanBody.mobileMoney || "",
      paymentCurrency: cleanBody.paymentCurrency || "USD",
      
      // =========================
      // AGREEMENTS
      // =========================
      agreeToTerms: cleanBody.agreeToTerms === "true" || cleanBody.agreeToTerms === true,
      agreeToPrivacy: cleanBody.agreeToPrivacy === "true" || cleanBody.agreeToPrivacy === true,
      agreeToConduct: cleanBody.agreeToConduct === "true" || cleanBody.agreeToConduct === true,
      agreeToCommission: cleanBody.agreeToCommission === "true" || cleanBody.agreeToCommission === true,
      agreeToTourism: cleanBody.agreeToTourism === "true" || cleanBody.agreeToTourism === true,
      agreeToAccurate: cleanBody.agreeToAccurate === "true" || cleanBody.agreeToAccurate === true,
      
      status: "pending",
    };

    console.log("📁 Saving provider request with", Object.keys(providerRequestData).length, "fields");

    const request = await ProviderRequest.create(providerRequestData);

    console.log("✅ Provider request created:", request._id);

    res.status(201).json({
      success: true,
      message: "Provider request submitted successfully",
      request
    });
  } catch (error) {
    console.error("❌ Create provider request error:", error);
    console.error("❌ Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ================= GET MY PROVIDER REQUEST ================= */

export const getMyProviderRequest = async (req, res) => {
  try {
    const request = await ProviderRequest.findOne({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    if (!request) {
      return res.status(200).json({
        success: true,
        request: null,
        message: "No provider application found",
      });
    }

    res.status(200).json({
      success: true,
      request: {
        _id: request._id,
        status: request.status,
        adminNotes: request.adminNotes,
        businessName: request.businessName,
        businessType: request.businessType,
        fullName: request.fullName,
        email: request.email,
        phone: request.phone,
        country: request.country,
        city: request.city,
        price: request.price,
        currency: request.currency,
        availability: request.availability,
        description: request.description,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
        reviewedAt: request.reviewedAt,
        isPending: request.isPending,
        isApproved: request.isApproved,
        whatsapp: request.whatsapp,
        nationality: request.nationality,
        businessEmail: request.businessEmail,
        alternatePhone: request.alternatePhone,
        province: request.province,
        district: request.district,
        street: request.street,
        googleMaps: request.googleMaps,
        businessPhone: request.businessPhone,
        businessAddress: request.businessAddress,
        website: request.website,
        nationalId: request.nationalId,
        tinNumber: request.tinNumber,
        rdbRegistration: request.rdbRegistration,
        tourismLicense: request.tourismLicense,
        languages: request.languages || [],
        specializations: request.specializations || [],
        yearsOfExperience: request.yearsOfExperience,
        employees: request.employees,
        businessHours: request.businessHours || {},
        paymentMethod: request.paymentMethod,
        bankName: request.bankName,
        accountName: request.accountName,
        accountNumber: request.accountNumber,
        swiftCode: request.swiftCode,
        mobileMoney: request.mobileMoney,
        paymentCurrency: request.paymentCurrency,
        logo: request.logo,
        coverImage: request.coverImage,
        facebook: request.facebook,
        instagram: request.instagram,
        twitter: request.twitter,
        linkedin: request.linkedin,
        youtube: request.youtube,
        tiktok: request.tiktok,
        agreeToTerms: request.agreeToTerms,
        agreeToPrivacy: request.agreeToPrivacy,
        agreeToConduct: request.agreeToConduct,
        agreeToCommission: request.agreeToCommission,
        agreeToTourism: request.agreeToTourism,
        agreeToAccurate: request.agreeToAccurate,
      },
    });
  } catch (error) {
    console.error("❌ Get my provider request error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET PROVIDER REQUESTS (ADMIN) ================= */

export const getProviderRequests = async (req, res) => {
  try {
    console.log("📥 GET /provider-requests - Query:", req.query);

    const { status, page = 1, limit = 20, search } = req.query;

    const filter = {};
    
    if (status && status !== 'all' && status !== 'undefined') {
      filter.status = status;
    }
    
    if (search && search.trim()) {
      filter.$or = [
        { businessName: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { businessEmail: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit) || 20;

    console.log("🔍 Filter:", JSON.stringify(filter));
    console.log("📄 Skip:", skip, "Limit:", limitNum);

    const requests = await ProviderRequest.find(filter)
      .populate('user', 'name email phone')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await ProviderRequest.countDocuments(filter);

    console.log(`✅ Found ${requests.length} requests, Total: ${total}`);

    res.status(200).json({
      success: true,
      requests,
      total,
      page: parseInt(page),
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    console.error("❌ Get provider requests error:", error);
    console.error("❌ Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch provider requests",
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
};

/* ================= GET PROVIDER REQUEST BY ID ================= */

export const getProviderRequestById = async (req, res) => {
  try {
    const request = await ProviderRequest.findById(req.params.id)
      .populate("user", "name email profileImage phone")
      .populate("reviewedBy", "name email");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Provider request not found",
      });
    }

    res.status(200).json({
      success: true,
      request: {
        _id: request._id,
        user: request.user,
        reviewedBy: request.reviewedBy,
        fullName: request.fullName,
        phone: request.phone,
        whatsapp: request.whatsapp,
        nationality: request.nationality,
        businessEmail: request.businessEmail,
        alternatePhone: request.alternatePhone,
        businessName: request.businessName,
        businessType: request.businessType,
        description: request.description,
        businessPhone: request.businessPhone,
        businessAddress: request.businessAddress,
        country: request.country,
        province: request.province,
        district: request.district,
        city: request.city,
        street: request.street,
        googleMaps: request.googleMaps,
        documents: request.documents,
        nationalIdFile: request.nationalIdFile,
        passportFile: request.passportFile,
        rdbCertificateFile: request.rdbCertificateFile,
        tinCertificateFile: request.tinCertificateFile,
        tourismLicenseFile: request.tourismLicenseFile,
        businessRegistrationFile: request.businessRegistrationFile,
        insuranceFile: request.insuranceFile,
        logo: request.logo,
        coverImage: request.coverImage,
        profileImage: request.profileImage,
        price: request.price,
        currency: request.currency,
        availability: request.availability,
        website: request.website,
        facebook: request.facebook,
        instagram: request.instagram,
        twitter: request.twitter,
        linkedin: request.linkedin,
        youtube: request.youtube,
        tiktok: request.tiktok,
        nationalId: request.nationalId,
        tinNumber: request.tinNumber,
        rdbRegistration: request.rdbRegistration,
        tourismLicense: request.tourismLicense,
        languages: request.languages || [],
        specializations: request.specializations || [],
        yearsOfExperience: request.yearsOfExperience,
        employees: request.employees,
        businessHours: request.businessHours || {},
        paymentMethod: request.paymentMethod,
        bankName: request.bankName,
        accountName: request.accountName,
        accountNumber: request.accountNumber,
        swiftCode: request.swiftCode,
        mobileMoney: request.mobileMoney,
        paymentCurrency: request.paymentCurrency,
        agreeToTerms: request.agreeToTerms,
        agreeToPrivacy: request.agreeToPrivacy,
        agreeToConduct: request.agreeToConduct,
        agreeToCommission: request.agreeToCommission,
        agreeToTourism: request.agreeToTourism,
        agreeToAccurate: request.agreeToAccurate,
        status: request.status,
        adminNotes: request.adminNotes,
        reviewedAt: request.reviewedAt,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
        isPending: request.isPending,
        isApproved: request.isApproved,
      },
    });
  } catch (error) {
    console.error("❌ Get provider request by id error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= UPDATE PROVIDER REQUEST STATUS (ADMIN) ================= */

export const updateProviderRequestStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const { id } = req.params;

    const request = await ProviderRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Provider request not found",
      });
    }

    request.status = status;
    if (adminNotes) request.adminNotes = adminNotes;
    request.reviewedAt = new Date();
    request.reviewedBy = req.user._id;
    await request.save();

    const user = await User.findById(request.user);
    if (user) {
      if (status === "approved") {
        user.role = "provider";
        user.verificationStatus = "approved";
        user.providerApprovedDate = new Date();
        await user.save();

        await createNotification({
          recipient: user._id,
          sender: req.user._id,
          type: "system_alert",
          title: "Provider Approved ✅",
          message: "Congratulations! Your provider account has been approved. You can now create tours and manage your business.",
          data: { requestId: request._id },
          link: `/provider/dashboard`,
        });
      } else if (status === "rejected") {
        user.role = "traveler";
        user.verificationStatus = "rejected";
        await user.save();

        await createNotification({
          recipient: user._id,
          sender: req.user._id,
          type: "system_alert",
          title: "Provider Application Rejected ❌",
          message: `Your provider application has been rejected. Reason: ${adminNotes || "No reason provided"}`,
          data: { requestId: request._id },
          link: `/provider/request`,
        });
      } else if (status === "needs_information") {
        user.verificationStatus = "needs_information";
        await user.save();

        await createNotification({
          recipient: user._id,
          sender: req.user._id,
          type: "system_alert",
          title: "More Information Required",
          message: `Please provide additional information. Reason: ${adminNotes || "Missing information"}`,
          data: { requestId: request._id },
          link: `/provider/request`,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Provider request ${status}`,
      request,
    });
  } catch (error) {
    console.error("❌ Update provider request status error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= APPROVE PROVIDER REQUEST (ADMIN) ================= */

export const approveProviderRequest = async (req, res) => {
  try {
    const request = await ProviderRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Provider request not found",
      });
    }

    request.status = "approved";
    request.reviewedAt = new Date();
    request.reviewedBy = req.user._id;
    await request.save();

    const user = await User.findById(request.user);
    if (user) {
      user.role = "provider";
      user.verificationStatus = "approved";
      user.providerApprovedDate = new Date();
      await user.save();
    }

    const profile = await createProviderProfileFromRequest(request._id, req.user._id);

    await createNotification({
      recipient: user._id,
      sender: req.user._id,
      type: "system_alert",
      title: "Provider Approved ✅",
      message: "Congratulations! Your provider account has been approved. You can now create tours.",
      data: { requestId: request._id, profileId: profile?._id },
      link: `/provider/dashboard`,
    });

    const io = req.app.get("io");
    if (io) {
      io.to(user._id.toString()).emit("newNotification", {
        title: "Provider Approved ✅",
        message: "Congratulations! Your provider account has been approved.",
        type: "system_alert",
        data: { requestId: request._id },
      });
    }

    res.status(200).json({
      success: true,
      message: "Provider approved successfully",
      request,
      profile,
    });
  } catch (error) {
    console.error("❌ Approve provider request error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= REJECT PROVIDER REQUEST (ADMIN) ================= */

export const rejectProviderRequest = async (req, res) => {
  try {
    const request = await ProviderRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Provider request not found",
      });
    }

    const { adminNotes } = req.body;

    request.status = "rejected";
    request.adminNotes = adminNotes || "";
    request.reviewedAt = new Date();
    request.reviewedBy = req.user._id;
    await request.save();

    const user = await User.findById(request.user);
    if (user) {
      user.role = "traveler";
      user.verificationStatus = "rejected";
      await user.save();

      await createNotification({
        recipient: user._id,
        sender: req.user._id,
        type: 'system_alert',
        title: 'Provider Request Rejected ❌',
        message: `Your provider application was rejected. Reason: ${request.adminNotes}`,
        data: { requestId: request._id },
        link: `/provider/request`
      });

      const io = req.app.get('io');
      if (io) {
        io.to(user._id.toString()).emit('newNotification', {
          title: 'Provider Request Rejected ❌',
          message: `Your provider application was rejected.`,
          type: 'system_alert',
          data: { requestId: request._id }
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "Provider request rejected",
      request,
    });
  } catch (error) {
    console.error("❌ Reject provider request error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= PROVIDER PROFILE ================= */

export const getProviderProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password");

    res.status(200).json({
      success: true,
      profile: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ================= UPDATE PROVIDER PROFILE ================= */

export const updateProviderProfile = async (req, res) => {
  try {
    const { name, phone, bio, location, socialLinks } = req.body;

    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (bio) user.bio = bio;
    if (location) user.location = location;
    if (socialLinks) user.socialLinks = socialLinks;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ================= PUBLIC: GET PROVIDER PUBLIC PROFILE ================= */

export const getPublicProviderProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const provider = await User.findOne({
      _id: id,
      $or: [
        { role: "provider" },
        { role: "traveler", verificationStatus: "approved" }
      ]
    }).select("-password -resetPasswordToken -resetPasswordExpire");

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Provider not found"
      });
    }

    const providerRequest = await ProviderRequest.findOne({
      user: provider._id,
      status: "approved"
    });

    if (!providerRequest && provider.role !== "provider") {
      return res.status(404).json({
        success: false,
        message: "Provider profile not found"
      });
    }

    // ✅ Get provider stats
    const listings = await Listing.find({ 
      provider: provider._id, 
      status: "approved",
      businessType: { $in: ['tour_operator', 'guide', 'transport'] }
    });
    
    const listingIds = listings.map(l => l._id);
    
    const reviews = await Review.find({
      listing: { $in: listingIds },
      status: "approved"
    });

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

    const isVerified = provider.role === "provider" || provider.verificationStatus === "approved";

    // ✅ Get WhatsApp number (priority: whatsapp > businessPhone > phone)
    const whatsappNumber = providerRequest?.whatsapp || 
                          providerRequest?.businessPhone || 
                          provider.phone || 
                          "";

    res.json({
      success: true,
      provider: {
        _id: provider._id,
        name: provider.name,
        email: provider.email || providerRequest?.businessEmail || "",
        phone: provider.phone || providerRequest?.businessPhone || "",
        avatar: provider.avatar || "",
        bio: provider.bio || providerRequest?.description || "",
        location: provider.location || providerRequest?.city || "",
        createdAt: provider.createdAt,
        memberSince: provider.createdAt,
        
        // ✅ Social Links
        socialLinks: {
          facebook: provider.socialLinks?.facebook || providerRequest?.facebook || "",
          instagram: provider.socialLinks?.instagram || providerRequest?.instagram || "",
          twitter: provider.socialLinks?.twitter || providerRequest?.twitter || "",
          linkedin: provider.socialLinks?.linkedin || providerRequest?.linkedin || "",
          youtube: provider.socialLinks?.youtube || providerRequest?.youtube || "",
          tiktok: provider.socialLinks?.tiktok || providerRequest?.tiktok || "",
        },
        
        // ✅ Business Information
        businessName: providerRequest?.businessName || provider.name,
        businessType: providerRequest?.businessType || "tour_operator",
        description: providerRequest?.description || "",
        country: providerRequest?.country || "",
        city: providerRequest?.city || "",
        province: providerRequest?.province || "",
        district: providerRequest?.district || "",
        street: providerRequest?.street || "",
        businessAddress: providerRequest?.businessAddress || "",
        price: providerRequest?.price || 0,
        currency: providerRequest?.currency || "USD",
        availability: providerRequest?.availability || "Monday-Friday",
        
        // ✅ Contact Information
        businessEmail: providerRequest?.businessEmail || provider.email || "",
        businessPhone: providerRequest?.businessPhone || provider.phone || "",
        // ✅ WhatsApp number (new field)
        whatsapp: whatsappNumber,
        website: providerRequest?.website || "",
        googleMaps: providerRequest?.googleMaps || "",
        
        // ✅ Branding
        logo: providerRequest?.logo || "",
        coverImage: providerRequest?.coverImage || "",
        
        // ✅ Languages & Specializations
        languages: providerRequest?.languages || [],
        specializations: providerRequest?.specializations || [],
        yearsOfExperience: providerRequest?.yearsOfExperience || "",
        
        // ✅ Business Hours
        businessHours: providerRequest?.businessHours || {
          monday: { open: "08:00", close: "18:00", closed: false },
          tuesday: { open: "08:00", close: "18:00", closed: false },
          wednesday: { open: "08:00", close: "18:00", closed: false },
          thursday: { open: "08:00", close: "18:00", closed: false },
          friday: { open: "08:00", close: "18:00", closed: false },
          saturday: { open: "08:00", close: "18:00", closed: false },
          sunday: { open: "08:00", close: "18:00", closed: false }
        },
        
        // ✅ Stats
        totalTours: listings.length,
        totalReviews: totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        
        // ✅ Verification
        verified: isVerified,
        verificationStatus: provider.verificationStatus || "approved",
      }
    });
  } catch (error) {
    console.error("❌ Get public provider profile error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ================= PUBLIC: GET PROVIDER TOURS ================= */

export const getPublicProviderTours = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // ✅ Use Listing instead of Tour
    const listings = await Listing.find({
      provider: id,
      status: "approved",
      businessType: { $in: ['tour_operator', 'guide', 'transport'] }
    })
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .lean();

    const total = await Listing.countDocuments({
      provider: id,
      status: "approved",
      businessType: { $in: ['tour_operator', 'guide', 'transport'] }
    });

    res.json({
      success: true,
      tours: listings,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error("❌ Get public provider tours error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ================= PUBLIC: GET PROVIDER REVIEWS ================= */

export const getPublicProviderReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // ✅ Get all listing IDs for this provider
    const listings = await Listing.find({ 
      provider: id, 
      status: "approved",
      businessType: { $in: ['tour_operator', 'guide', 'transport'] }
    }).select('_id');
    
    const listingIds = listings.map(l => l._id);

    const reviews = await Review.find({
      listing: { $in: listingIds },
      status: "approved"
    })
      .populate('user', 'name avatar')
      .populate('listing', 'title')
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await Review.countDocuments({
      listing: { $in: listingIds },
      status: "approved"
    });

    res.json({
      success: true,
      reviews,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error("❌ Get public provider reviews error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ================= UPDATE PROVIDER REQUEST (ADMIN) ================= */

export const updateProviderRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required"
      });
    }

    const validStatuses = ['pending', 'approved', 'rejected', 'needs_information'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    const request = await ProviderRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Provider request not found"
      });
    }

    request.status = status;
    if (adminNotes) request.adminNotes = adminNotes;
    request.reviewedAt = new Date();
    request.reviewedBy = req.user._id;
    await request.save();

    await request.populate('user', 'name email');

    res.status(200).json({
      success: true,
      message: `Provider request ${status}`,
      request
    });
  } catch (error) {
    console.error("❌ Update provider request error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ================= GET ALL PROVIDERS (ADMIN) ================= */

export const getAllProviders = async (req, res) => {
  try {
    const providers = await User.find({
      $or: [
        { role: 'provider' },
        { verificationStatus: 'approved' }
      ]
    })
      .select('-password -resetPasswordToken -resetPasswordExpire')
      .sort({ createdAt: -1 });

    const providerRequests = await ProviderRequest.find({
      user: { $in: providers.map(p => p._id) },
      status: 'approved'
    });

    const providersWithBusiness = providers.map(provider => {
      const request = providerRequests.find(r => 
        r.user.toString() === provider._id.toString()
      );
      
      return {
        _id: provider._id,
        name: provider.name,
        email: provider.email,
        phone: provider.phone,
        avatar: provider.avatar,
        role: provider.role,
        verificationStatus: provider.verificationStatus,
        providerApprovedDate: provider.providerApprovedDate,
        createdAt: provider.createdAt,
        businessName: request?.businessName || provider.name,
        businessType: request?.businessType || 'tour_operator',
        description: request?.description || '',
        country: request?.country || '',
        city: request?.city || '',
        price: request?.price || 0,
        currency: request?.currency || 'USD',
        logo: request?.logo || '',
        coverImage: request?.coverImage || '',
        businessPhone: request?.businessPhone || provider.phone,
        businessEmail: request?.businessEmail || provider.email,
        languages: request?.languages || [],
        specializations: request?.specializations || [],
        yearsOfExperience: request?.yearsOfExperience || '',
        website: request?.website || '',
        facebook: request?.facebook || '',
        instagram: request?.instagram || '',
        twitter: request?.twitter || '',
        linkedin: request?.linkedin || '',
        youtube: request?.youtube || '',
        tiktok: request?.tiktok || '',
        status: request?.status || 'pending',
      };
    });

    res.status(200).json({
      success: true,
      count: providersWithBusiness.length,
      providers: providersWithBusiness
    });
  } catch (error) {
    console.error('❌ Get all providers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch providers',
      error: error.message
    });
  }
};