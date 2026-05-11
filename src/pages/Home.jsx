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
  TrendingUp,
  Calendar,
  CheckCircle,
} from 'lucide-react';
import Card, { CardImage, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { destinations, testimonials } from '../data/mockData';
import Heroimg from '../assets/images/destinations/hero img.png'

const quickActions = [
  {
    title: 'Explore',
    icon: Compass,
    link: '/explore',
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  },
  {
    title: 'AI Planner',
    icon: Sparkles,
    link: '/ai-planner',
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  },
  {
    title: 'Trips',
    icon: Route,
    link: '/trips',
    color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  },
  {
    title: 'Reviews',
    icon: MessageCircle,
    link: '/reviews',
    color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  },
];

const categories = [
  {
    title: 'National Parks',
    icon: Mountain,
    color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  },
  {
    title: 'Cultural Tours',
    icon: Globe,
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  },
  {
    title: 'City Tours',
    icon: Map,
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  },
  {
    title: 'Hotels',
    icon: Hotel,
    color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10 md:space-y-12 lg:space-y-14 animate-fade-in pb-20 md:pb-6">
      
      {/* HERO SECTION - Fully Responsive */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl -mx-4 sm:mx-0">
        <div className="absolute inset-0">
          <img
            src={Heroimg}
            alt="Rwanda Tourism"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
        
        <div className="relative z-10 px-4 sm:px-6 py-12 sm:py-16 md:py-20 lg:py-28 text-center text-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6">
            Discover Rwanda
            <span className="block text-yellow-400 mt-2">
              with AI Tour
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
            Smart travel planning powered by artificial intelligence
          </p>
          
          <Link to="/ai-planner">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto"
            >
              Plan Your Trip
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* QUICK ACTIONS - Grid responsive */}
      <section>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {quickActions.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link to={item.link} key={index}>
                <Card hover className="p-3 sm:p-4 md:p-5 text-center border border-gray-100 dark:border-gray-800">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl mx-auto mb-2 sm:mb-3 md:mb-4 flex items-center justify-center ${item.color}`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CATEGORIES SECTION - New addition */}
      <section>
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Browse by Category
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1 sm:mt-2">
            Find your perfect travel experience
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card key={index} hover className="p-3 sm:p-4 text-center cursor-pointer">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full mx-auto mb-2 sm:mb-3 flex items-center justify-center ${category.color}`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-sm sm:text-base font-semibold dark:text-white">
                  {category.title}
                </h3>
              </Card>
            );
          })}
        </div>
      </section>

      {/* POPULAR DESTINATIONS - Horizontal scroll with touch support */}
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-0">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Popular Destinations
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">
              Most loved places by travelers
            </p>
          </div>
          <Link
            to="/explore"
            className="text-blue-600 hover:text-purple-600 font-semibold text-sm sm:text-base inline-flex items-center"
          >
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* Horizontal scroll container - Touch friendly */}
        <div className="w-full overflow-x-auto overflow-y-hidden pb-4 scrollbar-hide">
          <div className="flex gap-4 sm:gap-5 md:gap-6" style={{ scrollSnapType: 'x mandatory' }}>
            {destinations.map((dest) => (
              <Link
                to={`/destination/${dest.id}`}
                key={dest.id}
                className="flex-shrink-0 w-[260px] md:w-[300px] lg:w-[320px]"
                style={{ scrollSnapAlign: 'start' }}
              >
                <Card hover className="overflow-hidden border border-gray-100 dark:border-gray-800 h-full">
                  <CardImage
                    src={dest.image}
                    alt={dest.name}
                    className="h-40 sm:h-44 md:h-48 lg:h-52 object-cover"
                  />
                  <CardContent className="p-3 sm:p-4">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 dark:text-white line-clamp-1">
                      {dest.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-3 line-clamp-2">
                      {dest.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl sm:text-2xl font-bold text-blue-600">
                        ${dest.price}
                      </span>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-xs sm:text-sm dark:text-gray-300">
                          {dest.rating}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Scroll indicator for mobile */}
        <div className="flex justify-center gap-1 mt-3 sm:hidden">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
        </div>
      </section>

      {/* QUICK BOOKING SERVICES */}
      <section>
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Quick Booking Services
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1 sm:mt-2">
            Trusted tourism service providers
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {bookingServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card key={index} hover className="p-3 sm:p-4 md:p-6 text-center group cursor-pointer">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-r ${service.gradient} flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-sm sm:text-base md:text-lg font-bold mb-1 dark:text-white">
                  {service.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {service.desc}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* AI PLANNER BANNER */}
      <section className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10">
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 shadow-lg">
            <Bot className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
          </div>
          
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 dark:text-white">
            Meet Your AI Travel Assistant
          </h2>
          
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
            Personalized itineraries, smart travel recommendations,
            and tourism experiences powered by AI.
          </p>
          
          <Link to="/ai-planner">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              Start Planning with AI
              <Sparkles className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* FEATURED STATS */}
      <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="text-center p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="text-2xl sm:text-3xl font-bold text-blue-600">50+</div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Destinations</div>
        </div>
        <div className="text-center p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="text-2xl sm:text-3xl font-bold text-blue-600">10K+</div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Happy Travelers</div>
        </div>
        <div className="text-center p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="text-2xl sm:text-3xl font-bold text-blue-600">500+</div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Tours Available</div>
        </div>
        <div className="text-center p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="text-2xl sm:text-3xl font-bold text-blue-600">24/7</div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">AI Support</div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section>
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 dark:text-white">
            What Travelers Say
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Real experiences from our community
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-4 sm:p-6">
              <div className="flex items-center mb-3 sm:mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover mr-3 sm:mr-4"
                />
                <div>
                  <h4 className="font-semibold text-sm sm:text-base dark:text-white">
                    {testimonial.name}
                  </h4>
                  <div className="flex text-yellow-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                "{testimonial.text}"
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 sm:p-8 md:p-12 text-center">
        <div className="absolute inset-0 bg-white/10"></div>
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-white">
            Ready to Explore Rwanda?
          </h2>
          <p className="text-sm sm:text-base text-white/90 mb-6 sm:mb-8 max-w-md mx-auto">
            Join thousands of travelers discovering amazing places with AI Tour
          </p>
          <Link to="/signup">
            <Button variant="primary" size="lg" className="bg-white text-blue-600 hover:shadow-xl w-full sm:w-auto">
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