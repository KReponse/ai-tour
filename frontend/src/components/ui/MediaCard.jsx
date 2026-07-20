// src/components/ui/MediaCard.jsx
// ✅ UPDATED - Cover Media (Image + Video) support with autoplay

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  Clock, 
  Play,
  Heart,
  Eye,
} from 'lucide-react';
import clsx from 'clsx';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=500',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=500',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500',
  'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=500',
];

const getFallbackImage = (seed) => {
  const index = typeof seed === 'number' ? seed : Math.floor(Math.random() * FALLBACK_IMAGES.length);
  return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
};

const MediaCard = ({
  id,
  title,
  image,
  location,
  price,
  duration,
  rating,
  type, // 'experience' or 'video'
  videoUrl, // For cover video or standalone video
  coverMediaType, // 'image' or 'video'
  views,
  likes,
  onSelect,
  className,
}) => {
  const [imageError, setImageError] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const isVideo = type === 'video';
  const isCoverVideo = coverMediaType === 'video' && videoUrl;

  // Determine what to display
  const displayVideo = isVideo || isCoverVideo;
  const displayImage = !displayVideo;

  // Image URL with fallback
  const imageUrl = (!image || imageError) ? getFallbackImage(id) : image;

  // Handle video error - fallback to image
  const handleVideoError = () => {
    setVideoError(true);
  };

  return (
    <div 
      className={clsx(
        'flex-shrink-0 w-[200px] snap-start group cursor-pointer',
        'transition-all duration-300 hover:scale-[1.02]',
        className
      )}
      onClick={() => onSelect?.(id)}
    >
      <div className="relative overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
        {/* Media Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-200 dark:bg-gray-700">
          {displayVideo && videoUrl && !videoError ? (
            // ✅ Video display with autoplay, muted, loop
            <div className="w-full h-full bg-black">
              <video
                src={videoUrl}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                poster={imageUrl}
                onError={handleVideoError}
              />
              {/* Video overlay - play button */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-10 h-10 rounded-full bg-[#0D9488]/80 backdrop-blur flex items-center justify-center group-hover:scale-110 transition">
                  <Play className="w-4 h-4 text-white" />
                </div>
              </div>
              {/* Video badge */}
              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                <Play className="w-3 h-3" />
                Video
              </div>
            </div>
          ) : (
            // ✅ Image display (fallback for video errors too)
            <>
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={() => setImageError(true)}
                loading="lazy"
              />
              {/* Image overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </>
          )}

          {/* Price Badge - only for experiences */}
          {price !== undefined && !isVideo && !isCoverVideo && (
            <div className="absolute bottom-2 left-2 bg-[#0D9488] text-white px-2.5 py-0.5 rounded-full text-xs font-bold shadow-lg">
              ${price}
            </div>
          )}

          {/* Rating Badge */}
          {rating > 0 && (
            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-0.5 rounded-full text-xs text-white flex items-center gap-0.5">
              <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
              {rating.toFixed(1)}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3 space-y-1">
          <h3 className="font-semibold text-sm text-[#374151] dark:text-white line-clamp-1">
            {title}
          </h3>
          
          {location && (
            <div className="flex items-center gap-0.5 text-xs text-gray-500 dark:text-gray-400">
              <MapPin className="w-3 h-3 text-[#0D9488]" />
              <span className="line-clamp-1">{location}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-gray-400">
            {duration && !isVideo && !isCoverVideo && (
              <div className="flex items-center gap-0.5">
                <Clock className="w-3 h-3 text-[#0D9488]" />
                <span>{duration}</span>
              </div>
            )}
            {isVideo && views !== undefined && (
              <div className="flex items-center gap-0.5">
                <Eye className="w-3 h-3 text-gray-400" />
                <span>{views}</span>
              </div>
            )}
            {isVideo && likes !== undefined && (
              <div className="flex items-center gap-0.5">
                <Heart className="w-3 h-3 text-[#F59E0B]" />
                <span>{likes}</span>
              </div>
            )}
            {isCoverVideo && (
              <div className="flex items-center gap-0.5 text-[#0D9488]">
                <Play className="w-3 h-3" />
                <span>Preview</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaCard;