// src/pages/TourDetails.jsx

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin, Clock, Users, Star, Loader2, Sparkles, Calendar,
  CheckCircle, X, ChevronLeft, ChevronRight, Play, Shield,
  Award, Mail, Phone, Building2, ThumbsUp, Heart, Share2,
  Video, Info, List, Check, Camera, CreditCard,
  UserCheck, ZoomIn, Maximize, Minimize, Verified,
  Image as ImageIcon,
} from 'lucide-react';

import { getTourById } from '../services/tourService';
import { createCheckout } from '../services/paymentService';
import { useAuth } from '../contexts/AuthContext';
import {
getTourReviews,
createReview
}
from "../services/reviewService";

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
// HERO MEDIA AREA - Fixed Photo/Video Viewer
// ================================================================
const HeroMediaArea = ({ 
  images = [], 
  videos = [], 
  title = '',
  initialIndex = 0,
  onIndexChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isVideo, setIsVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const videoRef = useRef(null);
  
  const allMedia = [
    ...images.map(img => ({ type: 'image', src: img })),
    ...videos.map(vid => ({ type: 'video', src: vid })),
  ];

  const totalItems = allMedia.length;
  const currentItem = allMedia[currentIndex] || allMedia[0];

  // Update when initialIndex changes
  useEffect(() => {
    if (initialIndex !== currentIndex && initialIndex < totalItems) {
      setCurrentIndex(initialIndex);
    }
  }, [initialIndex]);

  useEffect(() => {
    setIsVideo(currentItem?.type === 'video');
    if (currentItem?.type === 'video' && videoRef.current) {
      videoRef.current.load();
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [currentIndex, currentItem?.type]);

  const goTo = (index) => {
    if (index >= 0 && index < totalItems) {
      setCurrentIndex(index);
      setIsVideo(allMedia[index]?.type === 'video');
      setIsPlaying(false);
      if (onIndexChange) onIndexChange(index);
    }
  };

  const goPrev = () => goTo(currentIndex - 1);
  const goNext = () => goTo(currentIndex + 1);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const openLightbox = () => {
    if (currentItem?.type === 'image') {
      setShowModal(true);
      document.body.style.overflow = 'hidden';
    }
  };

  const closeLightbox = () => {
    setShowModal(false);
    document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'ArrowRight') goNext();
      else if (e.key === 'Escape') closeLightbox();
      else if (e.key === ' ' && currentItem?.type === 'video') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentIndex, currentItem?.type]);

  if (totalItems === 0) {
    return (
      <div className="relative aspect-video bg-gray-200 dark:bg-gray-800 rounded-3xl overflow-hidden flex items-center justify-center">
        <ImageIcon className="w-20 h-20 text-gray-400" />
        <span className="absolute bottom-4 text-gray-500 text-sm">No media available</span>
      </div>
    );
  }

  return (
    <>
      <div className="relative aspect-video bg-black rounded-3xl overflow-hidden group">
        
        {currentItem?.type === 'image' ? (
          <img
            src={toUrl(currentItem.src)}
            alt={`${title} ${currentIndex + 1}`}
            className="w-full h-full object-contain cursor-zoom-in"
            onClick={openLightbox}
            onError={(e) => { e.target.src = '/placeholder-tour.jpg'; }}
          />
        ) : (
          <video
            ref={videoRef}
            src={toVideoUrl(currentItem.src)}
            className="w-full h-full object-contain"
            onClick={togglePlay}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            playsInline
          />
        )}

        {/* Media Type Badge */}
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
          {currentItem?.type === 'video' ? (
            <><Video className="w-3.5 h-3.5" /> Video</>
          ) : (
            <><ImageIcon className="w-3.5 h-3.5" /> Photo</>
          )}
          <span className="opacity-50">•</span>
          <span>{currentIndex + 1} / {totalItems}</span>
        </div>

        {/* Play/Pause Button for Videos */}
        {currentItem?.type === 'video' && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-all duration-300"
          >
            {!isPlaying && (
              <div className="w-20 h-20 rounded-full bg-[#0D9488]/90 backdrop-blur flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-2xl">
                <Play className="w-10 h-10 text-white ml-1" />
              </div>
            )}
          </button>
        )}

        {/* Video Progress Bar */}
        {currentItem?.type === 'video' && (
          <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20">
            <div className="h-full bg-[#0D9488] w-0" />
          </div>
        )}

        {/* Navigation Arrows */}
        {totalItems > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 bg-black/50 rounded-full hover:bg-black/70 transition opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 bg-black/50 rounded-full hover:bg-black/70 transition opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Pagination Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {allMedia.map((item, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex 
                  ? 'bg-white w-6' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        {/* Media Counter */}
        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur text-white text-xs px-3 py-1.5 rounded-full">
          {currentItem?.type === 'video' ? '▶' : '🖼'} {currentIndex + 1}/{totalItems}
        </div>
      </div>

      {/* Lightbox Modal for Images */}
      {showModal && (
        <div 
          className="fixed inset-0 z-[100] bg-black/98 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 text-white/70 hover:text-white p-2 bg-black/50 rounded-full transition z-10"
          >
            <X className="w-7 h-7" />
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 bg-black/50 rounded-full hover:bg-black/70 transition z-10"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 bg-black/50 rounded-full hover:bg-black/70 transition z-10"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <img
            src={toUrl(currentItem?.src)}
            alt={`${title} ${currentIndex + 1}`}
            className="max-w-[95vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/50 text-sm">
            {currentIndex + 1} / {totalItems}
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
  if (!images.length) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-[#374151] dark:text-white flex items-center gap-2">
        <Camera className="w-5 h-5 text-[#0D9488]" />
        Gallery
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(idx)}
            className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer hover:ring-2 hover:ring-[#0D9488] transition-all"
          >
            <img
              src={toUrl(img)}
              alt={`${title} ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              onError={(e) => { e.target.src = '/placeholder-tour.jpg'; }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
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
  if (!videos.length) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-[#374151] dark:text-white flex items-center gap-2">
        <Video className="w-5 h-5 text-[#0D9488]" />
        Tour Videos
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((v, i) => (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className="relative group rounded-2xl overflow-hidden bg-gray-900 aspect-video cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <video src={toVideoUrl(v)} className="w-full h-full object-cover" muted playsInline />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-[#0D9488]/90 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Play className="w-6 h-6 text-white ml-1" />
              </div>
            </div>
            <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
              <Video className="w-3 h-3" /> Video {i + 1}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

// ================================================================
// PROVIDER CARD
// ================================================================
const ProviderCard = ({ provider }) => {
  if (!provider) return null;
  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-6 border border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0D9488] to-[#F59E0B] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
          {provider.name?.charAt(0) || 'P'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-bold text-[#374151] dark:text-white truncate">{provider.name || 'Provider'}</h3>
            <Verified className="w-5 h-5 text-[#0D9488] flex-shrink-0" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Building2 className="w-3 h-3" /> Verified Provider
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {provider.email && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2 min-w-0">
            <Mail className="w-4 h-4 text-[#0D9488] flex-shrink-0" />
            <span className="truncate">{provider.email}</span>
          </div>
        )}
        {provider.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2">
            <Phone className="w-4 h-4 text-[#F59E0B] flex-shrink-0" />
            <span>{provider.phone}</span>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="flex items-center gap-1 text-xs text-[#0D9488] bg-[#0D9488]/10 px-3 py-1 rounded-full">
          <Shield className="w-3 h-3" /> Verified Identity
        </span>
        <span className="flex items-center gap-1 text-xs text-[#F59E0B] bg-[#F59E0B]/10 px-3 py-1 rounded-full">
          <Award className="w-3 h-3" /> Top Rated
        </span>
        <span className="flex items-center gap-1 text-xs text-[#374151] bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
          <ThumbsUp className="w-3 h-3" /> 100+ Bookings
        </span>
      </div>
    </div>
  );
};

// ================================================================
// TRUST BADGES
// ================================================================
const TrustBadges = () => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
    {[
      { Icon: CheckCircle, label: 'Instant Confirm', color: C.teal },
      { Icon: CreditCard,  label: 'Secure Payment',  color: C.gold },
      { Icon: Shield,      label: 'Verified Provider', color: C.teal },
      { Icon: Sparkles,    label: 'AI Tour Protected', color: C.gold },
    ].map(({ Icon, label, color }) => (
      <div key={label} className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: `${color}15` }}>
        <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
        <span className="text-xs font-medium text-[#374151] dark:text-white leading-tight">{label}</span>
      </div>
    ))}
  </div>
);

// ================================================================
// BOOKING MODAL
// ================================================================
const BookingModal = ({ tour, onClose }) => {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName:   user?.name  || '',
    email:      user?.email || '',
    phone:      '',
    travelers:  1,
    travelDate: '',
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const total = (tour.price * form.travelers).toFixed(2);

  const handleSubmit = async () => {
    if (!user) { alert('Please login to book a tour'); navigate('/login'); return; }
    if (!form.fullName || !form.email || !form.phone || !form.travelDate) {
      alert('Please fill in all required fields.'); return;
    }
    try {
      setLoading(true);
      const data = await createCheckout({
        userId:     user._id,
        tourId:     tour._id,
        title:      tour.title,
        price:      tour.price,
        ...form,
      });
      if (data?.url) window.location.href = data.url;
    } catch (err) {
      alert(err.response?.data?.message || 'Payment initialization failed');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, children }) => (
    <div>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">{label} *</label>
      {children}
    </div>
  );

  const inputCls = "w-full h-14 px-4 rounded-2xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition outline-none text-sm";

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start p-8 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-[#374151] dark:text-white">Book This Tour</h2>
            <p className="text-sm text-gray-500 mt-1 line-clamp-1">{tour.title} • {tour.location}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition flex-shrink-0 ml-4">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="px-8 pb-8 space-y-4">
          <Field label="Full Name">
            <input type="text" placeholder="Enter your full name" value={form.fullName} onChange={e => set('fullName', e.target.value)} className={inputCls} />
          </Field>

          <Field label="Email">
            <input type="email" placeholder="Enter your email" value={form.email} onChange={e => set('email', e.target.value)} className={inputCls} />
          </Field>

          <Field label="Phone">
            <input type="tel" placeholder="+250 7XX XXX XXX" value={form.phone} onChange={e => set('phone', e.target.value)} className={inputCls} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Travelers">
              <input type="number" min={1} max={tour.travelers || 20} value={form.travelers} onChange={e => set('travelers', Math.max(1, parseInt(e.target.value) || 1))} className={inputCls} />
            </Field>
            <Field label="Travel Date">
              <input type="date" min={new Date().toISOString().split('T')[0]} value={form.travelDate} onChange={e => set('travelDate', e.target.value)} className={inputCls} />
            </Field>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600 dark:text-gray-300">
              <span>${tour.price} × {form.travelers} traveler{form.travelers > 1 ? 's' : ''}</span>
              <span className="font-semibold text-[#0D9488]">${total}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2 font-bold text-[#374151] dark:text-white">
              <span>Total</span>
              <span className="text-[#0D9488] text-base">${total}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 h-14 rounded-2xl border border-gray-200 dark:border-gray-700 font-bold text-[#374151] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition text-sm">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-[#0D9488] to-[#F59E0B] text-white font-bold shadow-lg shadow-[#0D9488]/30 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 text-sm"
            >
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : <><CreditCard className="w-5 h-5" /> Pay ${total}</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
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
  const [tour,       setTour]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [activeTab,  setActiveTab]  = useState('about');
  const [showBooking, setShowBooking] = useState(false);
  const [saved,      setSaved]      = useState(false);
  const [heroIndex,  setHeroIndex]  = useState(0);
  const [reviews,setReviews]=useState([]);

const [reviewLoading,setReviewLoading]=useState(false);

const [reviewForm,setReviewForm]=useState({

rating:5,

comment:""

});

  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      try {
        setLoading(true);
        const data = await getTourById(id);
        setTour(data.tour);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleGallerySelect = (index) => {
    setHeroIndex(index);
    // Scroll to hero
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
                    <p className="text-white/60 text-xs">All taxes & fees included</p>
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