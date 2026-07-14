// backend/src/controllers/publicReviewController.js

import Review from '../models/Review.js';

export const getPublicReviews = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      sort = 'latest',
      rating,
      search,
      listingId,
      providerId
    } = req.query;

    const filter = { status: 'published' };

    if (listingId) filter.listing = listingId;
    if (providerId) filter.provider = providerId;
    if (rating) filter.rating = parseInt(rating);
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { comment: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = {
      latest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      highest: { rating: -1 },
      lowest: { rating: 1 },
      helpful: { helpfulCount: -1 }
    };

    const reviews = await Review.find(filter)
      .populate('traveler', 'name avatar')
      .populate('listing', 'title slug')
      .sort(sortOptions[sort] || { createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const total = await Review.countDocuments(filter);

    res.json({
      success: true,
      reviews,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPublicReviewById = async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      status: 'published'
    })
      .populate('traveler', 'name avatar')
      .populate('listing', 'title slug')
      .populate('provider', 'name businessName')
      .lean();

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getListingReviews = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { page = 1, limit = 20, sort = 'latest' } = req.query;

    const filter = { listing: listingId, status: 'published' };

    const reviews = await Review.find(filter)
      .populate('traveler', 'name avatar')
      .sort(sort === 'latest' ? { createdAt: -1 } : { rating: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const total = await Review.countDocuments(filter);
    const stats = await Review.getListingStats(listingId);

    res.json({
      success: true,
      reviews,
      stats,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProviderReviews = async (req, res) => {
  try {
    const { providerId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const filter = { provider: providerId, status: 'published' };

    const reviews = await Review.find(filter)
      .populate('traveler', 'name avatar')
      .populate('listing', 'title slug')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const total = await Review.countDocuments(filter);
    const stats = await Review.getProviderStats(providerId);

    res.json({
      success: true,
      reviews,
      stats: stats[0] || null,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getReviewStats = async (req, res) => {
  try {
    const { entityType, entityId } = req.params;

    let stats;
    if (entityType === 'listing') {
      stats = await Review.getListingStats(entityId);
    } else if (entityType === 'provider') {
      const result = await Review.getProviderStats(entityId);
      stats = result[0] || null;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid entity type'
      });
    }

    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};