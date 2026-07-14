// backend/src/models/Booking.js

import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
{
  bookingCode: {
    type: String,
    unique: true,
    default: () => "AITOUR-" + Date.now()
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    validate: {
      validator: function(v) {
        return this.listing || this.tour;
      },
      message: "Either listing or tour is required"
    }
  },

  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tour",
  },

  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  startDate: {
    type: Date,
    validate: {
      validator: function(v) {
        return !v || v > new Date();
      },
      message: "Start date must be in the future"
    }
  },

endDate: {
  type: Date,
  validate: {
    validator: function(v) {
      // ✅ If no endDate provided, it's valid (single day booking)
      if (!v) return true;
      // ✅ If no startDate, can't validate
      if (!this.startDate) return true;
      // ✅ Compare dates properly (ignore time)
      const start = new Date(this.startDate);
      const end = new Date(v);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      return end >= start;
    },
    message: "End date must be on or after start date"
  }
},

  numberOfPeople: {
    type: Number,
    default: 1,
    min: [1, "Minimum 1 person required"],
    max: [50, "Maximum 50 people allowed"]
  },

  totalPrice: {
    type: Number,
    required: true,
    min: [0.01, "Price must be greater than 0"]
  },

  status: {
    type: String,
    enum: [
      "draft",
      "pending_payment",
      "paid",
      "confirmed",
      "in_progress",
      "completed",
      "review_eligible",
      "cancelled",
      "failed_payment",
      "rejected"
    ],
    default: "pending_payment"
  },

  paymentStatus: {
    type: String,
    enum: [
      "unpaid",
      "pending",
      "paid",
      "failed",
      "refunded",
      "partially_refunded"
    ],
    default: "unpaid"
  },

  paymentId: {
    type: String
  },

  paidAt: {
    type: Date
  },

  checkIn: {
    type: Date
  },

  checkOut: {
    type: Date
  },

  specialRequests: {
    type: String,
    trim: true,
    maxlength: [500, "Special requests cannot exceed 500 characters"]
  },

  canReview: {
    type: Boolean,
    default: false
  },

  reviewSubmitted: {
    type: Boolean,
    default: false
  },

  adminNotes: {
    type: String,
    trim: true
  },

  cancelledAt: {
    type: Date
  },

  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  cancellationReason: {
    type: String,
    trim: true,
    maxlength: [500, "Cancellation reason cannot exceed 500 characters"]
  },

  refundAmount: {
    type: Number,
    default: 0,
    min: [0, "Refund amount cannot be negative"]
  },

  refundedAt: {
    type: Date
  },

  refundId: {
    type: String
  },

  duplicateCheckPerformed: {
    type: Boolean,
    default: false
  }
},
{
  timestamps: true
});

// =========================
// ✅ INDEXES
// =========================
bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ provider: 1, status: 1 });
bookingSchema.index({ listing: 1, status: 1 });
bookingSchema.index({ tour: 1, status: 1 });
bookingSchema.index({ startDate: 1 });
bookingSchema.index({ createdAt: -1 });
bookingSchema.index({ user: 1, listing: 1, status: 1 });
bookingSchema.index({ user: 1, tour: 1, status: 1 });

// ✅ REMOVED: Duplicate index on bookingCode (already defined in schema with unique: true)
// bookingSchema.index({ bookingCode: 1 }, { unique: true }); ← REMOVE THIS LINE

// =========================
// ✅ VIRTUALS
// =========================

bookingSchema.virtual("isActive").get(function() {
  return ["pending_payment", "paid", "confirmed", "in_progress"].includes(this.status);
});

bookingSchema.virtual("canBeCancelled").get(function() {
  return ["pending_payment", "paid", "confirmed"].includes(this.status);
});

bookingSchema.virtual("canBeReviewed").get(function() {
  return (this.status === "completed" || this.status === "review_eligible") && 
         !this.reviewSubmitted;
});

bookingSchema.virtual("requiresPayment").get(function() {
  return this.paymentStatus === "unpaid" || this.paymentStatus === "pending";
});

// =========================
// ✅ INSTANCE METHODS
// =========================

bookingSchema.methods.canCancel = function() {
  return ["pending_payment", "paid", "confirmed"].includes(this.status);
};

bookingSchema.methods.isReviewable = function() {
  return (this.status === "completed" || this.status === "review_eligible") && 
         !this.reviewSubmitted;
};

bookingSchema.methods.markAsPaid = async function(paymentId) {
  this.paymentStatus = "paid";
  this.paymentId = paymentId;
  this.paidAt = new Date();
  
  if (this.status === "pending_payment") {
    this.status = "paid";
  }
  
  await this.save();
  return this;
};

bookingSchema.methods.markAsFailed = async function(reason) {
  this.paymentStatus = "failed";
  this.status = "failed_payment";
  this.adminNotes = reason || "Payment failed";
  await this.save();
  return this;
};

bookingSchema.methods.cancelBooking = async function(reason, userId) {
  this.status = "cancelled";
  this.cancelledAt = new Date();
  this.cancelledBy = userId;
  this.cancellationReason = reason || "No reason provided";
  
  if (this.paymentStatus === "paid") {
    this.paymentStatus = "refunded";
  }
  
  await this.save();
  return this;
};

bookingSchema.methods.confirmBooking = async function() {
  if (this.status === "paid") {
    this.status = "confirmed";
    await this.save();
  } else {
    throw new Error("Booking must be paid before confirmation");
  }
  return this;
};

bookingSchema.methods.completeBooking = async function() {
  if (this.status === "confirmed" || this.status === "in_progress") {
    this.status = "completed";
    this.canReview = true;
    await this.save();
  } else if (this.status === "completed") {
    this.canReview = true;
    await this.save();
  } else {
    throw new Error("Only confirmed or in-progress bookings can be completed");
  }
  return this;
};

bookingSchema.methods.markAsReviewEligible = async function() {
  if (this.status === "completed") {
    this.status = "review_eligible";
    this.canReview = true;
    await this.save();
  }
  return this;
};

bookingSchema.methods.rejectBooking = async function(reason) {
  this.status = "rejected";
  this.adminNotes = reason || "Booking rejected by provider";
  await this.save();
  return this;
};

// =========================
// ✅ STATIC METHODS
// =========================

bookingSchema.statics.hasActiveBooking = async function(userId, entityId, entityType = 'listing') {
  const field = entityType === 'listing' ? 'listing' : 'tour';
  const activeStatuses = ["pending_payment", "paid", "confirmed", "in_progress"];
  
  const booking = await this.findOne({
    user: userId,
    [field]: entityId,
    status: { $in: activeStatuses }
  });
  return !!booking;
};

bookingSchema.statics.getActiveBooking = async function(userId, entityId, entityType = 'listing') {
  const field = entityType === 'listing' ? 'listing' : 'tour';
  const activeStatuses = ["pending_payment", "paid", "confirmed", "in_progress"];
  
  return this.findOne({
    user: userId,
    [field]: entityId,
    status: { $in: activeStatuses }
  });
};

bookingSchema.statics.getActiveBookings = async function(userId) {
  return this.find({
    user: userId,
    status: { $in: ["pending_payment", "paid", "confirmed", "in_progress"] }
  })
  .populate('listing', 'title location coverImage price')
  .populate('tour', 'title location coverImage price')
  .populate('provider', 'name email')
  .sort({ createdAt: -1 });
};

bookingSchema.statics.getProviderPendingBookings = async function(providerId) {
  return this.find({
    provider: providerId,
    status: { $in: ["paid", "pending_payment"] }
  })
  .populate('user', 'name email')
  .populate('listing', 'title location coverImage price')
  .populate('tour', 'title location coverImage price')
  .sort({ createdAt: -1 });
};

bookingSchema.statics.getProviderBookingsByStatus = async function(providerId, status) {
  const filter = { provider: providerId };
  if (status) filter.status = status;
  
  return this.find(filter)
    .populate('user', 'name email')
    .populate('listing', 'title location coverImage price')
    .populate('tour', 'title location coverImage price')
    .sort({ createdAt: -1 });
};

bookingSchema.statics.canBook = async function(userId, entityId, entityType = 'listing') {
  const hasActive = await this.hasActiveBooking(userId, entityId, entityType);
  return !hasActive;
};

bookingSchema.statics.getExpiredPendingPayments = async function() {
  const expiryTime = new Date(Date.now() - 30 * 60 * 1000);
  return this.find({
    status: "pending_payment",
    createdAt: { $lt: expiryTime }
  });
};

// =========================
// ✅ CREATE AND EXPORT THE MODEL
// =========================

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;