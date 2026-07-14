// src/pages/Blog.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  User, 
  Clock, 
  Tag, 
  Search,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Heart,
  MessageCircle,
  Share2,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

// ===============================
// AI TOUR COLORS
// ===============================
// Teal  : #0D9488
// Gold  : #F59E0B
// Slate : #374151
// White : #FFFFFF
// ===============================

const Blog = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Travel Tips', 'Destinations', 'Culture', 'Safari', 'Luxury'];

  const posts = [
    {
      id: 1,
      title: 'Ultimate Guide to Gorilla Trekking in Rwanda',
      excerpt: 'Everything you need to know about the incredible experience of gorilla trekking in Volcanoes National Park.',
      category: 'Travel Tips',
      author: 'Grace K.',
      date: 'June 15, 2025',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=800',
      likes: 245,
      comments: 32,
    },
    {
      id: 2,
      title: '5 Best Luxury Safari Lodges in Rwanda',
      excerpt: 'Discover the most exclusive and breathtaking safari accommodations Rwanda has to offer.',
      category: 'Luxury',
      author: 'Alex M.',
      date: 'June 10, 2025',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800',
      likes: 189,
      comments: 18,
    },
    {
      id: 3,
      title: 'Exploring Lake Kivu: Rwanda\'s Hidden Gem',
      excerpt: 'A comprehensive guide to the beautiful Lake Kivu region, including boat tours, beaches, and local culture.',
      category: 'Destinations',
      author: 'Sarah M.',
      date: 'June 5, 2025',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
      likes: 312,
      comments: 45,
    },
    {
      id: 4,
      title: 'Rwandan Cuisine: A Food Lover\'s Journey',
      excerpt: 'From traditional dishes to modern fusion, explore the rich flavors of Rwandan food culture.',
      category: 'Culture',
      author: 'David R.',
      date: 'May 28, 2025',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800',
      likes: 156,
      comments: 22,
    },
  ];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto px-4 py-8">

      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0D9488] to-[#F59E0B] p-12 text-white">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur mb-6">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">Travel Blog</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            Stories from
            <span className="block text-white/90">Rwanda & Beyond</span>
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Insights, tips, and inspiration for your next adventure in the Land of a Thousand Hills.
          </p>
        </div>
      </section>

      {/* SEARCH & CATEGORIES */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                activeCategory === cat
                  ? 'bg-[#0D9488] text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition outline-none"
          />
        </div>
      </div>

      {/* POSTS */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-16 text-center border border-gray-100 dark:border-gray-800">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#374151] dark:text-white">No posts found</h2>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredPosts.map((post) => (
            <Link to={`/blog/${post.id}`} key={post.id}>
              <Card className="overflow-hidden hover:shadow-xl transition group h-full">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur text-white text-xs px-3 py-1 rounded-full">
                    {post.category}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-[#374151] dark:text-white group-hover:text-[#0D9488] transition">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4 text-red-500" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {post.comments}
                      </span>
                    </div>
                    <span className="text-[#0D9488] font-semibold flex items-center gap-1 group-hover:gap-2 transition">
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* NEWSLETTER */}
      <section className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 text-center">
        <Sparkles className="w-12 h-12 text-[#0D9488] mx-auto mb-4" />
        <h2 className="text-2xl font-black text-[#374151] dark:text-white mb-2">
          Subscribe to Our Newsletter
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Get the latest travel tips and stories delivered to your inbox.
        </p>
        <div className="flex max-w-md mx-auto gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition outline-none"
          />
          <Button className="bg-gradient-to-r from-[#0D9488] to-[#F59E0B] text-white hover:scale-[1.02] transition whitespace-nowrap">
            Subscribe
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Blog;