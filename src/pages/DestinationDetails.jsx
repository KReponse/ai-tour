// src/pages/DestinationDetails.jsx

import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  MapPin,
  Clock,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  CalendarDays,
  Users,
  Wifi,
  Coffee,
  Car,
  ShieldCheck,
} from 'lucide-react';

import Card, { CardImage, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { destinations } from '../data/mockData';

// Icon mapping for amenities
const amenityIcons = {
  wifi: Wifi,
  breakfast: Coffee,
  transport: Car,
  support: ShieldCheck,
};

const DestinationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const destination = destinations.find((item) => item.id === parseInt(id));
  const [currentImage, setCurrentImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // If destination not found
  if (!destination) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold mb-4 dark:text-white">Destination Not Found</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          The destination you are looking for does not exist.
        </p>
        <Link to="/explore">
          <Button>Back to Explore</Button>
        </Link>
      </div>
    );
  }

  // Extended destination data (can be moved to mockData later)
  const extendedData = {
    reviews: 1243,
    region: 'Rwanda',
    bestTime: destination.bestTime || 'June - September',
    language: 'English & Kinyarwanda',
    currency: 'RWF',
    travelers: '2-10 People',
    highlights: [
      'Breathtaking landscapes',
      'Authentic cultural experiences',
      'Professional local guides',
      'Safe & memorable adventure',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival & Relaxation',
        activities: [
          'Welcome at Kigali International Airport',
          'Hotel check-in with welcome drink',
          'City orientation tour',
          'Traditional Rwandan dinner experience',
        ],
      },
      {
        day: 2,
        title: 'Adventure & Exploration',
        activities: [
          'Morning guided tour of main attractions',
          'Lunch at local restaurant',
          'Afternoon photography session',
          'Sunset viewing at scenic spot',
        ],
      },
      {
        day: 3,
        title: 'Culture & Departure',
        activities: [
          'Visit to cultural heritage site',
          'Local market shopping experience',
          'Farewell lunch',
          'Airport transfer',
        ],
      },
    ],
  };

  // Multiple images (use same image as fallback)
  const images = destination.images || [destination.image, destination.image, destination.image];

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-5 space-y-6 pb-32 md:pb-8 animate-fade-in">
      
      {/* Navigation Row: Back Button + Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300 w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </button>

        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-2">
          <Link to="/" className="hover:text-blue-600 transition">
            Home
          </Link>
          <span>/</span>
          <Link to="/explore" className="hover:text-blue-600 transition">
            Explore
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-medium truncate max-w-[200px]">
            {destination.name}
          </span>
        </div>
      </div>

      {/* Hero Image Section */}
      <div className="relative rounded-3xl overflow-hidden h-[320px] md:h-[500px] group">
        <img
          src={images[currentImage]}
          alt={destination.name}
          className="w-full h-full object-cover transition-all duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

        {/* Image Navigation Buttons */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md hover:scale-110 transition-all opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md hover:scale-110 transition-all opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Action Buttons (Like & Share) */}
        <div className="absolute top-4 right-4 flex gap-3">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="p-2 md:p-3 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg hover:scale-110 transition-all"
          >
            <Heart className={`w-5 h-5 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-red-500'}`} />
          </button>
          <button className="p-2 md:p-3 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg hover:scale-110 transition-all">
            <Share2 className="w-5 h-5 text-blue-600" />
          </button>
        </div>

        {/* Text Overlay */}
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="bg-white/20 backdrop-blur-md text-xs px-3 py-1 rounded-full">
              Popular Destination
            </span>
            <div className="flex items-center bg-yellow-400 text-black px-2 py-1 rounded-full text-sm font-semibold">
              <Star className="w-3 h-3 fill-current mr-1" />
              {destination.rating}
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-2">{destination.name}</h1>
          <div className="flex items-center text-white/90 text-sm md:text-base">
            <MapPin className="w-4 h-4 md:w-5 md:h-5 mr-1" />
            {extendedData.region}
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`w-16 h-14 md:w-24 md:h-20 rounded-xl md:rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${
              currentImage === index ? 'border-blue-600 scale-105' : 'border-transparent'
            }`}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main Grid: Content + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Description */}
          <Card className="p-4 md:p-6 rounded-2xl md:rounded-3xl">
            <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 dark:text-white">
              About This Destination
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base">
              {destination.description}
            </p>
          </Card>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
            <Card className="p-3 md:p-5 text-center rounded-xl md:rounded-2xl">
              <Clock className="w-6 h-6 md:w-7 md:h-7 mx-auto mb-2 text-blue-600" />
              <div className="font-bold text-sm md:text-base dark:text-white">{destination.duration}</div>
              <div className="text-xs text-gray-500">Duration</div>
            </Card>
            <Card className="p-3 md:p-5 text-center rounded-xl md:rounded-2xl">
              <CalendarDays className="w-6 h-6 md:w-7 md:h-7 mx-auto mb-2 text-green-600" />
              <div className="font-bold text-sm md:text-base dark:text-white">{extendedData.bestTime}</div>
              <div className="text-xs text-gray-500">Best Time</div>
            </Card>
            <Card className="p-3 md:p-5 text-center rounded-xl md:rounded-2xl">
              <Users className="w-6 h-6 md:w-7 md:h-7 mx-auto mb-2 text-purple-600" />
              <div className="font-bold text-sm md:text-base dark:text-white">{extendedData.travelers}</div>
              <div className="text-xs text-gray-500">Group Size</div>
            </Card>
            <Card className="p-3 md:p-5 text-center rounded-xl md:rounded-2xl">
              <Sparkles className="w-6 h-6 md:w-7 md:h-7 mx-auto mb-2 text-orange-600" />
              <div className="font-bold text-sm md:text-base dark:text-white">{extendedData.language}</div>
              <div className="text-xs text-gray-500">Language</div>
            </Card>
          </div>

          {/* Highlights */}
          <Card className="p-4 md:p-6 rounded-2xl md:rounded-3xl">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-5 dark:text-white">Highlights</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {extendedData.highlights.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center p-3 md:p-4 rounded-xl md:rounded-2xl bg-gray-50 dark:bg-gray-800"
                >
                  <Star className="w-4 h-4 text-yellow-400 fill-current mr-3" />
                  <span className="text-sm md:text-base dark:text-gray-200">{item}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Itinerary */}
          <Card className="p-4 md:p-6 rounded-2xl md:rounded-3xl">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 dark:text-white">Suggested Itinerary</h2>
            <div className="space-y-4 md:space-y-5">
              {extendedData.itinerary.map((day) => (
                <div
                  key={day.day}
                  className="border border-gray-100 dark:border-gray-800 rounded-xl md:rounded-2xl p-4 md:p-5"
                >
                  <h3 className="font-bold text-base md:text-lg mb-3 dark:text-white">
                    Day {day.day}: {day.title}
                  </h3>
                  <div className="space-y-2">
                    {day.activities.map((activity, idx) => (
                      <div key={idx} className="flex items-start text-gray-600 dark:text-gray-300 text-sm md:text-base">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 mr-3"></div>
                        {activity}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* AI Travel Tip */}
          <Card className="p-4 md:p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 border border-blue-100 dark:border-gray-700 rounded-2xl md:rounded-3xl">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0">
                <Sparkles className="w-5 h-5 md:w-7 md:h-7 text-white" />
              </div>
              <div>
                <h3 className="text-base md:text-xl font-bold mb-1 md:mb-2 dark:text-white">AI Travel Tip</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed">
                  Best time to visit {destination.name} is during {extendedData.bestTime} for better weather 
                  and amazing wildlife viewing opportunities. Book at least 2 months in advance!
                </p>
              </div>
            </div>
          </Card>

          {/* Related Destinations */}
          <section>
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-bold dark:text-white">You May Also Like</h2>
              <Link to="/explore" className="text-blue-600 font-semibold text-sm md:text-base">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {destinations
                .filter((item) => item.id !== destination.id)
                .slice(0, 2)
                .map((item) => (
                  <Link to={`/destination/${item.id}`} key={item.id}>
                    <Card hover className="overflow-hidden h-full rounded-xl md:rounded-2xl">
                      <CardImage src={item.image} alt={item.name} className="h-44 md:h-52 object-cover" />
                      <CardContent className="p-3 md:p-4">
                        <h3 className="text-base md:text-xl font-bold mb-1 dark:text-white line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-500 line-clamp-2">{item.description}</p>
                        <div className="flex items-center mt-2">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="ml-1 text-xs text-gray-600 dark:text-gray-400">{item.rating}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN - Booking Sidebar (Sticky) */}
        <div className="lg:sticky lg:top-24 h-fit">
          <Card className="p-4 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl">
            
            {/* Price */}
            <div className="mb-4 md:mb-6">
              <p className="text-xs md:text-sm text-gray-500 mb-1">Starting from</p>
              <div className="text-3xl md:text-4xl font-bold text-blue-600">${destination.price}</div>
              <p className="text-xs md:text-sm text-gray-500">per person</p>
            </div>

            {/* Quick Details */}
            <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2">
                <span className="text-gray-500 text-sm">Duration</span>
                <span className="font-semibold text-sm dark:text-white">{destination.duration}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2">
                <span className="text-gray-500 text-sm">Best Time</span>
                <span className="font-semibold text-sm dark:text-white">{extendedData.bestTime}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2">
                <span className="text-gray-500 text-sm">Rating</span>
                <span className="font-semibold text-sm dark:text-white flex items-center">
                  {destination.rating} <Star className="w-3 h-3 text-yellow-400 fill-current ml-1" />
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Reviews</span>
                <span className="font-semibold text-sm dark:text-white">{extendedData.reviews}+</span>
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-4 md:mb-6">
              <h3 className="font-bold text-sm md:text-base mb-3 dark:text-white">Amenities</h3>
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                {[
                  { label: 'Free WiFi', icon: 'wifi' },
                  { label: 'Breakfast', icon: 'breakfast' },
                  { label: 'Transport', icon: 'transport' },
                  { label: '24/7 Support', icon: 'support' },
                ].map((item, index) => {
                  const Icon = amenityIcons[item.icon];
                  return (
                    <div key={index} className="flex items-center gap-2 p-2 md:p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                      <Icon className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                      <span className="text-xs md:text-sm dark:text-gray-200">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <Link to={`/booking/${destination.id}`}>
                <Button variant="primary" className="w-full h-10 md:h-12 rounded-xl text-sm md:text-base">
                  Book Now
                </Button>
              </Link>
              <Link to="/custom-request">
                <Button variant="outline" className="w-full h-10 md:h-12 rounded-xl text-sm md:text-base">
                  Custom Package
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Mobile Fixed Booking Bar */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 z-50 shadow-lg">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-xs text-gray-500">Starting from</p>
            <p className="text-xl font-bold text-blue-600">${destination.price}</p>
          </div>
          <Link to={`/booking/${destination.id}`} className="flex-1">
            <Button className="w-full h-11">Book Now</Button>
          </Link>
        </div>
      </div>

    </div>
  );
};

export default DestinationDetails;