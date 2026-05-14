import React from 'react';
import { Link } from 'react-router-dom';
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
  CheckCircle,
  Search,
  Heart
} from 'lucide-react';

import Card, { CardImage, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { testimonials } from '../data/mockData';
import Heroimg from '../assets/images/destinations/hero img.png';
import { destinations } from "../data/mockData.js";


const quickActions = [
  {
    title: 'Explore',
    icon: Compass,
    link: '/explore',
    color:
      'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  },
  {
    title: 'AI Planner',
    icon: Sparkles,
    link: '/ai-planner',
    color:
      'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  },
  {
    title: 'Trips',
    icon: Route,
    link: '/trips',
    color:
      'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  },
  {
    title: 'Reviews',
    icon: MessageCircle,
    link: '/reviews',
    color:
      'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  },
];

const categories = [
  {
    title: 'National Parks',
    icon: Mountain,
    color:
      'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  },
  {
    title: 'Cultural Tours',
    icon: Globe,
    color:
      'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  },
  {
    title: 'City Tours',
    icon: Map,
    color:
      'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  },
  {
    title: 'Hotels',
    icon: Hotel,
    color:
      'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  },
];

const bookingServices = [
  {
    title: 'Hotels',
    desc: 'Luxury & affordable stays',
    icon: Hotel,
    gradient: 'from-cyan-500 to-teal-500',
  },
  {
    title: 'Tours',
    desc: 'Local guides & experiences',
    icon: Map,
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    title: 'Transport',
    desc: 'Airport pickups & rides',
    icon: Car,
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    title: 'Activities',
    desc: 'Adventure experiences',
    icon: Activity,
    gradient: 'from-pink-500 to-purple-500',
  },
];

const Home = () => {
  return (
    <div className="space-y-6 animate-fade-in">

      {/* Background Glow Effects */}
<div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/10 blur-3xl rounded-full pointer-events-none"></div>

<div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/10 blur-3xl rounded-full pointer-events-none"></div>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl w-full">
        <div className="absolute inset-0">
          <img
            src={Heroimg}
            alt="Rwanda Tourism"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="flex justify-center items-center gap-6 flex-wrap text-sm text-white/80 mt-8">
  <span>⭐ 10K+ Travelers</span>
  <span>🌍 50+ Destinations</span>
  <span>🤖 AI Powered</span>
</div>

        {/* FLOATING SEARCH */}
<div className="relative -mt-10 z-20 px-2">
  <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-4 md:p-5 max-w-4xl mx-auto">
    
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

      <div>
        <label className="text-sm font-medium text-gray-500">
          Destination
        </label>

        <div className="flex items-center mt-2 bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-3">
          <Search className="w-5 h-5 text-gray-400 mr-2" />

          <input
            type="text"
            placeholder="Where to?"
            className="bg-transparent outline-none w-full"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-500">
          Date
        </label>

        <div className="mt-2 bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-3">
          <input
            type="date"
            className="bg-transparent outline-none w-full"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-500">
          Travelers
        </label>

        <div className="mt-2 bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-3">
          <select className="bg-transparent outline-none w-full">
            <option>1 Traveler</option>
            <option>2 Travelers</option>
            <option>3 Travelers</option>
          </select>
        </div>
      </div>

      <div className="flex items-end">
        <Button className="w-full h-14 rounded-xl">
          Search Trips
        </Button>
      </div>
    </div>
  </div>
</div>

        {/* Decorative blur */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 px-4 sm:px-6 py-14 sm:py-20 lg:py-28 text-center text-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            Discover Rwanda
            <span className="block text-yellow-400 mt-2">
              with AI Tour
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Smart travel planning powered by artificial intelligence
          </p>

          <Link to="/ai-planner">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-blue-500/30"
            >
              Plan Your Trip
              <Sparkles className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((item, index) => {
            const Icon = item.icon;

            return (
              <Link to={item.link} key={index}>
                <Card
                  hover
                  className=" group hover:-translate-y-2 transition-all duration-500 p-5 text-center border border-gray-100 dark:border-gray-800"
                >
                  
                  <div
                    className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center ${item.color}`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CATEGORIES */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Browse by Category
          </h2>

          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Find your perfect travel experience
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <Card
                key={index}
                hover
                className="p-5 text-center cursor-pointer"
              >
                <div
                  className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${category.color}`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-base font-semibold dark:text-white">
                  {category.title}
                </h3>
              </Card>
            );
          })}
        </div>
      </section>

      {/* POPULAR DESTINATIONS */}
      <section className="overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Popular Destinations
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Most loved places by travelers
            </p>
          </div>

          <Link
            to="/explore"
            className="text-blue-600 hover:text-purple-600 font-semibold inline-flex items-center"
          >
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* FIXED GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {destinations.slice(0, 4).map((dest) => (
            <Link
              to={`/destination/${dest.id}`}
              key={dest.id}
            >
              <Card
  hover
  className="
    group
    relative
    overflow-hidden
    rounded-3xl
    border border-gray-200/60 dark:border-gray-800
    bg-white dark:bg-gray-900
    h-full
    transform-gpu
    transition-all duration-300
    hover:-translate-y-1
    hover:shadow-xl
  "
>
  {/* IMAGE SECTION */}
  <div className="relative overflow-hidden">

    <CardImage
      src={dest.image}
      alt={dest.name}
      className="
        h-56 w-full object-cover
        transition-transform duration-500
        group-hover:scale-105
      "
    />

    {/* CINEMATIC OVERLAY */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>

    {/* TOP BADGE */}
    <div className="absolute top-4 left-4">
      <span className="
        bg-white/90 dark:bg-gray-900/90
        backdrop-blur-md
        px-3 py-1
        rounded-full
        text-xs font-semibold
        text-gray-800 dark:text-white
        shadow-md
      ">
        Popular
      </span>
    </div>

    {/* FAVORITE BUTTON */}
    <button
      className="
        absolute top-4 right-4
        w-10 h-10
        rounded-full
        bg-white/90 dark:bg-gray-900/90
        backdrop-blur-md
        flex items-center justify-center
        shadow-md
        transition-transform duration-300
        hover:scale-110
      "
    >
      <Heart className="w-4 h-4 text-red-500 fill-red-500/20" />
    </button>

    {/* BOTTOM OVERLAY INFO */}
    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
      
      <div>
        <h3 className="text-white text-xl font-bold line-clamp-1">
          {dest.name}
        </h3>

        <p className="text-white/80 text-sm">
          Rwanda
        </p>
      </div>

      <div className="
        flex items-center
        bg-white/20
        backdrop-blur-md
        px-2 py-1
        rounded-lg
      ">
        <Star className="w-4 h-4 text-yellow-400 fill-current" />

        <span className="ml-1 text-sm text-white font-medium">
          {dest.rating}
        </span>
      </div>
    </div>
  </div>

  {/* CONTENT */}
  <CardContent className="p-5">

    <p className="
      text-sm
      text-gray-500 dark:text-gray-400
      line-clamp-2
      leading-relaxed
      mb-5
    ">
      {dest.description}
    </p>

    {/* FOOTER */}
    <div className="flex items-center justify-between">

      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wide">
          Starting From
        </p>

        <h4 className="text-2xl font-bold text-blue-600">
          ${dest.price}
        </h4>
      </div>

      <Button
        size="sm"
        className="
          rounded-xl
          px-4
          shadow-md
        "
      >
        Explore
      </Button>
    </div>
  </CardContent>
</Card>
            </Link>
          ))}
        </div>
      </section>

      {/* BOOKING SERVICES */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Quick Booking Services
          </h2>

          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Trusted tourism service providers
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {bookingServices.map((service, index) => {
            const Icon = service.icon;

            return (
              <Card
                key={index}
                hover
                className="p-5 text-center group cursor-pointer"
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${service.gradient} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-lg font-bold mb-1 dark:text-white">
                  {service.title}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {service.desc}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* AI BANNER */}
      <section className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl p-8 md:p-10">
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
            <Bot className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mb-4 dark:text-white">
            Meet Your AI Travel Assistant
          </h2>

          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Personalized itineraries, smart travel recommendations,
            and tourism experiences powered by AI.
          </p>

          <Link to="/ai-planner">
            <Button variant="primary" size="lg">
              Start Planning with AI
              <Sparkles className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* STATS */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          ['50+', 'Destinations'],
          ['10K+', 'Happy Travelers'],
          ['500+', 'Tours Available'],
          ['24/7', 'AI Support'],
        ].map(([value, label], index) => (
          <div
            key={index}
            className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
          >
            <div className="text-3xl font-bold text-blue-600">
              {value}
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-300">
              {label}
            </div>
          </div>
        ))}
      </section>

      {/* TESTIMONIALS */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 dark:text-white">
            What Travelers Say
          </h2>

          <p className="text-gray-600 dark:text-gray-300">
            Real experiences from our community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-6">
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />

                <div>
                  <h4 className="font-semibold dark:text-white">
                    {testimonial.name}
                  </h4>

                  <div className="flex text-yellow-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-current"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                "{testimonial.text}"
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 md:p-12 text-center">
        <div className="absolute inset-0 bg-white/10"></div>

        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Ready to Explore Rwanda?
          </h2>

          <p className="text-white/90 mb-8 max-w-md mx-auto">
            Join thousands of travelers discovering amazing places with AI Tour
          </p>

          <Link to="/signup">
            <Button
              variant="primary"
              size="lg"
              className="bg-white text-blue-600 hover:shadow-xl"
            >
              Get Started Free
              <CheckCircle className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;