// src/pages/Explore.jsx
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  DollarSign,
  ChevronDown,
  Grid3x3,
  List,
  TrendingUp,
  Sparkles,
  Compass,
  Navigation,
  Loader2,
  Eye,
  Calendar,
  Award,
  Zap,
} from 'lucide-react';
import { getTours } from '../services/tourService';
import { useAuth } from '../contexts/AuthContext';

const Explore = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null);
  
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 2000 },
    duration: '',
    travelers: '',
    minRating: 0,
    location: '',
  });
  
  const [sortBy, setSortBy] = useState('recommended');

  useEffect(() => {
    fetchTours();
    loadFavorites();
  }, []);

  useEffect(() => {
    filterAndSortTours();
  }, [tours, searchTerm, filters, sortBy]);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const data = await getTours();
      setTours(data.tours || data || []);
      
      // Simulate AI recommendations based on user behavior
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error fetching tours:', error);
      setLoading(false);
    }
  };

  const loadFavorites = () => {
    const saved = localStorage.getItem('favoriteTours');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  };

  const toggleFavorite = (tourId) => {
    let newFavorites;
    if (favorites.includes(tourId)) {
      newFavorites = favorites.filter(id => id !== tourId);
    } else {
      newFavorites = [...favorites, tourId];
    }
    setFavorites(newFavorites);
    localStorage.setItem('favoriteTours', JSON.stringify(newFavorites));
  };

  const filterAndSortTours = () => {
    let result = [...tours];
    
    // Search filter
    if (searchTerm) {
      result = result.filter(tour => 
        tour.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Price range filter
    result = result.filter(tour => 
      tour.price >= filters.priceRange.min && 
      tour.price <= filters.priceRange.max
    );
    
    // Location filter
    if (filters.location) {
      result = result.filter(tour => 
        tour.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    // Rating filter
    if (filters.minRating > 0) {
      result = result.filter(tour => (tour.rating || 0) >= filters.minRating);
    }
    
    // Duration filter
    if (filters.duration) {
      result = result.filter(tour => 
        tour.duration?.toLowerCase().includes(filters.duration.toLowerCase())
      );
    }
    
    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'popular':
        result.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'recommended':
        // AI-based recommendation: combine rating, popularity, and recency
        result.sort((a, b) => {
          const scoreA = (a.rating || 0) * 0.4 + (a.views || 0) * 0.3 + (a.price > 500 ? 10 : 0);
          const scoreB = (b.rating || 0) * 0.4 + (b.views || 0) * 0.3 + (b.price > 500 ? 10 : 0);
          return scoreB - scoreA;
        });
        break;
      default:
        break;
    }
    
    setFilteredTours(result);
  };

  const clearFilters = () => {
    setFilters({
      priceRange: { min: 0, max: 2000 },
      duration: '',
      travelers: '',
      minRating: 0,
      location: '',
    });
    setSearchTerm('');
    setSortBy('recommended');
  };

  const TourCard = ({ tour, index }) => {
    const isFavorite = favorites.includes(tour._id);
    const imageUrl = tour.images?.[0] || tour.image || `https://via.placeholder.com/600x400?text=${tour.title}`;
    
    return (
      <div
        className="group relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden animate-fade-in-up cursor-pointer"
        style={{ animationDelay: `${index * 50}ms` }}
        onClick={() => navigate(`/tour/${tour._id}`)}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden h-64">
          <img
            src={imageUrl.startsWith('http') ? imageUrl : `http://localhost:5000/uploads/${imageUrl}`}
            alt={tour.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {tour.isFeatured && (
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg flex items-center gap-1">
                <Award className="w-3 h-3" />
                Featured
              </div>
            )}
            {tour.isTrending && (
              <div className="bg-gradient-to-r from-red-500 to-pink-500 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Trending
              </div>
            )}
          </div>
          
          {/* Rating */}
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-xs font-bold text-white">{tour.rating || 4.5}</span>
          </div>
          
          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(tour._id);
            }}
            className="absolute bottom-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-2 rounded-full shadow-lg hover:scale-110 transition-all duration-300"
          >
            <Heart className={`w-5 h-5 transition-colors ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
          </button>
          
          {/* Price Badge */}
          <div className="absolute bottom-3 left-3 bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-1.5 rounded-full shadow-lg">
            <span className="text-white font-bold">${tour.price}</span>
            <span className="text-white/80 text-xs ml-1">/person</span>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-5 space-y-3">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1 mb-1">
              {tour.title}
            </h3>
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span className="line-clamp-1">{tour.location}</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {tour.description}
          </p>
          
          {/* Details */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{tour.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{tour.travelers} max</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Eye className="w-3 h-3" />
              <span>{tour.views || 0} views</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ListCard = ({ tour, index }) => {
    const isFavorite = favorites.includes(tour._id);
    const imageUrl = tour.images?.[0] || tour.image;
    
    return (
      <div
        className="group bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden animate-fade-in-up cursor-pointer"
        style={{ animationDelay: `${index * 50}ms` }}
        onClick={() => navigate(`/tour/${tour._id}`)}
      >
        <div className="flex flex-col md:flex-row">
          <div className="relative md:w-64 h-48 md:h-auto overflow-hidden">
            <img
              src={imageUrl?.startsWith('http') ? imageUrl : `http://localhost:5000/uploads/${imageUrl}`}
              alt={tour.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(tour._id);
              }}
              className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow-lg hover:scale-110 transition"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
            </button>
          </div>
          
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {tour.title}
                </h3>
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span>{tour.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-lg">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="font-semibold">{tour.rating || 4.5}</span>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
              {tour.description}
            </p>
            
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{tour.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Users className="w-4 h-4" />
                  <span>{tour.travelers} travelers</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold text-blue-600">
                  ${tour.price}
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-blue-200 dark:border-blue-900 rounded-full"></div>
            <div className="absolute top-0 left-0 w-24 h-24 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <Compass className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-600 animate-pulse" />
          </div>
          <h2 className="mt-6 text-xl font-semibold text-gray-700 dark:text-gray-300">
            Discovering Amazing Tours
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Finding the best experiences for you...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section with AI Recommendation */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 blur-3xl rounded-full"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">AI-Powered Travel Recommendations</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Discover Your Next Adventure
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Explore breathtaking destinations with personalized AI recommendations
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mt-8">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by destination, activity, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-14 pl-12 pr-24 rounded-2xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-2xl focus:ring-2 focus:ring-purple-500 border-0"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-sm">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Bar */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{filteredTours.length}</p>
              <p className="text-sm text-gray-500">Tours Available</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {[...new Set(tours.map(t => t.location))].length}
              </p>
              <p className="text-sm text-gray-500">Destinations</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-pink-600">
                ${Math.round(tours.reduce((sum, t) => sum + (t.price || 0), 0) / tours.length || 0)}
              </p>
              <p className="text-sm text-gray-500">Avg. Price</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {Math.round((filteredTours.length / (tours.length || 1)) * 100)}%
              </p>
              <p className="text-sm text-gray-500">Match Rate</p>
            </div>
          </div>
        </div>
        
        {/* Filters and Controls Bar */}
        <div className="sticky top-16 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-lg mb-6 p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
                {Object.values(filters).some(v => v !== 0 && v !== '' && v.min !== 0) && (
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                )}
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowSort(!showSort)}
                  className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 transition flex items-center gap-2"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Sort: {sortBy === 'recommended' ? 'Recommended' : 
                         sortBy === 'price-low' ? 'Price: Low to High' :
                         sortBy === 'price-high' ? 'Price: High to Low' :
                         sortBy === 'rating' ? 'Top Rated' : 'Most Popular'}
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {showSort && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 overflow-hidden z-20 animate-fade-in">
                    {[
                      { value: 'recommended', label: 'Recommended for You' },
                      { value: 'price-low', label: 'Price: Low to High' },
                      { value: 'price-high', label: 'Price: High to Low' },
                      { value: 'rating', label: 'Top Rated' },
                      { value: 'popular', label: 'Most Popular' },
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setShowSort(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition ${
                          sortBy === option.value ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : ''
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow' : ''}`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow' : ''}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <p className="text-sm text-gray-500">
              Showing {filteredTours.length} of {tours.length} tours
            </p>
          </div>
          
          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-slide-down">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Price Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceRange.min}
                      onChange={(e) => setFilters({
                        ...filters,
                        priceRange: { ...filters.priceRange, min: Number(e.target.value) }
                      })}
                      className="flex-1 px-3 py-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceRange.max}
                      onChange={(e) => setFilters({
                        ...filters,
                        priceRange: { ...filters.priceRange, max: Number(e.target.value) }
                      })}
                      className="flex-1 px-3 py-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="Anywhere"
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Min Rating</label>
                  <div className="flex gap-1">
                    {[0, 3, 4, 4.5].map(rating => (
                      <button
                        key={rating}
                        onClick={() => setFilters({ ...filters, minRating: rating })}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                          filters.minRating === rating
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600'
                        }`}
                      >
                        {rating === 0 ? 'Any' : `${rating}+`}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Duration</label>
                  <input
                    type="text"
                    placeholder="Any"
                    value={filters.duration}
                    onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border dark:border-gray-700 dark:bg-gray-800"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Tours Grid/List */}
        {filteredTours.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Compass className="w-12 h-12 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2 dark:text-white">No Tours Found</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              We couldn't find any tours matching your criteria
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold"
            >
              Clear All Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTours.map((tour, index) => (
              <TourCard key={tour._id} tour={tour} index={index} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTours.map((tour, index) => (
              <ListCard key={tour._id} tour={tour} index={index} />
            ))}
          </div>
        )}
        
        {/* Load More */}
        {filteredTours.length > 0 && filteredTours.length < tours.length && (
          <div className="text-center mt-8">
            <button className="px-8 py-3 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-xl font-semibold hover:border-purple-500 transition-all">
              Load More Tours
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;