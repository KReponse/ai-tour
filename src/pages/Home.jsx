// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, TrendingUp, Star, Calendar, ArrowRight } from 'lucide-react';
import Card, { CardImage, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { destinations, testimonials } from '../data/mockData';

const Home = () => {
  return (
    <div className="space-y-12 animate-fade-in">
      {/* Hero Section */}
      <section className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90"></div>
        <div className="relative z-10 px-6 py-16 md:py-24 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Discover Your Next Adventure with AI
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Personalized travel planning powered by artificial intelligence
          </p>
          <Link to="/ai-planner">
            <Button size="lg" className="bg-white text-blue-600 hover:shadow-xl">
              Plan Your Trip Now
              <Sparkles className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Popular Destinations */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Popular Destinations
          </h2>
          <Link to="/explore" className="text-blue-600 hover:text-blue-700 font-semibold">
            View All <ArrowRight className="inline w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((dest) => (
            <Link to={`/destination/${dest.id}`} key={dest.id}>
              <Card hover>
                <CardImage src={dest.image} alt={dest.name} />
                <CardContent>
                  <h3 className="text-lg font-semibold mb-2">{dest.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">${dest.price}</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm">{dest.rating}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* AI Assistant Section */}
      <section className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-8">
        <div className="text-center mb-8">
          <Bot className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Meet Your AI Travel Assistant
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Get personalized recommendations, smart itineraries, and the best deals
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

      {/* Testimonials */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
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
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <div className="flex text-yellow-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">{testimonial.text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Start Your Journey?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Join thousands of happy travelers who discovered amazing places with AI Tour
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