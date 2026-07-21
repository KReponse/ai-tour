// frontend/src/pages/Review.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Loader2, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { getBookingById } from '../services/bookingService';
import { createReview, getReviewByBooking } from '../services/reviewService';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Review = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // ✅ Debug: Log the bookingId from URL
  console.log('🔍 Review page - bookingId from URL:', bookingId);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState(null);
  const [existingReview, setExistingReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // ✅ Check if bookingId exists and is valid
    if (!bookingId || bookingId === 'undefined' || bookingId === 'null' || bookingId === ':bookingId') {
      setError('Invalid booking ID. Please go back and try again.');
      setLoading(false);
      return;
    }
    
    // ✅ Check if bookingId is a valid MongoDB ObjectId (24 hex characters)
    if (!/^[0-9a-fA-F]{24}$/.test(bookingId)) {
      setError('Invalid booking ID format. Please go back and try again.');
      setLoading(false);
      return;
    }
    
    fetchData();
  }, [bookingId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to leave a review');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      console.log('📤 Fetching booking with ID:', bookingId);
      
      const bookingData = await getBookingById(bookingId, token);
      console.log('✅ Booking data:', bookingData);
      
      if (!bookingData || !bookingData.booking) {
        setError('Booking not found');
        setLoading(false);
        return;
      }
      
      setBooking(bookingData.booking);

      // ✅ Check if review already exists - handle 404 gracefully
      try {
        const reviewData = await getReviewByBooking(bookingId);
        if (reviewData && reviewData.review) {
          setExistingReview(reviewData.review);
          setRating(reviewData.review.rating);
          setTitle(reviewData.review.title || '');
          setComment(reviewData.review.comment);
          console.log('✅ Existing review found');
        }
      } catch (error) {
        if (error.response?.status === 404) {
          console.log('ℹ️ No existing review found - user can create one');
        } else {
          console.error('Error checking for existing review:', error);
          setError(error.response?.data?.message || 'Failed to check existing review');
        }
      }

    } catch (error) {
      console.error('❌ Error fetching data:', error);
      setError(error.response?.data?.message || 'Failed to load review data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!title.trim()) {
      toast.error('Please enter a review title');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      
      const reviewData = {
        bookingId: bookingId,
        rating: rating,
        title: title.trim(),
        comment: comment.trim()
      };

      console.log('📤 Submitting review:', reviewData);
      
      const response = await createReview(reviewData);
      console.log('✅ Review submitted:', response);
      
      toast.success('Review submitted successfully! 🎉');
      navigate(`/booking-details/${bookingId}`);
    } catch (error) {
      console.error('❌ Error submitting review:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const getEntityTitle = () => {
    if (!booking) return 'Experience';
    return booking.listing?.title || booking.tour?.title || 'Experience';
  };

  const canReview = booking?.status === 'completed' || booking?.status === 'review_eligible';
  const alreadyReviewed = existingReview && existingReview._id;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950">
        <Loader2 className="w-10 h-10 animate-spin text-[#0D9488]" />
        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
        <div className="max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#374151] dark:text-white mb-2">
            Something Went Wrong
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-2xl bg-[#0D9488] text-white font-bold hover:bg-[#0D9488]/80 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#374151] dark:text-white">Booking Not Found</h2>
          <button
            onClick={() => navigate('/my-bookings')}
            className="mt-4 px-6 py-3 rounded-2xl bg-[#0D9488] text-white font-bold hover:bg-[#0D9488]/80 transition"
          >
            View My Bookings
          </button>
        </div>
      </div>
    );
  }

  if (!canReview) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
        <div className="max-w-md w-full text-center bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-lg border border-gray-200 dark:border-gray-800">
          <AlertCircle className="w-16 h-16 text-[#F59E0B] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#374151] dark:text-white mb-2">
            Not Yet Reviewable
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            This booking must be completed before you can leave a review.
            Current status: <span className="font-medium">{booking.status}</span>
          </p>
          <button
            onClick={() => navigate(`/booking-details/${bookingId}`)}
            className="px-6 py-3 rounded-2xl bg-[#0D9488] text-white font-bold hover:bg-[#0D9488]/80 transition"
          >
            View Booking Details
          </button>
        </div>
      </div>
    );
  }

  if (alreadyReviewed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
        <div className="max-w-md w-full text-center bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-lg border border-gray-200 dark:border-gray-800">
          <CheckCircle className="w-16 h-16 text-[#0D9488] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#374151] dark:text-white mb-2">
            Review Already Submitted
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            You have already reviewed this experience.
          </p>
          <button
            onClick={() => navigate(`/booking-details/${bookingId}`)}
            className="px-6 py-3 rounded-2xl bg-[#0D9488] text-white font-bold hover:bg-[#0D9488]/80 transition"
          >
            View Booking Details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-[#0D9488] transition mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 md:p-8">
          <h1 className="text-2xl font-bold text-[#374151] dark:text-white mb-2">
            Leave a Review
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Share your experience with "{getEntityTitle()}"
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating Stars */}
            <div>
              <label className="block text-sm font-semibold text-[#374151] dark:text-white mb-3">
                Your Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 ${
                        star <= (hoverRating || rating)
                          ? 'text-[#F59E0B] fill-[#F59E0B]'
                          : 'text-gray-300 dark:text-gray-600'
                      } transition-colors duration-200`}
                    />
                  </button>
                ))}
                <span className="ml-3 text-sm text-gray-500 flex items-center">
                  {rating > 0 ? `${rating} / 5` : 'Select a rating'}
                </span>
              </div>
            </div>

            {/* Title Input */}
            <div>
              <label className="block text-sm font-semibold text-[#374151] dark:text-white mb-3">
                Review Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summarize your experience (e.g., 'Amazing Adventure!')"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition outline-none"
                maxLength={100}
                required
              />
              <p className="mt-1 text-xs text-gray-400">
                {title.length} / 100 characters
              </p>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-semibold text-[#374151] dark:text-white mb-3">
                Your Review
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="6"
                placeholder="Tell us about your experience..."
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[#374151] dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition outline-none resize-none"
                maxLength={2000}
                required
              />
              <p className="mt-2 text-sm text-gray-400">
                {comment.length} / 2000 characters
              </p>
            </div>

            {booking && booking.paymentStatus === 'paid' && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#0D9488]/5 border border-[#0D9488]/20">
                <CheckCircle className="w-5 h-5 text-[#0D9488]" />
                <span className="text-sm text-[#0D9488] font-medium">
                  Verified Booking ✓
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || rating === 0 || !title.trim() || !comment.trim()}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#0D9488] to-[#F59E0B] text-white font-bold text-lg shadow-lg shadow-[#0D9488]/30 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Review'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Review;