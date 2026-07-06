// src/pages/provider/Reviews.jsx

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
  ClipboardList, // ✅ Added for Listings
} from 'lucide-react';
import Card, { CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ReviewCard from '../../components/ReviewCard';
import { getProviderReviews } from '../../services/reviewService';
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
  const [stats, setStats] = useState({
    average: 0,
    total: 0,
    byListing: {}, // ✅ Changed from byTour
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
      const data = await getProviderReviews();
      const reviewsList = data.reviews || [];
      setReviews(reviewsList);
      setFilteredReviews(reviewsList);

      // Calculate stats
      if (reviewsList.length > 0) {
        const total = reviewsList.length;
        const sum = reviewsList.reduce((acc, r) => acc + r.rating, 0);
        const avg = (sum / total).toFixed(1);

        // ✅ Updated: Group by listing instead of tour
        const byListing = {};
        reviewsList.forEach(r => {
          // ✅ Support both listing and tour for backward compatibility
          const listingId = r.listing?._id || r.tour?._id;
          const listingTitle = r.listing?.title || r.tour?.title || 'Unknown Listing';
          if (listingId) {
            if (!byListing[listingId]) {
              byListing[listingId] = { title: listingTitle, count: 0, sum: 0 };
            }
            byListing[listingId].count++;
            byListing[listingId].sum += r.rating;
          }
        });

        setStats({ average: avg, total, byListing });
      }
    } catch (error) {
      console.error('Error fetching provider reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterReviews = () => {
    let filtered = [...reviews];

    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.listing?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.tour?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (ratingFilter !== 'all') {
      filtered = filtered.filter(r => r.rating === parseInt(ratingFilter));
    }

    setFilteredReviews(filtered);
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

  return (
    <div className="space-y-6 animate-fade-in px-4 py-6 max-w-5xl mx-auto">

      {/* HEADER - ✅ Updated */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#F59E0B] flex items-center justify-center shadow-lg">
            <Star className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#374151] dark:text-white">
              Reviews on My Listings {/* ✅ Changed from "My Tours" */}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              See what travelers are saying about your listings {/* ✅ Changed from "tours" */}
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              <ClipboardList className="w-5 h-5 text-[#0D9488]" /> {/* ✅ Changed from TrendingUp */}
              <span className="text-2xl font-bold text-[#374151] dark:text-white">
                {Object.keys(stats.byListing).length} {/* ✅ Changed from byTour */}
              </span>
            </div>
            <p className="text-xs text-gray-500">Listings with Reviews</p> {/* ✅ Changed from "Tours with Reviews" */}
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
        </div>
      )}

      {/* LISTING BREAKDOWN - ✅ Updated */}
      {Object.keys(stats.byListing).length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
          <h3 className="font-semibold text-[#374151] dark:text-white mb-3">
            Reviews by Listing {/* ✅ Changed from "Reviews by Tour" */}
          </h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(stats.byListing).map(([id, data]) => (
              <Link
                key={id}
                to={`/listing/${id}`} // ✅ Changed from /tour/${id}
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

      {/* SEARCH & FILTER - ✅ Updated placeholder */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search reviews by traveler or listing..." // ✅ Changed from "tour"
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

      {/* EMPTY STATE - ✅ Updated */}
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
              : 'Reviews will appear here once travelers review your listings'} {/* ✅ Changed from "tours" */}
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