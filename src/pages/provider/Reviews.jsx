// frontend/src/pages/provider/Reviews.jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  MessageCircle,
  Sparkles,
  Loader2,
  Search,
  Filter,
  ThumbsUp,
  Calendar,
  MapPin,
  User,
  Eye,
  TrendingUp,
  Award,
  ClipboardList,
  AlertCircle,
} from 'lucide-react';
import Card, { CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ReviewCard from '../../components/ReviewCard';
import { getProviderReviews, getProviderReviewStats } from '../../services/reviewService';
import { useAuth } from '../../contexts/AuthContext';

// ===============================
// AI TOUR COLORS
// ===============================
// Teal  : #0D9488
// Gold  : #F59E0B
// Slate : #374151
// White : #FFFFFF
// ===============================

const ProviderReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    average: 0,
    total: 0,
    byListing: {},
    ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    pendingCount: 0,
    publishedCount: 0,
    hiddenCount: 0,
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    filterReviews();
  }, [reviews, searchTerm, ratingFilter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ Fetch reviews and stats in parallel
      const [reviewsData, statsData] = await Promise.all([
        getProviderReviews(),
        getProviderReviewStats().catch(() => ({ success: false }))
      ]);

      const reviewsList = reviewsData.reviews || [];
      setReviews(reviewsList);
      setFilteredReviews(reviewsList);

      // ✅ Use stats from API if available
      if (statsData.success && statsData.stats) {
        const apiStats = statsData.stats;
        
        // Calculate byListing from reviews
        const byListing = {};
        reviewsList.forEach(r => {
          const listingId = r.listing?._id || r.listing || r.tour?._id || r.tour;
          const listingTitle = r.listing?.title || r.tour?.title || 'Unknown Listing';
          if (listingId) {
            if (!byListing[listingId]) {
              byListing[listingId] = { title: listingTitle, count: 0, sum: 0 };
            }
            byListing[listingId].count++;
            byListing[listingId].sum += r.rating;
          }
        });

        setStats({
          average: apiStats.averageRating || 0,
          total: apiStats.totalReviews || reviewsList.length,
          byListing,
          ratingCounts: apiStats.ratingCounts || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          pendingCount: apiStats.pendingCount || 0,
          publishedCount: apiStats.publishedCount || 0,
          hiddenCount: apiStats.hiddenCount || 0,
        });
      } else {
        // ✅ Fallback: Calculate stats from reviews
        calculateStats(reviewsList);
      }
    } catch (error) {
      console.error('Error fetching provider reviews:', error);
      setError('Failed to load reviews. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (reviewsList) => {
    if (reviewsList.length === 0) {
      setStats({
        average: 0,
        total: 0,
        byListing: {},
        ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        pendingCount: 0,
        publishedCount: 0,
        hiddenCount: 0,
      });
      return;
    }

    const total = reviewsList.length;
    const sum = reviewsList.reduce((acc, r) => acc + r.rating, 0);
    const avg = sum / total;

    // Rating counts
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviewsList.forEach(r => {
      if (ratingCounts[r.rating] !== undefined) {
        ratingCounts[r.rating]++;
      }
    });

    // By listing
    const byListing = {};
    reviewsList.forEach(r => {
      const listingId = r.listing?._id || r.listing || r.tour?._id || r.tour;
      const listingTitle = r.listing?.title || r.tour?.title || 'Unknown Listing';
      if (listingId) {
        if (!byListing[listingId]) {
          byListing[listingId] = { title: listingTitle, count: 0, sum: 0 };
        }
        byListing[listingId].count++;
        byListing[listingId].sum += r.rating;
      }
    });

    // Status counts
    const pendingCount = reviewsList.filter(r => r.status === 'pending').length;
    const publishedCount = reviewsList.filter(r => r.status === 'published').length;
    const hiddenCount = reviewsList.filter(r => r.status === 'hidden').length;

    setStats({
      average: Math.round(avg * 10) / 10,
      total,
      byListing,
      ratingCounts,
      pendingCount,
      publishedCount,
      hiddenCount,
    });
  };

  const filterReviews = () => {
    let filtered = [...reviews];

    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.listing?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.tour?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (ratingFilter !== 'all') {
      filtered = filtered.filter(r => r.rating === parseInt(ratingFilter));
    }

    setFilteredReviews(filtered);
  };

  // ✅ Render rating distribution
  const renderDistribution = () => {
    const total = stats.total || 1;
    return [5, 4, 3, 2, 1].map((star) => {
      const count = stats.ratingCounts[star] || 0;
      const percentage = (count / total) * 100;
      return (
        <div key={star} className="flex items-center gap-2">
          <span className="text-xs text-gray-500 w-8">{star}★</span>
          <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#F59E0B] rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="text-xs text-gray-400 w-8 text-right">{count}</span>
        </div>
      );
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px]">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488]/20" />
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488] border-t-transparent animate-spin" />
        </div>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
        <button
          onClick={fetchReviews}
          className="mt-4 px-6 py-2 rounded-xl bg-[#0D9488] text-white hover:bg-[#0D9488]/80 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in px-4 py-6 max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#F59E0B] flex items-center justify-center shadow-lg">
            <Star className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#374151] dark:text-white">
              Reviews on My Listings
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              See what travelers are saying about your listings
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Sparkles className="w-4 h-4 text-[#0D9488]" />
          <span>{reviews.length} reviews</span>
        </div>
      </div>

      {/* STATS */}
      {reviews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-[#F59E0B] fill-[#F59E0B]" />
              <span className="text-2xl font-bold text-[#374151] dark:text-white">
                {stats.average}
              </span>
            </div>
            <p className="text-xs text-gray-500">Average Rating</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-[#0D9488]" />
              <span className="text-2xl font-bold text-[#374151] dark:text-white">
                {stats.total}
              </span>
            </div>
            <p className="text-xs text-gray-500">Total Reviews</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-[#0D9488]" />
              <span className="text-2xl font-bold text-[#374151] dark:text-white">
                {Object.keys(stats.byListing).length}
              </span>
            </div>
            <p className="text-xs text-gray-500">Listings with Reviews</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#F59E0B]" />
              <span className="text-2xl font-bold text-[#374151] dark:text-white">
                {reviews.filter(r => r.rating >= 4).length}
              </span>
            </div>
            <p className="text-xs text-gray-500">4+ Star Reviews</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#F59E0B]" />
              <span className="text-2xl font-bold text-[#F59E0B]">
                {stats.pendingCount}
              </span>
            </div>
            <p className="text-xs text-gray-500">Pending</p>
          </div>
        </div>
      )}

      {/* RATING DISTRIBUTION */}
      {reviews.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
          <h3 className="font-semibold text-[#374151] dark:text-white mb-3">
            Rating Distribution
          </h3>
          <div className="space-y-1.5 max-w-md">
            {renderDistribution()}
          </div>
        </div>
      )}

      {/* LISTING BREAKDOWN */}
      {Object.keys(stats.byListing).length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
          <h3 className="font-semibold text-[#374151] dark:text-white mb-3">
            Reviews by Listing
          </h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(stats.byListing).map(([id, data]) => (
              <Link
                key={id}
                to={`/listing/${id}`}
                className="px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-[#0D9488]/10 transition flex items-center gap-2"
              >
                <span className="text-sm font-medium text-[#374151] dark:text-white">
                  {data.title}
                </span>
                <span className="text-xs bg-[#0D9488]/10 text-[#0D9488] px-2 py-0.5 rounded-full">
                  {data.count} {data.count > 1 ? 'reviews' : 'review'}
                </span>
                <span className="text-xs text-[#F59E0B]">
                  ⭐ {(data.sum / data.count).toFixed(1)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* SEARCH & FILTER */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search reviews by traveler or listing..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 h-12 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition outline-none"
          />
        </div>
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="h-12 px-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none"
        >
          <option value="all">All Ratings</option>
          <option value="5">⭐ 5 Stars</option>
          <option value="4">⭐ 4 Stars</option>
          <option value="3">⭐ 3 Stars</option>
          <option value="2">⭐ 2 Stars</option>
          <option value="1">⭐ 1 Star</option>
        </select>
      </div>

      {/* EMPTY STATE */}
      {filteredReviews.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-16 text-center shadow-sm">
          <div className="w-20 h-20 rounded-full bg-[#0D9488]/10 flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-10 h-10 text-[#0D9488]" />
          </div>
          <h2 className="text-2xl font-bold text-[#374151] dark:text-white mb-2">
            {searchTerm || ratingFilter !== 'all' ? 'No Reviews Found' : 'No Reviews Yet'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm || ratingFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Reviews will appear here once travelers review your listings'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              showActions={false}
              showTourInfo={true}
              onHelpfulToggle={() => fetchReviews()}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProviderReviews;