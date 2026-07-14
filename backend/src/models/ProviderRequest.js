// backend/src/models/ProviderRequest.js

import mongoose from "mongoose";

const providerRequestSchema = new mongoose.Schema(
  {
    // =========================
    // USER (Applicant)
    // =========================
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // =========================
    // PERSONAL INFORMATION
    // =========================
    fullName: {
      type: String,
      trim: true
    },

    email: {
      type: String,
      trim: true,
      lowercase: true
    },

    phone: {
      type: String,
      trim: true
    },

    whatsapp: {
      type: String,
      trim: true
    },

    nationality: {
      type: String,
      trim: true
    },

    businessEmail: {
      type: String,
      trim: true,
      lowercase: true
    },

    alternatePhone: {
      type: String,
      trim: true
    },

    // =========================
    // BUSINESS INFORMATION
    // =========================
    businessName: {
      type: String,
      trim: true,
      required: true
    },

    businessType: {
      type: String,
      enum: [
        'tour_operator',
        'hotel',
        'lodge',
        'restaurant',
        'transport',
        'guide',
        'events',
        'cafe',
        'shop',
        'other'
      ],
      default: 'other'
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000
    },

    // =========================
    // LOCATION
    // =========================
    country: {
      type: String,
      trim: true,
      default: 'Rwanda'
    },

    province: {
      type: String,
      trim: true
    },

    district: {
      type: String,
      trim: true
    },

    city: {
      type: String,
      trim: true
    },

    street: {
      type: String,
      trim: true
    },

    googleMaps: {
      type: String,
      trim: true
    },

    businessAddress: {
      type: String,
      trim: true
    },

    businessPhone: {
      type: String,
      trim: true
    },

    // =========================
    // DOCUMENTS & MEDIA
    // =========================
    documents: [{
      type: String,
      trim: true
    }],

    // Individual document fields
    nationalIdFile: {
      type: String,
      trim: true
    },

    passportFile: {
      type: String,
      trim: true
    },

    rdbCertificateFile: {
      type: String,
      trim: true
    },

    tinCertificateFile: {
      type: String,
      trim: true
    },

    tourismLicenseFile: {
      type: String,
      trim: true
    },

    businessRegistrationFile: {
      type: String,
      trim: true
    },

    insuranceFile: {
      type: String,
      trim: true
    },

    profileImage: {
      type: String,
      trim: true
    },

    logo: {
      type: String,
      trim: true
    },

    coverImage: {
      type: String,
      trim: true
    },

    // =========================
    // PRICING
    // =========================
    price: {
      type: Number,
      min: 0
    },

    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'RWF', 'EUR', 'GBP']
    },

    availability: {
      type: String,
      enum: [
        'Monday-Friday',
        'Monday-Saturday',
        'Monday-Sunday',
        'Weekends',
        'Weekdays',
        '24/7',
        'By Appointment'
      ],
      default: 'Monday-Friday'
    },

    // =========================
    // SOCIAL LINKS
    // =========================
    socialLinks: {
      instagram: {
        type: String,
        trim: true
      },
      facebook: {
        type: String,
        trim: true
      },
      linkedin: {
        type: String,
        trim: true
      },
      tiktok: {
        type: String,
        trim: true
      },
      twitter: {
        type: String,
        trim: true
      },
      youtube: {
        type: String,
        trim: true
      }
    },

    // Separate social fields for direct access
    facebook: {
      type: String,
      trim: true
    },

    instagram: {
      type: String,
      trim: true
    },

    twitter: {
      type: String,
      trim: true
    },

    linkedin: {
      type: String,
      trim: true
    },

    youtube: {
      type: String,
      trim: true
    },

    tiktok: {
      type: String,
      trim: true
    },

    // =========================
    // BUSINESS DETAILS
    // =========================
    website: {
      type: String,
      trim: true
    },

    nationalId: {
      type: String,
      trim: true
    },

    tinNumber: {
      type: String,
      trim: true
    },

    rdbRegistration: {
      type: String,
      trim: true
    },

    tourismLicense: {
      type: String,
      trim: true
    },

    languages: [{
      type: String
    }],

    specializations: [{
      type: String
    }],

    yearsOfExperience: {
      type: String,
      trim: true
    },

    employees: {
      type: Number,
      min: 0
    },

    businessHours: {
      monday: { open: String, close: String, closed: Boolean },
      tuesday: { open: String, close: String, closed: Boolean },
      wednesday: { open: String, close: String, closed: Boolean },
      thursday: { open: String, close: String, closed: Boolean },
      friday: { open: String, close: String, closed: Boolean },
      saturday: { open: String, close: String, closed: Boolean },
      sunday: { open: String, close: String, closed: Boolean }
    },

    // =========================
    // PAYMENT INFORMATION
    // =========================
    paymentMethod: {
      type: String,
      enum: ['bank_transfer', 'mobile_money', 'both'],
      default: 'mobile_money'
    },

    bankName: {
      type: String,
      trim: true
    },

    accountName: {
      type: String,
      trim: true
    },

    accountNumber: {
      type: String,
      trim: true
    },

    swiftCode: {
      type: String,
      trim: true
    },

    mobileMoney: {
      type: String,
      trim: true
    },

    paymentCurrency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'RWF', 'EUR', 'GBP']
    },

    // =========================
    // AGREEMENTS
    // =========================
    agreeToTerms: {
      type: Boolean,
      default: false
    },

    agreeToPrivacy: {
      type: Boolean,
      default: false
    },

    agreeToConduct: {
      type: Boolean,
      default: false
    },

    agreeToCommission: {
      type: Boolean,
      default: false
    },

    agreeToTourism: {
      type: Boolean,
      default: false
    },

    agreeToAccurate: {
      type: Boolean,
      default: false
    },

    // =========================
    // STATUS
    // =========================
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "needs_information"],
      default: "pending"
    },

    adminNotes: {
      type: String,
      default: "",
      trim: true
    },

    reviewedAt: {
      type: Date
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

/// =========================
// INDEXES FOR PERFORMANCE
// =========================
providerRequestSchema.index({ user: 1 });
providerRequestSchema.index({ status: 1, createdAt: -1 });
providerRequestSchema.index({ businessName: 'text', fullName: 'text', email: 'text' });
providerRequestSchema.index({ createdAt: -1 });


// =========================
// VIRTUAL: Is pending
// =========================
providerRequestSchema.virtual('isPending').get(function() {
  return this.status === 'pending';
});

// =========================
// VIRTUAL: Is approved
// =========================
providerRequestSchema.virtual('isApproved').get(function() {
  return this.status === 'approved';
});

// =========================
// METHOD: Update status
// =========================
providerRequestSchema.methods.updateStatus = async function(status, adminNotes, adminId) {
  this.status = status;
  if (adminNotes) this.adminNotes = adminNotes;
  this.reviewedAt = new Date();
  this.reviewedBy = adminId;
  await this.save();
  return this;
};

// =========================
// STATIC: Get pending requests
// =========================
providerRequestSchema.statics.getPending = function() {
  return this.find({ status: 'pending' })
    .populate('user', 'name email profileImage')
    .sort({ createdAt: 1 });
};

// =========================
// STATIC: Get by status
// =========================
providerRequestSchema.statics.getByStatus = function(status) {
  return this.find({ status })
    .populate('user', 'name email profileImage')
    .sort({ createdAt: -1 });
};

// =========================
// TO JSON
// =========================
providerRequestSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

// =========================
// TO OBJECT
// =========================
providerRequestSchema.set('toObject', {
  virtuals: true
});

const ProviderRequest = mongoose.model("ProviderRequest", providerRequestSchema);
export default ProviderRequest;