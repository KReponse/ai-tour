// src/pages/Reviews.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import { 
  Star, 
  ThumbsUp, 
  Loader2, 
  MessageCircle,
  Sparkles,
  User,
  Calendar,
  TrendingUp,
  Award,
  Heart,
} from "lucide-react";
import Card, { CardContent } from "../components/ui/Card";

// ===============================
// AI TOUR COLORS
// ===============================
// Teal  : #0D9488
// Gold  : #F59E0B
// Slate : #374151
// White : #FFFFFF
// ===============================

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api/reviews";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    average: 0,
    total: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(API, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const reviewsData = data.reviews || [];
      setReviews(reviewsData);

      // Calculate stats
      if (reviewsData.length > 0) {
        const total = reviewsData.length;
        const sum = reviewsData.reduce((acc, r) => acc + r.rating, 0);
        const avg = (sum / total).toFixed(1);

        const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviewsData.forEach(r => {
          if (dist[r.rating]) dist[r.rating]++;
        });

        setStats({ average: avg, total, distribution: dist });
      }
    } catch (error) {
      console.log("Reviews error:", error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? "text-[#F59E0B] fill-[#F59E0B]"
            : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ));
  };

  const handleHelpful = async (reviewId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API}/${reviewId}/helpful`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update local state
      setReviews(prev =>
        prev.map(r =>
          r._id === reviewId
            ? { ...r, helpful: (r.helpful || 0) + 1 }
            : r
        )
      );
    } catch (error) {
      console.error("Failed to mark helpful:", error);
    }
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
    <div className="space-y-6 animate-fade-in px-4 py-6 max-w-4xl mx-auto">

      {/* HEADER - Updated with AI Tour colors */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#F59E0B] flex items-center justify-center shadow-lg">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#374151] dark:text-white">
            Traveler Reviews
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Real experiences from travelers across Rwanda & beyond
          </p>
        </div>
      </div>

      {/* STATS - Updated with AI Tour colors */}
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
              <TrendingUp className="w-5 h-5 text-[#0D9488]" />
              <span className="text-2xl font-bold text-[#374151] dark:text-white">
                {stats.distribution[5] || 0}
              </span>
            </div>
            <p className="text-xs text-gray-500">5-Star Reviews</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#F59E0B]" />
              <span className="text-2xl font-bold text-[#374151] dark:text-white">
                {Math.round((stats.distribution[4] + stats.distribution[5]) / stats.total * 100)}%
              </span>
            </div>
            <p className="text-xs text-gray-500">Recommend Rate</p>
          </div>
        </div>
      )}

      {/* EMPTY STATE - Updated with AI Tour colors */}
      {reviews.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-16 text-center shadow-sm">
          <div className="w-20 h-20 rounded-full bg-[#0D9488]/10 flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-10 h-10 text-[#0D9488]" />
          </div>
          <h2 className="text-2xl font-bold text-[#374151] dark:text-white">
            No Reviews Yet
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Reviews will appear once travelers start sharing experiences.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card
              key={review._id}
              className="hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden"
            >
              <CardContent className="p-6">
                {/* TOP - Updated with AI Tour colors */}
                <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0D9488] to-[#F59E0B] flex items-center justify-center text-white font-bold text-sm">
                        {review.user?.name?.charAt(0) || 'A'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#374151] dark:text-white">
                          {review.user?.name || "Anonymous"}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {review.tour?.title || review.destination || 'Tour'}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                    <span className="ml-2 font-semibold text-[#374151] dark:text-white">
                      {review.rating}
                    </span>
                  </div>
                </div>

                {/* COMMENT */}
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                  {review.comment}
                </p>

                {/* BOTTOM - Updated with AI Tour colors */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <button
                    onClick={() => handleHelpful(review._id)}
                    className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[#0D9488] transition-all duration-300 group"
                  >
                    <ThumbsUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">
                      Helpful ({review.helpful || 0})
                    </span>
                  </button>

                  {review.rating >= 4 && (
                    <span className="flex items-center gap-1 text-xs text-[#0D9488] bg-[#0D9488]/10 px-3 py-1 rounded-full">
                      <Heart className="w-3 h-3" />
                      Recommended
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;