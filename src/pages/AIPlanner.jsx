// src/pages/AIPlanner.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bot,
  MapPin,
  Users,
  Sparkles,
  Send,
  Wallet,
  Star,
  Clock3,
  Mountain,
  Camera,
  Music4,
  HeartHandshake,
  Heart,
  Trees,
  ArrowRight,
  CheckCircle2,
  Globe2,
  TrendingUp,
  Sunset,
  Utensils,
  BedDouble,
  ThumbsUp,
  Loader2,
} from 'lucide-react';

import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { destinations } from '../data/mockData';

const AIPlanner = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [recommendations, setRecommendations] = useState(null);
  const [savedTrips, setSavedTrips] = useState([]);

  const aiMessages = [
    'Analyzing your travel style...',
    'Finding the best Rwanda experiences...',
    'Optimizing your budget...',
    'Generating smart itinerary...',
  ];

  const [formData, setFormData] = useState({
    destination: '',
    destinationId: null,
    startDate: '',
    endDate: '',
    travelers: 2,
    budget: 800,
    interests: [],
    mood: '',
    accommodation: 'mid',
    travelStyle: 'balanced',
  });

  const moods = [
    {
      name: 'Adventure',
      icon: Mountain,
      color: 'from-orange-500 to-red-500',
      description: 'Thrilling experiences & wildlife',
    },
    {
      name: 'Relaxation',
      icon: HeartHandshake,
      color: 'from-cyan-500 to-blue-500',
      description: 'Peaceful nature escapes',
    },
    {
      name: 'Luxury',
      icon: Star,
      color: 'from-yellow-500 to-orange-400',
      description: 'Premium travel experiences',
    },
    {
      name: 'Romantic',
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      description: 'Couple-friendly experiences',
    },
    {
      name: 'Nature',
      icon: Trees,
      color: 'from-green-500 to-emerald-500',
      description: 'Forests, lakes & mountains',
    },
    {
      name: 'Cultural',
      icon: Globe2,
      color: 'from-indigo-500 to-purple-500',
      description: 'History & local traditions',
    },
  ];

  const interests = [
    { name: 'Wildlife', icon: Trees },
    { name: 'Hiking', icon: Mountain },
    { name: 'Photography', icon: Camera },
    { name: 'Local Food', icon: Utensils },
    { name: 'History', icon: Clock3 },
    { name: 'Beach', icon: Sunset },
    { name: 'Nightlife', icon: Music4 },
    { name: 'Shopping', icon: Wallet },
  ];

  const accommodationOptions = [
    { value: 'budget', label: 'Budget', icon: BedDouble },
    { value: 'mid', label: 'Mid-Range', icon: BedDouble },
    { value: 'luxury', label: 'Luxury', icon: Star },
  ];

  const travelStyles = [
    { value: 'packed', label: 'Full Activities', icon: TrendingUp },
    { value: 'balanced', label: 'Balanced', icon: ThumbsUp },
    { value: 'relaxed', label: 'Relaxed', icon: Sunset },
  ];

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

  const generateAITrip = async () => {
    setLoading(true);
    setLoadingProgress(0);

    const daysCount = calculateDays();

    const selectedDestination =
      destinations.find((d) => d.name === formData.destination) ||
      destinations[0];

    const intervals = [25, 50, 75, 100];

    for (let i = 0; i < intervals.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setLoadingProgress(intervals[i]);
    }

    const activitiesByMood = {
      Adventure: [
        'Gorilla Trekking',
        'Canopy Walk',
        'Mountain Hiking',
        'Kayaking',
      ],
      Relaxation: [
        'Lake Boat Cruise',
        'Spa Session',
        'Sunset Relaxation',
      ],
      Luxury: [
        'Luxury Resort Stay',
        'Private Tour',
        'Fine Dining Experience',
      ],
      Romantic: [
        'Couple Sunset Dinner',
        'Private Boat Ride',
        'Romantic Picnic',
      ],
      Nature: [
        'Forest Walk',
        'Bird Watching',
        'Nature Photography',
      ],
      Cultural: [
        'Museum Visit',
        'Traditional Dance',
        'Village Tour',
      ],
    };

    const selectedActivities =
      activitiesByMood[formData.mood] || activitiesByMood.Nature;

    const itinerary = [];

    for (let i = 1; i <= daysCount; i++) {
      itinerary.push({
        day: i,
        title:
          i === 1
            ? 'Arrival & Welcome'
            : i === daysCount
            ? 'Farewell Day'
            : `Adventure Day ${i}`,

        activities: [
          {
            time: '09:00',
            title:
              selectedActivities[
                i % selectedActivities.length
              ],
            cost: 80,
            icon: Sparkles,
          },

          {
            time: '13:00',
            title: 'Lunch Experience',
            cost: 35,
            icon: Utensils,
          },

          {
            time: '16:00',
            title: 'Local Exploration',
            cost: 50,
            icon: Camera,
          },
        ],
      });
    }

    const recommendationsData = {
      destination: selectedDestination,
      itinerary,
      daysCount,
      totalCost: formData.budget - 100,
      savings: 100,
      dailyBudget: Math.round(formData.budget / daysCount),

      aiInsights: [
        `🎯 Perfect for ${formData.mood.toLowerCase()} travelers`,
        `📸 Great destination for ${
          formData.interests[0] || 'exploration'
        }`,
        `💰 Budget optimized for ${daysCount} days`,
      ],

      packingList: [
        'Passport',
        'Phone Charger',
        'Comfortable Shoes',
        'Camera',
        'Travel Insurance',
      ],

      bestTimeToVisit: 'June - September',

      localTips:
        'Learn basic Kinyarwanda greetings and use local transport apps like Yango.',
    };

    setRecommendations(recommendationsData);

    setLoading(false);

    setStep(4);
  };

  const saveTrip = () => {
    const newTrip = {
      id: Date.now(),
      destination: recommendations.destination.name,
      date: new Date().toISOString(),
    };

    const updatedTrips = [...savedTrips, newTrip];

    setSavedTrips(updatedTrips);

    localStorage.setItem(
      'savedTrips',
      JSON.stringify(updatedTrips)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.destination) {
      alert('Please select destination');
      return;
    }

    if (!formData.mood) {
      alert('Please select mood');
      return;
    }

    generateAITrip();
  };

  useEffect(() => {
    const stored = localStorage.getItem('savedTrips');

    if (stored) {
      setSavedTrips(JSON.parse(stored));
    }
  }, []);

  return (
    
<div className="space-y-6 animate-fade-in">
      {/* HERO */}

      <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white p-8 md:p-12 shadow-2xl">

        <div className="absolute inset-0 bg-black/10"></div>

        <div className="relative z-10">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md mb-6">
            <Bot className="w-5 h-5" />
            <span className="font-medium">
              AI Travel Assistant
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-5">
            Plan Smarter.
            <br />
            Travel Better.
          </h1>

          <p className="text-lg text-white/85 max-w-2xl">
            AI Tour creates personalized Rwanda travel
            experiences based on your travel style,
            budget, and interests.
          </p>

        </div>
      </section>

      {/* STEPS */}

      <div className="flex items-center justify-center gap-3 flex-wrap">

        {[
          'Destination',
          'Mood',
          'Preferences',
          'Results',
        ].map((item, index) => (
          <div
            key={item}
            className={`px-5 py-3 rounded-2xl font-medium ${
              step >= index + 1
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800'
            }`}
          >
            {index + 1}. {item}
          </div>
        ))}
      </div>

      {step !== 4 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* FORM */}

          <div className="lg:col-span-2">

            <Card className="p-6 md:p-8 rounded-[32px] shadow-xl">

              <h2 className="text-3xl font-black mb-8 dark:text-white">
                AI Trip Planner
              </h2>

              <form
                onSubmit={handleSubmit}
                className="space-y-8"
              >

                {/* Destination */}

                <div>

                  <label className="block text-sm font-semibold mb-3 dark:text-white">
                    Destination
                  </label>

                  <select
                    value={formData.destination}
                    onChange={(e) => {
                      const selected = destinations.find(
                        (d) => d.name === e.target.value
                      );

                      setFormData({
                        ...formData,
                        destination: e.target.value,
                        destinationId: selected?.id,
                      });
                    }}
                    className="w-full h-14 rounded-2xl border border-gray-200 dark:border-gray-700 px-4 bg-white dark:bg-gray-900 dark:text-white"
                  >
                    <option value="">
                      Select destination
                    </option>

                    {destinations.map((dest) => (
                      <option
                        key={dest.id}
                        value={dest.name}
                      >
                        {dest.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mood */}

                <div>

                  <label className="block text-sm font-semibold mb-4 dark:text-white">
                    Travel Mood
                  </label>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                    {moods.map((item) => (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            mood: item.name,
                          })
                        }
                        className={`rounded-2xl p-4 text-left text-white bg-gradient-to-r ${item.color} ${
                          formData.mood === item.name
                            ? 'ring-4 ring-emerald-500'
                            : ''
                        }`}
                      >
                        <item.icon className="w-7 h-7 mb-3" />

                        <h3 className="font-bold">
                          {item.name}
                        </h3>

                        <p className="text-xs text-white/80 mt-1">
                          {item.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dates */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <div>
                    <label className="block text-sm font-semibold mb-3 dark:text-white">
                      Start Date
                    </label>

                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          startDate: e.target.value,
                        })
                      }
                      className="h-14 rounded-2xl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-3 dark:text-white">
                      End Date
                    </label>

                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          endDate: e.target.value,
                        })
                      }
                      className="h-14 rounded-2xl"
                    />
                  </div>
                </div>

                {/* Travelers + Budget */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <div>
                    <label className="block text-sm font-semibold mb-3 dark:text-white">
                      Travelers
                    </label>

                    <Input
                      type="number"
                      min="1"
                      value={formData.travelers}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          travelers: parseInt(e.target.value),
                        })
                      }
                      className="h-14 rounded-2xl"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-3 dark:text-white">
                      Budget (USD)
                    </label>

                    <Input
                      type="number"
                      value={formData.budget}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          budget: parseInt(e.target.value),
                        })
                      }
                      className="h-14 rounded-2xl"
                    />
                  </div>
                </div>

                {/* Interests */}

                <div>

                  <label className="block text-sm font-semibold mb-4 dark:text-white">
                    Interests
                  </label>

                  <div className="flex flex-wrap gap-3">

                    {interests.map((item) => (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => {
                          const updated =
                            formData.interests.includes(
                              item.name
                            )
                              ? formData.interests.filter(
                                  (i) => i !== item.name
                                )
                              : [
                                  ...formData.interests,
                                  item.name,
                                ];

                          setFormData({
                            ...formData,
                            interests: updated,
                          });
                        }}
                        className={`px-5 py-3 rounded-2xl text-sm font-semibold transition-all ${
                          formData.interests.includes(
                            item.name
                          )
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 dark:text-white'
                        }`}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit */}

                <Button
                  type="submit"
                  className="w-full h-16 rounded-3xl text-lg font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 shadow-xl"
                >
                  Generate AI Trip Plan
                  <Send className="w-5 h-5 ml-3" />
                </Button>

              </form>
            </Card>
          </div>

          {/* SIDEBAR */}

          <div className="space-y-6">

            <Card className="p-6 rounded-[32px] shadow-xl">

              <h3 className="text-2xl font-black mb-6 dark:text-white">
                Why AI Tour?
              </h3>

              <div className="space-y-4">

                {[
                  'AI Personalized Trips',
                  'Local Rwanda Insights',
                  'Budget Optimization',
                  'Smart Itineraries',
                  '24/7 AI Assistant',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />

                    <span className="dark:text-white">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      ) : (
        recommendations && (
          <div className="space-y-8">

            {/* RESULT HERO */}

            <div className="relative overflow-hidden rounded-[32px]">

              <img
                src={recommendations.destination.image}
                alt={recommendations.destination.name}
                className="w-full h-[350px] object-cover"
              />

              <div className="absolute inset-0 bg-black/50"></div>

              <div className="absolute bottom-8 left-8 text-white">
                <h2 className="text-4xl font-black">
                  {recommendations.destination.name}
                </h2>

                <p className="text-lg mt-2">
                  Your personalized AI itinerary
                </p>
              </div>
            </div>

            {/* SUMMARY */}

            <Card className="p-6 rounded-[32px] shadow-xl">

              <h3 className="text-2xl font-black mb-6 dark:text-white">
                Trip Summary
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">

                <div>
                  <p className="text-gray-500 text-sm">
                    Duration
                  </p>

                  <h4 className="font-bold text-lg dark:text-white">
                    {recommendations.daysCount} Days
                  </h4>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">
                    Travelers
                  </p>

                  <h4 className="font-bold text-lg dark:text-white">
                    {formData.travelers}
                  </h4>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">
                    Budget
                  </p>

                  <h4 className="font-bold text-lg text-emerald-600">
                    ${formData.budget}
                  </h4>
                </div>
              </div>
            </Card>

            {/* AI Insights */}

            <Card className="p-6 rounded-[32px] shadow-xl">

              <h3 className="text-2xl font-black mb-5 dark:text-white">
                AI Insights
              </h3>

              <div className="space-y-3">

                {recommendations.aiInsights.map(
                  (insight, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800"
                    >
                      {insight}
                    </div>
                  )
                )}
              </div>
            </Card>

            {/* ITINERARY */}

            <div className="space-y-6">

              {recommendations.itinerary.map((day) => (
                <Card
                  key={day.day}
                  className="p-6 rounded-[32px] shadow-xl"
                >

                  <h3 className="text-2xl font-black mb-5 dark:text-white">
                    Day {day.day}
                  </h3>

                  <div className="space-y-4">

                    {day.activities.map((activity, idx) => {
                      const Icon = activity.icon;

                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                              <Icon className="w-5 h-5 text-emerald-600" />
                            </div>

                            <div>
                              <div className="font-bold dark:text-white">
                                {activity.title}
                              </div>

                              <div className="text-sm text-gray-500">
                                {activity.time}
                              </div>
                            </div>
                          </div>

                          <div className="font-bold text-emerald-600">
                            ${activity.cost}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              ))}
            </div>

            {/* CTA */}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">

              <Button
                onClick={saveTrip}
                className="h-14 px-8 rounded-2xl border-2 border-emerald-600 text-emerald-600 bg-white"
              >
                Save Trip
              </Button>

              <Link
                to={`/booking/${recommendations.destination.id}`}
              >
                <Button className="h-14 px-10 rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-600 text-white">
                  Book This Trip
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        )
      )}

      {/* LOADING */}

      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">

          <Card className="p-8 max-w-md mx-4 text-center rounded-3xl">

            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-emerald-600 to-cyan-600 flex items-center justify-center mx-auto mb-6">

              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>

            <h3 className="text-2xl font-bold mb-2 dark:text-white">
              AI Planning Your Trip
            </h3>

            <p className="text-gray-500 mb-6">
              {
                aiMessages[
                  Math.min(
                    Math.floor(loadingProgress / 25),
                    aiMessages.length - 1
                  )
                ]
              }
            </p>

            <div className="w-full bg-gray-200 rounded-full h-2">

              <div
                className="bg-gradient-to-r from-emerald-600 to-cyan-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${loadingProgress}%`,
                }}
              ></div>
            </div>

            <p className="text-sm text-gray-400 mt-4">
              {loadingProgress}% Complete
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AIPlanner;