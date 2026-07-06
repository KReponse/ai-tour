// src/pages/ListingDetails.jsx

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Users,
  Star,
  Loader2,
  Sparkles,
  Calendar,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Shield,
  Award,
  Mail,
  Phone,
  Building2,
  ThumbsUp,
  Heart,
  Share2,
  Video,
  Info,
  List,
  Check,
  Camera,
  CreditCard,
  UserCheck,
  ZoomIn,
  Maximize,
  Minimize,
  Verified,
  Globe,
  Image as ImageIcon,
  MessageCircle,
  Send,
  Eye,
  Pause,
  Utensils,
  Bed,
  Car,
  Music,
  ShoppingBag,
  DollarSign,
} from 'lucide-react';

import { getListingById, toggleLike } from '../services/listingService';
import { getPublicProviderProfile } from '../services/providerService';
import { createCheckout } from '../services/paymentService';
import { useAuth } from '../contexts/AuthContext';
import { getTourReviews, createReview, toggleHelpful } from '../services/reviewService';
import { BIZ_CONFIG, getBusinessConfig } from '../config/listingConfigs';
import ReviewCard from '../components/ReviewCard';
import ReviewForm from '../components/ReviewForm';


// ─── Brand tokens ───────────────────────────────────────────────
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ─── Helpers ────────────────────────────────────────────────────
const toUrl = (img) => {
  if (!img) return '/placeholder-tour.jpg';
  if (img.startsWith('http') || img.startsWith('/')) return img;
  return `${API_URL}/uploads/${img}`;
};

const buildGallery = (listing) => {
  const seen = new Set();
  const push = (src) => {
    if (src && !seen.has(src)) { seen.add(src); return true; }
    return false;
  };
  const out = [];
  if (push(listing.coverImage)) out.push(listing.coverImage);
  (listing.galleryImages || []).forEach(i => push(i) && out.push(i));
  return out;
};

const buildVideos = (listing) => {
  if (Array.isArray(listing.videos) && listing.videos.length) return listing.videos;
  if (listing.video) return [listing.video];
  return [];
};

const toVideoUrl = (v) => {
  if (!v) return '';
  if (v.startsWith('http') || v.startsWith('/')) return v;
  return `${API_URL}/uploads/${v}`;
};

// ─── Get Business Config ────────────────────────────────────────
const getBusinessIcon = (businessType) => {
  const config = getBusinessConfig(businessType);
  return config?.icon || Building2;
};

const getBusinessLabel = (businessType) => {
  const config = getBusinessConfig(businessType);
  return config?.label || 'Service Provider';
};

// ================================================================
// HERO MEDIA AREA
// ================================================================
const HeroMediaArea = ({
  images = [],
  videos = [],
  title = '',
  initialIndex = 0,
  onIndexChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const allMedia = [...images, ...videos.map(v => ({ video: true, url: v }))];
  const currentItem = allMedia[currentIndex] || allMedia[0] || null;

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const handlePrev = () => {
    const newIndex = (currentIndex - 1 + allMedia.length) % allMedia.length;
    setCurrentIndex(newIndex);
    if (onIndexChange) onIndexChange(newIndex);
  };

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % allMedia.length;
    setCurrentIndex(newIndex);
    if (onIndexChange) onIndexChange(newIndex);
  };

  const renderMedia = () => {
    if (!currentItem) {
      return (
        <div className="w-full h-[400px] bg-gray-200 dark:bg-gray-800 flex items-center justify-center rounded-2xl">
          <ImageIcon className="w-16 h-16 text-gray-400" />
          <span className="ml-2 text-gray-400">No media available</span>
        </div>
      );
    }

    if (currentItem.video) {
      return (
        <div className="relative w-full h-[400px] bg-black rounded-2xl overflow-hidden">
          <video
            src={toVideoUrl(currentItem.url)}
            className="w-full h-full object-contain"
            controls
            autoPlay
            playsInline
          />
        </div>
      );
    }

    return (
      <div className="relative w-full h-[400px] bg-gray-200 dark:bg-gray-800 rounded-2xl overflow-hidden">
        <img
          src={toUrl(currentItem)}
          alt={title}
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute bottom-4 right-4 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition"
        >
          <Maximize className="w-5 h-5" />
        </button>
      </div>
    );
  };

  return (
    <>
      <div className="relative">
        {renderMedia()}
        
        {allMedia.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {allMedia.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                if (onIndexChange) onIndexChange(index);
              }}
              className={`w-2 h-2 rounded-full transition ${
                index === currentIndex ? 'bg-white w-4' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full transition z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={toUrl(currentItem)}
              alt={title}
              className="w-full h-auto max-h-[80vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
};

// ================================================================
// GALLERY THUMBNAILS
// ================================================================
const GalleryThumbnails = ({ images = [], onSelect, title = '' }) => {
  if (images.length <= 1) return null;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-4 border border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-2 mb-3">
        <Camera className="w-5 h-5 text-[#0D9488]" />
        <h3 className="font-semibold text-[#374151] dark:text-white">Gallery</h3>
        <span className="text-sm text-gray-400">({images.length} photos)</span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => onSelect(index)}
            className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden snap-start hover:ring-2 hover:ring-[#0D9488] transition"
          >
            <img
              src={toUrl(img)}
              alt={`${title} - ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

// ================================================================
// VIDEO GALLERY
// ================================================================
const VideoGallery = ({ videos = [], onSelect }) => {
  if (videos.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-4 border border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-2 mb-3">
        <Video className="w-5 h-5 text-[#0D9488]" />
        <h3 className="font-semibold text-[#374151] dark:text-white">Videos</h3>
        <span className="text-sm text-gray-400">({videos.length} videos)</span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
        {videos.map((video, index) => (
          <button
            key={index}
            onClick={() => onSelect(index)}
            className="flex-shrink-0 w-48 rounded-xl overflow-hidden snap-start hover:ring-2 hover:ring-[#0D9488] transition relative group"
          >
            <div className="relative w-full h-28 bg-gray-800">
              <Play className="absolute inset-0 m-auto w-8 h-8 text-white/80 group-hover:text-white transition" />
              <div className="absolute bottom-1 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                Video {index + 1}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// ================================================================
// PROVIDER CARD - ENHANCED with Contact Modal
// ================================================================
const ProviderCard = ({ provider }) => {
  const [showContact, setShowContact] = useState(false);
  const navigate = useNavigate();
  const [publicProfile, setPublicProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  if (!provider) return null;

  const fetchPublicProfile = async () => {
    try {
      setLoadingProfile(true);
      const data = await getPublicProviderProfile(provider._id);
      if (data.success) {
        setPublicProfile(data.provider);
      }
    } catch (error) {
      console.error("❌ Error fetching provider profile:", error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleOpenModal = () => {
    setShowContact(true);
    fetchPublicProfile();
  };

  const displayName = provider.businessName || provider.name || 'Provider';
  const isVerified = provider.verificationStatus === 'approved' || provider.verified === true;
  const rating = provider.averageRating || 0;
  const totalReviews = provider.totalReviews || 0;
  const ratingDisplay = rating > 0 ? rating.toFixed(1) : 'New';

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-6 border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-[#0D9488] to-[#F59E0B] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
              {provider.avatar ? (
                <img
                  src={provider.avatar}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                displayName.charAt(0).toUpperCase()
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-[#374151] dark:text-white truncate">
                  {displayName}
                </h3>
                {isVerified && (
                  <span className="flex items-center gap-1 text-[#0D9488] text-xs font-medium flex-shrink-0">
                    <Verified className="w-4 h-4 fill-[#0D9488]" />
                    Verified
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                <span>Provider</span>
                {rating > 0 && (
                  <span className="flex items-center gap-1 text-[#F59E0B]">
                    <Star className="w-3.5 h-3.5 fill-[#F59E0B]" />
                    <span className="font-medium text-[#374151] dark:text-white">
                      {ratingDisplay}
                    </span>
                    <span className="text-gray-400 dark:text-gray-500 text-xs">
                      ({totalReviews})
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={handleOpenModal}
            className="px-5 py-2.5 rounded-xl bg-[#0D9488] text-white text-sm font-medium hover:bg-[#0f766e] transition flex-shrink-0 flex items-center gap-2 shadow-lg shadow-[#0D9488]/30 hover:scale-[1.02] transition-all duration-300"
          >
            <MessageCircle className="w-4 h-4" />
            Contact
          </button>
        </div>
      </div>

      {/* Contact Modal */}
      {showContact && (
        <>
          <div
            onClick={() => setShowContact(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto pointer-events-auto">
              {loadingProfile ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-[#0D9488]" />
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading profile...</p>
                </div>
              ) : publicProfile ? (
                <>
                  {/* Header */}
                  <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-[#0D9488] to-[#F59E0B] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                          {publicProfile.avatar ? (
                            <img src={publicProfile.avatar} alt={publicProfile.businessName} className="w-full h-full object-cover" />
                          ) : (
                            (publicProfile.businessName || "P").charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-[#374151] dark:text-white">
                            {publicProfile.businessName || publicProfile.name}
                          </h2>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            {publicProfile.verified && (
                              <span className="flex items-center gap-1 text-[#0D9488] text-sm">
                                <Verified className="w-4 h-4 fill-[#0D9488]" />
                                Verified Provider
                              </span>
                            )}
                            {publicProfile.averageRating > 0 && (
                              <span className="flex items-center gap-1 text-sm">
                                <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                                <span className="font-medium text-[#374151] dark:text-white">
                                  {publicProfile.averageRating.toFixed(1)}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400">
                                  ({publicProfile.totalReviews || 0} reviews)
                                </span>
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400 dark:text-gray-500 flex-wrap">
                            {publicProfile.city && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {publicProfile.city}{publicProfile.country ? `, ${publicProfile.country}` : ''}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Member since {new Date(publicProfile.createdAt).getFullYear()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowContact(false)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition flex-shrink-0"
                      >
                        <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  {publicProfile.description && (
                    <div className="px-6 pt-4">
                      <h4 className="text-sm font-semibold text-[#374151] dark:text-white mb-2">About</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {publicProfile.description}
                      </p>
                    </div>
                  )}

                  {/* Contact Info */}
                  <div className="p-6 space-y-3">
                    {publicProfile.email && (
                      <a href={`mailto:${publicProfile.email}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition group">
                        <div className="w-9 h-9 rounded-xl bg-[#0D9488]/10 flex items-center justify-center flex-shrink-0">
                          <Mail className="w-4 h-4 text-[#0D9488]" />
                        </div>
                        <span className="text-[#374151] dark:text-white group-hover:text-[#0D9488] transition truncate">
                          {publicProfile.email}
                        </span>
                      </a>
                    )}
                    {publicProfile.phone && (
                      <a href={`tel:${publicProfile.phone}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition group">
                        <div className="w-9 h-9 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center flex-shrink-0">
                          <Phone className="w-4 h-4 text-[#F59E0B]" />
                        </div>
                        <span className="text-[#374151] dark:text-white group-hover:text-[#F59E0B] transition">
                          {publicProfile.phone}
                        </span>
                      </a>
                    )}
                    {publicProfile.website && (
                      <a href={publicProfile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition group">
                        <div className="w-9 h-9 rounded-xl bg-[#0D9488]/10 flex items-center justify-center flex-shrink-0">
                          <Globe className="w-4 h-4 text-[#0D9488]" />
                        </div>
                        <span className="text-[#374151] dark:text-white group-hover:text-[#0D9488] transition truncate">
                          {publicProfile.website.replace(/^https?:\/\//, '')}
                        </span>
                      </a>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="px-6 pb-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-center">
                        <p className="text-2xl font-bold text-[#0D9488]">
                          {publicProfile.totalTours || 0}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Active Tours</p>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-center">
                        <p className="text-2xl font-bold text-[#F59E0B]">
                          {publicProfile.totalReviews || 0}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Reviews</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer Buttons */}
                  <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex gap-3">
                    <button
                      onClick={() => {
                        if (publicProfile.email) {
                          window.location.href = `mailto:${publicProfile.email}`;
                        }
                      }}
                      className="flex-1 py-3 rounded-xl bg-[#0D9488] text-white font-medium hover:bg-[#0f766e] transition flex items-center justify-center gap-2 shadow-lg shadow-[#0D9488]/30 hover:scale-[1.02] transition-all duration-300"
                    >
                      <Mail className="w-4 h-4" />
                      Contact Provider
                    </button>
                    <button
                      onClick={() => {
                        setShowContact(false);
                        navigate(`/provider/${publicProfile._id}`);
                      }}
                      className="flex-1 py-3 rounded-xl border-2 border-[#0D9488] text-[#0D9488] font-medium hover:bg-[#0D9488]/10 transition flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Profile
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                  <p>Unable to load provider information</p>
                  <button onClick={() => setShowContact(false)} className="mt-4 px-6 py-2 rounded-xl bg-[#0D9488] text-white">
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

// ================================================================
// REVIEWS SECTION
// ================================================================
const ReviewsSection = ({ listingId, reviews, onReviewAdded, loading }) => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const getRatingDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(r => {
      if (distribution[r.rating] !== undefined) {
        distribution[r.rating]++;
      }
    });
    return distribution;
  };

  const distribution = getRatingDistribution();
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : 0;

  const canWriteReview = user && !reviews.some(r => r.user?._id === user._id);

  const handleSubmitReview = async (data) => {
    try {
      setSubmitting(true);
      
      if (editingReview) {
        const { updateReview } = await import('../services/reviewService');
        await updateReview(editingReview._id, {
          rating: data.rating,
          comment: data.comment,
        });
      } else {
        const { createReview } = await import('../services/reviewService');
        await createReview({
          tourId: data.tourId,
          rating: data.rating,
          comment: data.comment,
        });
      }
      
      setShowForm(false);
      setEditingReview(null);
      onReviewAdded();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowForm(true);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    try {
      const { deleteReview } = await import('../services/reviewService');
      await deleteReview(reviewId);
      onReviewAdded();
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-[#0D9488]" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-6 border border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-6 h-6 text-[#0D9488]" />
          <h2 className="text-2xl font-bold text-[#374151] dark:text-white">
            Reviews
          </h2>
          {totalReviews > 0 && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({totalReviews} • ⭐ {averageRating})
            </span>
          )}
        </div>
        {canWriteReview && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 rounded-xl bg-[#0D9488] text-white text-sm font-medium hover:bg-[#0D9488]/80 transition"
          >
            Write Review
          </button>
        )}
        {showForm && (
          <button
            onClick={() => {
              setShowForm(false);
              setEditingReview(null);
            }}
            className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        )}
      </div>

      {totalReviews > 0 && (
        <div className="mb-6 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="text-center">
              <span className="text-4xl font-bold text-[#374151] dark:text-white">
                {averageRating}
              </span>
              <div className="flex justify-center mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(averageRating)
                        ? 'text-[#F59E0B] fill-[#F59E0B]'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">{totalReviews} reviews</span>
            </div>

            <div className="flex-1 space-y-1">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = distribution[star] || 0;
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400 w-6">{star}★</span>
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#F59E0B] rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500 w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="mb-6">
          <ReviewForm
            tourId={listingId}
            initialData={editingReview}
            isEditing={!!editingReview}
            onSubmit={handleSubmitReview}
            onCancel={() => {
              setShowForm(false);
              setEditingReview(null);
            }}
            isLoading={submitting}
          />
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <MessageCircle className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <p>No reviews yet. Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              showTourInfo={false}
              onEdit={() => handleEditReview(review)}
              onDelete={handleDeleteReview}
              onHelpfulToggle={onReviewAdded}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ================================================================
// BOOKING MODAL
// ================================================================
const BookingModal = ({ listing, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [travelers, setTravelers] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');

  const handleBooking = async () => {
    if (!user) {
      alert('Please login to book this listing');
      navigate('/login');
      return;
    }

    if (!selectedDate) {
      alert('Please select a date');
      return;
    }

    try {
      setLoading(true);

      const bookingData = {
        tour: listing._id,
        startDate: selectedDate,
        endDate: selectedDate,
        numberOfPeople: travelers,
      };

      const { createBooking } = await import('../services/bookingService');
      const bookingResult = await createBooking(bookingData, localStorage.getItem('token'));

      const { createCheckout } = await import('../services/paymentService');
      const checkout = await createCheckout(bookingResult.booking._id);

      if (checkout.url) {
        window.location.href = checkout.url;
      } else {
        alert('Booking created! Please complete payment.');
        onClose();
      }

    } catch (error) {
      console.error('Booking error:', error);
      alert(error.response?.data?.message || 'Failed to process booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#374151] dark:text-white">
            Book This Experience
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800">
            <h3 className="font-bold text-[#374151] dark:text-white">{listing.title}</h3>
            <p className="text-sm text-gray-500">{listing.location}</p>
            <p className="text-2xl font-bold text-[#0D9488] mt-2">${listing.price}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Number of Travelers
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setTravelers(Math.max(1, travelers - 1))}
                className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-lg font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                -
              </button>
              <span className="text-xl font-bold text-[#374151] dark:text-white w-12 text-center">
                {travelers}
              </span>
              <button
                onClick={() => setTravelers(Math.min(listing.capacity || 10, travelers + 1))}
                className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-lg font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                +
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">Max {listing.capacity || 10} travelers</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition outline-none"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="p-4 rounded-2xl bg-[#0D9488]/5 border border-[#0D9488]/20">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Total</span>
              <span className="text-xl font-bold text-[#0D9488]">
                ${(listing.price * travelers).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleBooking}
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#0D9488] to-[#F59E0B] text-white font-bold shadow-lg shadow-[#0D9488]/25 hover:scale-[1.02] transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Book Now
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ================================================================
// TRUST BADGES
// ================================================================
const ListingTrustBadges = () => {
  const badges = [
    { icon: Shield, label: 'Secure Booking', desc: 'SSL encrypted' },
    { icon: Award, label: 'Verified Provider', desc: 'Trusted partners' },
    { icon: CheckCircle, label: 'Best Price Guarantee', desc: 'Price match' },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-4 border border-gray-100 dark:border-gray-800">
      <div className="space-y-2">
        {badges.map((badge, index) => {
          const Icon = badge.icon;
          return (
            <div key={index} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              <div className="w-8 h-8 rounded-full bg-[#0D9488]/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-[#0D9488]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#374151] dark:text-white">{badge.label}</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">{badge.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ================================================================
// MAIN PAGE
// ================================================================
const TABS = [
  { id: 'about', label: 'About', Icon: Info },
  { id: 'highlights', label: 'Highlights', Icon: Sparkles },
  { id: 'included', label: 'What\'s Included', Icon: Check },
  { id: 'requirements', label: 'Requirements', Icon: List },
];

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [showBooking, setShowBooking] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchListingData();
  }, [id]);

  const fetchListingData = async () => {
    try {
      setLoading(true);
      const data = await getListingById(id);
      setListing(data.listing);
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
    const galleryLength = listing ? buildGallery(listing).length : 0;
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
      <p className="mt-6 text-lg font-semibold text-[#374151] dark:text-white">Loading Listing...</p>
    </div>
  );

  if (!listing) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 text-center p-6">
      <div className="w-24 h-24 mx-auto rounded-full bg-[#0D9488]/10 flex items-center justify-center mb-6">
        <MapPin className="w-12 h-12 text-[#0D9488]" />
      </div>
      <h1 className="text-3xl font-bold text-[#374151] dark:text-white mb-2">Listing Not Found</h1>
      <p className="text-gray-500 dark:text-gray-400">The listing you're looking for doesn't exist.</p>
      <button onClick={() => navigate('/explore')} className="mt-6 px-6 py-3 rounded-xl bg-[#0D9488] text-white font-bold hover:bg-[#0D9488]/90 transition">
        Browse Listings
      </button>
    </div>
  );

  const gallery = buildGallery(listing);
  const videos = buildVideos(listing);
  const isPending = listing.status === 'pending';
  const rating = listing.averageRating || 0;
  const ratingDisplay = rating > 0 ? rating.toFixed(1) : 'New';

  const BusinessIcon = getBusinessIcon(listing.businessType);
  const businessLabel = getBusinessLabel(listing.businessType);

  const tabContent = {
    about: { title: 'About This Listing', body: listing.description || 'No description available.' },
    highlights: { title: 'Highlights', body: listing.highlights || 'No highlights listed.' },
    included: { title: 'What\'s Included', body: listing.included || 'No included services listed.' },
    requirements: { title: 'Requirements', body: listing.requirements || 'No specific requirements.' },
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

        {/* ── HERO SECTION ── */}
        <div className="hero-media-container sticky top-0 z-20 bg-gray-50 dark:bg-gray-950 shadow-lg border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <HeroMediaArea
              images={gallery}
              videos={videos}
              title={listing.title}
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

              {/* Business Type Badge */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0D9488]/10 flex items-center justify-center">
                  <BusinessIcon className="w-5 h-5 text-[#0D9488]" />
                </div>
                <span className="text-sm font-medium text-[#0D9488] bg-[#0D9488]/10 px-4 py-1.5 rounded-full">
                  {businessLabel}
                </span>
                {listing.listingType && (
                  <span className="text-sm font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-4 py-1.5 rounded-full">
                    {listing.listingType}
                  </span>
                )}
                {isPending && (
                  <span className="text-sm font-medium text-[#F59E0B] bg-[#F59E0B]/10 px-4 py-1.5 rounded-full">
                    Pending Approval
                  </span>
                )}
              </div>

              {/* Gallery Thumbnails */}
              {gallery.length > 1 && (
                <GalleryThumbnails
                  images={gallery}
                  title={listing.title}
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

              {/* Provider Profile - Using enhanced ProviderCard */}
              {listing.provider && <ProviderCard provider={listing.provider} />}

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
                listingId={listing._id}
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
                      <span className="text-4xl font-bold text-white">${listing.price}</span>
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
                    {/* Listing Meta */}
                    <div className="space-y-3 text-sm">
                      {[
                        { label: 'Location', value: listing.location },
                        { label: 'Duration', value: listing.duration },
                        { label: 'Capacity', value: `${listing.capacity || 1} people` },
                        { label: 'Type', value: businessLabel },
                        { label: 'Status', value: listing.status || 'approved', isStatus: true },
                      ].map(({ label, value, isStatus }) => value && (
                        <div key={label} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                          <span className="text-gray-500">{label}</span>
                          {isStatus ? (
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              listing.status === 'approved' || !listing.status ? 'bg-[#0D9488]/10 text-[#0D9488]'
                              : listing.status === 'pending' ? 'bg-[#F59E0B]/10 text-[#F59E0B]'
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

                <ListingTrustBadges />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && <BookingModal listing={listing} onClose={() => setShowBooking(false)} />}
    </>
  );
};

export default ListingDetails;