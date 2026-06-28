// src/pages/TourDetails.jsx

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin, Clock, Users, Star, Loader2, Sparkles, Calendar,
  CheckCircle, X, ChevronLeft, ChevronRight, Play, Shield,
  Award, Mail, Phone, Building2, ThumbsUp, Heart, Share2,
  Video, Info, List, Check, Camera, CreditCard,
  UserCheck, ZoomIn, Maximize, Minimize, Verified,
  Image as ImageIcon, MessageCircle, Send,
} from 'lucide-react';

import { getTourById } from '../services/tourService';
import { createCheckout } from '../services/paymentService';
import { useAuth } from '../contexts/AuthContext';
import { getTourReviews, createReview, toggleHelpful } from "../services/reviewService";
import { toggleLike } from '../services/tourService';

// ─── Brand tokens ───────────────────────────────────────────────
const C = {
  teal:  '#0D9488',
  gold:  '#F59E0B',
  slate: '#374151',
  white: '#FFFFFF',
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ─── Helpers ────────────────────────────────────────────────────
const toUrl = (img) => {
  if (!img) return '/placeholder-tour.jpg';
  if (img.startsWith('http') || img.startsWith('/')) return img;
  return `${API_URL}/uploads/${img}`;
};

const buildGallery = (tour) => {
  const seen = new Set();
  const push = (src) => {
    if (src && !seen.has(src)) { seen.add(src); return true; }
    return false;
  };
  const out = [];
  if (push(tour.coverImage))  out.push(tour.coverImage);
  (tour.galleryImages || []).forEach(i => push(i) && out.push(i));
  (tour.images       || []).forEach(i => push(i) && out.push(i));
  return out;
};

const buildVideos = (tour) => {
  if (Array.isArray(tour.videos) && tour.videos.length) return tour.videos;
  if (tour.video) return [tour.video];
  return [];
};

const toVideoUrl = (v) => {
  if (!v) return '';
  if (v.startsWith('http') || v.startsWith('/')) return v;
  return `${API_URL}/uploads/${v}`;
};

// ================================================================
// HERO MEDIA AREA (unchanged)
// ================================================================
const HeroMediaArea = ({ 
  images = [], 
  videos = [], 
  title = '',
  initialIndex = 0,
  onIndexChange,
}) => {
  // ... (same as before)
  // [Keep the existing HeroMediaArea code]
};

// ================================================================
// GALLERY THUMBNAILS (unchanged)
// ================================================================
const GalleryThumbnails = ({ images = [], onSelect, title = '' }) => {
  // ... (same as before)
};

// ================================================================
// VIDEO GALLERY (unchanged)
// ================================================================
const VideoGallery = ({ videos = [], onSelect }) => {
  // ... (same as before)
};

// ================================================================
// PROVIDER CARD (unchanged)
// ================================================================
const ProviderCard = ({ provider }) => {
  // ... (same as before)
};

// ================================================================
// TRUST BADGES (unchanged)
// ================================================================
const TrustBadges = () => {
  // ... (same as before)
};

// ================================================================
// REVIEWS SECTION (NEW)
// ================================================================
const ReviewsSection = ({ tourId, reviews, onReviewAdded, loading }) => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [helpfulLoading, setHelpfulLoading] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to leave a review');
      return;
    }
    if (!formData.comment.trim()) {
      alert('Please write a review');
      return;
    }

    try {
      setSubmitting(true);
      await createReview({
        tourId,
        rating: formData.rating,
        comment: formData.comment,
      });
      setFormData({ rating: 5, comment: '' });
      setShowForm(false);
      onReviewAdded();
    } catch (error) {
      console.error('Error creating review:', error);
      alert(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleHelpful = async (reviewId) => {
    if (!user) {
      alert('Please login to mark as helpful');
      return;
    }
    try {
      setHelpfulLoading(reviewId);
      await toggleHelpful(reviewId);
      onReviewAdded();
    } catch (error) {
      console.error('Error marking helpful:', error);
    } finally {
      setHelpfulLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-[#0D9488]" />
      </div>
    );
  }

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-6 border border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-6 h-6 text-[#0D9488]" />
          <h2 className="text-2xl font-bold text-[#374151] dark:text-white">
            Reviews
          </h2>
          {reviews.length > 0 && (
            <span className="text-sm text-gray-500">
              ({reviews.length} • ⭐ {averageRating})
            </span>
          )}
        </div>
        {user && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-xl bg-[#0D9488] text-white text-sm font-medium hover:bg-[#0D9488]/80 transition"
          >
            {showForm ? 'Cancel' : 'Write Review'}
          </button>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rating
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= formData.rating
                        ? 'text-[#F59E0B] fill-[#F59E0B]'
                        : 'text-gray-300 dark:text-gray-600'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Comment
            </label>
            <textarea
              rows="3"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              placeholder="Share your experience..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition outline-none resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0D9488] to-[#F59E0B] text-white font-medium shadow-lg shadow-[#0D9488]/30 hover:scale-[1.02] transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Review
              </>
            )}
          </button>
        </form>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <MessageCircle className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p>No reviews yet. Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0D9488] to-[#F59E0B] flex items-center justify-center text-white font-bold text-sm">
                    {review.user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#374151] dark:text-white">
                      {review.user?.name || 'Anonymous'}
                    </h4>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < review.rating
                              ? 'text-[#F59E0B] fill-[#F59E0B]'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {review.comment}
              </p>
              <div className="mt-2 flex items-center gap-4">
                <button
                  onClick={() => handleHelpful(review._id)}
                  disabled={helpfulLoading === review._id}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#0D9488] transition"
                >
                  {helpfulLoading === review._id ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <>
                      <ThumbsUp className="w-3 h-3" />
                      Helpful ({review.helpfulCount || 0})
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ================================================================
// BOOKING MODAL (unchanged)
// ================================================================
const BookingModal = ({ tour, onClose }) => {
  // ... (same as before)
};

// ================================================================
// MAIN PAGE
// ================================================================
const TABS = [
  { id: 'about',        label: 'About',        Icon: Info     },
  { id: 'highlights',   label: 'Highlights',   Icon: Sparkles },
  { id: 'included',     label: 'Included',     Icon: Check    },
  { id: 'requirements', label: 'Requirements', Icon: List     },
];

const TourDetails = () => {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { user }     = useAuth();
  const [tour,       setTour]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [activeTab,  setActiveTab]  = useState('about');
  const [showBooking, setShowBooking] = useState(false);
  const [saved,      setSaved]      = useState(false);
  const [heroIndex,  setHeroIndex]  = useState(0);
  const [reviews,    setReviews]    = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchTourData();
  }, [id]);

  const fetchTourData = async () => {
    try {
      setLoading(true);
      const data = await getTourById(id);
      setTour(data.tour);
      
      // Fetch reviews
      await fetchReviews();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setReviewLoading(true);
      const data = await getTourReviews(id);
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleGallerySelect = (index) => {
    setHeroIndex(index);
    const heroElement = document.querySelector('.hero-media-container');
    if (heroElement) {
      heroElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleVideoSelect = (index) => {
    const galleryLength = tour ? buildGallery(tour).length : 0;
    setHeroIndex(galleryLength + index);
    const heroElement = document.querySelector('.hero-media-container');
    if (heroElement) {
      heroElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="relative w-20 h-20">
        <div className="w-20 h-20 rounded-full border-4 border-[#0D9488]/20" />
        <div className="absolute inset-0 rounded-full border-4 border-[#0D9488] border-t-transparent animate-spin" />
      </div>
      <p className="mt-6 text-lg font-semibold text-[#374151] dark:text-white">Loading Tour...</p>
    </div>
  );

  if (!tour) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 text-center p-6">
      <div className="w-24 h-24 mx-auto rounded-full bg-[#0D9488]/10 flex items-center justify-center mb-6">
        <MapPin className="w-12 h-12 text-[#0D9488]" />
      </div>
      <h1 className="text-3xl font-bold text-[#374151] dark:text-white mb-2">Tour Not Found</h1>
      <p className="text-gray-500 dark:text-gray-400">The tour you're looking for doesn't exist.</p>
      <button onClick={() => navigate('/explore')} className="mt-6 px-6 py-3 rounded-xl bg-[#0D9488] text-white font-bold hover:bg-[#0D9488]/90 transition">
        Browse Tours
      </button>
    </div>
  );

  const gallery   = buildGallery(tour);
  const videos    = buildVideos(tour);
  const isPending = tour.status === 'pending';
  
  // Use averageRating from backend
  const rating = tour.averageRating || 0;
  const ratingDisplay = rating > 0 ? rating.toFixed(1) : 'New';

  const tabContent = {
    about:        { title: 'About This Tour',      body: tour.description  || 'No description available.'  },
    highlights:   { title: 'Tour Highlights',       body: tour.highlights   || 'No highlights listed.'      },
    included:     { title: 'Included Services',     body: tour.included     || 'No included services listed.' },
    requirements: { title: 'Tour Requirements',     body: tour.requirements || 'No specific requirements.'  },
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

        {/* ── HERO SECTION ── FIXED/STICKY AT TOP ── */}
        <div className="hero-media-container sticky top-0 z-20 bg-gray-50 dark:bg-gray-950 shadow-lg border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <HeroMediaArea 
              images={gallery} 
              videos={videos} 
              title={tour.title}
              initialIndex={heroIndex}
              onIndexChange={setHeroIndex}
            />
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT COLUMN */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Gallery Thumbnails */}
              {gallery.length > 1 && (
                <GalleryThumbnails 
                  images={gallery} 
                  title={tour.title}
                  onSelect={handleGallerySelect}
                />
              )}

              {/* Video Gallery */}
              {videos.length > 0 && (
                <VideoGallery 
                  videos={videos} 
                  onSelect={handleVideoSelect}
                />
              )}

              {/* Provider Profile */}
              {tour.provider && <ProviderCard provider={tour.provider} />}

              {/* Tabs */}
              <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
                {TABS.map(({ id: tid, label, Icon }) => (
                  <button
                    key={tid}
                    onClick={() => setActiveTab(tid)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      activeTab === tid
                        ? 'bg-[#0D9488] text-white shadow-lg shadow-[#0D9488]/25'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Tab Panel */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-6 border border-gray-100 dark:border-gray-800">
                <h2 className="text-2xl font-bold text-[#374151] dark:text-white mb-4">{tabContent[activeTab].title}</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">{tabContent[activeTab].body}</p>
              </div>

              {/* Reviews Section */}
              <ReviewsSection 
                tourId={tour._id}
                reviews={reviews}
                onReviewAdded={fetchReviews}
                loading={reviewLoading}
              />
            </div>

            {/* RIGHT COLUMN - Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                  
                  {/* Price Header */}
                  <div className="bg-gradient-to-r from-[#0D9488] to-[#0f766e] p-6">
                    <div className="flex items-end gap-2 mb-1">
                      <span className="text-4xl font-bold text-white">${tour.price}</span>
                      <span className="text-white/70 text-sm mb-1">per person</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/60 text-xs">
                      <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                      <span>{ratingDisplay}</span>
                      <span>•</span>
                      <span>{reviews.length} reviews</span>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Tour Meta */}
                    <div className="space-y-3 text-sm">
                      {[
                        { label: 'Location', value: tour.location  },
                        { label: 'Duration', value: tour.duration  },
                        { label: 'Max Travelers', value: `${tour.travelers} people` },
                        { label: 'Status', value: tour.status || 'approved', isStatus: true },
                      ].map(({ label, value, isStatus }) => value && (
                        <div key={label} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                          <span className="text-gray-500">{label}</span>
                          {isStatus ? (
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              tour.status === 'approved' || !tour.status ? 'bg-[#0D9488]/10 text-[#0D9488]'
                              : tour.status === 'pending' ? 'bg-[#F59E0B]/10 text-[#F59E0B]'
                              : 'bg-red-100 text-red-600'
                            }`}>{value}</span>
                          ) : (
                            <span className="font-medium text-[#374151] dark:text-white text-right max-w-[55%]">{value}</span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => !isPending && setShowBooking(true)}
                      disabled={isPending}
                      className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#0D9488] to-[#F59E0B] text-white font-bold text-lg hover:scale-[1.02] transition-all duration-300 shadow-xl shadow-[#0D9488]/25 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                    >
                      {isPending ? <><Clock className="w-5 h-5" /> Pending Approval</> : <><Sparkles className="w-5 h-5" /> Book Now</>}
                    </button>

                    <p className="text-center text-xs text-gray-400">No payment charged until confirmed</p>
                  </div>
                </div>

                <TrustBadges />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && <BookingModal tour={tour} onClose={() => setShowBooking(false)} />}
    </>
  );
};

export default TourDetails;