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
import { generateTripPlan } from '../services/aiService';

// ===============================
// AI TOUR COLORS
// ===============================
// Teal  : #0D9488
// Gold  : #F59E0B
// Slate : #374151
// White : #FFFFFF
// ===============================

const AIPlanner = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [tripPlan, setTripPlan] = useState(null);
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
      color: 'from-[#0D9488] to-[#0f766e]',
      description: 'Thrilling experiences & wildlife',
    },
    {
      name: 'Relaxation',
      icon: HeartHandshake,
      color: 'from-[#0D9488] to-[#0f766e]',
      description: 'Peaceful nature escapes',
    },
    {
      name: 'Luxury',
      icon: Star,
      color: 'from-[#F59E0B] to-[#d97706]',
      description: 'Premium travel experiences',
    },
    {
      name: 'Romantic',
      icon: Heart,
      color: 'from-[#0D9488] to-[#0f766e]',
      description: 'Couple-friendly experiences',
    },
    {
      name: 'Nature',
      icon: Trees,
      color: 'from-[#0D9488] to-[#0f766e]',
      description: 'Forests, lakes & mountains',
    },
    {
      name: 'Cultural',
      icon: Globe2,
      color: 'from-[#0D9488] to-[#0f766e]',
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

  const [aiText, setAiText] = useState('');

  // ============================================================
  // ✅ FIX: Frontend sends request to Backend, not Gemini directly
  // ============================================================
  const generateAITrip = async () => {
    setLoading(true);
    setLoadingProgress(0);

    // Prepare request data
    const requestData = {
      destination: formData.destination,
      mood: formData.mood,
      budget: formData.budget,
      travelers: formData.travelers,
      interests: formData.interests.join(', '),
      travelStyle: formData.travelStyle,
      accommodation: formData.accommodation,
      days: calculateDays(),
    };

    try {
      // ✅ Call backend API
      const response = await generateTripPlan(requestData);
      
      console.log('✅ Backend Response:', response);

      // Update progress
      const intervals = [25, 50, 75, 100];
      for (let i = 0; i < intervals.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 600));
        setLoadingProgress(intervals[i]);
      }

      // ✅ Set response from backend
      const planText = response.plan || response.message || response.reply || 'No plan generated';
      setAiText(planText);
      setTripPlan({
        plan: planText,
        ...response,
      });

      setLoading(false);
      setStep(4);

    } catch (error) {
      console.error('❌ AI Generation Error:', error);
      alert(error.response?.data?.message || 'AI failed to generate trip plan');
      setLoading(false);
    }
  };

  const saveTrip = () => {
    if (!tripPlan) return;
    const newTrip = {
      id: Date.now(),
      destination: formData.destination,
      date: new Date().toISOString(),
      plan: tripPlan,
    };
    const updatedTrips = [...savedTrips, newTrip];
    setSavedTrips(updatedTrips);
    localStorage.setItem('savedTrips', JSON.stringify(updatedTrips));
    alert('✅ Trip saved successfully!');
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

  useEffect(() => {
    const stored = localStorage.getItem('savedTrips');
    if (stored) {
      setSavedTrips(JSON.parse(stored));
    }
  }, []);

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto px-4 py-8">

      {/* HERO */}
      <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#0D9488] via-[#0D9488] to-[#F59E0B] text-white p-8 md:p-12 shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md mb-6">
            <Bot className="w-5 h-5" />
            <span className="font-medium">AI Travel Assistant</span>
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
        {['Destination', 'Mood', 'Preferences', 'Results'].map((item, index) => (
          <div
            key={item}
            className={`px-5 py-3 rounded-2xl font-medium ${
              step >= index + 1
                ? 'bg-[#0D9488] text-white'
                : 'bg-gray-100 dark:bg-gray-800 dark:text-gray-300'
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

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Destination */}
                <div>
                  <label className="block text-sm font-semibold mb-3 dark:text-white">
                    Destination
                  </label>
                  <select
                    value={formData.destination}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        destination: e.target.value,
                      });
                    }}
                    className="w-full h-14 rounded-2xl border border-gray-200 dark:border-gray-700 px-4 bg-white dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
                  >
                    <option value="">Select destination</option>
                    <option value="Kigali City">Kigali City</option>
                    <option value="Volcanoes National Park">Volcanoes National Park</option>
                    <option value="Akagera National Park">Akagera National Park</option>
                    <option value="Nyungwe Forest">Nyungwe Forest</option>
                    <option value="Lake Kivu">Lake Kivu</option>
                    <option value="Musanze">Musanze</option>
                    <option value="Gisenyi">Gisenyi</option>
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
                            ? 'ring-4 ring-[#F59E0B]'
                            : ''
                        }`}
                      >
                        <item.icon className="w-7 h-7 mb-3" />
                        <h3 className="font-bold">{item.name}</h3>
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
                      className="h-14 rounded-2xl focus:ring-[#0D9488]"
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
                      className="h-14 rounded-2xl focus:ring-[#0D9488]"
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
                      className="h-14 rounded-2xl focus:ring-[#0D9488]"
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
                      className="h-14 rounded-2xl focus:ring-[#0D9488]"
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
                          const updated = formData.interests.includes(item.name)
                            ? formData.interests.filter((i) => i !== item.name)
                            : [...formData.interests, item.name];
                          setFormData({
                            ...formData,
                            interests: updated,
                          });
                        }}
                        className={`px-5 py-3 rounded-2xl text-sm font-semibold transition-all ${
                          formData.interests.includes(item.name)
                            ? 'bg-[#0D9488] text-white'
                            : 'bg-gray-100 dark:bg-gray-800 dark:text-white hover:bg-[#0D9488]/10'
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
                  className="w-full h-16 rounded-3xl text-lg font-bold bg-gradient-to-r from-[#0D9488] to-[#F59E0B] shadow-xl shadow-[#0D9488]/30 hover:scale-[1.02] transition"
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
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#0D9488]" />
                    <span className="dark:text-white">{item}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      ) : (
        // ============================================================
        // RESULTS
        // ============================================================
        <div className="space-y-8">

          {/* RESULT HERO */}
          <div className="relative overflow-hidden rounded-[32px]">
            <img
              src="https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=1200"
              alt={formData.destination}
              className="w-full h-[350px] object-cover"
            />
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="absolute bottom-8 left-8 text-white">
              <h2 className="text-4xl font-black">
                {formData.destination}
              </h2>
              <p className="text-lg mt-2">Your personalized AI itinerary</p>
            </div>
          </div>

          {/* TRIP SUMMARY */}
          <Card className="p-6 rounded-[32px] shadow-xl">
            <h3 className="text-2xl font-black mb-6 dark:text-white">
              Trip Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              <div>
                <p className="text-gray-500 text-sm">Duration</p>
                <h4 className="font-bold text-lg dark:text-white">
                  {calculateDays()} Days
                </h4>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Travelers</p>
                <h4 className="font-bold text-lg dark:text-white">
                  {formData.travelers}
                </h4>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Budget</p>
                <h4 className="font-bold text-lg text-[#0D9488]">
                  ${formData.budget}
                </h4>
              </div>
            </div>
          </Card>

          {/* AI PLAN - From Backend */}
          <Card className="p-6 rounded-[32px] shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-2xl font-black dark:text-white">
                AI Travel Plan
              </h3>
              <span className="text-xs bg-[#0D9488]/10 text-[#0D9488] px-3 py-1 rounded-full">
                Powered by AI
              </span>
            </div>
            <div className="whitespace-pre-line text-gray-700 dark:text-gray-200 leading-8">
              {aiText}
            </div>
          </Card>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={saveTrip}
              className="h-14 px-8 rounded-2xl border-2 border-[#0D9488] text-[#0D9488] bg-white hover:bg-[#0D9488]/10 transition"
            >
              Save Trip
            </Button>

            <Link to="/explore">
              <Button className="h-14 px-10 rounded-2xl bg-gradient-to-r from-[#0D9488] to-[#F59E0B] text-white shadow-xl shadow-[#0D9488]/30 hover:scale-[1.02] transition">
                Explore Tours
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <Card className="p-8 max-w-md mx-4 text-center rounded-3xl">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#0D9488] to-[#F59E0B] flex items-center justify-center mx-auto mb-6">
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
                className="bg-gradient-to-r from-[#0D9488] to-[#F59E0B] h-2 rounded-full transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              />
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