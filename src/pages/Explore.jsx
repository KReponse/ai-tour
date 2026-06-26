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
} from 'lucide-react';

import { getTours } from '../services/tourService';

// ===============================
// AI TOUR COLORS
// ===============================
// Teal  : #0D9488
// Gold  : #F59E0B
// Slate : #374151
// White : #FFFFFF
// ===============================

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ===============================
// FALLBACK IMAGES
// ===============================
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
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [sortBy, setSortBy] = useState('recommended');
  const [imageErrors, setImageErrors] = useState({});
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 5000,
    location: '',
    minRating: 0,
  });

  /* ================= FETCH TOURS ================= */
  useEffect(() => {
    fetchTours();
    const saved = localStorage.getItem('favoriteTours');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const data = await getTours();
      setTours(data.tours || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FAVORITES ================= */
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

  /* ================= FILTERED TOURS ================= */
  const filteredTours = useMemo(() => {
    let result = [...tours];

    // SEARCH
    if (searchTerm) {
      result = result.filter(
        (tour) =>
          tour.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tour.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tour.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // PRICE
    result = result.filter(
      (tour) => tour.price >= filters.minPrice && tour.price <= filters.maxPrice
    );

    // LOCATION
    if (filters.location) {
      result = result.filter((tour) =>
        tour.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // SORT
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
        break;
      default:
        result.sort((a, b) => (b.views || 0) - (a.views || 0));
    }

    return result;
  }, [tours, searchTerm, filters, sortBy]);

  /* ================= IMAGE URL ================= */
  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith('http')) return image;
    if (image.startsWith('/')) return image;
    return `${API_URL}/uploads/${image}`;
  };

  const getTourImage = (tour) => {
    if (tour.coverImage) return getImageUrl(tour.coverImage);
    if (tour.images && tour.images.length > 0) return getImageUrl(tour.images[0]);
    if (tour.image) return getImageUrl(tour.image);
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

  /* ================= TOUR CARD ================= */
  const TourCard = ({ tour }) => {
    const isFavorite = favorites.includes(tour._id);
    const imageUrl = getImageWithFallback(tour);

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
        {/* IMAGE */}
        <div className="relative overflow-hidden h-64 bg-gray-100 dark:bg-gray-800">
          <img
            src={imageUrl}
            alt={tour.title}
            className="
              w-full
              h-full
              object-cover
              group-hover:scale-110
              transition-transform
              duration-700
            "
            onError={() => handleImageError(tour._id)}
            loading="lazy"
          />

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* TOP BADGES - Updated with AI Tour colors */}
          <div className="absolute top-4 left-4 flex gap-2">
            <div className="
              bg-[#0D9488]
              text-white
              text-xs
              px-3
              py-1
              rounded-full
              font-semibold
              flex
              items-center
              gap-1
            ">
              <Sparkles className="w-3 h-3" />
              AI Pick
            </div>
          </div>

          {/* FAVORITE */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(tour._id);
            }}
            className="
              absolute
              top-4
              right-4
              w-10
              h-10
              rounded-full
              bg-white/90
              flex
              items-center
              justify-center
              shadow-lg
              hover:scale-110
              transition
            "
          >
            <Heart
              className={`
                w-5
                h-5
                transition
                ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600'}
              `}
            />
          </button>

          {/* PRICE - Updated with AI Tour colors */}
          <div className="absolute bottom-4 left-4 bg-white text-[#0D9488] px-4 py-2 rounded-xl font-bold shadow-lg">
            ${tour.price}
          </div>

          {/* Status badge */}
          {tour.status === 'pending' && (
            <div className="absolute top-4 left-20">
              <span className="bg-[#F59E0B] text-white text-xs px-3 py-1 rounded-full font-semibold">
                Pending
              </span>
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-5">
          {/* TITLE */}
          <h2 className="text-xl font-bold text-[#374151] dark:text-white mb-2 line-clamp-1">
            {tour.title}
          </h2>

          {/* LOCATION - Updated with AI Tour colors */}
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-3">
            <MapPin className="w-4 h-4 text-[#0D9488]" />
            <span>{tour.location || 'Location not specified'}</span>
          </div>

          {/* DESCRIPTION */}
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
            {tour.description || 'No description available'}
          </p>

          {/* FOOTER */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-[#0D9488]" />
                <span>{tour.duration || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-[#F59E0B]" />
                <span>{tour.travelers || 0}</span>
              </div>
            </div>

            {/* Rating - Updated with AI Tour colors */}
            <div className="flex items-center gap-1 bg-[#F59E0B]/10 dark:bg-[#F59E0B]/20 px-2 py-1 rounded-lg">
              <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
              <span className="text-sm font-semibold text-[#374151] dark:text-white">
                {tour.rating || 4.8}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="
            w-20
            h-20
            border-4
            border-[#0D9488]/20
            border-t-[#0D9488]
            rounded-full
            animate-spin
            mx-auto
          " />
          <h2 className="mt-6 text-xl font-bold text-[#374151] dark:text-white">
            Loading Amazing Tours...
          </h2>
        </div>
      </div>
    );
  }

  /* ================= MAIN ================= */
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* HERO - Updated with AI Tour colors */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0D9488] via-[#F59E0B] to-[#374151]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6 backdrop-blur-md">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">AI Powered Tourism</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-4">
              Explore Rwanda
            </h1>

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
                className="
                  w-full
                  h-16
                  pl-14
                  pr-6
                  rounded-2xl
                  outline-none
                  text-gray-900
                  font-medium
                  focus:ring-2
                  focus:ring-[#0D9488]
                "
              />
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* TOP BAR */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          {/* LEFT */}
          <div className="flex flex-wrap items-center gap-3">
            {/* FILTER */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="
                px-4
                py-3
                bg-white
                dark:bg-gray-900
                rounded-xl
                shadow
                flex
                items-center
                gap-2
                hover:shadow-lg
                transition
                text-[#374151]
                dark:text-white
              "
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            {/* SORT */}
            <div className="relative">
              <button
                onClick={() => setShowSort(!showSort)}
                className="
                  px-4
                  py-3
                  bg-white
                  dark:bg-gray-900
                  rounded-xl
                  shadow
                  flex
                  items-center
                  gap-2
                  text-[#374151]
                  dark:text-white
                "
              >
                <SlidersHorizontal className="w-4 h-4" />
                Sort
                <ChevronDown className="w-4 h-4" />
              </button>

              {showSort && (
                <div className="
                  absolute
                  top-full
                  mt-2
                  w-52
                  bg-white
                  dark:bg-gray-900
                  rounded-xl
                  shadow-2xl
                  overflow-hidden
                  z-50
                ">
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
                      className="
                        w-full
                        text-left
                        px-4
                        py-3
                        hover:bg-gray-100
                        dark:hover:bg-gray-800
                        transition
                        text-[#374151]
                        dark:text-white
                      "
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* VIEW - Updated with AI Tour colors */}
            <div className="flex bg-white dark:bg-gray-900 rounded-xl shadow p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`
                  p-3
                  rounded-lg
                  transition
                  ${viewMode === 'grid' ? 'bg-[#0D9488] text-white' : 'text-[#374151] dark:text-white'}
                `}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`
                  p-3
                  rounded-lg
                  transition
                  ${viewMode === 'list' ? 'bg-[#0D9488] text-white' : 'text-[#374151] dark:text-white'}
                `}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {filteredTours.length} tours found
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
                className="
                  h-12
                  px-4
                  rounded-xl
                  border
                  dark:border-gray-700
                  dark:bg-gray-800
                  focus:ring-2
                  focus:ring-[#0D9488]
                  focus:border-transparent
                "
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
                className="
                  h-12
                  px-4
                  rounded-xl
                  border
                  dark:border-gray-700
                  dark:bg-gray-800
                  focus:ring-2
                  focus:ring-[#0D9488]
                  focus:border-transparent
                "
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
                className="
                  h-12
                  px-4
                  rounded-xl
                  border
                  dark:border-gray-700
                  dark:bg-gray-800
                  focus:ring-2
                  focus:ring-[#0D9488]
                  focus:border-transparent
                "
              />
            </div>
          </div>
        )}

        {/* TOURS */}
        {filteredTours.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-16 text-center shadow-lg">
            <div className="w-24 h-24 mx-auto rounded-full bg-[#0D9488]/10 flex items-center justify-center mb-4">
              <Compass className="w-12 h-12 text-[#0D9488]" />
            </div>
            <h2 className="text-2xl font-bold text-[#374151] dark:text-white mb-2">
              No Tours Found
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Try another search or filter.
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTours.map((tour) => (
              <TourCard key={tour._id} tour={tour} />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredTours.map((tour) => (
              <TourCard key={tour._id} tour={tour} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;