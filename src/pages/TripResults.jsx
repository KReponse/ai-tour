// src/pages/TripResults.jsx - Add missing imports
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, SortAsc, Clock, Wallet, Star, Wifi, Coffee, Car, Hotel, MapPin } from 'lucide-react'; // Added Hotel, MapPin
import Card, { CardImage, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';

// Rest of the code remains the same...ui/Button';

const TripResults = () => {
  const [sortBy, setSortBy] = useState('price');
  const [view, setView] = useState('grid');

  const results = [
    {
      id: 1,
      name: 'Paris Premium Package',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
      price: 1299,
      originalPrice: 1599,
      rating: 4.9,
      duration: '7 days',
      includes: ['Hotel', 'Breakfast', 'Tours', 'Transfer'],
      discount: 19
    },
    {
      id: 2,
      name: 'Paris Budget Explorer',
      image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800',
      price: 899,
      originalPrice: 1099,
      rating: 4.7,
      duration: '5 days',
      includes: ['Hotel', 'City Tour'],
      discount: 18
    },
    {
      id: 3,
      name: 'Luxury Paris Experience',
      image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800',
      price: 2499,
      originalPrice: 2999,
      rating: 4.9,
      duration: '8 days',
      includes: ['5-star Hotel', 'All meals', 'Private tours', 'First class train'],
      discount: 17
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Trip Results</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Found {results.length} trips matching your criteria
        </p>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <div className="flex border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <button
              onClick={() => setView('grid')}
              className={`px-3 py-1 ${view === 'grid' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800'}`}
            >
              Grid
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1 ${view === 'list' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800'}`}
            >
              List
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <SortAsc className="w-4 h-4" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1"
          >
            <option value="price">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Rating</option>
            <option value="duration">Duration</option>
          </select>
        </div>
      </div>

      {/* Results Grid */}
      <div className={`grid ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
        {results.map((result) => (
          <Link to={`/booking?trip=${result.id}`} key={result.id}>
            <Card hover className="h-full">
              <div className="relative">
                <CardImage src={result.image} alt={result.name} />
                {result.discount && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-semibold">
                    Save {result.discount}%
                  </div>
                )}
              </div>
              <CardContent>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{result.name}</h3>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm">{result.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{result.duration}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {result.includes.map((item, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                      {item === 'Hotel' && <Hotel className="w-3 h-3 inline mr-1" />}
                      {item === 'Breakfast' && <Coffee className="w-3 h-3 inline mr-1" />}
                      {item === 'Transfer' && <Car className="w-3 h-3 inline mr-1" />}
                      {item === 'Tours' && <MapPin className="w-3 h-3 inline mr-1" />}
                      {item}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">${result.price}</div>
                    <div className="text-sm text-gray-500 line-through">${result.originalPrice}</div>
                  </div>
                  <Button variant="primary" size="sm">
                    View Deal
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TripResults;