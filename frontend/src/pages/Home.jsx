// src/pages/Home.jsx
// ✅ UPDATED - Passes coverMediaType in navigation to ListingDetails

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  Sparkles,
  Star,
  ArrowRight,
  Bot,
  Compass,
  Globe,
  Route,
  MessageCircle,
  Search,
  Heart,
  MapPin,
  Clock,
  Users,
  Loader2,
  Play,
  Flame,
  Calendar,
  User,
  Quote,
} from 'lucide-react';

import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import SectionTitle from '../components/ui/SectionTitle';
import MediaCard from '../components/ui/MediaCard';
import { getListings } from '../services/listingService';
import { getPublicReviews } from '../services/reviewService';
import Heroimg from '../assets/images/heroimg.png';

// ===============================
// API CONFIGURATION
// ===============================
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ===============================
// IMAGE HELPERS
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

const getImageUrl = (image) => {
  if (!image) return null;
  if (image.startsWith('http')) return image;
  if (image.startsWith('/')) return image;
  return `${API_URL}/uploads/${image}`;
};

// ✅ Get cover media (supports both image and video)
const getCoverMedia = (listing) => {
  if (listing.coverMedia) {
    return getImageUrl(listing.coverMedia);
  }
  if (listing.coverImage) {
    return getImageUrl(listing.coverImage);
  }
  if (listing.galleryImages && listing.galleryImages.length > 0) {
    return getImageUrl(listing.galleryImages[0]);
  }
  if (listing.images && listing.images.length > 0) {
    return getImageUrl(listing.images[0]);
  }
  return null;
};

// ✅ Get cover media type
const getCoverMediaType = (listing) => {
  if (listing.coverMediaType === 'video') return 'video';
  if (listing.coverMediaType === 'image') return 'image';
  if (listing.videos && listing.videos.length > 0) return 'video';
  return 'image';
};

// ✅ Get listing image with coverMedia support
const getListingImage = (listing) => {
  if (listing.coverMedia) {
    return getImageUrl(listing.coverMedia);
  }
  if (listing.coverImage) {
    return getImageUrl(listing.coverImage);
  }
  if (listing.galleryImages && listing.galleryImages.length > 0) {
    return getImageUrl(listing.galleryImages[0]);
  }
  if (listing.images && listing.images.length > 0) {
    return getImageUrl(listing.images[0]);
  }
  return null;
};

// ===============================
// QUICK ACTIONS
// ===============================
const quickActions = [
  { 
    title: 'Explore', 
    icon: Compass, 
    link: '/explore', 
    color: 'bg-[#0D9488]/10 text-[#0D9488] dark:bg-[#0D9488]/20 dark:text-[#0D9488]' 
  },
  { 
    title: 'AI Planner', 
    icon: Sparkles, 
    link: '/ai-planner', 
    color: 'bg-[#F59E0B]/10 text-[#F59E0B] dark:bg-[#F59E0B]/20 dark:text-[#F59E0B]' 
  },
  { 
    title: 'Trips', 
    icon: Route, 
    link: '/trips', 
    color: 'bg-[#374151]/10 text-[#374151] dark:bg-[#374151]/20 dark:text-gray-300' 
  },
  { 
    title: 'Reviews', 
    icon: MessageCircle, 
    link: '/reviews', 
    color: 'bg-[#0D9488]/10 text-[#0D9488] dark:bg-[#0D9488]/20 dark:text-[#0D9488]' 
  },
];

// ===============================
// HOME COMPONENT
// ===============================
const Home = () => {
  const navigate = useNavigate();
  
  const [experiences, setExperiences] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    totalTravelers: 0,
    totalExperiences: 0,
    totalReviews: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [imageErrors, setImageErrors] = useState({});
  const [heroError, setHeroError] = useState(false);

  // ===============================
  // FETCH ALL DATA
  // ===============================
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // ✅ Fetch 12 listings for trending grid (2 rows × 6 columns)
      const listingsData = await getListings({ limit: 12 });
      const listingsList = listingsData?.listings || [];
      setExperiences(listingsList);

      // ✅ Fetch latest 6 approved reviews
      const reviewsData = await getPublicReviews({ limit: 6, sort: 'latest' });
      
      let reviewsList = [];
      if (reviewsData.success && reviewsData.reviews) {
        reviewsList = reviewsData.reviews;
      } else if (Array.isArray(reviewsData)) {
        reviewsList = reviewsData;
      } else if (reviewsData.data && Array.isArray(reviewsData.data)) {
        reviewsList = reviewsData.data;
      }
      
      // ✅ Filter only approved reviews
      const approvedReviews = reviewsList.filter(r => r.status === 'approved' || !r.status);
      setReviews(approvedReviews);

      // Calculate stats
      const totalReviews = approvedReviews.length;
      const totalTravelers = listingsList.reduce((acc, listing) => acc + (listing.totalBookings || 0), 0);

      setStats({
        totalTravelers: totalTravelers > 0 ? totalTravelers : 1247,
        totalExperiences: listingsList.length || 48,
        totalReviews: totalReviews > 0 ? totalReviews : 89
      });

    } catch (error) {
      console.error('❌ Error loading home data:', error);
      setExperiences([]);
      setReviews([]);
      setStats({
        totalTravelers: 1247,
        totalExperiences: 48,
        totalReviews: 89
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!search.trim()) {
      navigate('/explore');
    } else {
      navigate(`/explore?search=${encodeURIComponent(search)}`);
    }
  };

  const handleImageError = (listingId) => {
    setImageErrors(prev => ({ ...prev, [listingId]: true }));
  };

  const getImageWithFallback = (listing) => {
    if (imageErrors[listing._id]) {
      return getFallbackImage(listing._id);
    }
    const image = getListingImage(listing);
    return image || getFallbackImage(listing._id);
  };

  // ===============================
  // GET TRENDING EXPERIENCES (12 items max)
  // ===============================
  const getTrendingExperiences = () => {
    // Sort by rating and booking count for trending
    const sorted = [...experiences]
      .filter(exp => exp.status === 'approved')
      .sort((a, b) => {
        const ratingDiff = (b.averageRating || 0) - (a.averageRating || 0);
        if (ratingDiff !== 0) return ratingDiff;
        return (b.totalBookings || 0) - (a.totalBookings || 0);
      });
    
    // Return top 12 experiences
    return sorted.slice(0, 12);
  };

  const trendingExperiences = getTrendingExperiences();

  // ===============================
  // RENDER REVIEW CARD
  // ===============================
  const ReviewCard = ({ review }) => {
    const name = review.user?.name || review.traveler?.name || 'Anonymous Traveler';
    const avatar = review.user?.profileImage || review.traveler?.profileImage || null;
    const rating = review.rating || 0;
    const date = review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }) : '';

    return (
      <Card className="p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 hover:border-[#0D9488]/20 h-full">
        <div className="flex items-start gap-3 mb-3">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D9488&color=fff&size=48`;
              }}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0D9488] to-[#F59E0B] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-[#374151] dark:text-white text-sm truncate">
              {name}
            </h4>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= rating
                        ? 'text-[#F59E0B] fill-[#F59E0B]'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
              {date && (
                <span className="text-xs text-gray-400">{date}</span>
              )}
            </div>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
          "{review.comment || review.text || 'No comment provided.'}"
        </p>
        {review.listing && (
          <p className="text-xs text-gray-400 mt-2">
            on {review.listing.title || review.listing}
          </p>
        )}
      </Card>
    );
  };

  // ===============================
  // RENDER
  // ===============================
  return (
    <div className="relative overflow-hidden space-y-8 animate-fade-in">

      {/* BACKGROUND */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#0D9488]/10 blur-3xl rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#F59E0B]/10 blur-3xl rounded-full pointer-events-none"></div>

      {/* ===============================
          HERO SECTION
      =============================== */}
      <section className="relative overflow-hidden rounded-3xl">
        <div className="absolute inset-0">
          <img 
            src={heroError ? getFallbackImage(0) : Heroimg}
            alt="AI Tour Rwanda" 
            className="w-full h-full object-cover"
            onError={(e) => {
              setHeroError(true);
              e.target.src = getFallbackImage(0);
            }}
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative z-10 px-4 sm:px-6 py-20 lg:py-32 text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">AI Powered Tourism Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold mb-6">
            Discover Rwanda
            <span className="block text-[#F59E0B]">with AI Tour</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/90 mb-10">
            Smart travel planning powered by artificial intelligence.
          </p>

          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl px-4 h-14">
                  <Search className="w-5 h-5 text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="Search experiences..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="bg-transparent outline-none w-full text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <Button onClick={handleSearch} className="h-14 rounded-xl bg-gradient-to-r from-[#0D9488] to-[#F59E0B] hover:scale-105 transition">
                Explore Now
              </Button>
            </div>
          </div>

          <div className="flex justify-center flex-wrap gap-6 mt-10 text-sm text-white/90">
            <span>⭐ {stats.totalTravelers > 0 ? `${stats.totalTravelers}+` : '10K+'} Travelers</span>
            <span>🌍 {stats.totalExperiences}+ Experiences</span>
            <span>🤖 AI Recommendations</span>
          </div>
        </div>
      </section>

      {/* ===============================
          QUICK ACTIONS
      =============================== */}
      <section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link key={index} to={item.link}>
                <Card hover className="p-5 text-center group">
                  <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center ${item.color}`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-semibold dark:text-white">{item.title}</h3>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ===============================
          TRENDING EXPERIENCES - Responsive Grid (2 rows × 6 columns)
      =============================== */}
      <section>
        <SectionTitle
          title="Trending Adventures"
          subtitle="12 experiences you might love"
          icon={Flame}
          iconColor="text-[#F59E0B]"
          viewAllLink="/explore"
          viewAllText="View All"
        />

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-[#0D9488]" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">Loading experiences...</p>
            </div>
          </div>
        ) : trendingExperiences.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800">
            <Compass className="w-16 h-16 mx-auto text-[#0D9488] mb-4" />
            <h3 className="text-2xl font-bold text-[#374151] dark:text-white">No Experiences Yet</h3>
            <p className="text-gray-500 mt-2">Check back soon for trending adventures.</p>
          </div>
        ) : (
          <div>
            {/* ✅ Responsive Grid: 2 cols mobile, 3 cols tablet, 6 cols desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
              {trendingExperiences.map((listing) => {
                const coverType = getCoverMediaType(listing);
                const coverUrl = getCoverMedia(listing);
                
                return (
                  <div key={listing._id} className="w-full">
                    <MediaCard
                      id={listing._id}
                      title={listing.title}
                      image={coverUrl || getImageWithFallback(listing)}
                      location={listing.location}
                      price={listing.price}
                      duration={listing.duration}
                      rating={listing.averageRating || 0}
                      type="experience"
                      coverMediaType={coverType}
                      videoUrl={coverType === 'video' ? coverUrl : null}
                      // ✅ FIXED: Pass coverMediaType in navigation state
                      onSelect={(id) => navigate(`/listing/${id}`, { state: { coverMediaType: coverType } })}
                    />
                  </div>
                );
              })}
            </div>

            {/* ✅ View All Listings Button */}
            <div className="flex justify-center mt-8">
              <Link to="/explore">
                <Button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#0D9488] to-[#F59E0B] text-white shadow-lg shadow-[#0D9488]/30 hover:scale-[1.02] transition-all duration-300 text-lg font-bold">
                  View All Listings
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* ===============================
          AI BANNER
      =============================== */}
      <section className="bg-gradient-to-r from-[#0D9488] to-[#F59E0B] rounded-3xl p-10 text-center text-white shadow-xl">
        <div className="relative z-10">
          <Bot className="w-10 h-10 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Meet Your AI Travel Assistant</h2>
          <p className="max-w-2xl mx-auto mb-8 text-white/90">
            Personalized itineraries and smart travel recommendations.
          </p>
          <Link to="/ai-planner">
            <Button size="lg" className="bg-white text-[#0D9488] hover:scale-105 transition">
              Start Planning <Sparkles className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ===============================
          COMMUNITY REVIEWS - Latest 6 Approved Reviews
      =============================== */}
      <section>
        <SectionTitle
          title="Community Reviews"
          subtitle="Real experiences from our community"
          icon={MessageCircle}
          iconColor="text-[#0D9488]"
          viewAllLink="/reviews"
          viewAllText="View All"
        />

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-[#0D9488]" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
            <MessageCircle className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-bold text-[#374151] dark:text-white">No Reviews Yet</h3>
            <p className="text-gray-500 dark:text-gray-400">Be the first to share your experience!</p>
          </div>
        ) : (
          <div>
            {/* ✅ Responsive Grid: 1 col mobile, 2 cols tablet, 3 cols desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {reviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>

            {/* ✅ View All Community Reviews Button */}
            <div className="flex justify-center mt-8">
              <Link to="/reviews">
                <Button className="px-8 py-4 rounded-2xl bg-white dark:bg-gray-900 text-[#0D9488] border-2 border-[#0D9488] hover:bg-[#0D9488] hover:text-white transition-all duration-300 text-lg font-bold shadow-lg shadow-[#0D9488]/10 hover:shadow-[#0D9488]/30">
                  View All Community Reviews
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </section>

    </div>
  );
};

export default Home;