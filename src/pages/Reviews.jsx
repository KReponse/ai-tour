// src/pages/Reviews.jsx

import React, { useEffect, useState, useCallback } from 'react';
import {
  Star,
  ThumbsUp,
  Loader2,
  MessageCircle,
  Sparkles,
  Calendar,
  MapPin,
  Search,
  ChevronDown,
  Reply,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import axios from 'axios';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';

// ===============================
// AI TOUR COLORS
// ===============================
// Teal  : #0D9488
// Gold  : #F59E0B
// Slate : #374151
// White : #FFFFFF
// ===============================

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });
  const [filters, setFilters] = useState({
    sort: 'latest',
    rating: 'all',
    search: ''
  });
  const [hasMore, setHasMore] = useState(true);

  // Sort options
  const sortOptions = [
    { value: 'latest', label: 'Latest' },
    { value: 'highest', label: 'Highest Rating' },
    { value: 'lowest', label: 'Lowest Rating' },
    { value: 'mostHelpful', label: 'Most Helpful' },
    { value: 'oldest', label: 'Oldest' }
  ];

  const ratingOptions = [
    { value: 'all', label: 'All Ratings' },
    { value: '5', label: '⭐ 5 Stars' },
    { value: '4', label: '⭐ 4 Stars' },
    { value: '3', label: '⭐ 3 Stars' },
    { value: '2', label: '⭐ 2 Stars' },
    { value: '1', label: '⭐ 1 Star' }
  ];

  // Fetch community reviews
  const fetchReviews = useCallback(async (reset = true) => {
    try {
      if (reset) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const params = new URLSearchParams({
        page: reset ? 1 : pagination.page + 1,
        limit: 10,
        sort: filters.sort,
      });

      if (filters.rating !== 'all') {
        params.append('rating', filters.rating);
      }

      if (filters.search.trim()) {
        params.append('search', filters.search.trim());
      }

      const response = await axios.get(`${API_URL}/reviews/community?${params}`);

      if (response.data.success) {
        const { reviews: newReviews, total, page, totalPages, stats: dataStats } = response.data;

        if (reset) {
          setReviews(newReviews);
        } else {
          setReviews(prev => [...prev, ...newReviews]);
        }

        setPagination({ page, totalPages, total });
        setStats(dataStats);
        setHasMore(page < totalPages);
      }
    } catch (err) {
      console.error('Error fetching community reviews:', err);
      setError(err.response?.data?.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filters, pagination.page]);

  // Initial load and filter changes
  useEffect(() => {
    fetchReviews(true);
  }, [filters.sort, filters.rating]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.search !== undefined) {
        fetchReviews(true);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [filters.search]);

  // Load more
  const loadMore = () => {
    if (!loadingMore && hasMore) {
      setPagination(prev => ({ ...prev, page: prev.page + 1 }));
      fetchReviews(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchReviews(true);
  };

  // Render stars
  const renderStars = (rating, size = 'w-4 h-4') => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating
                ? 'text-[#F59E0B] fill-[#F59E0B]'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get avatar URL
  const getAvatar = (name) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=0D9488&color=fff&size=48`;
  };

  // Loading skeleton
  const renderSkeleton = () => {
    return Array.from({ length: 3 }).map((_, index) => (
      <Card key={`skeleton-${index}`} className="animate-pulse border border-gray-100 dark:border-gray-800">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            </div>
          </div>
        </CardContent>
      </Card>
    ));
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="text-center">
          <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-2" />
          <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
        </div>
        <div className="flex justify-center gap-4">
          <div className="h-12 w-32 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <div className="h-12 w-32 bg-gray-200 dark:bg-gray-700 rounded-full" />
        </div>
        {renderSkeleton()}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-red-500/10 flex items-center justify-center mb-4">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-[#374151] dark:text-white mb-2">
          Unable to Load Reviews
        </h3>
        <p className="text-gray-500 dark:text-gray-400">{error}</p>
        <button
          onClick={() => fetchReviews(true)}
          className="mt-4 px-6 py-2 rounded-xl bg-[#0D9488] text-white hover:bg-[#0D9488]/90 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#F59E0B] flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[#374151] dark:text-white">
            Community Reviews
          </h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          Real experiences from travelers around the world
        </p>
      </div>

      {/* Stats Overview */}
      {stats.totalReviews > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Overall Rating */}
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-500 dark:text-gray-400">Overall Rating</p>
              <div className="flex items-center justify-center md:justify-start gap-3 mt-1">
                <span className="text-5xl font-bold text-[#374151] dark:text-white">
                  {stats.averageRating.toFixed(1)}
                </span>
                <div>
                  {renderStars(Math.round(stats.averageRating), 'w-6 h-6')}
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {stats.totalReviews} reviews
                  </p>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="md:col-span-2">
              <div className="space-y-1.5">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = stats.distribution[star] || 0;
                  const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-12">
                        {star} ★
                      </span>
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#F59E0B] rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-500 w-12 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by tour, traveler, or keyword..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-12 pr-4 h-12 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition outline-none"
          />
        </form>

        {/* Sort */}
        <div className="relative">
          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="h-12 px-4 pr-10 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none appearance-none"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
        </div>

        {/* Rating Filter */}
        <div className="relative">
          <select
            value={filters.rating}
            onChange={(e) => handleFilterChange('rating', e.target.value)}
            className="h-12 px-4 pr-10 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none appearance-none"
          >
            {ratingOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-16 text-center shadow-sm">
          <div className="w-20 h-20 rounded-full bg-[#0D9488]/10 flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-10 h-10 text-[#0D9488]" />
          </div>
          <h2 className="text-2xl font-bold text-[#374151] dark:text-white mb-2">
            {filters.search ? 'No Reviews Found' : 'No Reviews Yet'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {filters.search
              ? 'Try adjusting your search or filters'
              : 'Reviews will appear here once travelers share their experiences'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review._id} className="hover:shadow-lg transition border border-gray-100 dark:border-gray-800">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <img
                      src={review.user?.profileImage || getAvatar(review.user?.name)}
                      alt={review.user?.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#0D9488]"
                      onError={(e) => {
                        e.target.src = getAvatar(review.user?.name);
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* User Info */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-[#374151] dark:text-white">
                        {review.user?.name || 'Anonymous'}
                      </span>
                      {review.user?.role === 'traveler' && (
                        <span className="inline-flex items-center gap-1 text-xs text-[#0D9488] bg-[#0D9488]/10 px-2 py-0.5 rounded-full">
                          <CheckCircle className="w-3 h-3" />
                          Verified Traveler
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mt-1">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {review.rating}.0
                      </span>
                    </div>

                    {/* Comment */}
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-2">
                      {review.comment}
                    </p>

                    {/* Tour Info */}
                    {review.tour && (
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-2">
                        <MapPin className="w-3 h-3 text-[#0D9488]" />
                        <span>{review.tour.title}</span>
                        {review.tour.location && (
                          <span className="text-gray-400">· {review.tour.location}</span>
                        )}
                      </div>
                    )}

                    {/* Provider Reply */}
                    {review.reply && (
                      <div className="mt-3 p-3 rounded-xl bg-[#0D9488]/5 border border-[#0D9488]/10">
                        <div className="flex items-start gap-2">
                          <Reply className="w-4 h-4 text-[#0D9488] flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-medium text-[#0D9488]">
                              Provider Response
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {review.reply}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Helpful Count */}
                    <div className="flex items-center gap-2 mt-3 text-sm text-gray-400">
                      <ThumbsUp className="w-3 h-3" />
                      <span>{review.helpfulCount || 0} found this helpful</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Load More */}
          {hasMore && (
            <div className="text-center pt-4">
              <Button
                onClick={loadMore}
                disabled={loadingMore}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-[#0D9488] to-[#F59E0B] text-white font-semibold shadow-lg shadow-[#0D9488]/30 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                    Loading...
                  </>
                ) : (
                  'Load More Reviews'
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Reviews;