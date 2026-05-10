// src/pages/DestinationDetails.jsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Calendar, Clock, Users, Heart, Share2, ChevronLeft, ChevronRight, Wifi, Coffee, Car, Umbrella } from 'lucide-react';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';

const DestinationDetails = () => {
  const { id } = useParams();
  const [currentImage, setCurrentImage] = useState(0);
  
  const destination = {
    id: parseInt(id),
    name: 'Paris, France',
    description: 'The City of Light offers an unparalleled blend of romance, art, and cuisine. From the iconic Eiffel Tower to the historic Louvre Museum, Paris captivates visitors with its timeless beauty and vibrant culture.',
    longDescription: 'Paris, the capital of France, is one of the most visited cities in the world. Known for its world-class art and culture, exquisite cuisine, and romantic ambiance, the city offers endless opportunities for exploration and discovery. From the charming streets of Montmartre to the grand boulevards of the Champs-Élysées, every corner of Paris tells a story.',
    images: [
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200',
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1200',
      'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=1200'
    ],
    rating: 4.8,
    reviews: 1243,
    price: 899,
    duration: '5 days',
    bestTime: 'April to October',
    language: 'French',
    currency: 'Euro',
    highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame Cathedral', 'Seine River Cruise'],
    amenities: ['Free WiFi', 'Breakfast Included', 'Airport Transfer', '24/7 Support'],
    itinerary: [
      { day: 1, title: 'Arrival and Orientation', activities: ['Check-in to hotel', 'Welcome dinner', 'Evening Seine cruise'] },
      { day: 2, title: 'Iconic Landmarks', activities: ['Eiffel Tower visit', 'Lunch at Champs-Élysées', 'Arc de Triomphe'] },
      { day: 3, title: 'Art and Culture', activities: ['Louvre Museum tour', 'Montmartre exploration', 'Moulin Rouge show'] }
    ]
  };

  const images = [
    destination.images[0],
    destination.images[1],
    destination.images[2]
  ];

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Image Gallery */}
      <div className="relative rounded-2xl overflow-hidden h-64 md:h-96">
        <img
          src={images[currentImage]}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full hover:bg-white transition"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full hover:bg-white transition"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button className="p-2 bg-white/80 dark:bg-gray-800/80 rounded-full hover:bg-white transition">
            <Heart className="w-5 h-5" />
          </button>
          <button className="p-2 bg-white/80 dark:bg-gray-800/80 rounded-full hover:bg-white transition">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Destination Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl md:text-4xl font-bold">{destination.name}</h1>
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="ml-1 font-semibold">{destination.rating}</span>
                <span className="text-gray-500 ml-1">({destination.reviews} reviews)</span>
              </div>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
              <MapPin className="w-5 h-5 mr-1" />
              <span>Western Europe</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {destination.longDescription}
            </p>
          </div>

          {/* Highlights */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Highlights</h2>
            <div className="grid grid-cols-2 gap-3">
              {destination.highlights.map((highlight, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <Star className="w-4 h-4 text-blue-600 mr-2" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Itinerary */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Suggested Itinerary</h2>
            <div className="space-y-4">
              {destination.itinerary.map((day) => (
                <Card key={day.day}>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-2">Day {day.day}: {day.title}</h3>
                    <ul className="space-y-1">
                      {day.activities.map((activity, idx) => (
                        <li key={idx} className="flex items-center text-gray-600 dark:text-gray-300">
                          <Clock className="w-4 h-4 mr-2 text-blue-600" />
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="lg:sticky lg:top-20 h-fit">
          <Card className="p-6">
            <div className="mb-4">
              <div className="text-3xl font-bold text-blue-600">${destination.price}</div>
              <div className="text-gray-500">per person</div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-300">Duration</span>
                <span className="font-semibold">{destination.duration}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-300">Best Time to Visit</span>
                <span className="font-semibold">{destination.bestTime}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-300">Language</span>
                <span className="font-semibold">{destination.language}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600 dark:text-gray-300">Currency</span>
                <span className="font-semibold">{destination.currency}</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {destination.amenities.map((amenity, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            <Link to="/booking">
              <Button variant="primary" className="w-full mb-3">
                Book Now
              </Button>
            </Link>
            <Link to="/request-trip">
              <Button variant="outline" className="w-full">
                Request Custom Package
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetails;