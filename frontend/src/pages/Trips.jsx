// src/pages/Trips.jsx
// ✅ FIXED - Better video detection for both coverMedia and coverImage

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle, 
  MoreVertical,
  Loader2,
  Sparkles,
  Plane,
  Users,
  Star,
  TrendingUp,
  ChevronDown,
  ArrowRight,
  DollarSign,
  CreditCard,
  Play,
  Video,
} from 'lucide-react';
import Card, { CardImage, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { getMyBookings, cancelBooking } from '../services/bookingService';
import { useAuth } from '../contexts/AuthContext';

// ===============================
// AI TOUR COLORS
// ===============================
// Teal  : #0D9488
// Gold  : #F59E0B
// Slate : #374151
// White : #FFFFFF
// ===============================

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Trips = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTrip, setExpandedTrip] = useState(null);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const data = await getMyBookings(token);
      console.log('✅ Bookings from backend:', data);
      
      if (data && data.bookings) {
        setBookings(data.bookings);
      } else if (data && Array.isArray(data)) {
        setBookings(data);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error('❌ Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    const confirmCancel = window.confirm(
      'Are you sure you want to cancel this booking?'
    );
    if (!confirmCancel) return;

    try {
      setCancelling(bookingId);
      const token = localStorage.getItem('token');
      await cancelBooking(bookingId, token);

      setBookings(
        bookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: 'cancelled' }
            : booking
        )
      );

      alert('Booking cancelled successfully');
    } catch (error) {
      console.error('❌ Error cancelling booking:', error);
      alert('Failed to cancel booking');
    } finally {
      setCancelling(null);
    }
  };

  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith('http')) return image;
    if (image.startsWith('/')) return image;
    if (image.startsWith('blob:')) return image;
    return `${API_URL}/uploads/${image}`;
  };

  // ✅ Check if a string is a video file
  const isVideoFile = (url) => {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.mov', '.webm', '.avi', '.mkv', '.m4v', '.3gp', '.mpeg', '.mpg'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  // ✅ Get all possible media sources from entity
  const getAllMediaSources = (entity) => {
    const sources = [];
    
    if (!entity) return sources;
    
    // Check coverMedia
    if (entity.coverMedia) {
      sources.push({ url: entity.coverMedia, source: 'coverMedia' });
    }
    
    // Check coverImage (old field)
    if (entity.coverImage) {
      sources.push({ url: entity.coverImage, source: 'coverImage' });
    }
    
    // Check galleryImages
    if (entity.galleryImages && entity.galleryImages.length > 0) {
      entity.galleryImages.forEach(img => {
        if (img) sources.push({ url: img, source: 'galleryImages' });
      });
    }
    
    // Check videos array
    if (entity.videos && entity.videos.length > 0) {
      entity.videos.forEach(v => {
        if (v) sources.push({ url: v, source: 'videos' });
      });
    }
    
    // Check images array
    if (entity.images && entity.images.length > 0) {
      entity.images.forEach(img => {
        if (img) sources.push({ url: img, source: 'images' });
      });
    }
    
    // Check single image field
    if (entity.image) {
      sources.push({ url: entity.image, source: 'image' });
    }
    
    return sources;
  };

  // ✅ Get cover media type (image or video) - FIXED
  const getCoverMediaType = (entity) => {
    if (!entity) return 'image';
    
    const allSources = getAllMediaSources(entity);
    
    // Check if any source is a video file
    for (const source of allSources) {
      if (isVideoFile(source.url)) {
        console.log('🎬 Video detected from source:', source.source, source.url);
        return 'video';
      }
    }
    
    return 'image';
  };

  // ✅ Get cover video URL - FIXED
  const getCoverVideo = (entity) => {
    if (!entity) return null;
    
    const allSources = getAllMediaSources(entity);
    
    // Find first video source
    for (const source of allSources) {
      if (isVideoFile(source.url)) {
        const url = getImageUrl(source.url);
        console.log('🎬 Video URL found from source:', source.source, url);
        return url;
      }
    }
    
    return null;
  };

  // ✅ Get cover image URL (for poster/fallback) - FIXED
  const getCoverImage = (entity) => {
    if (!entity) return null;
    
    const allSources = getAllMediaSources(entity);
    
    // Find first non-video source (image)
    for (const source of allSources) {
      if (!isVideoFile(source.url)) {
        const url = getImageUrl(source.url);
        if (url) return url;
      }
    }
    
    return null;
  };

  // ✅ Get entity media with video support - FIXED
  const getEntityMedia = (entity) => {
    const defaultImage = 'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=500';
    
    if (!entity) {
      return { url: defaultImage, isVideo: false, videoUrl: null, poster: defaultImage };
    }
    
    if (typeof entity === 'string') {
      return { url: defaultImage, isVideo: false, videoUrl: null, poster: defaultImage };
    }

    // Debug: log all media sources
    const allSources = getAllMediaSources(entity);
    console.log('📋 All media sources:', allSources);
    
    const videoUrl = getCoverVideo(entity);
    const coverImage = getCoverImage(entity);
    const isVideo = !!videoUrl;
    
    console.log('📊 Media result:', { isVideo, videoUrl, coverImage });
    
    if (isVideo && videoUrl) {
      return {
        url: videoUrl,
        isVideo: true,
        videoUrl: videoUrl,
        poster: coverImage || defaultImage,
      };
    }
    
    return {
      url: coverImage || defaultImage,
      isVideo: false,
      videoUrl: null,
      poster: coverImage || defaultImage,
    };
  };

  // Get entity (listing or tour) - FIXED to handle both populated and unpopulated
  const getEntity = (booking) => {
    if (!booking) return {};
    
    // Check if listing is populated
    if (booking.listing && typeof booking.listing === 'object' && booking.listing._id) {
      return booking.listing;
    }
    
    // Check if tour is populated
    if (booking.tour && typeof booking.tour === 'object' && booking.tour._id) {
      return booking.tour;
    }
    
    // If listing is just a string ID but we have the data elsewhere
    // Sometimes the booking might have the listing data at the root level
    if (booking.title || booking.coverImage || booking.coverMedia) {
      return booking;
    }
    
    return {};
  };

  // Get travel date from booking
  const getTravelDate = (booking) => {
    if (booking.startDate) return booking.startDate;
    if (booking.travelDate) return booking.travelDate;
    return null;
  };

  // Get travelers count
  const getTravelers = (booking) => {
    return booking.numberOfPeople || booking.travelers || 1;
  };

  // Get total price
  const getTotalPrice = (booking) => {
    return booking.totalPrice || 0;
  };

  // Check if booking can be cancelled
  const canCancel = (status) => {
    return ['pending_payment', 'paid', 'confirmed'].includes(status);
  };

  // Check if booking can be paid
  const canPay = (status) => {
    return status === 'pending_payment';
  };

  // Check if booking can be reviewed
  const canReview = (status) => {
    return status === 'completed' || status === 'review_eligible';
  };

  // Filter bookings by status
  const upcomingBookings = bookings.filter(
    b => b.status === 'paid' || b.status === 'confirmed' || b.status === 'pending_payment' || b.status === 'in_progress'
  );
  
  const pastBookings = bookings.filter(
    b => b.status === 'completed' || b.status === 'cancelled' || b.status === 'rejected' || b.status === 'refunded'
  );

  const getStatusColor = (status) => {
    const colors = {
      pending_payment: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
      paid: 'bg-[#0D9488]/10 text-[#0D9488] border-[#0D9488]/20',
      confirmed: 'bg-[#0D9488]/10 text-[#0D9488] border-[#0D9488]/20',
      in_progress: 'bg-[#0D9488]/10 text-[#0D9488] border-[#0D9488]/20',
      completed: 'bg-green-100 text-green-600 border-green-200',
      cancelled: 'bg-red-100 text-red-600 border-red-200',
      rejected: 'bg-red-100 text-red-600 border-red-200',
      refunded: 'bg-gray-100 text-gray-600 border-gray-200',
    };
    return colors[status] || colors.pending_payment;
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending_payment: 'Pending Payment',
      paid: 'Paid',
      confirmed: 'Confirmed',
      in_progress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled',
      rejected: 'Rejected',
      refunded: 'Refunded',
    };
    return labels[status] || status;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending_payment: Clock,
      paid: CheckCircle,
      confirmed: CheckCircle,
      in_progress: Clock,
      completed: CheckCircle,
      cancelled: XCircle,
      rejected: XCircle,
      refunded: CheckCircle,
    };
    return icons[status] || Clock;
  };

  // ✅ Media Component - handles both image and video
  const MediaDisplay = ({ media, title, className }) => {
    const [videoError, setVideoError] = useState(false);
    const [imageError, setImageError] = useState(false);
    
    // If we have a video and no video error, render video
    if (media.isVideo && media.videoUrl && !videoError) {
      return (
        <div className="relative w-full h-full min-h-[192px] md:min-h-full bg-black">
          <video
            key={media.videoUrl}
            src={media.videoUrl}
            className={className || "w-full h-full object-cover"}
            autoPlay
            muted
            loop
            playsInline
            poster={media.poster}
            onError={(e) => {
              console.error('❌ Video error:', media.videoUrl, e);
              setVideoError(true);
              e.target.style.display = 'none';
              // Show fallback image
              const parent = e.target.parentElement;
              if (parent) {
                const img = document.createElement('img');
                img.src = media.poster || 'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=500';
                img.className = className || "w-full h-full object-cover";
                img.alt = title || 'Media';
                img.onerror = () => {
                  img.src = 'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=500';
                };
                parent.appendChild(img);
              }
            }}
            onLoadedData={() => {
              console.log('✅ Video loaded successfully:', media.videoUrl);
            }}
          />
          {/* Video overlay with play icon */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-12 h-12 rounded-full bg-[#0D9488]/80 backdrop-blur flex items-center justify-center">
              <Play className="w-5 h-5 text-white" />
            </div>
          </div>
          {/* Video badge */}
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 pointer-events-none">
            <Video className="w-3 h-3" />
            Video
          </div>
        </div>
      );
    }
    
    // Fallback to image
    const imageSrc = imageError ? 'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=500' : media.url;
    
    return (
      <img
        src={imageSrc}
        alt={title || 'Trip image'}
        className={className || "w-full h-full object-cover"}
        onError={(e) => {
          console.error('❌ Image error:', media.url);
          setImageError(true);
          e.target.src = 'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=500';
        }}
      />
    );
  };

  const TripCard = ({ booking }) => {
    const entity = getEntity(booking);
    const StatusIcon = getStatusIcon(booking.status);
    const isExpanded = expandedTrip === booking._id;
    const travelDate = getTravelDate(booking);
    const travelers = getTravelers(booking);
    const totalPrice = getTotalPrice(booking);
    const isCancellable = canCancel(booking.status);
    const isPayable = canPay(booking.status);
    const isReviewable = canReview(booking.status);
    
    // ✅ Get media with proper URL
    const media = getEntityMedia(entity);
    const entityTitle = entity.title || booking.title || 'Experience';
    const entityLocation = entity.location || booking.location || 'Location not specified';

    console.log(`📋 TripCard ${booking._id}:`, {
      entityTitle,
      mediaType: media.isVideo ? 'video' : 'image',
      mediaUrl: media.url,
      videoUrl: media.videoUrl,
      entityFields: Object.keys(entity),
    });

    return (
      <Card hover className="overflow-hidden border border-gray-100 dark:border-gray-800 rounded-3xl">
        <div className="grid md:grid-cols-3">
          {/* Media - Image or Video */}
          <div className="relative md:col-span-1 bg-gray-100 dark:bg-gray-800 min-h-[192px] md:min-h-full">
            <MediaDisplay 
              media={media} 
              title={entityTitle}
              className="w-full h-48 md:h-full object-cover"
            />
            
            <div className="absolute top-3 left-3">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(booking.status)}`}>
                <StatusIcon className="w-3 h-3" />
                {getStatusLabel(booking.status)}
              </span>
            </div>
            
            {/* Price Badge */}
            {totalPrice > 0 && (
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                ${totalPrice}
              </div>
            )}

            {/* Video indicator badge on top */}
            {media.isVideo && (
              <div className="absolute top-3 right-3 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                <Play className="w-3 h-3" />
                Video
              </div>
            )}
          </div>

          {/* Content */}
          <div className="md:col-span-2 p-5">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl font-bold text-[#374151] dark:text-white line-clamp-1">
                    {entityTitle}
                  </h3>
                  {media.isVideo && (
                    <span className="inline-flex items-center gap-1 text-xs text-[#0D9488] bg-[#0D9488]/10 px-2 py-0.5 rounded-full">
                      <Play className="w-3 h-3" />
                      Video Cover
                    </span>
                  )}
                </div>
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mt-1">
                  <MapPin className="w-4 h-4 mr-1 text-[#0D9488]" />
                  <span>{entityLocation}</span>
                </div>
                {booking.bookingCode && (
                  <p className="text-xs text-gray-400 mt-1">
                    Ref: {booking.bookingCode}
                  </p>
                )}
              </div>
              <button 
                onClick={() => setExpandedTrip(isExpanded ? null : booking._id)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition"
              >
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2">
                <Calendar className="w-4 h-4 mr-2 text-[#0D9488]" />
                <span className="text-sm">
                  {travelDate 
                    ? new Date(travelDate).toLocaleDateString()
                    : 'Date not set'}
                </span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2">
                <Users className="w-4 h-4 mr-2 text-[#F59E0B]" />
                <span className="text-sm">
                  {travelers} {travelers > 1 ? 'Travelers' : 'Traveler'}
                </span>
              </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
              <div className="mb-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 animate-fade-in">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Booking Reference</p>
                    <p className="font-mono font-semibold text-[#0D9488] text-xs">
                      {booking.bookingCode || booking._id?.slice(0, 8)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Payment Status</p>
                    <p className={`font-semibold ${
                      booking.paymentStatus === 'paid' ? 'text-[#0D9488]' : 'text-[#F59E0B]'
                    }`}>
                      {booking.paymentStatus || 'Pending'}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">Total Price</p>
                    <p className="font-bold text-[#0D9488]">${totalPrice}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Link to={`/trip/${booking._id}`} className="flex-1">
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="w-full bg-gradient-to-r from-[#0D9488] to-[#F59E0B] shadow-lg shadow-[#0D9488]/30 hover:scale-[1.02] transition text-sm"
                >
                  View Details
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              
              {isPayable && (
                <Link to={`/payment/${booking._id}`} className="flex-1">
                  <Button 
                    variant="primary" 
                    size="sm"
                    className="w-full bg-[#F59E0B] text-white hover:bg-[#F59E0B]/80 transition text-sm"
                  >
                    <CreditCard className="w-4 h-4 mr-1" />
                    Pay Now
                  </Button>
                </Link>
              )}
              
              {isCancellable && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleCancel(booking._id)}
                  disabled={cancelling === booking._id}
                  className="border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                >
                  {cancelling === booking._id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Cancel'
                  )}
                </Button>
              )}

              {isReviewable && !booking.reviewSubmitted && (
                <Link to={`/review/${booking._id}`}>
                  <Button 
                    variant="primary" 
                    size="sm"
                    className="bg-[#0D9488] text-white hover:bg-[#0D9488]/80 transition text-sm"
                  >
                    <Star className="w-4 h-4 mr-1" />
                    Review
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488]/20" />
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488] border-t-transparent animate-spin" />
        </div>
        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading your trips...</p>
      </div>
    );
  }

  const currentBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-8 animate-fade-in pb-20 md:pb-6">

      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#F59E0B] flex items-center justify-center shadow-lg">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#374151] dark:text-white">
                My Trips
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Manage your upcoming and past adventures
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Sparkles className="w-4 h-4 text-[#0D9488]" />
          <span>{bookings.length} total bookings</span>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-6 py-3 font-semibold transition-all relative ${
            activeTab === 'upcoming'
              ? 'text-[#0D9488]'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Upcoming
            <span className="text-xs bg-[#0D9488]/10 text-[#0D9488] px-2 py-0.5 rounded-full">
              {upcomingBookings.length}
            </span>
          </div>
          {activeTab === 'upcoming' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0D9488]"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-6 py-3 font-semibold transition-all relative ${
            activeTab === 'past'
              ? 'text-[#0D9488]'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Past Trips
            <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
              {pastBookings.length}
            </span>
          </div>
          {activeTab === 'past' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0D9488]"></div>
          )}
        </button>
      </div>

      {/* TRIP LIST */}
      {currentBookings.length > 0 ? (
        <div className="space-y-6">
          {currentBookings.map(booking => (
            <TripCard key={booking._id} booking={booking} />
          ))}
        </div>
      ) : (
        <div className="col-span-full text-center py-16 bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800">
          {activeTab === 'upcoming' ? (
            <>
              <div className="w-20 h-20 rounded-full bg-[#0D9488]/10 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-[#0D9488]" />
              </div>
              <h3 className="text-xl font-bold text-[#374151] dark:text-white mb-2">
                No upcoming trips
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Start planning your next adventure
              </p>
              <Link to="/explore">
                <Button className="bg-gradient-to-r from-[#0D9488] to-[#F59E0B] shadow-lg shadow-[#0D9488]/30 hover:scale-[1.02] transition">
                  Explore Experiences
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-[#374151] dark:text-white mb-2">
                No past trips yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Your completed trips will appear here
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Trips;