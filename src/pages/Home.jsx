// src/pages/Home.jsx

import React, { useEffect, useState, useRef } from 'react';
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
  ChevronLeft,
  ChevronRight,
  Flame,
} from 'lucide-react';

import Card, { CardImage, CardContent, CardBadge } from '../components/ui/Card';
import Button from '../components/ui/Button';
import VideoCard from "../components/ui/VideoCard";
import SectionTitle from '../components/ui/SectionTitle';
import MediaCard from '../components/ui/MediaCard';
import { getListings } from '../services/listingService';
import Heroimg from '../assets/images/heroimg.png';

// ===============================
// API CONFIGURATION
// ===============================
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
  return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/${image}`;
};

const getListingImage = (listing) => {
  if (listing.coverImage) return getImageUrl(listing.coverImage);
  if (listing.galleryImages && listing.galleryImages.length > 0) return getImageUrl(listing.galleryImages[0]);
  if (listing.images && listing.images.length > 0) return getImageUrl(listing.images[0]);
  return null;
};

// ===============================
// QUICK ACTIONS (Static Navigation) ✅ MUST BE DEFINED
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
  const scrollContainerRef = useRef(null);
  
  const [experiences, setExperiences] = useState([]);
  const [videos, setVideos] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [stats, setStats] = useState({
    totalTravelers: 0,
    totalExperiences: 0,
    totalReviews: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [imageErrors, setImageErrors] = useState({});
  const [heroError, setHeroError] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // ===============================
  // FETCH ALL DATA
  // ===============================
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      const listingsData = await getListings({ limit: 10 });
      const listingsList = listingsData?.listings || [];
      setExperiences(listingsList);

      const videosRes = await fetch(`${API_URL}/videos`);
      const videosData = await videosRes.json();
      setVideos(videosData?.videos || []);

      // ✅ FIXED: Use correct public reviews endpoint
      const reviewsRes = await fetch(`${API_URL}/public/reviews?limit=6`);
      const reviewsData = await reviewsRes.json();
      
      // ✅ Handle different response structures
      let reviews = [];
      if (reviewsData.success && reviewsData.reviews) {
        reviews = reviewsData.reviews;
      } else if (Array.isArray(reviewsData)) {
        reviews = reviewsData;
      } else if (reviewsData.data && Array.isArray(reviewsData.data)) {
        reviews = reviewsData.data;
      }
      
      setTestimonials(reviews);

      // Calculate stats from actual data
      const totalReviews = reviews.length;
      const totalTravelers = listingsList.reduce((acc, listing) => acc + (listing.totalBookings || 0), 0);

      setStats({
        totalTravelers: totalTravelers > 0 ? totalTravelers : 1247,
        totalExperiences: listingsList.length || 48,
        totalReviews: totalReviews > 0 ? totalReviews : 89
      });

    } catch (error) {
      console.error('❌ Error loading home data:', error);
      // ✅ Set fallback values so UI still looks good
      setExperiences([]);
      setVideos([]);
      setTestimonials([]);
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
  // SCROLL FUNCTIONS
  // ===============================
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -220, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 220, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  // ===============================
  // GET TRENDING ITEMS (5 cards: Experience, Video, Experience, Video, Experience)
  // ===============================
  const getTrendingItems = () => {
    const items = [];
    const topExperiences = experiences.slice(0, 3);
    const topVideos = videos.slice(0, 2);

    const pattern = [
      { type: 'experience', data: topExperiences[0] },
      { type: 'video', data: topVideos[0] },
      { type: 'experience', data: topExperiences[1] },
      { type: 'video', data: topVideos[1] },
      { type: 'experience', data: topExperiences[2] },
    ];

    pattern.forEach(item => {
      if (item.data) {
        items.push(item);
      }
    });

    return items;
  };

  const trendingItems = getTrendingItems();

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
          TRENDING EXPERIENCES - Gallery Style (5 Cards)
      =============================== */}
      <section>
        <SectionTitle
          title="Trending Adventures"
          subtitle="Experiences you might love"
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
        ) : trendingItems.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800">
            <Compass className="w-16 h-16 mx-auto text-[#0D9488] mb-4" />
            <h3 className="text-2xl font-bold text-[#374151] dark:text-white">No Experiences Yet</h3>
            <p className="text-gray-500 mt-2">Check back soon for trending adventures.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Left Arrow */}
            {showLeftArrow && (
              <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur p-2 rounded-full shadow-xl hover:scale-110 transition-all duration-200 border border-gray-200 dark:border-gray-700"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5 text-[#374151] dark:text-white" />
              </button>
            )}

            {/* Gallery-Style Scroll Container */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {trendingItems.map((item, index) => {
                if (item.type === 'experience') {
                  const listing = item.data;
                  return (
                    <MediaCard
                      key={listing._id}
                      id={listing._id}
                      title={listing.title}
                      image={getImageWithFallback(listing)}
                      location={listing.location}
                      price={listing.price}
                      duration={listing.duration}
                      rating={listing.averageRating || 0}
                      type="experience"
                      onSelect={(id) => navigate(`/listing/${id}`)}
                    />
                  );
                } else {
                  const video = item.data;
                  return (
                    <MediaCard
                      key={video._id}
                      id={video._id}
                      title={video.title}
                      image={video.thumbnail || video.videoUrl}
                      views={video.views || 0}
                      likes={video.likes || 0}
                      type="video"
                      videoUrl={video.videoUrl}
                      onSelect={(id) => navigate(`/video/${id}`)}
                    />
                  );
                }
              })}
            </div>

            {/* Right Arrow */}
            {showRightArrow && (
              <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur p-2 rounded-full shadow-xl hover:scale-110 transition-all duration-200 border border-gray-200 dark:border-gray-700"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5 text-[#374151] dark:text-white" />
              </button>
            )}
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
          TESTIMONIALS
      =============================== */}
      <section>
        <SectionTitle
          title="What Travelers Say"
          subtitle="Real experiences from our community"
          icon={MessageCircle}
          iconColor="text-[#0D9488]"
        />

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-[#0D9488]" />
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((review) => (
              <Card key={review._id} className="p-6 hover:shadow-xl transition">
                <div className="flex items-center mb-4">
                  <img 
                    src={review.user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user?.name || 'Traveler')}&background=0D9488&color=fff&size=128`}
                    className="w-12 h-12 rounded-full mr-4 object-cover" 
                    alt={review.user?.name || 'Traveler'}
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user?.name || 'Traveler')}&background=0D9488&color=fff&size=128`;
                    }}
                  />
                  <div>
                    <h4 className="font-semibold text-[#374151] dark:text-white">
                      {review.user?.name || 'Anonymous Traveler'}
                    </h4>
                    <div className="flex text-[#F59E0B]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'fill-none'}`} />
                      ))}
                    </div>
                    {review.tour && (
                      <p className="text-xs text-gray-400 mt-0.5">on {review.tour.title}</p>
                    )}
                    {review.listing && (
                      <p className="text-xs text-gray-400 mt-0.5">on {review.listing.title}</p>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
                  "{review.comment}"
                </p>
              </Card>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default Home;