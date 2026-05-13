// src/pages/AIPlanner.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bot,
  Calendar,
  MapPin,
  Users,
  Sparkles,
  Send,
  Wallet,
  Plane,
  Star,
  Clock3,
  Mountain,
  Coffee,
  Camera,
  Music4,
  HeartHandshake,
  Heart,
  Trees,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Globe2,
  TrendingUp,
  Sunrise,
  Sunset,
  Utensils,
  BedDouble,
  Car,
  Wifi,
  ThumbsUp,
  Loader2,
} from 'lucide-react';

import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { destinations } from '../data/mockData';

const AIPlanner = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [recommendations, setRecommendations] = useState(null);
  const [savedTrips, setSavedTrips] = useState([]);

  const [formData, setFormData] = useState({
    destination: '',
    destinationId: null,
    startDate: '',
    endDate: '',
    travelers: 2,
    budget: 800,
    interests: [],
    mood: '',
    accommodation: 'mid-range',
    travelStyle: 'balanced',
  });

  // AI Suggestions based on Rwanda destinations
  const aiSuggestions = destinations.map(d => ({
    name: d.name,
    location: d.location,
    price: d.price,
    rating: d.rating,
    duration: d.duration,
  }));

  const moods = [
    { name: 'Adventure', icon: Mountain, color: 'from-orange-500 to-red-500', description: 'Thrilling experiences, hiking, wildlife' },
    { name: 'Relaxation', icon: HeartHandshake, color: 'from-cyan-500 to-blue-500', description: 'Peaceful getaways, spa, nature' },
    { name: 'Luxury', icon: Star, color: 'from-yellow-500 to-orange-400', description: 'Premium stays, fine dining, exclusivity' },
    { name: 'Romantic', icon: Heart, color: 'from-pink-500 to-rose-500', description: 'Couple getaways, sunset views, intimate' },
    { name: 'Nature', icon: Trees, color: 'from-green-500 to-emerald-500', description: 'Forests, lakes, mountains, wildlife' },
    { name: 'Cultural', icon: Globe2, color: 'from-indigo-500 to-purple-500', description: 'Heritage, museums, local traditions' },
  ];

  const interests = [
    { name: 'Wildlife', icon: Trees, category: 'nature' },
    { name: 'Hiking', icon: Mountain, category: 'adventure' },
    { name: 'Photography', icon: Camera, category: 'creative' },
    { name: 'Local Food', icon: Utensils, category: 'culture' },
    { name: 'History', icon: Clock3, category: 'culture' },
    { name: 'Beach', icon: Sunset, category: 'relaxation' },
    { name: 'Nightlife', icon: Music4, category: 'entertainment' },
    { name: 'Shopping', icon: Wallet, category: 'lifestyle' },
  ];

  const accommodationOptions = [
    { value: 'budget', label: 'Budget', priceMultiplier: 0.6, icon: BedDouble },
    { value: 'mid-range', label: 'Mid-Range', priceMultiplier: 1, icon: BedDouble },
    { value: 'luxury', label: 'Luxury', priceMultiplier: 2.5, icon: Star },
  ];

  const travelStyles = [
    { value: 'packed', label: 'Full of Activities', icon: TrendingUp },
    { value: 'balanced', label: 'Balanced', icon: ThumbsUp },
    { value: 'relaxed', label: 'Relaxed Pace', icon: Sunset },
  ];

  // Calculate days between dates
  const calculateDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays + 1;
    }
    return 3;
  };

  // AI Trip Generation Logic
  const generateAITrip = async () => {
    setLoading(true);
    setLoadingProgress(0);

    const daysCount = calculateDays();
    const selectedDestination = destinations.find(d => d.name === formData.destination) || destinations[0];
    
    // Simulate AI processing with progress
    const intervals = [25, 50, 75, 100];
    for (let i = 0; i < intervals.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setLoadingProgress(intervals[i]);
    }

    // AI Logic: Generate personalized itinerary based on preferences
    const itinerary = [];
    const activitiesByMood = {
      Adventure: ['Gorilla Trekking', 'Canopy Walk', 'Mountain Hiking', 'Kayaking', 'Game Drive'],
      Relaxation: ['Lake Kivu Boat Cruise', 'Spa Treatment', 'Sunset Watching', 'Beach Time', 'Yoga Session'],
      Luxury: ['Private Helicopter Tour', '5-Star Lodge Stay', 'Gourmet Dining', 'Private Safari', 'Spa Experience'],
      Romantic: ['Sunset Dinner', 'Couple Massage', 'Private Boat Ride', 'Candlelit Dinner', 'Scenic Picnic'],
      Nature: ['Bird Watching', 'Forest Walk', 'Waterfall Visit', 'Botanical Tour', 'Nature Photography'],
      Cultural: ['Museum Visit', 'Traditional Dance', 'Village Tour', 'Art Workshop', 'Cooking Class'],
    };

    const selectedActivities = activitiesByMood[formData.mood] || activitiesByMood.Nature;
    
    // Calculate daily budget
    const dailyBudget = formData.budget / daysCount;
    const accommodationCost = dailyBudget * 0.4;
    const foodCost = dailyBudget * 0.25;
    const activityCost = dailyBudget * 0.35;

    for (let i = 1; i <= daysCount; i++) {
      const dayActivities = [];
      
      // Morning activity
      dayActivities.push({
        time: '09:00',
        title: selectedActivities[(i * 2) % selectedActivities.length],
        type: 'activity',
        cost: Math.round(activityCost * 0.4),
        icon: Sparkles,
      });
      
      // Lunch
      dayActivities.push({
        time: '12:30',
        title: i === 1 ? 'Welcome Lunch - Local Cuisine' : 'Lunch at Recommended Restaurant',
        type: 'food',
        cost: Math.round(foodCost * 0.4),
        icon: Utensils,
      });
      
      // Afternoon activity
      dayActivities.push({
        time: '14:00',
        title: selectedActivities[(i * 2 + 1) % selectedActivities.length],
        type: 'activity',
        cost: Math.round(activityCost * 0.6),
        icon: Camera,
      });
      
      // Dinner (special for last day)
      if (i === daysCount) {
        dayActivities.push({
          time: '19:00',
          title: formData.mood === 'Romantic' ? 'Romantic Farewell Dinner' : 'Celebration Dinner',
          type: 'food',
          cost: Math.round(foodCost * 0.6),
          icon: Utensils,
        });
      } else {
        dayActivities.push({
          time: '19:00',
          title: 'Dinner at Local Restaurant',
          type: 'food',
          cost: Math.round(foodCost * 0.6),
          icon: Utensils,
        });
      }
      
      itinerary.push({
        day: i,
        title: i === 1 ? 'Arrival & Introduction' : i === daysCount ? 'Farewell & Departure' : `Day ${i} Exploration`,
        activities: dayActivities,
        accommodation: {
          name: getAccommodationName(selectedDestination.name, formData.accommodation, i),
          cost: Math.round(accommodationCost),
        },
      });
    }

    const totalCost = itinerary.reduce((sum, day) => {
      const dayActivitiesCost = day.activities.reduce((s, a) => s + a.cost, 0);
      return sum + dayActivitiesCost + day.accommodation.cost;
    }, 0);

    const recommendationsData = {
      destination: selectedDestination,
      itinerary,
      totalCost,
      daysCount,
      dailyBudget,
      savings: formData.budget - totalCost,
      aiInsights: generateAIInsights(formData, selectedDestination, daysCount),
      packingList: generatePackingList(formData.mood, selectedDestination.name),
      bestTimeToVisit: getBestTimeToVisit(selectedDestination.name),
      localTips: getLocalTips(selectedDestination.name),
    };

    setRecommendations(recommendationsData);
    setLoading(false);
    setStep(4);
  };

  const getAccommodationName = (destination, type, day) => {
    const accommodations = {
      'Volcanoes National Park': { budget: 'Gorilla Volcanoes Lodge', mid: 'Bisate Lodge', luxury: 'Singita Kwitonda' },
      'Lake Kivu': { budget: 'Paradise Malahide', mid: 'Lake Kivu Serena Hotel', luxury: 'The Retreat by Heaven' },
      'Nyungwe National Park': { budget: 'Nyungwe Top View Hill', mid: 'Nyungwe House', luxury: 'One&Only Nyungwe House' },
      'Kigali City': { budget: 'Hotel des Mille Collines', mid: 'The Marriott', luxury: 'The Retreat' },
      'Akagera National Park': { budget: 'Akagera Game Lodge', mid: 'Ruzizi Tented Lodge', luxury: 'Magashi Camp' },
    };
    const destAccommodations = accommodations[destination] || accommodations['Kigali City'];
    return destAccommodations[type] || destAccommodations.mid;
  };

  const generateAIInsights = (data, destination, days) => {
    const insights = [];
    
    if (data.mood === 'Adventure') {
      insights.push(`🎒 Based on your adventure preference, we've included challenging hikes and wildlife encounters at ${destination.name}.`);
    }
    if (data.budget < 500) {
      insights.push(`💰 Your budget of $${data.budget} is optimized for ${days} days using local transport and mid-range accommodations.`);
    } else if (data.budget > 1500) {
      insights.push(`✨ With your $${data.budget} budget, we've upgraded to luxury lodges and private tours.`);
    }
    if (data.interests.includes('Photography')) {
      insights.push(`📸 We've scheduled activities during golden hour (sunrise/sunset) for the best photography opportunities.`);
    }
    if (data.interests.includes('Local Food')) {
      insights.push(`🍽️ Your itinerary includes authentic Rwandan cuisine experiences at top-rated local restaurants.`);
    }
    
    if (insights.length === 0) {
      insights.push(`🎯 This ${days}-day itinerary is optimized for ${data.mood.toLowerCase()} travelers visiting ${destination.name}.`);
    }
    
    return insights;
  };

  const generatePackingList = (mood, destination) => {
    const baseItems = ['Passport/ID', 'Travel Insurance', 'Phone & Charger', 'Comfortable Shoes'];
    const moodItems = {
      Adventure: ['Hiking Boots', 'Rain Jacket', 'Insect Repellent', 'Binoculars', 'Backpack'],
      Relaxation: ['Swimsuit', 'Sunscreen', 'Sunglasses', 'Beach Towel', 'Book'],
      Luxury: ['Smart Casual Outfits', 'Camera', 'Power Bank', 'Sunglasses'],
      Romantic: ['Nice Evening Wear', 'Perfume/Cologne', 'Camera', 'Journal'],
      Nature: ['Binoculars', 'Field Guide', 'Water Bottle', 'Hat', 'Sunscreen'],
      Cultural: ['Modest Clothing', 'Notebook', 'Camera', 'Comfortable Shoes'],
    };
    
    const destinationItems = destination.includes('Volcanoes') ? ['Warm Jacket', 'Gloves', 'Waterproof Pants'] :
                          destination.includes('Akagera') ? ['Neutral Colored Clothes', 'Sunscreen', 'Hat'] :
                          destination.includes('Kivu') ? ['Swimsuit', 'Sandals', 'Sunscreen'] : [];
    
    return [...baseItems, ...(moodItems[mood] || moodItems.Nature), ...destinationItems];
  };

  const getBestTimeToVisit = (destination) => {
    const times = {
      'Volcanoes National Park': 'June-September & December-February (Dry seasons)',
      'Akagera National Park': 'June-September (Dry season for better wildlife viewing)',
      'Nyungwe National Park': 'June-August & December-February (Less rain for canopy walk)',
      'Lake Kivu': 'May-October (Warm and sunny)',
      'Kigali City': 'Year-round (Mild climate)',
    };
    return times[destination] || 'June-September (Dry season)';
  };

  const getLocalTips = (destination) => {
    const tips = {
      'Volcanoes National Park': 'Book gorilla permits 6 months in advance. Hire a porter for $20 to help with gear.',
      'Akagera National Park': 'Early morning game drives offer the best sightings. Bring binoculars!',
      'Nyungwe National Park': 'The canopy walk requires good weather - check forecast before booking.',
      'Lake Kivu': 'Try the local fish "Isambaza" - it\'s delicious! Rent a bike for the Congo Nile Trail.',
      'Kigali City': 'Use Yango or Move for affordable transport. Visit Kimironko Market for souvenirs.',
    };
    return tips[destination] || 'Respect local customs. Learn a few Kinyarwanda phrases like "Muraho" (Hello)!';
  };

  const saveTrip = () => {
    const newTrip = {
      id: Date.now(),
      destination: recommendations.destination.name,
      date: new Date().toISOString(),
      budget: recommendations.totalCost,
      days: recommendations.daysCount,
      itinerary: recommendations.itinerary,
    };
    setSavedTrips([...savedTrips, newTrip]);
    localStorage.setItem('savedTrips', JSON.stringify([...savedTrips, newTrip]));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.destination) {
      alert('Please select a destination');
      return;
    }
    if (!formData.mood) {
      alert('Please select your travel mood');
      return;
    }
    generateAITrip();
  };

  // Load saved trips on mount
  useEffect(() => {
    const stored = localStorage.getItem('savedTrips');
    if (stored) {
      setSavedTrips(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-5 pb-32 md:pb-10 space-y-8 animate-fade-in">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white p-8 md:p-12 shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md mb-6 border border-white/20">
            <Bot className="w-5 h-5" />
            <span className="font-medium">AI Travel Assistant Powered by RwandaAI</span>
          </div>
          
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-5">
              Plan Smarter.
              <br />
              <span className="text-yellow-300">Travel Better.</span>
            </h1>
            <p className="text-lg text-white/85 leading-relaxed max-w-2xl">
              AI Tour creates personalized Rwanda travel experiences based on your travel style, 
              budget, mood, and interests — just like having a local expert in your pocket.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl p-4">
              <div className="text-2xl font-bold">50+</div>
              <div className="text-sm text-white/80">Destinations</div>
            </div>
            <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl p-4">
              <div className="text-2xl font-bold">10K+</div>
              <div className="text-sm text-white/80">Trips Planned</div>
            </div>
            <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl p-4">
              <div className="text-2xl font-bold">98%</div>
              <div className="text-sm text-white/80">Satisfaction</div>
            </div>
            <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl p-4">
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm text-white/80">AI Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2 md:gap-3 overflow-x-auto pb-2">
        {[
          { step: 1, label: 'Destination', icon: MapPin },
          { step: 2, label: 'Style & Mood', icon: Heart },
          { step: 3, label: 'Preferences', icon: Sparkles },
          { step: 4, label: 'AI Results', icon: Bot },
        ].map((item) => (
          <div
            key={item.step}
            onClick={() => step >= item.step && setStep(item.step)}
            className={`flex items-center gap-2 px-3 md:px-5 py-2 md:py-3 rounded-2xl whitespace-nowrap transition-all duration-300 cursor-pointer ${
              step >= item.step
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-800 dark:text-white opacity-60'
            }`}
          >
            <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
              {item.step}
            </div>
            <span className="font-medium text-xs md:text-sm hidden sm:inline">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Main Content */}
      {step !== 4 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 md:p-8 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-center shadow-xl">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-black dark:text-white">AI Trip Planner</h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">Create your perfect Rwanda experience</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Destination */}
                <div>
                  <label className="block text-sm font-semibold mb-3 dark:text-white">
                    Where would you love to explore? <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={formData.destination}
                      onChange={(e) => {
                        const selected = destinations.find(d => d.name === e.target.value);
                        setFormData({
                          ...formData,
                          destination: e.target.value,
                          destinationId: selected?.id,
                        });
                      }}
                      className="w-full pl-12 pr-4 h-14 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a destination</option>
                      {destinations.map((dest) => (
                        <option key={dest.id} value={dest.name}>
                          {dest.name} - ${dest.price} (⭐ {dest.rating})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* AI Suggestions */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <p className="text-xs text-gray-500 w-full mb-2">✨ AI Suggestions:</p>
                    {aiSuggestions.slice(0, 4).map((place) => (
                      <button
                        key={place.name}
                        type="button"
                        onClick={() => setFormData({ ...formData, destination: place.name })}
                        className="px-4 py-2 rounded-full bg-gray-100 hover:bg-emerald-100 dark:bg-gray-800 dark:text-white text-sm transition-all duration-300"
                      >
                        {place.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Travel Mood */}
                <div>
                  <label className="block text-sm font-semibold mb-4 dark:text-white">
                    What kind of experience do you want? <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {moods.map((item) => (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => setFormData({ ...formData, mood: item.name })}
                        className={`rounded-2xl p-4 text-left transition-all duration-300 border ${
                          formData.mood === item.name
                            ? 'border-transparent shadow-xl scale-[1.02] ring-2 ring-emerald-500'
                            : 'border-gray-200 dark:border-gray-700 hover:border-emerald-400'
                        } bg-gradient-to-r ${item.color} text-white`}
                      >
                        <item.icon className="w-7 h-7 mb-3" />
                        <h3 className="font-bold">{item.name}</h3>
                        <p className="text-xs text-white/80 mt-1 hidden md:block">{item.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold mb-3 dark:text-white">Start Date</label>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="h-14 rounded-2xl"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-3 dark:text-white">End Date</label>
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="h-14 rounded-2xl"
                      required
                    />
                  </div>
                </div>

                {/* Travelers & Budget */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold mb-3 dark:text-white">Travelers</label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="number"
                        min="1"
                        max="20"
                        value={formData.travelers}
                        onChange={(e) => setFormData({ ...formData, travelers: parseInt(e.target.value) })}
                        className="pl-12 h-14 rounded-2xl"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-3 dark:text-white">
                      Budget (USD per person)
                    </label>
                    <div className="relative">
                      <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="number"
                        placeholder="800"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) })}
                        className="pl-12 h-14 rounded-2xl"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      💡 Recommended: $500-800 for 3 days, $1000-1500 for 5-7 days
                    </p>
                  </div>
                </div>

                {/* Accommodation Preference */}
                <div>
                  <label className="block text-sm font-semibold mb-3 dark:text-white">Accommodation Preference</label>
                  <div className="grid grid-cols-3 gap-3">
                    {accommodationOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, accommodation: opt.value })}
                        className={`p-4 rounded-2xl text-center transition-all border ${
                          formData.accommodation === opt.value
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 ring-2 ring-emerald-500'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <opt.icon className="w-6 h-6 mx-auto mb-2 text-emerald-600" />
                        <span className="text-sm font-medium dark:text-white">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <label className="block text-sm font-semibold mb-4 dark:text-white">Travel Interests (Select multiple)</label>
                  <div className="flex flex-wrap gap-3">
                    {interests.map((item) => (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => {
                          const updated = formData.interests.includes(item.name)
                            ? formData.interests.filter((i) => i !== item.name)
                            : [...formData.interests, item.name];
                          setFormData({ ...formData, interests: updated });
                        }}
                        className={`flex items-center gap-2 px-5 py-3 rounded-2xl transition-all duration-300 text-sm font-semibold ${
                          formData.interests.includes(item.name)
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg scale-[1.02]'
                            : 'bg-gray-100 dark:bg-gray-800 dark:text-white hover:bg-gray-200'
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Travel Style */}
                <div>
                  <label className="block text-sm font-semibold mb-3 dark:text-white">Travel Pace</label>
                  <div className="grid grid-cols-3 gap-3">
                    {travelStyles.map((style) => (
                      <button
                        key={style.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, travelStyle: style.value })}
                        className={`p-4 rounded-2xl text-center transition-all border ${
                          formData.travelStyle === style.value
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 ring-2 ring-emerald-500'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <style.icon className="w-6 h-6 mx-auto mb-2 text-emerald-600" />
                        <span className="text-sm font-medium dark:text-white">{style.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Assistant Message */}
                <div className="rounded-3xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-900 border border-emerald-100 dark:border-gray-700 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-center shadow-xl flex-shrink-0">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2 dark:text-white">AI Travel Assistant</h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                        Based on your preferences, AI Tour will generate personalized experiences, 
                        recommend the best accommodations, and optimize your trip budget.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-16 rounded-3xl text-lg font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:scale-[1.02] transition-all duration-300 shadow-xl"
                >
                  <div className="flex items-center justify-center">
                    Generate AI Trip Plan
                    <Send className="w-5 h-5 ml-3" />
                  </div>
                </Button>
              </form>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Why AI Tour */}
            <Card className="p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-xl">
              <h3 className="text-xl font-black mb-6 dark:text-white">Why AI Tour?</h3>
              <div className="space-y-4">
                {[
                  '🎯 Personalized AI itineraries',
                  '🤖 24/7 travel assistant',
                  '💰 Real-time budget optimization',
                  '📍 Local Rwanda insights',
                  '⭐ Curated by travel experts',
                  '📱 Seamless booking experience',
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="dark:text-gray-200 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Trending AI Trips */}
            <Card className="p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black dark:text-white">🔥 Trending Now</h3>
                <Link to="/explore">
                  <button className="text-emerald-600 font-semibold text-sm">See All</button>
                </Link>
              </div>
              <div className="space-y-4">
                {destinations.slice(0, 3).map((trip) => (
                  <div key={trip.id} className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold dark:text-white">{trip.name}</h4>
                        <p className="text-sm text-gray-500">{trip.duration}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-emerald-600">${trip.price}</div>
                        <div className="flex items-center text-xs">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="ml-1">{trip.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* AI Stats */}
            <Card className="p-6 rounded-[32px] bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-xl overflow-hidden relative">
              <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-black mb-6">AI Tour Stats</h3>
                <div className="space-y-5">
                  <div>
                    <div className="text-3xl font-black">10,000+</div>
                    <p className="text-white/80 mt-1">Trips Planned</p>
                  </div>
                  <div>
                    <div className="text-3xl font-black">98%</div>
                    <p className="text-white/80 mt-1">Happy Travelers</p>
                  </div>
                  <div>
                    <div className="text-3xl font-black">24/7</div>
                    <p className="text-white/80 mt-1">AI Support</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        /* RESULTS SECTION */
        recommendations && (
          <div className="space-y-8">
            {/* Success Header */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 font-semibold mb-4">
                <Sparkles className="w-4 h-4" />
                AI Personalized Results
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-3 dark:text-white">
                Your {recommendations.daysCount}-Day {recommendations.destination.name} Adventure
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Designed specifically for {formData.mood.toLowerCase()} travelers
              </p>
            </div>

            {/* AI Insights */}
            <Card className="p-6 rounded-[32px] border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 shadow-lg">
              <h3 className="text-xl font-black mb-4 dark:text-white flex items-center gap-2">
                <Bot className="w-6 h-6 text-emerald-600" />
                AI Travel Insights
              </h3>
              <div className="space-y-2">
                {recommendations.aiInsights.map((insight, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-gray-800">
                    <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="dark:text-gray-200">{insight}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Budget Summary */}
            <Card className="p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-xl">
              <h3 className="text-xl font-black mb-5 dark:text-white">💰 Budget Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 text-center">
                  <div className="text-3xl font-black text-emerald-600">${recommendations.totalCost}</div>
                  <p className="text-sm text-gray-500 mt-1">Total Estimated Cost</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 text-center">
                  <div className="text-3xl font-black text-emerald-600">${Math.round(recommendations.dailyBudget)}</div>
                  <p className="text-sm text-gray-500 mt-1">Per Day (per person)</p>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-center">
                  <div className="text-3xl font-black text-emerald-600">${recommendations.savings > 0 ? recommendations.savings : 0}</div>
                  <p className="text-sm text-gray-500 mt-1">Estimated Savings</p>
                </div>
              </div>
              {recommendations.savings < 0 && (
                <p className="text-amber-600 text-sm mt-4 text-center">
                  ⚠️ Your budget is ${Math.abs(recommendations.savings)} below the estimated cost. Consider adjusting dates or accommodation.
                </p>
              )}
            </Card>

            {/* Itinerary Days */}
            <div className="space-y-6">
              {recommendations.itinerary.map((day) => (
                <Card key={day.day} className="p-6 md:p-8 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
                  <div className="flex items-start gap-5 mb-6">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-center text-2xl font-black shadow-lg flex-shrink-0">
                      {day.day}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-black dark:text-white">Day {day.day}</h3>
                      <p className="text-gray-500 text-lg">{day.title}</p>
                      <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 text-sm">
                        <BedDouble className="w-3 h-3" />
                        Staying at: {day.accommodation.name}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Accommodation</div>
                      <div className="font-bold text-emerald-600">${day.accommodation.cost}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {day.activities.map((activity, idx) => {
                      const Icon = activity.icon;
                      return (
                        <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                              <Icon className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                              <div className="font-medium dark:text-white">{activity.title}</div>
                              <div className="text-xs text-gray-400">{activity.time}</div>
                            </div>
                          </div>
                          <div className="font-semibold text-emerald-600">${activity.cost}</div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              ))}
            </div>

            {/* Local Tips & Packing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-xl">
                <h3 className="text-xl font-black mb-4 dark:text-white flex items-center gap-2">
                  <ThumbsUp className="w-6 h-6 text-emerald-600" />
                  Local Expert Tips
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{recommendations.localTips}</p>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-sm text-gray-500">📅 Best time to visit: {recommendations.bestTimeToVisit}</p>
                </div>
              </Card>

              <Card className="p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-xl">
                <h3 className="text-xl font-black mb-4 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  Smart Packing List
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recommendations.packingList.map((item, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-sm">
                      {item}
                    </span>
                  ))}
                </div>
              </Card>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={saveTrip}
                className="h-14 px-8 rounded-2xl bg-white border-2 border-emerald-600 text-emerald-600 font-bold hover:bg-emerald-50"
              >
                💾 Save This Trip
              </Button>
              <Link to={`/booking/${recommendations.destination.id}`}>
                <Button className="h-14 px-10 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white font-bold shadow-xl">
                  Book This Trip Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <button
                onClick={() => {
                  setRecommendations(null);
                  setStep(1);
                  setFormData({
                    destination: '',
                    destinationId: null,
                    startDate: '',
                    endDate: '',
                    travelers: 2,
                    budget: 800,
                    interests: [],
                    mood: '',
                    accommodation: 'mid-range',
                    travelStyle: 'balanced',
                  });
                }}
                className="h-14 px-8 rounded-2xl border border-gray-300 dark:border-gray-700 font-medium"
              >
                Plan Another Trip
              </button>
            </div>
          </div>
        )
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <Card className="p-8 max-w-md mx-4 text-center rounded-3xl">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
            <h3 className="text-2xl font-bold mb-2 dark:text-white">AI is Planning Your Trip</h3>
            <p className="text-gray-500 mb-6">Creating your personalized Rwanda experience...</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-emerald-600 to-teal-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-400 mt-4">{loadingProgress}% Complete</p>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AIPlanner;