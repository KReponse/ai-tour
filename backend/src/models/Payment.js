// backend/src/models/Payment.js
// ✅ FIXED - Updated paymentMethod enum to include all providers

import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },

  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  amount: {
    type: Number,
    required: true,
    min: [0.01, "Amount must be greater than 0"],
  },

  currency: {
    type: String,
    default: "USD",
    enum: ["USD", "EUR", "GBP", "RWF"],
  },

  platformFee: {
    type: Number,
    default: 0,
    min: [0, "Platform fee cannot be negative"],
  },

  providerAmount: {
    type: Number,
    default: 0,
    min: [0, "Provider amount cannot be negative"],
  },

  stripeSessionId: {
    type: String,
  },

  stripePaymentId: {
    type: String,
  },

  transactionId: {
    type: String,
    unique: true,
    sparse: true,
  },

  refundId: {
    type: String,
  },

  // ✅ UPDATED: Include all payment providers
  paymentMethod: {
    type: String,
    enum: [
      "stripe",        // ✅ Added
      "card",          // Keep for backward compatibility
      "bank_transfer",
      "mobile_money",
      "momo",          // MTN Mobile Money
      "airtel",        // Airtel Money
      "paypal",        // PayPal
      "test",          // Test mode
    ],
    default: "stripe", // ✅ Changed default to stripe
  },

  status: {
    type: String,
    enum: [
      "pending",
      "processing",
      "paid",
      "failed",
      "refunded",
      "partially_refunded",
      "disputed",
    ],
    default: "pending",
  },

  paidAt: {
    type: Date,
  },

  refundedAt: {
    type: Date,
  },

  refundAmount: {
    type: Number,
    default: 0,
    min: [0, "Refund amount cannot be negative"],
  },

  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {},
  },

  isTestMode: {
    type: Boolean,
    default: false,
  },

  errorMessage: {
    type: String,
  },

  source: {
    type: String,
    enum: ["checkout", "subscription", "manual", "webhook"],
    default: "checkout",
  },

  // ✅ NEW: Provider reference for multi-provider support
  providerReference: {
    type: String,
  },

  // ✅ NEW: Provider data storage
  providerData: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {},
  },

  // ✅ NEW: Payment URL for redirects
  paymentUrl: {
    type: String,
  },
},
{
  timestamps: true,
});

// =========================
// ✅ INDEXES
// =========================

paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ provider: 1, createdAt: -1 });
paymentSchema.index({ booking: 1 });
paymentSchema.index({ status: 1, createdAt: -1 });
paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ stripeSessionId: 1 });
paymentSchema.index({ stripePaymentId: 1 });
paymentSchema.index({ paidAt: -1 });
paymentSchema.index({ createdAt: -1 });
paymentSchema.index({ user: 1, booking: 1, status: 1 });
paymentSchema.index({ providerReference: 1 }); // ✅ New index

// =========================
// ✅ VIRTUALS
// =========================

paymentSchema.virtual("isRefundable").get(function() {
  return this.status === "paid" && !this.refundId;
});

paymentSchema.virtual("canBeRefunded").get(function() {
  return this.status === "paid" && this.amount > 0;
});

paymentSchema.virtual("isSuccessful").get(function() {
  return this.status === "paid" || this.status === "processing";
});

paymentSchema.virtual("calculatedProviderAmount").get(function() {
  return this.amount - (this.platformFee || 0);
});

// =========================
// ✅ INSTANCE METHODS
// =========================

paymentSchema.methods.markAsPaid = async function(paymentIntentId) {
  this.status = "paid";
  this.stripePaymentId = paymentIntentId;
  this.paidAt = new Date();
  this.providerAmount = this.amount - (this.platformFee || 0);
  await this.save();
  return this;
};

paymentSchema.methods.markAsFailed = async function(errorMessage) {
  this.status = "failed";
  this.errorMessage = errorMessage;
  await this.save();
  return this;
};

paymentSchema.methods.processRefund = async function(refundId, amount = null) {
  this.status = "refunded";
  this.refundId = refundId;
  this.refundAmount = amount || this.amount;
  this.refundedAt = new Date();
  await this.save();
  return this;
};

paymentSchema.methods.processPartialRefund = async function(refundId, amount) {
  this.status = "partially_refunded";
  this.refundId = refundId;
  this.refundAmount = amount;
  this.refundedAt = new Date();
  await this.save();
  return this;
};

paymentSchema.methods.calculateProviderAmount = function() {
  this.providerAmount = this.amount - (this.platformFee || 0);
  return this.providerAmount;
};

// =========================
// ✅ STATIC METHODS
// =========================

paymentSchema.statics.getProviderEarnings = async function(providerId) {
  const result = await this.aggregate([
    {
      $match: {
        provider: providerId,
        status: "paid",
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
        count: { $sum: 1 },
        platformFees: { $sum: "$platformFee" },
        providerAmount: { $sum: "$providerAmount" },
      },
    },
  ]);
  return result[0] || { total: 0, count: 0, platformFees: 0, providerAmount: 0 };
};

paymentSchema.statics.getUserPayments = async function(userId, limit = 10) {
  return this.find({ user: userId })
    .populate("booking", "tour listing startDate endDate totalPrice")
    .sort({ createdAt: -1 })
    .limit(limit);
};

paymentSchema.statics.hasSuccessfulPayment = async function(bookingId) {
  const payment = await this.findOne({
    booking: bookingId,
    status: { $in: ["paid", "processing"] },
  });
  return !!payment;
};

paymentSchema.statics.findBySessionId = async function(sessionId) {
  return this.findOne({ stripeSessionId: sessionId });
};

// =========================
// ✅ CREATE AND EXPORT MODEL
// =========================

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;