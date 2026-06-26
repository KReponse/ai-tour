// src/components/ui/Card.jsx
import React, { useState } from 'react';
import clsx from 'clsx';
import { MapPin } from 'lucide-react';

// =====================================
// AI TOUR COLORS
// =====================================
// Teal  : #0D9488
// Gold  : #F59E0B
// Slate : #374151
// White : #FFFFFF
// =====================================

// =====================================
// FALLBACK IMAGES
// =====================================
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

// =====================================
// CARD - MAIN COMPONENT
// =====================================
const Card = ({ 
  children, 
  className, 
  hover = true,
  variant = 'default',
  padding = true,
}) => {
  const variants = {
    default: {
      bg: 'bg-white dark:bg-gray-900',
      shadow: 'shadow-lg hover:shadow-2xl',
      border: 'border border-gray-100 dark:border-gray-800',
      rounded: 'rounded-2xl',
    },
    featured: {
      bg: 'bg-gradient-to-br from-[#0D9488]/5 to-[#F59E0B]/5 dark:from-[#0D9488]/10 dark:to-[#F59E0B]/10',
      shadow: 'shadow-xl hover:shadow-2xl',
      border: 'border-2 border-[#0D9488]/30 dark:border-[#0D9488]/20',
      rounded: 'rounded-3xl',
    },
    compact: {
      bg: 'bg-white dark:bg-gray-900',
      shadow: 'shadow-md hover:shadow-xl',
      border: 'border border-gray-200 dark:border-gray-700',
      rounded: 'rounded-xl',
    },
  };

  const variantStyles = variants[variant] || variants.default;

  return (
    <div className={clsx(
      variantStyles.bg,
      variantStyles.shadow,
      variantStyles.border,
      variantStyles.rounded,
      'overflow-hidden',
      'transition-all duration-300',
      hover && 'hover:scale-[1.02] hover:-translate-y-1',
      padding && 'p-6',
      className
    )}>
      {children}
    </div>
  );
};

// =====================================
// CARD IMAGE
// =====================================
export const CardImage = ({ 
  src, 
  alt, 
  className, 
  height = 'h-48',
  fallback = true,
  children,
  seed,
}) => {
  const [error, setError] = useState(false);

  const finalSrc = (!src || error) && fallback 
    ? getFallbackImage(seed) 
    : src;

  const handleError = () => {
    if (fallback) {
      setError(true);
    }
  };

  return (
    <div className={clsx(
      'relative overflow-hidden bg-gradient-to-br from-[#0D9488]/10 to-[#F59E0B]/10',
      height,
      className
    )}>
      {finalSrc ? (
        <img
          src={finalSrc}
          alt={alt || 'Tour image'}
          onError={handleError}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-[#0D9488] to-[#F59E0B]">
          🏔️
        </div>
      )}
      {children}
    </div>
  );
};

// =====================================
// CARD CONTENT
// =====================================
export const CardContent = ({ 
  children, 
  className,
  noPadding = false,
}) => (
  <div className={clsx(
    'space-y-3',
    !noPadding && 'p-6',
    className
  )}>
    {children}
  </div>
);

// =====================================
// CARD BADGE ✅ (Added export)
// =====================================
export const CardBadge = ({ 
  children, 
  variant = 'default',
  className 
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    success: 'bg-[#0D9488]/10 text-[#0D9488] dark:bg-[#0D9488]/20 dark:text-[#0D9488]',
    warning: 'bg-[#F59E0B]/10 text-[#F59E0B] dark:bg-[#F59E0B]/20 dark:text-[#F59E0B]',
    danger: 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400',
    info: 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
  };

  return (
    <span className={clsx(
      'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide',
      variants[variant] || variants.default,
      className
    )}>
      {children}
    </span>
  );
};

// =====================================
// CARD TITLE ✅ (Added export)
// =====================================
export const CardTitle = ({ 
  children, 
  className,
  featured = false,
}) => (
  <h3 className={clsx(
    'text-xl font-bold text-[#374151] dark:text-white',
    featured && 'bg-gradient-to-r from-[#0D9488] to-[#F59E0B] bg-clip-text text-transparent',
    className
  )}>
    {children}
  </h3>
);

// =====================================
// CARD SUBTITLE ✅ (Added export)
// =====================================
export const CardSubtitle = ({ 
  children, 
  className,
  icon = MapPin,
}) => {
  const Icon = icon;
  return (
    <div className={clsx(
      'flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm',
      className
    )}>
      {Icon && <Icon className="w-4 h-4 text-[#0D9488]" />}
      {children}
    </div>
  );
};

// =====================================
// CARD PRICE
// =====================================
export const CardPrice = ({ 
  price, 
  className,
  currency = '$',
}) => (
  <div className={clsx(
    'font-black text-[#0D9488] text-lg',
    className
  )}>
    {currency}{price}
  </div>
);

// =====================================
// CARD STATS
// =====================================
export const CardStats = ({ 
  children, 
  className,
}) => (
  <div className={clsx(
    'flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400',
    className
  )}>
    {children}
  </div>
);

// =====================================
// CARD ACTIONS
// =====================================
export const CardActions = ({ 
  children, 
  className,
}) => (
  <div className={clsx(
    'flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-gray-800',
    className
  )}>
    {children}
  </div>
);

// =====================================
// CARD FOOTER
// =====================================
export const CardFooter = ({ 
  children, 
  className,
}) => (
  <div className={clsx(
    'bg-gray-50 dark:bg-gray-800/50 px-6 py-4',
    className
  )}>
    {children}
  </div>
);

// =====================================
// CARD GROUP
// =====================================
export const CardGroup = ({ 
  children, 
  className,
  cols = { sm: 1, md: 2, lg: 3 },
}) => {
  return (
    <div className={clsx(
      'grid gap-6',
      `grid-cols-${cols.sm || 1}`,
      `md:grid-cols-${cols.md || 2}`,
      `lg:grid-cols-${cols.lg || 3}`,
      className
    )}>
      {children}
    </div>
  );
};

// =====================================
// TOUR CARD
// =====================================
const getStatusBadgeVariant = (status) => {
  const styles = {
    approved: 'success',
    pending: 'warning',
    rejected: 'danger',
    active: 'success',
    inactive: 'default',
  };
  return styles[status?.toLowerCase()] || 'default';
};

export const TourCard = ({ 
  tour, 
  onView,
  onEdit,
  onDelete,
  onShare,
}) => {
  const { 
    _id, 
    title, 
    location, 
    price, 
    images, 
    coverImage, 
    duration, 
    travelers, 
    views, 
    rating,
    status,
    bookings 
  } = tour || {};

  const getImage = () => {
    if (coverImage) return coverImage;
    if (images?.length > 0) return images[0];
    return null;
  };

  const badgeVariant = getStatusBadgeVariant(status);

  return (
    <Card variant="default" hover={true} padding={false}>
      <CardImage 
        src={getImage()} 
        alt={title || 'Tour'}
        height="h-56"
        seed={_id}
      >
        {status && (
          <div className="absolute top-4 right-4">
            <CardBadge variant={badgeVariant}>
              {status}
            </CardBadge>
          </div>
        )}
        {bookings > 0 && (
          <div className="absolute top-4 left-4">
            <CardBadge variant="info">
              📊 {bookings} Bookings
            </CardBadge>
          </div>
        )}
      </CardImage>

      <CardContent>
        <div className="flex justify-between items-start gap-2">
          <CardTitle>{title || 'Untitled Tour'}</CardTitle>
          <CardPrice price={price || 0} />
        </div>

        <CardSubtitle icon={MapPin}>
          {location || 'Location not specified'}
        </CardSubtitle>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
            <div className="text-[#0D9488] text-sm">Duration</div>
            <div className="font-bold text-sm dark:text-white">{duration || 'N/A'}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
            <div className="text-[#F59E0B] text-sm">Travelers</div>
            <div className="font-bold text-sm dark:text-white">{travelers || 0}</div>
          </div>
        </div>

        <CardStats>
          <span>👁️ {views || 0}</span>
          <span>⭐ {rating || 0}</span>
        </CardStats>

        <CardActions>
          <button
            onClick={() => onView?.(_id)}
            className="flex-1 bg-[#0D9488] hover:bg-[#0D9488]/90 text-white font-bold py-2 rounded-xl transition"
          >
            View
          </button>
          <button
            onClick={() => onEdit?.(_id)}
            className="w-10 h-10 bg-[#374151] hover:bg-[#374151]/80 text-white rounded-xl transition flex items-center justify-center"
          >
            ✏️
          </button>
          <button
            onClick={() => onShare?.(tour)}
            className="w-10 h-10 bg-[#F59E0B] hover:bg-[#F59E0B]/80 text-white rounded-xl transition flex items-center justify-center"
          >
            📤
          </button>
          <button
            onClick={() => onDelete?.(tour)}
            className="w-10 h-10 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl transition flex items-center justify-center"
          >
            🗑️
          </button>
        </CardActions>
      </CardContent>
    </Card>
  );
};

// =====================================
// EXPORTS ✅ (All exports)
// =====================================
export default Card;