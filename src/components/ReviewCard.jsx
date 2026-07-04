// src/components/ReviewCard.jsx

import React, { useState } from 'react';
import { 
  Star, 
  ThumbsUp, 
  User, 
  Calendar, 
  Heart, 
  Edit2, 
  Trash2,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageCircle,
  Award,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Card, { CardContent } from './ui/Card';
import { toggleHelpful } from '../services/reviewService';
import { useAuth } from '../contexts/AuthContext';

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
  showActions = true,
  onEdit,
  onDelete,
  onHelpfulToggle,
  showTourInfo = true,
  showUserInfo = true,
  compact = false,
  className = '',
}) => {
  const { user } = useAuth();
  const [helpfulLoading, setHelpfulLoading] = useState(false);
  const [isHelpful, setIsHelpful] = useState(review.isHelpful || false);
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount || 0);

  const isOwner = user?._id === review.user?._id;
  const isAdmin = user?.role === 'admin' || user?.role === 'ADMIN';

  // ===============================
  // RENDER STARS
  // ===============================
  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? 'text-[#F59E0B] fill-[#F59E0B]'
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ));
  };

  // ===============================
  // HANDLE HELPFUL
  // ===============================
  const handleHelpful = async () => {
    if (!user) {
      alert('Please login to mark reviews as helpful');
      return;
    }

    try {
      setHelpfulLoading(true);
      const response = await toggleHelpful(review._id);
      
      setIsHelpful(response.helpful || !isHelpful);
      setHelpfulCount(prev => response.helpful ? prev + 1 : prev - 1);
      
      if (onHelpfulToggle) {
        onHelpfulToggle(review._id, response.helpful);
      }
    } catch (error) {
      console.error('Error toggling helpful:', error);
      alert('Failed to mark as helpful');
    } finally {
      setHelpfulLoading(false);
    }
  };

  // ===============================
  // GET ROLE BADGE
  // ===============================
  const getRoleBadge = (role) => {
    const styles = {
      user: 'bg-[#0D9488]/10 text-[#0D9488]',
      traveler: 'bg-[#0D9488]/10 text-[#0D9488]',
      provider: 'bg-[#F59E0B]/10 text-[#F59E0B]',
      admin: 'bg-purple-100 text-purple-600',
    };
    return styles[role] || styles.user;
  };

  // ===============================
  // GET STATUS BADGE
  // ===============================
  const getStatusBadge = (status) => {
    const styles = {
      approved: 'bg-[#0D9488]/10 text-[#0D9488]',
      pending: 'bg-[#F59E0B]/10 text-[#F59E0B]',
      rejected: 'bg-red-100 text-red-600',
    };
    return styles[status] || styles.pending;
  };

  // ===============================
  // FORMAT DATE
  // ===============================
  const formatDate = (date) => {
    if (!date) return 'Recently';
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 172800000) return 'Yesterday';
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // ===============================
  // GET USER AVATAR
  // ===============================
  const getAvatar = (name) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=0D9488&color=fff&size=40`;
  };

  // ===============================
  // COMPACT VIEW
  // ===============================
  if (compact) {
    return (
      <div className={`flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition ${className}`}>
        <img
          src={getAvatar(review.user?.name)}
          alt={review.user?.name}
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm text-[#374151] dark:text-white">
              {review.user?.name || 'Anonymous'}
            </span>
            <div className="flex items-center gap-0.5">
              {renderStars(review.rating)}
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {review.comment}
          </p>
        </div>
      </div>
    );
  }

  // ===============================
  // FULL VIEW
  // ===============================
  return (
    <Card className={`hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden ${className}`}>
      <CardContent className="p-6">
        
        {/* TOP SECTION */}
        <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
          <div className="flex-1 min-w-0">
            {/* User Info */}
            <div className="flex items-center gap-3">
              {showUserInfo ? (
                <>
                  <img
                    src={review.user?.profileImage || getAvatar(review.user?.name)}
                    alt={review.user?.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#0D9488] flex-shrink-0"
                    onError={(e) => {
                      e.target.src = getAvatar(review.user?.name);
                    }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-[#374151] dark:text-white truncate">
                        {review.user?.name || 'Anonymous'}
                      </h3>
                      {review.user?.role && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadge(review.user.role)}`}>
                          {review.user.role === 'user' ? 'Traveler' : review.user.role}
                        </span>
                      )}
                      {review.user?.verificationStatus === 'approved' && (
                        <span className="text-[#0D9488] text-xs">
                          <CheckCircle className="w-3 h-3 inline mr-0.5" />
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(review.createdAt)}</span>
                      {review.editedAt && (
                        <span className="text-xs text-gray-400">(edited)</span>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="min-w-0">
                  <h3 className="font-semibold text-[#374151] dark:text-white">
                    {review.user?.name || 'Anonymous'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(review.createdAt)}
                  </p>
                </div>
              )}
            </div>

            {/* Tour Info */}
            {showTourInfo && review.tour && (
              <Link
                to={`/tour/${review.tour._id}`}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-[#0D9488] transition mt-1 inline-block"
              >
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  {review.tour.title}
                </span>
              </Link>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {renderStars(review.rating)}
            <span className="ml-2 font-semibold text-[#374151] dark:text-white">
              {review.rating}
            </span>
          </div>
        </div>

        {/* COMMENT */}
        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed whitespace-pre-wrap">
          {review.comment}
        </p>

        {/* IMAGES (if any) */}
        {review.images && review.images.length > 0 && (
          <div className="flex gap-2 mb-4 flex-wrap">
            {review.images.slice(0, 4).map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Review image ${idx + 1}`}
                className="w-16 h-16 object-cover rounded-lg"
              />
            ))}
            {review.images.length > 4 && (
              <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs text-gray-500">
                +{review.images.length - 4}
              </div>
            )}
          </div>
        )}

        {/* STATUS BADGE */}
        {review.status && review.status !== 'approved' && (
          <div className="mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(review.status)}`}>
              {review.status}
            </span>
          </div>
        )}

        {/* BOTTOM SECTION */}
        <div className="flex items-center justify-between flex-wrap gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
          
          {/* Helpful Button */}
          <button
            onClick={handleHelpful}
            disabled={helpfulLoading}
            className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[#0D9488] transition-all duration-300 group disabled:opacity-50"
          >
            {helpfulLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ThumbsUp className={`w-4 h-4 transition-transform group-hover:scale-110 ${isHelpful ? 'text-[#0D9488] fill-[#0D9488]' : ''}`} />
            )}
            <span className="text-sm font-medium">
              Helpful ({helpfulCount || 0})
            </span>
          </button>

          {/* Actions */}
          {showActions && (isOwner || isAdmin) && (
            <div className="flex items-center gap-2">
              {review.rating >= 4 && (
                <span className="flex items-center gap-1 text-xs text-[#0D9488] bg-[#0D9488]/10 px-3 py-1 rounded-full">
                  <Heart className="w-3 h-3" />
                  Recommended
                </span>
              )}

              {isOwner && (
                <button
                  onClick={() => onEdit?.(review)}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-400 hover:text-[#0D9488]"
                  title="Edit review"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}

              {(isOwner || isAdmin) && (
                <button
                  onClick={() => onDelete?.(review._id)}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-400 hover:text-red-500"
                  title="Delete review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;