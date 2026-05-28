// src/pages/Home.jsx

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  Sparkles,
  Star,
  ArrowRight,
  Bot,
  Hotel,
  Map,
  Car,
  Mountain,
  Compass,
  Globe,
  Route,
  MessageCircle,
  Activity,
  Search,
  Heart,
  MapPin,
  Clock,
  Users,
  Loader2,
} from 'lucide-react';

import Card, { CardImage, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { testimonials } from '../data/mockData';
import Heroimg from '../assets/images/destinations/hero img.png';
import { getTours } from '../services/tourService';

/* ================= QUICK ACTIONS ================= */

const quickActions = [
  { title: 'Explore', icon: Compass, link: '/explore', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
  { title: 'AI Planner', icon: Sparkles, link: '/ai-planner', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
  { title: 'Trips', icon: Route, link: '/trips', color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
  { title: 'Reviews', icon: MessageCircle, link: '/reviews', color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' },
];

/* ================= HOME COMPONENT ================= */

const Home = () => {
  const navigate = useNavigate();

  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const data = await getTours();
      setTours(data.tours || []);
    } catch (error) {
      console.error('Error loading tours:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!search.trim()) {
      navigate('/explore');
    } else {
      navigate(`/explore?search=${search}`);
    }
  };

  return (
    <div className="relative overflow-hidden space-y-8 animate-fade-in">

      {/* BACKGROUND */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/10 blur-3xl rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/10 blur-3xl rounded-full pointer-events-none"></div>

      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl">
        <div className="absolute inset-0">
          <img src={Heroimg} alt="AI Tour Rwanda" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative z-10 px-4 sm:px-6 py-20 lg:py-32 text-center text-white">

          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">AI Powered Tourism Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold mb-6">
            Discover Rwanda
            <span className="block text-yellow-400">with AI Tour</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/90 mb-10">
            Smart travel planning powered by artificial intelligence.
          </p>

          {/* SEARCH */}
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

              <div className="md:col-span-3">
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl px-4 h-14">
                  <Search className="w-5 h-5 text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="Search destinations..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-transparent outline-none w-full text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <Button onClick={handleSearch} className="h-14 rounded-xl">
                Search Trips
              </Button>

            </div>
          </div>

          {/* STATS */}
          <div className="flex justify-center flex-wrap gap-6 mt-10 text-sm text-white/90">
            <span>⭐ 10K+ Travelers</span>
            <span>🌍 {tours.length}+ Tours</span>
            <span>🤖 AI Recommendations</span>
          </div>

        </div>
      </section>

      {/* QUICK ACTIONS */}
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

      {/* POPULAR TOURS */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold dark:text-white">Popular Tours</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Real tours from our tourism providers
            </p>
          </div>

          <Link to="/explore" className="text-blue-600 font-semibold flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          </div>
        ) : tours.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl">
            <Compass className="w-16 h-16 mx-auto text-blue-500 mb-4" />
            <h3 className="text-2xl font-bold dark:text-white">No Tours Yet</h3>
            <p className="text-gray-500 mt-2">Tours will appear here after upload.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 auto-rows-fr">

            {tours.slice(0, 8).map((tour) => {
              const imageUrl = tour.image
                ? `http://localhost:5000/uploads/${tour.image}`
                : Heroimg;

              return (
                <Link key={tour._id} to={`/tour/${tour._id}`}>
                  <Card hover className="overflow-hidden rounded-3xl h-full flex flex-col">

                    {/* IMAGE */}
                    <div className="relative overflow-hidden">
                      <CardImage
                        src={imageUrl}
                        alt={tour.title}
                        className="h-52 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                      <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                        <Heart className="w-4 h-4 text-red-500" />
                      </button>

                      <div className="absolute bottom-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        ${tour.price}
                      </div>
                    </div>

                    {/* CONTENT */}
                    <CardContent className="p-5 flex flex-col flex-1">

                      <h3 className="text-xl font-bold dark:text-white line-clamp-1">
                        {tour.title}
                      </h3>

                      <div className="flex items-center gap-1 text-gray-500 text-sm mt-2">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        <span>{tour.location}</span>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 line-clamp-2 min-h-[40px]">
                        {tour.description}
                      </p>

                      {/* FOOTER */}
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">

                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{tour.duration}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{tour.travelers}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-semibold">4.8</span>
                        </div>

                      </div>

                    </CardContent>
                  </Card>
                </Link>
              );
            })}

          </div>
        )}
      </section>

      {/* AI BANNER */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-10 text-center text-white">
        <div className="relative z-10">
          <Bot className="w-10 h-10 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Meet Your AI Travel Assistant</h2>
          <p className="max-w-2xl mx-auto mb-8 text-white/90">
            Personalized itineraries and smart travel recommendations.
          </p>

          <Link to="/ai-planner">
            <Button size="lg" className="bg-white text-blue-600">
              Start Planning <Sparkles className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold dark:text-white">What Travelers Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <Card key={t.id} className="p-6">
              <div className="flex items-center mb-4">
                <img src={t.avatar} className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h4 className="font-semibold dark:text-white">{t.name}</h4>
                  <div className="flex text-yellow-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300">"{t.text}"</p>
            </Card>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;