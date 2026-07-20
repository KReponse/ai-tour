// frontend/src/utils/mediaHelpers.js
// ✅ NEW - Unified media helper for cover media (image + video)

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Get image URL from a media path
 */
export const getImageUrl = (image) => {
  if (!image) return null;
  if (image.startsWith('http')) return image;
  if (image.startsWith('/')) return image;
  if (image.startsWith('blob:')) return image;
  return `${API_URL}/uploads/${image}`;
};

/**
 * Check if a string is a video file based on extension
 */
export const isVideoFile = (url) => {
  if (!url) return false;
  const videoExtensions = ['.mp4', '.mov', '.webm', '.avi', '.mkv', '.m4v', '.3gp', '.mpeg', '.mpg'];
  return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
};

/**
 * Get cover media URL from a listing/entity
 * Supports: coverMedia, coverImage, galleryImages, images
 */
export const getCoverMedia = (entity) => {
  if (!entity) return null;
  
  if (entity.coverMedia) {
    return getImageUrl(entity.coverMedia);
  }
  if (entity.coverImage) {
    return getImageUrl(entity.coverImage);
  }
  if (entity.galleryImages && entity.galleryImages.length > 0) {
    return getImageUrl(entity.galleryImages[0]);
  }
  if (entity.images && entity.images.length > 0) {
    return getImageUrl(entity.images[0]);
  }
  if (entity.image) {
    return getImageUrl(entity.image);
  }
  return null;
};

/**
 * Get cover media type from a listing/entity
 * Returns: 'video' or 'image'
 */
export const getCoverMediaType = (entity) => {
  if (!entity) return 'image';
  
  // Check explicit coverMediaType
  if (entity.coverMediaType === 'video') return 'video';
  if (entity.coverMediaType === 'image') return 'image';
  
  // Check if coverMedia is a video file
  if (entity.coverMedia && isVideoFile(entity.coverMedia)) return 'video';
  
  // Check if videos array exists
  if (entity.videos && entity.videos.length > 0) return 'video';
  
  // Check galleryImages for videos
  if (entity.galleryImages && entity.galleryImages.length > 0) {
    for (const img of entity.galleryImages) {
      if (isVideoFile(img)) return 'video';
    }
  }
  
  return 'image';
};

/**
 * Get cover video URL from a listing/entity
 */
export const getCoverVideo = (entity) => {
  if (!entity) return null;
  
  if (entity.coverMediaType === 'video' && entity.coverMedia) {
    return getImageUrl(entity.coverMedia);
  }
  if (entity.coverMedia && isVideoFile(entity.coverMedia)) {
    return getImageUrl(entity.coverMedia);
  }
  if (entity.videos && entity.videos.length > 0) {
    return getImageUrl(entity.videos[0]);
  }
  if (entity.galleryImages && entity.galleryImages.length > 0) {
    for (const img of entity.galleryImages) {
      if (isVideoFile(img)) {
        return getImageUrl(img);
      }
    }
  }
  return null;
};

/**
 * Get full media object for a listing/entity
 * Returns: { url, type, isVideo, videoUrl, poster, thumbnail }
 */
export const getEntityMedia = (entity, fallbackImage = null) => {
  const defaultImage = fallbackImage || 'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=500';
  
  if (!entity) {
    return {
      url: defaultImage,
      type: 'image',
      isVideo: false,
      videoUrl: null,
      poster: defaultImage,
      thumbnail: defaultImage,
    };
  }
  
  const coverType = getCoverMediaType(entity);
  const coverUrl = getCoverMedia(entity);
  const videoUrl = getCoverVideo(entity);
  const poster = coverUrl || defaultImage;
  
  if (coverType === 'video' && videoUrl) {
    return {
      url: videoUrl,
      type: 'video',
      isVideo: true,
      videoUrl: videoUrl,
      poster: poster,
      thumbnail: poster,
    };
  }
  
  return {
    url: coverUrl || defaultImage,
    type: 'image',
    isVideo: false,
    videoUrl: null,
    poster: coverUrl || defaultImage,
    thumbnail: coverUrl || defaultImage,
  };
};

/**
 * Render media (image or video) as a React element
 * This is a helper for consistent rendering across components
 */
export const renderMedia = (entity, className = 'w-full h-full object-cover', onClick = null) => {
  const media = getEntityMedia(entity);
  
  if (media.isVideo && media.videoUrl) {
    return (
      <video
        key={media.videoUrl}
        src={media.videoUrl}
        className={className}
        autoPlay
        muted
        loop
        playsInline
        poster={media.poster}
        onClick={onClick}
        onError={(e) => {
          e.target.style.display = 'none';
          // Show fallback image
          const parent = e.target.parentElement;
          if (parent) {
            const img = document.createElement('img');
            img.src = media.poster || 'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=500';
            img.className = className;
            img.alt = 'Media';
            parent.appendChild(img);
          }
        }}
      />
    );
  }
  
  return (
    <img
      src={media.url}
      alt="Media"
      className={className}
      onClick={onClick}
      loading="lazy"
      onError={(e) => {
        e.target.src = 'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=500';
      }}
    />
  );
};