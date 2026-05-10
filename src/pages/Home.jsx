// src/pages/Home.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  TrendingUp,
  Star,
  Calendar,
  ArrowRight,
  Bot,
  Hotel,
  Map,
  Car,
  Mountain,
  Plane,
  Compass
} from 'lucide-react';

import Card, { CardImage, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';

import { destinations, testimonials } from '../data/mockData';

const quickBookings = [
  {
    title: 'Hotels',
    icon: Hotel,
    color: 'from-cyan-500 to-teal-500',
  },
  {
    title: 'Tours',
    icon: Plane,
    color: 'from-blue-500 to-indigo-500',
  },
  {
    title: 'Transport',
    icon: Car,
    color: 'from-orange-500 to-amber-500',
  },
  {
    title: 'Activities',
    icon: Compass,
    color: 'from-pink-500 to-purple-500',
  },
];

const Home = () => {
  return (
    <div className="space-y-16 animate-fade-in">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl">

        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-95"></div>

        <div className="relative z-10 px-6 py-20 md:py-28 text-center text-white">

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Discover Your Next
            <span className="block text-accent">
              Adventure with AI
            </span>
          </h1>

          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Personalized travel planning powered by artificial intelligence
          </p>

          <Link to="/ai-planner">
            <Button
              size="lg"
              className="bg-white text-primary hover:scale-105 transition-all duration-300"
            >
              Plan Your Trip Now
              <Sparkles className="w-5 h-5 ml-2" />
            </Button>
          </Link>

        </div>
      </section>

      {/* POPULAR DESTINATIONS */}
      <section>

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Popular Destinations
          </h2>

          <Link
            to="/explore"
            className="text-primary hover:text-secondary font-semibold"
          >
            View All
            <ArrowRight className="inline w-4 h-4 ml-1" />
          </Link>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {destinations.map((dest) => (

            <Link to={`/destination/${dest.id}`} key={dest.id}>

              <Card hover>

                <CardImage src={dest.image} alt={dest.name} />

                <CardContent>

                  <h3 className="text-lg font-semibold mb-2">
                    {dest.name}
                  </h3>

                  <div className="flex justify-between items-center">

                    <span className="text-2xl font-bold text-primary">
                      ${dest.price}
                    </span>

                    <div className="flex items-center">

                      <Star className="w-4 h-4 text-yellow-400 fill-current" />

                      <span className="ml-1 text-sm">
                        {dest.rating}
                      </span>

                    </div>

                  </div>

                </CardContent>

              </Card>

            </Link>

          ))}

        </div>

      </section>

      {/* Quick Booking Section */}
<section>

  <div className="flex justify-between items-center mb-6">

    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
        Quick Booking Services
      </h2>

      <p className="text-gray-600 dark:text-gray-300 mt-2">
        Easily access trusted tourism services and providers
      </p>
    </div>

  </div>

  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

    {/* Hotels */}
    <Card
      hover
      className="p-6 text-center group cursor-pointer"
    >

      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition">

        <Hotel className="w-8 h-8 text-primary" />

      </div>

      <h3 className="font-bold text-lg mb-2">
        Hotels
      </h3>

      <p className="text-sm text-gray-600 dark:text-gray-300">
        Find luxury & affordable stays
      </p>

    </Card>

    {/* Tours */}
    <Card
      hover
      className="p-6 text-center group cursor-pointer"
    >

      <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition">

        <Map className="w-8 h-8 text-accent" />

      </div>

      <h3 className="font-bold text-lg mb-2">
        Tours
      </h3>

      <p className="text-sm text-gray-600 dark:text-gray-300">
        Explore with expert guides
      </p>

    </Card>

    {/* Transport */}
    <Card
      hover
      className="p-6 text-center group cursor-pointer"
    >

      <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition">

        <Car className="w-8 h-8 text-blue-500" />

      </div>

      <h3 className="font-bold text-lg mb-2">
        Transport
      </h3>

      <p className="text-sm text-gray-600 dark:text-gray-300">
        Airport pickups & travel rides
      </p>

    </Card>

    {/* Activities */}
    <Card
      hover
      className="p-6 text-center group cursor-pointer"
    >

      <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition">

        <Mountain className="w-8 h-8 text-green-500" />

      </div>

      <h3 className="font-bold text-lg mb-2">
        Activities
      </h3>

      <p className="text-sm text-gray-600 dark:text-gray-300">
        Adventures & experiences
      </p>

    </Card>

  </div>

</section>
      {/* AI ASSISTANT */}
      <section className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-8">

        <div className="text-center mb-8">

          <div className="bg-primary w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">

            <Bot className="w-10 h-10 text-white" />

          </div>

          <h2 className="text-2xl md:text-3xl font-bold mb-4 dark:text-white">
            Meet Your AI Travel Assistant
          </h2>

          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get personalized recommendations, smart itineraries,
            and the best travel deals powered by AI.
          </p>

        </div>

        <div className="flex justify-center">

          <Link to="/ai-planner">

            <Button variant="primary" size="lg">
              Start Planning with AI
            </Button>

          </Link>

        </div>

      </section>

      {/* TESTIMONIALS */}
      <section>

        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 dark:text-white">
          What Our Travelers Say
        </h2>

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

                      <Star key={i} className="w-4 h-4 fill-current" />

                    ))}

                  </div>

                </div>

              </div>

              <p className="text-gray-600 dark:text-gray-300">
                {testimonial.text}
              </p>

            </Card>

          ))}

        </div>

      </section>

      {/* CTA */}
      <section className="text-center py-12">

        <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">
          Ready to Start Your Journey?
        </h2>

        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Join thousands of travelers discovering amazing places with AI Tour
        </p>

        <Link to="/signup">

          <Button variant="primary" size="lg">
            Get Started Free
          </Button>

        </Link>

      </section>

    </div>
  );
};

export default Home;