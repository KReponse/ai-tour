// src/pages/Explore.jsx

import React, {
  useEffect,
  useState,
  useMemo,
} from 'react';

import { useNavigate } from 'react-router-dom';

import {
  Search,
  Filter,
  MapPin,
  Star,
  SlidersHorizontal,
  X,
  Heart,
  Clock,
  Users,
  ChevronDown,
  Grid3x3,
  List,
  TrendingUp,
  Sparkles,
  Compass,
  Eye,
  Award,
  Play,
} from 'lucide-react';

// ✅ FIXED: Use listingService instead of tourService
import { getListings } from '../services/listingService';
import VideoCard from "../components/ui/VideoCard";

// ===============================
// AI TOUR COLORS
// ===============================
// Teal  : #0D9488
// Gold  : #F59E0B
// Slate : #374151
// White : #FFFFFF
// ===============================

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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

const Explore = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [sortBy, setSortBy] = useState('recommended');
  const [imageErrors, setImageErrors] = useState({});
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 5000,
    location: '',
    minRating: 0,
  });

  // ================= FETCH DATA =================
  useEffect(() => {
    fetchAllData();
    const saved = localStorage.getItem('favoriteTours');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      // ✅ FIXED: Use getListings from listingService
      const listingsData = await getListings({ limit: 50 });
      const listingsList = listingsData?.listings || [];
      setTours(listingsList);

      // ✅ Fetch videos from backend
      const videosRes = await fetch(`${API_URL}/api/videos`);
      const videosData = await videosRes.json();
      setVideos(videosData?.videos || []);

    } catch (error) {
      console.error('❌ Error fetching data:', error);
      setTours([]);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= FAVORITES =================
  const toggleFavorite = (tourId) => {
    let updated = [];
    if (favorites.includes(tourId)) {
      updated = favorites.filter((id) => id !== tourId);
    } else {
      updated = [...favorites, tourId];
    }
    setFavorites(updated);
    localStorage.setItem('favoriteTours', JSON.stringify(updated));
  };

  // ================= AI RECOMMENDED TOURS =================
  const aiRecommendedTours = useMemo(() => {
    const sorted = [...tours].sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    return sorted.slice(0, 3);
  }, [tours]);

  // ================= FILTERED ITEMS (Tours + Videos) =================
  const filteredItems = useMemo(() => {
    let result = [];

    // Filter tours
    let tourResult = [...tours];

    if (searchTerm) {
      tourResult = tourResult.filter(
        (tour) =>
          tour.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tour.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tour.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    tourResult = tourResult.filter(
      (tour) => tour.price >= filters.minPrice && tour.price <= filters.maxPrice
    );

    if (filters.location) {
      tourResult = tourResult.filter((tour) =>
        tour.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Sort tours
    switch (sortBy) {
      case 'price-low':
        tourResult.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        tourResult.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        tourResult.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      case 'recommended':
        tourResult.sort((a, b) => {
          const scoreA = (a.views || 0) + (a.averageRating || 0) * 10;
          const scoreB = (b.views || 0) + (b.averageRating || 0) * 10;
          return scoreB - scoreA;
        });
        break;
      default:
        tourResult.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Filter videos from backend
    let videoResult = [...videos];
    if (searchTerm) {
      videoResult = videoResult.filter((video) =>
        video.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply tab filter
    if (activeTab === 'tours') {
      result = tourResult.map(item => ({ ...item, type: 'tour' }));
    } else if (activeTab === 'videos') {
      result = videoResult.map(item => ({ ...item, type: 'video' }));
    } else if (activeTab === 'ai-picks') {
      // ✅ AI picks: tours with rating >= 4.0
      const aiPicks = tourResult.filter(t => (t.averageRating || 0) >= 4.0).slice(0, 6);
      result = aiPicks.map(item => ({ ...item, type: 'tour' }));
    } else {
      // All - Mix tours and videos
      const mixed = [];
      const tourItems = tourResult.map(t => ({ ...t, type: 'tour' }));
      const videoItems = videoResult.map(v => ({ ...v, type: 'video' }));
      
      let tourIndex = 0;
      let videoIndex = 0;
      
      while (tourIndex < tourItems.length || videoIndex < videoItems.length) {
        for (let i = 0; i < 2 && tourIndex < tourItems.length; i++) {
          mixed.push(tourItems[tourIndex++]);
        }
        if (videoIndex < videoItems.length) {
          mixed.push(videoItems[videoIndex++]);
        }
      }
      
      result = mixed;
    }

    return result;
  }, [tours, videos, searchTerm, filters, sortBy, activeTab]);

  // ================= IMAGE URL =================
  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith('http')) return image;
    if (image.startsWith('/')) return image;
    return `${API_URL}/uploads/${image}`;
  };

  const getTourImage = (tour) => {
    if (tour.coverImage) return getImageUrl(tour.coverImage);
    if (tour.galleryImages && tour.galleryImages.length > 0) return getImageUrl(tour.galleryImages[0]);
    if (tour.images && tour.images.length > 0) return getImageUrl(tour.images[0]);
    return null;
  };

  const handleImageError = (tourId) => {
    setImageErrors((prev) => ({ ...prev, [tourId]: true }));
  };

  const getImageWithFallback = (tour) => {
    if (imageErrors[tour._id]) {
      return getFallbackImage(tour._id);
    }
    const image = getTourImage(tour);
    return image || getFallbackImage(tour._id);
  };

  // ================= RENDER TOUR CARD =================
  const TourCard = ({ tour }) => {
    const isFavorite = favorites.includes(tour._id);
    const imageUrl = getImageWithFallback(tour);
    const rating = tour.averageRating || 0;
    const ratingDisplay = rating > 0 ? rating.toFixed(1) : 'New';
    // ✅ Only show AI Pick badge if rating >= 4.0
    const isAIPick = rating >= 4.0;

    return (
      <div
        onClick={() => navigate(`/tour/${tour._id}`)}
        className="
          group
          bg-white
          dark:bg-gray-900
          rounded-3xl
          overflow-hidden
          shadow-lg
          hover:shadow-2xl
          transition-all
          duration-500
          cursor-pointer
          border
          border-gray-100
          dark:border-gray-800
        "
      >
        <div className="relative overflow-hidden h-64 bg-gray-100 dark:bg-gray-800">
          <img
            src={imageUrl}
            alt={tour.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={() => handleImageError(tour._id)}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          
          {/* ✅ Only show AI Pick badge if actually AI recommended */}
          {isAIPick && (
            <div className="absolute top-4 left-4 flex gap-2">
              <div className="bg-[#0D9488] text-white text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                AI Pick
              </div>
            </div>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(tour._id);
            }}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:scale-110 transition"
          >
            <Heart
              className={`w-5 h-5 transition ${
                isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600'
              }`}
            />
          </button>

          <div className="absolute bottom-4 left-4 bg-white text-[#0D9488] px-4 py-2 rounded-xl font-bold shadow-lg">
            ${tour.price}
          </div>

          {tour.status === 'pending' && (
            <div className="absolute top-4 left-20">
              <span className="bg-[#F59E0B] text-white text-xs px-3 py-1 rounded-full font-semibold">
                Pending
              </span>
            </div>
          )}
        </div>

        <div className="p-5">
          <h2 className="text-xl font-bold text-[#374151] dark:text-white mb-2 line-clamp-1">
            {tour.title}
          </h2>
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-3">
            <MapPin className="w-4 h-4 text-[#0D9488]" />
            <span>{tour.location || 'Location not specified'}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
            {tour.description || 'No description available'}
          </p>
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-[#0D9488]" />
                <span>{tour.duration || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-[#F59E0B]" />
                <span>{tour.capacity || tour.travelers || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4 text-gray-400" />
                <span>{tour.views || 0}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-[#F59E0B]/10 dark:bg-[#F59E0B]/20 px-2 py-1 rounded-lg">
              <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
              <span className="text-sm font-semibold text-[#374151] dark:text-white">
                {ratingDisplay}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ================= RENDER VIDEO CARD =================
  const VideoCardWrapper = ({ video }) => {
    // ✅ Map backend video data to VideoCard props
    const videoProps = {
      id: video._id,
      title: video.title,
      thumbnail: video.thumbnail || video.videoUrl,
      views: video.views || 0,
      likes: video.likes || 0,
      duration: video.duration || 0,
      location: video.location || '',
    };

    return (
      <div className="h-full">
        <VideoCard
          video={videoProps}
          onClick={() => navigate(`/video/${video._id}`)}
        />
      </div>
    );
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-[#0D9488]/20 border-t-[#0D9488] rounded-full animate-spin mx-auto" />
          <h2 className="mt-6 text-xl font-bold text-[#374151] dark:text-white">
            Loading Amazing Tours...
          </h2>
        </div>
      </div>
    );
  }

  // ================= MAIN =================
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* HERO */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0D9488] via-[#F59E0B] to-[#374151]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6 backdrop-blur-md">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">AI Powered Tourism</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4">Explore Rwanda</h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Discover unforgettable experiences, adventures and hidden gems with AI Tour Rwanda.
            </p>
          </div>

          {/* SEARCH */}
          <div className="max-w-3xl mx-auto mt-10">
            <div className="relative bg-white rounded-2xl shadow-2xl">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tours, locations, adventures..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-16 pl-14 pr-6 rounded-2xl outline-none text-gray-900 font-medium focus:ring-2 focus:ring-[#0D9488]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* TABS */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
          {[
            { id: 'all', label: 'All', icon: Compass },
            { id: 'tours', label: 'Tours', icon: MapPin },
            { id: 'videos', label: 'Videos', icon: Play },
            { id: 'ai-picks', label: 'AI Picks', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#0D9488] text-white shadow-lg shadow-[#0D9488]/25'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TOP BAR */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 bg-white dark:bg-gray-900 rounded-xl shadow flex items-center gap-2 hover:shadow-lg transition text-[#374151] dark:text-white"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            <div className="relative">
              <button
                onClick={() => setShowSort(!showSort)}
                className="px-4 py-3 bg-white dark:bg-gray-900 rounded-xl shadow flex items-center gap-2 text-[#374151] dark:text-white"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Sort
                <ChevronDown className="w-4 h-4" />
              </button>

              {showSort && (
                <div className="absolute top-full mt-2 w-52 bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden z-50">
                  {[
                    { value: 'recommended', label: 'Recommended' },
                    { value: 'price-low', label: 'Price Low' },
                    { value: 'price-high', label: 'Price High' },
                    { value: 'rating', label: 'Top Rated' },
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => {
                        setSortBy(item.value);
                        setShowSort(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-[#374151] dark:text-white"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex bg-white dark:bg-gray-900 rounded-xl shadow p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg transition ${
                  viewMode === 'grid'
                    ? 'bg-[#0D9488] text-white'
                    : 'text-[#374151] dark:text-white'
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg transition ${
                  viewMode === 'list'
                    ? 'bg-[#0D9488] text-white'
                    : 'text-[#374151] dark:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            {filteredItems.length} items found
          </div>
        </div>

        {/* FILTERS PANEL */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Location"
                value={filters.location}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    location: e.target.value,
                  })
                }
                className="h-12 px-4 rounded-xl border dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    minPrice: Number(e.target.value),
                  })
                }
                className="h-12 px-4 rounded-xl border dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    maxPrice: Number(e.target.value),
                  })
                }
                className="h-12 px-4 rounded-xl border dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* GRID - Tours + Videos mixed */}
        {filteredItems.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-16 text-center shadow-lg">
            <div className="w-24 h-24 mx-auto rounded-full bg-[#0D9488]/10 flex items-center justify-center mb-4">
              <Compass className="w-12 h-12 text-[#0D9488]" />
            </div>
            <h2 className="text-2xl font-bold text-[#374151] dark:text-white mb-2">
              No Results Found
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search, filters, or tab selection.
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, index) => {
              if (item.type === 'video') {
                return <VideoCardWrapper key={`video-${item._id || item.id}`} video={item} />;
              } else {
                return <TourCard key={`tour-${item._id}`} tour={item} />;
              }
            })}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredItems.map((item, index) => {
              if (item.type === 'video') {
                return <VideoCardWrapper key={`video-${item._id || item.id}`} video={item} />;
              } else {
                return <TourCard key={`tour-${item._id}`} tour={item} />;
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;