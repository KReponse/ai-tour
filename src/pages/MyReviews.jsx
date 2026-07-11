// frontend/src/pages/MyReviews.jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  MessageCircle,
  Sparkles,
  Loader2,
  Search,
  Filter,
  Edit2,
  Trash2,
  ThumbsUp,
  Calendar,
  MapPin,
  ChevronDown,
  X,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import ReviewCard from '../components/ReviewCard';
import ReviewForm from '../components/ReviewForm';
import { getMyReviews, deleteReview, updateReview } from '../services/reviewService';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

// ===============================
// AI TOUR COLORS
// ===============================
// Teal  : #0D9488
// Gold  : #F59E0B
// Slate : #374151
// White : #FFFFFF
// ===============================

const MyReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingReview, setEditingReview] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    filterReviews();
  }, [reviews, searchTerm, ratingFilter, statusFilter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMyReviews();
      setReviews(data.reviews || []);
      setFilteredReviews(data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError(error.response?.data?.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const filterReviews = () => {
    let filtered = [...reviews];

    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.listing?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.tour?.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (ratingFilter !== 'all') {
      filtered = filtered.filter(r => r.rating === parseInt(ratingFilter));
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }

    setFilteredReviews(filtered);
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    
    try {
      await deleteReview(reviewId);
      await fetchReviews();
      toast.success('Review deleted successfully');
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error(error.response?.data?.message || 'Failed to delete review');
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setShowForm(true);
  };

  // ✅ FIXED: Update review without sending bookingId
  const handleSubmit = async (data) => {
    try {
      setSubmitting(true);
      
      await updateReview(editingReview._id, {
        rating: data.rating,
        title: data.title || editingReview.title,
        comment: data.comment,
      });
      
      setShowForm(false);
      setEditingReview(null);
      await fetchReviews();
      toast.success('Review updated successfully');
    } catch (error) {
      console.error('Error updating review:', error);
      toast.error(error.response?.data?.message || 'Failed to update review');
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Get status badge color
  const getStatusBadge = (status) => {
    const map = {
      'pending': { bg: 'bg-[#F59E0B]/10', text: 'text-[#F59E0B]', label: 'Pending' },
      'published': { bg: 'bg-[#0D9488]/10', text: 'text-[#0D9488]', label: 'Published' },
      'hidden': { bg: 'bg-gray-100', text: 'text-gray-500', label: 'Hidden' },
      'deleted': { bg: 'bg-red-100', text: 'text-red-500', label: 'Deleted' },
      'flagged': { bg: 'bg-red-100', text: 'text-red-500', label: 'Flagged' },
    };
    return map[status] || map['pending'];
  };

  // ✅ Get stats
  const getStats = () => {
    const total = reviews.length;
    const published = reviews.filter(r => r.status === 'published').length;
    const pending = reviews.filter(r => r.status === 'pending').length;
    const hidden = reviews.filter(r => r.status === 'hidden').length;
    const avgRating = total > 0 
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1)
      : 0;
    return { total, published, pending, hidden, avgRating };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px]">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488]/20" />
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488] border-t-transparent animate-spin" />
        </div>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading your reviews...</p>
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
              My Reviews
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage your reviews and feedback
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
                {stats.avgRating}
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
              <CheckCircle className="w-5 h-5 text-[#0D9488]" />
              <span className="text-2xl font-bold text-[#0D9488]">
                {stats.published}
              </span>
            </div>
            <p className="text-xs text-gray-500">Published</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#F59E0B]" />
              <span className="text-2xl font-bold text-[#F59E0B]">
                {stats.pending}
              </span>
            </div>
            <p className="text-xs text-gray-500">Pending</p>
          </div>
        </div>
      )}

      {/* SEARCH & FILTER */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search your reviews..."
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
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-12 px-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="published">Published</option>
          <option value="hidden">Hidden</option>
          <option value="deleted">Deleted</option>
        </select>
      </div>

      {/* EMPTY STATE */}
      {filteredReviews.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-16 text-center shadow-sm">
          <div className="w-20 h-20 rounded-full bg-[#0D9488]/10 flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-10 h-10 text-[#0D9488]" />
          </div>
          <h2 className="text-2xl font-bold text-[#374151] dark:text-white mb-2">
            {searchTerm || ratingFilter !== 'all' || statusFilter !== 'all' ? 'No Reviews Found' : 'No Reviews Yet'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm || ratingFilter !== 'all' || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Start exploring tours and leave your first review!'}
          </p>
          <Link to="/explore">
            <Button className="mt-6 bg-gradient-to-r from-[#0D9488] to-[#F59E0B] text-white">
              Explore Tours
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => {
            const statusBadge = getStatusBadge(review.status);
            const canEdit = review.status !== 'deleted' && review.status !== 'hidden';
            
            return (
              <div key={review._id} className="relative">
                <div className="absolute top-4 right-4 z-10">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge.bg} ${statusBadge.text}`}>
                    {statusBadge.label}
                  </span>
                </div>
                
                <ReviewCard
                  review={review}
                  onEdit={() => canEdit && handleEdit(review)}
                  onDelete={() => canEdit && handleDelete(review._id)}
                  onHelpfulToggle={() => fetchReviews()}
                  showActions={canEdit}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* EDIT FORM MODAL */}
      {showForm && editingReview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full">
            <ReviewForm
              initialData={editingReview}
              tourId={editingReview.tour?._id || editingReview.listing?._id}
              tourTitle={editingReview.tour?.title || editingReview.listing?.title}
              isEditing={true}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingReview(null);
              }}
              isLoading={submitting}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReviews;