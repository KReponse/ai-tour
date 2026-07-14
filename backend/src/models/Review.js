// backend/src/models/Review.js

import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  // Core Relations
  traveler: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
    unique: true, // ✅ This creates the unique index
    index: true
  },
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    index: true
  },
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
    index: true
  },

  // Review Content
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  images: [{
    url: String,
    publicId: String,
    caption: String
  }],

  // Provider Response
  providerResponse: {
    comment: {
      type: String,
      trim: true,
      maxlength: 1000
    },
    respondedAt: Date,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    editedAt: Date
  },

  // Status & Moderation
  status: {
    type: String,
    enum: ['pending', 'published', 'hidden', 'flagged', 'deleted'],
    default: 'pending',
    index: true
  },
  isVerifiedBooking: {
    type: Boolean,
    default: false
  },
  moderationNotes: {
    type: String,
    trim: true
  },
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  moderatedAt: Date,

  // AI Features (Future)
  aiSummary: {
    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative']
    },
    highlights: [String],
    translated: {
      fr: String,
      rw: String,
      sw: String
    },
    fakeDetection: {
      isFake: Boolean,
      confidence: Number,
      reasons: [String]
    }
  },

  // Helpful Votes
  helpfulCount: {
    type: Number,
    default: 0
  },
  helpfulUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  // Reporting
  flags: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Review Window
  reviewDeadline: {
    type: Date,
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }

}, {
  timestamps: true
});

// =========================
// INDEXES - FIXED (No duplicates)
// =========================
reviewSchema.index({ listing: 1, status: 1, createdAt: -1 });
reviewSchema.index({ provider: 1, status: 1, createdAt: -1 });
reviewSchema.index({ traveler: 1, status: 1, createdAt: -1 });
// ✅ booking unique index is already created by `unique: true` in schema
// reviewSchema.index({ booking: 1 }, { unique: true }); // ❌ REMOVED - duplicate
reviewSchema.index({ rating: 1 });
reviewSchema.index({ status: 1, createdAt: -1 });
reviewSchema.index({ helpfulCount: -1 });
reviewSchema.index({ 'aiSummary.sentiment': 1 });

// =========================
// VIRTUALS
// =========================
reviewSchema.virtual('canEdit').get(function() {
  const editWindow = 7 * 24 * 60 * 60 * 1000; // 7 days
  return this.status === 'published' && 
         (Date.now() - this.createdAt) < editWindow;
});

reviewSchema.virtual('canDelete').get(function() {
  const deleteWindow = 7 * 24 * 60 * 60 * 1000; // 7 days
  return this.status === 'published' && 
         (Date.now() - this.createdAt) < deleteWindow;
});

// =========================
// INSTANCE METHODS
// =========================
reviewSchema.methods.publish = async function() {
  this.status = 'published';
  await this.save();
  return this;
};

reviewSchema.methods.hide = async function(reason) {
  this.status = 'hidden';
  this.moderationNotes = reason;
  await this.save();
  return this;
};

reviewSchema.methods.flag = async function(userId, reason) {
  this.flags.push({ user: userId, reason });
  if (this.flags.length >= 3) {
    this.status = 'flagged';
  }
  await this.save();
  return this;
};

reviewSchema.methods.addResponse = async function(comment, providerId) {
  this.providerResponse = {
    comment,
    respondedAt: new Date(),
    respondedBy: providerId
  };
  await this.save();
  return this;
};

reviewSchema.methods.editResponse = async function(comment) {
  if (!this.providerResponse) {
    throw new Error('No response to edit');
  }
  this.providerResponse.comment = comment;
  this.providerResponse.editedAt = new Date();
  await this.save();
  return this;
};

// =========================
// STATIC METHODS
// =========================
reviewSchema.statics.getListingStats = async function(listingId) {
  const stats = await this.aggregate([
    { $match: { listing: listingId, status: 'published' } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        distribution: {
          $push: '$rating'
        }
      }
    }
  ]);

  if (!stats.length) return null;

  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  stats[0].distribution.forEach(r => distribution[r]++);

  return {
    averageRating: Math.round(stats[0].averageRating * 10) / 10,
    totalReviews: stats[0].totalReviews,
    distribution
  };
};

reviewSchema.statics.getProviderStats = async function(providerId) {
  return this.aggregate([
    { $match: { provider: providerId, status: 'published' } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        fiveStar: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
        fourStar: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
        threeStar: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
        twoStar: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
        oneStar: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } }
      }
    }
  ]);
};

const Review = mongoose.model('Review', reviewSchema);
export default Review;