// frontend/src/components/ReviewCard.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  ThumbsUp,
  MessageCircle,
  CheckCircle,
  Calendar,
  User,
  Image as ImageIcon,
  X,
  ChevronLeft,
  ChevronRight,
  Reply,
  Building2,
  Edit2,
  Trash2,
} from 'lucide-react';

// ===============================
// AI TOUR COLORS
// ===============================
// Teal  : #0D9488
// Gold  : #F59E0B
// Slate : #374151
// White : #FFFFFF
// ===============================

const ReviewCard = ({
  review,
  onEdit,
  onDelete,
  onHelpfulToggle,
  onReply,
  showActions = false,
  showTourInfo = false,
  showUserInfo = true,
  showProviderResponse = true,
  compact = false,
  className = '',
}) => {
  // State
  const [imageLightbox, setImageLightbox] = useState({ open: false, index: 0 });
  const [isHelpful, setIsHelpful] = useState(review?.isHelpful || false);
  const [helpfulCount, setHelpfulCount] = useState(review?.helpfulCount || 0);
  const [showFullComment, setShowFullComment] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [responseText, setResponseText] = useState('');

  // Safety check
  if (!review) return null;

  // ✅ Get images (handle both string and object formats)
  const getImages = () => {
    if (!review.images || review.images.length === 0) return [];
    return review.images.map(img => {
      if (typeof img === 'string') return { url: img };
      return img;
    });
  };

  const images = getImages();
  const hasImages = images.length > 0;

  // ✅ Get reviewer name
  const getReviewerName = () => {
    if (review.traveler?.name) return review.traveler.name;
    if (review.user?.name) return review.user.name;
    return 'Anonymous Traveler';
  };

  // ✅ Get reviewer avatar
  const getReviewerAvatar = () => {
    if (review.traveler?.profileImage) return review.traveler.profileImage;
    if (review.user?.profileImage) return review.user.profileImage;
    if (review.traveler?.avatar) return review.traveler.avatar;
    return null;
  };

  // ✅ Get entity (listing or tour)
  const getEntity = () => {
    return review.listing || review.tour || null;
  };

  const getEntityTitle = () => {
    const entity = getEntity();
    return entity?.title || 'Experience';
  };

  const getEntityLink = () => {
    const entity = getEntity();
    if (!entity) return '#';
    if (review.listing) return `/listing/${entity._id || entity}`;
    if (review.tour) return `/tour/${entity._id || entity}`;
    return '#';
  };

  // ✅ Get provider name
  const getProviderName = () => {
    if (review.provider?.name) return review.provider.name;
    if (review.provider?.businessName) return review.provider.businessName;
    return 'Provider';
  };

  // ✅ Render stars
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

  // ✅ Format date
  const formatDate = (date) => {
    if (!date) return '';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  // ✅ Handle helpful toggle
  const handleHelpfulToggle = async () => {
    if (onHelpfulToggle) {
      const result = await onHelpfulToggle(review._id);
      if (result) {
        setIsHelpful(!isHelpful);
        setHelpfulCount(prev => isHelpful ? prev - 1 : prev + 1);
      }
    }
  };

  // ✅ Image Lightbox
  const openLightbox = (index) => {
    setImageLightbox({ open: true, index });
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setImageLightbox({ open: false, index: 0 });
    document.body.style.overflow = '';
  };

  const navigateLightbox = (direction) => {
    const newIndex = (imageLightbox.index + direction + images.length) % images.length;
    setImageLightbox({ ...imageLightbox, index: newIndex });
  };

  // ✅ Keyboard navigation for lightbox
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (!imageLightbox.open) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [imageLightbox.open]);

  // ✅ Handle reply
  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!responseText.trim()) return;
    if (onReply) {
      await onReply(review._id, responseText);
      setResponseText('');
      setIsResponding(false);
    }
  };

  // ✅ Truncate comment
  const shouldTruncate = !compact && review.comment?.length > 300;
  const displayComment = compact 
    ? (review.comment?.substring(0, 120) + (review.comment?.length > 120 ? '...' : ''))
    : showFullComment || !shouldTruncate
      ? review.comment
      : review.comment?.substring(0, 300) + '...';

  // ✅ Check if verified
  const isVerified = review.isVerifiedBooking || review.paymentStatus === 'paid';

  return (
    <>
      <div className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 sm:p-6 hover:shadow-md transition-shadow duration-300 ${className}`}>
        
        {/* HEADER: User Info & Rating */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            {showUserInfo && (
              <div className="flex-shrink-0">
                {getReviewerAvatar() ? (
                  <img
                    src={getReviewerAvatar()}
                    alt={getReviewerName()}
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#0D9488]"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0D9488] to-[#F59E0B] flex items-center justify-center text-white font-bold text-sm">
                    {getReviewerName().charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            )}
            
            <div>
              {showUserInfo && (
                <h4 className="font-semibold text-[#374151] dark:text-white">
                  {getReviewerName()}
                </h4>
              )}
              <div className="flex items-center gap-2 flex-wrap">
                {renderStars(review.rating)}
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {review.rating}.0
                </span>
                {isVerified && (
                  <span className="inline-flex items-center gap-1 text-xs text-[#0D9488] bg-[#0D9488]/10 px-2 py-0.5 rounded-full">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400 flex-shrink-0">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(review.createdAt)}</span>
          </div>
        </div>

        {/* TITLE */}
        {review.title && (
          <h3 className="text-lg font-semibold text-[#374151] dark:text-white mt-3">
            {review.title}
          </h3>
        )}

        {/* COMMENT */}
        <div className="mt-2">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            {displayComment}
          </p>
          {shouldTruncate && !compact && (
            <button
              onClick={() => setShowFullComment(!showFullComment)}
              className="text-sm text-[#0D9488] hover:underline font-medium mt-1"
            >
              {showFullComment ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>

        {/* IMAGES GALLERY */}
        {hasImages && !compact && (
          <div className="mt-3">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {images.slice(0, 4).map((img, index) => (
                <button
                  key={index}
                  onClick={() => openLightbox(index)}
                  className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden hover:opacity-90 transition relative group"
                >
                  <img
                    src={img.url}
                    alt={img.caption || `Review photo ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                    }}
                  />
                  {index === 3 && images.length > 4 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-bold">
                      +{images.length - 4}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* EXPERIENCE INFO */}
        {showTourInfo && getEntity() && (
          <Link
            to={getEntityLink()}
            className="inline-flex items-center gap-1 mt-3 text-sm text-[#0D9488] hover:underline"
          >
            <Building2 className="w-3 h-3" />
            <span>{getEntityTitle()}</span>
          </Link>
        )}

        {/* PROVIDER RESPONSE */}
        {showProviderResponse && review.providerResponse?.comment && (
          <div className="mt-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-2">
              <Reply className="w-4 h-4 text-[#0D9488] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-[#0D9488]">
                  {getProviderName()} (Provider)
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">
                  {review.providerResponse.comment}
                </p>
                {review.providerResponse.respondedAt && (
                  <p className="text-xs text-gray-400 mt-1">
                    Responded on {formatDate(review.providerResponse.respondedAt)}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={handleHelpfulToggle}
            className={`flex items-center gap-1.5 text-sm transition ${
              isHelpful ? 'text-[#0D9488]' : 'text-gray-400 hover:text-[#0D9488]'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${isHelpful ? 'fill-[#0D9488]' : ''}`} />
            <span>Helpful ({helpfulCount})</span>
          </button>

          {showActions && onEdit && (
            <button
              onClick={() => onEdit(review)}
              className="text-sm text-gray-400 hover:text-[#0D9488] transition flex items-center gap-1"
            >
              <Edit2 className="w-3 h-3" />
              Edit
            </button>
          )}

          {showActions && onDelete && (
            <button
              onClick={() => onDelete(review._id)}
              className="text-sm text-gray-400 hover:text-red-500 transition flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Delete
            </button>
          )}

          {onReply && !review.providerResponse?.comment && (
            <button
              onClick={() => setIsResponding(!isResponding)}
              className="text-sm text-[#0D9488] hover:underline transition"
            >
              {isResponding ? 'Cancel' : 'Reply'}
            </button>
          )}

          {isResponding && (
            <form onSubmit={handleReplySubmit} className="w-full mt-2 flex gap-2">
              <input
                type="text"
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Write your response..."
                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none"
              />
              <button
                type="submit"
                disabled={!responseText.trim()}
                className="px-4 py-2 rounded-xl bg-[#0D9488] text-white text-sm font-medium hover:bg-[#0D9488]/80 transition disabled:opacity-50"
              >
                Send
              </button>
            </form>
          )}

          {compact && review.comment?.length > 120 && (
            <Link
              to={`/reviews/${review._id}`}
              className="text-sm text-[#0D9488] hover:underline ml-auto"
            >
              Read Full Review →
            </Link>
          )}
        </div>
      </div>

      {/* IMAGE LIGHTBOX */}
      {imageLightbox.open && hasImages && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full transition z-10"
          >
            <X className="w-6 h-6" />
          </button>
          
          {images.length > 1 && (
            <>
              <button
                onClick={() => navigateLightbox(-1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-3 hover:bg-white/20 rounded-full transition"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={() => navigateLightbox(1)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-3 hover:bg-white/20 rounded-full transition"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          <div className="max-w-4xl max-h-[80vh] mx-4">
            <img
              src={images[imageLightbox.index]?.url}
              alt={images[imageLightbox.index]?.caption || `Review photo ${imageLightbox.index + 1}`}
              className="w-full h-full object-contain max-h-[80vh]"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x600?text=No+Image';
              }}
            />
            <p className="text-center text-white/60 text-sm mt-4">
              {imageLightbox.index + 1} / {images.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewCard;