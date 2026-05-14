// src/pages/Explore.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  MapPin,
  Star,
  SlidersHorizontal,
  X,
  Heart
} from 'lucide-react';
import Card, { CardImage, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { destinations } from '../data/mockData';

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: [0, 2000],
    rating: 0,
    duration: ''
  });

  const filteredDestinations = destinations.filter((dest) => {
  const matchesSearch =
    dest.name.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesRating =
    filters.rating === 0 || dest.rating >= filters.rating;

  return matchesSearch && matchesRating;
});

  return (
  <div className="space-y-6 animate-fade-in">

    {/* Background Glow Effects */}
    <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/10 blur-3xl rounded-full pointer-events-none"></div>

    <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/10 blur-3xl rounded-full pointer-events-none"></div>
      
      <div>
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-4">
  🌍 Discover Rwanda
</div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Explore Destinations</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Discover amazing places around the world
        </p>
      </div>

      {/* Search and Filters */}
      <div className="sticky top-16 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl py-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search destinations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 rounded-xl"
          >
            <Filter className="w-5 h-5" />
          </Button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg animate-slide-down">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Filters</h3>
              <button onClick={() => setShowFilters(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Price Range</label>
                <div className="flex gap-4">
                  <Input placeholder="Min" type="number" />
                  <Input placeholder="Max" type="number" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Minimum Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setFilters({...filters, rating})}
                      className={`px-3 py-1 rounded-full text-sm ${
                        filters.rating === rating
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      {rating}+
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Found {filteredDestinations.length} destinations
        </p>
        <Button variant="outline" size="sm">
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Sort by
        </Button>
      </div>

      {/* Destinations Grid */}
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {filteredDestinations.map((dest) => (
    <Link to={`/destination/${dest.id}`} key={dest.id}>
      <Card
        hover
        className=" transition-all duration-500 hover:-translate-y-2 h-full overflow-hidden rounded-2xl group border border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all duration-500"
      >
        {/* IMAGE */}
        <div className="relative overflow-hidden">
          <img
            src={dest.image}
            alt={dest.name}
            className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/10"></div>

          {/* Trending Badge */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-gray-800">
            Trending
          </div>

          {/* Rating */}
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full flex items-center text-white">
            <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
            <span className="text-xs font-semibold">
              {dest.rating}
            </span>
          </div>
          {/* Favorite Button */}
<div className="absolute bottom-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-2 rounded-full shadow-lg cursor-pointer hover:scale-110 transition">
  <Heart className="w-4 h-4 text-red-500" />
</div>
        </div>
        

        {/* CONTENT */}
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">
              {dest.name}
            </h3>
          </div>

          {/* LOCATION */}
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-3">
            <MapPin className="w-4 h-4 mr-1 text-blue-500" />
            <span>{dest.location}</span>
          </div>

          {/* DESCRIPTION */}
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
            {dest.description}
          </p>

          {/* PRICE */}
          <div className="flex justify-between items-center">
            <div>
              <span className="text-2xl font-bold text-blue-600">
                ${dest.price}
              </span>
              <span className="text-sm text-gray-500 ml-1">
                / person
              </span>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              {dest.duration}
            </div>
          </div>
        </CardContent>
      </Card>
          </Link>
        ))}
      </div>
      {/* EMPTY STATE */}
{filteredDestinations.length === 0 && (
  <div className="text-center py-20">
    <h2 className="text-2xl font-bold mb-2 dark:text-white">
      No destinations found
    </h2>

    <p className="text-gray-500 dark:text-gray-400">
      Try searching another destination
    </p>
  </div>
)}

      {/* Map Section */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Explore on Map</h2>
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl h-96 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300">
              Interactive map integration coming soon
            </p>
            <p className="text-sm text-gray-500 mt-2">
              View all destinations on an interactive map
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Explore;