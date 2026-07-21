// src/components/listing/ListingCard.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Star,
  Eye,
  Heart,
  Clock,
  Users,
  DollarSign,
  Sparkles,
  XCircle,
  Pencil,  // ✅ ADDED for Edit
} from 'lucide-react';
import ListingStatusBadge from './ListingStatusBadge';

// ── Helpers ──────────────────────────────────────────────────────
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getImageUrl = (image) => {
  if (!image) return null;
  if (image.startsWith('http')) return image;
  if (image.startsWith('/')) return image;
  return `${API_URL}/uploads/${image}`;
};

const formatPrice = (price, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(price);
};

// ── Main Component ──────────────────────────────────────────────
const ListingCard = ({
  listing,
  showActions = true,
  onToggleFavorite,
  onDelete,
  isFavorite = false,
  compact = false,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  const {
    _id,
    title,
    location,
    price,
    currency = 'USD',
    coverImage,
    galleryImages,
    averageRating,
    totalReviews,
    status,
    businessType,
    listingType,
    duration,
    capacity,
    views,
    createdAt,
  } = listing;

  const imageUrl = imageError
    ? null
    : getImageUrl(coverImage) || getImageUrl(galleryImages?.[0]);

  const ratingDisplay = averageRating > 0 ? averageRating.toFixed(1) : 'New';
  const isApproved = status === 'approved';

  // ── Compact View ──
  if (compact) {
    return (
      <Link
        to={`/listing/${_id}`}
        className={`block bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-800 ${className}`}
      >
        <div className="flex gap-4 p-4">
          {/* Image */}
          <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Sparkles className="w-8 h-8" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-[#374151] dark:text-white text-sm truncate">
                {title}
              </h3>
              <ListingStatusBadge status={status} size="sm" />
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
              <MapPin className="w-3 h-3 text-[#0D9488]" />
              <span className="truncate">{location}</span>
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <span className="font-bold text-[#0D9488] text-sm">
                {formatPrice(price, currency)}
              </span>
              {averageRating > 0 && (
                <div className="flex items-center gap-1 text-xs">
                  <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
                  <span className="font-medium text-[#374151] dark:text-white">
                    {ratingDisplay}
                  </span>
                  <span className="text-gray-400">({totalReviews || 0})</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // ── Full View ──
  return (
    <div
      className={`
        bg-white dark:bg-gray-900 rounded-3xl overflow-hidden
        shadow-sm hover:shadow-xl transition-all duration-300
        border border-gray-100 dark:border-gray-800
        ${className}
      `}
    >
      {/* ── Image ── */}
      <Link to={`/listing/${_id}`} className="block relative overflow-hidden group">
        <div className="relative h-56 overflow-hidden bg-gray-100 dark:bg-gray-800">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Sparkles className="w-16 h-16" />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <ListingStatusBadge status={status} size="md" />
          </div>

          {/* Price Badge */}
          <div className="absolute bottom-4 left-4 bg-[#0D9488] text-white px-4 py-2 rounded-xl font-bold shadow-lg">
            {formatPrice(price, currency)}
          </div>

          {/* Listing Type */}
          {listingType && (
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium">
              {listingType}
            </div>
          )}

          {/* Stats overlay */}
          <div className="absolute bottom-4 right-4 flex items-center gap-3 text-white/90 text-xs bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
            {views > 0 && (
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {views}
              </span>
            )}
            {averageRating > 0 && (
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
                {ratingDisplay}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* ── Content ── */}
      <div className="p-5 space-y-3">
        {/* Title & Location */}
        <Link to={`/listing/${_id}`}>
          <h3 className="text-lg font-bold text-[#374151] dark:text-white hover:text-[#0D9488] transition line-clamp-1">
            {title}
          </h3>
        </Link>

        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
          <MapPin className="w-4 h-4 text-[#0D9488]" />
          <span className="line-clamp-1">{location}</span>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          {duration && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#0D9488]" />
              {duration}
            </span>
          )}
          {capacity && (
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3 text-[#F59E0B]" />
              {capacity} {capacity === 1 ? 'person' : 'people'}
            </span>
          )}
          <span className="text-gray-300 dark:text-gray-600">•</span>
          <span className="capitalize">{businessType?.replace('_', ' ') || 'Service'}</span>
        </div>

        {/* ── Actions ── */}
        {showActions && (
          <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
            {/* View Details */}
            <Link
              to={`/listing/${_id}`}
              className="flex-1 h-10 rounded-xl bg-[#0D9488] text-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#0f766e] transition"
            >
              <Eye className="w-4 h-4" />
              View Details
            </Link>

            {/* ✅ Edit Button */}
            <Link
              to={`/provider/listings/edit/${_id}`}
              className="w-10 h-10 rounded-xl bg-[#374151] text-white flex items-center justify-center hover:bg-[#374151]/80 transition"
              title="Edit Listing"
            >
              <Pencil className="w-4 h-4" />
            </Link>

            {/* Favorite */}
            {onToggleFavorite && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onToggleFavorite(_id);
                }}
                className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition ${
                  isFavorite
                    ? 'border-red-500 bg-red-500/10 text-red-500'
                    : 'border-gray-200 dark:border-gray-700 hover:border-red-500 hover:bg-red-500/10'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500' : ''}`} />
              </button>
            )}

            {/* Delete */}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (window.confirm(`Delete "${title}"? This action cannot be undone.`)) {
                    onDelete(_id);
                  }
                }}
                className="w-10 h-10 rounded-xl border-2 border-red-200 text-red-500 hover:bg-red-50 transition flex items-center justify-center"
              >
                <XCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingCard;