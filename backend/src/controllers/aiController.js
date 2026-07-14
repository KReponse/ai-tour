// backend/src/controllers/aiController.js
// ✅ UPDATED - Uses ONLY Listing, no Tour references

import plannerService from '../ai/services/planner.service.js';
import chatService from '../ai/services/chat.service.js';
import recommendationService from '../ai/services/recommendation.service.js';
import searchService from '../ai/services/search.service.js';
import aiProvider from '../ai/providers/providerInterface.js';
import Listing from "../models/Listing.js";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Review from "../models/Review.js";
import { transformToExperiences } from '../ai/utils/experienceTransformer.js';

console.log('🔍 aiProvider instance type:', typeof aiProvider);
console.log('🔍 aiProvider methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(aiProvider)));

/* ================= AI CHAT ================= */

export const aiChat = async (req, res) => {
  try {
    const { message, context, language = 'English' } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    // Check if AI provider is available
    const providerInfo = aiProvider.getProviderInfo();
    console.log('🔍 AI Provider Status:', providerInfo);

    if (!aiProvider.isAvailable()) {
      console.warn('⚠️ AI Provider not available, using fallback');
      const fallbackResponse = getFallbackResponse(message);
      return res.status(200).json({
        success: true,
        reply: fallbackResponse,
        fallback: true,
        message: "AI service is in fallback mode",
        provider: providerInfo
      });
    }

    console.log('✅ AI Provider is available, sending to chat service...');

    // Get user context if authenticated
    const userContext = req.user ? await getUserContext(req.user._id) : null;

    // Get relevant experiences (Listings)
    const relevantExperiences = await getRelevantExperiences(message);

    // Use chat service
    const response = await chatService.sendMessage({
      message,
      context: context || 'general',
      userContext,
      relevantExperiences,
      chatHistory: []
    });

    console.log('✅ Chat response received from service');

    res.status(200).json({
      success: true,
      reply: response.reply,
      suggestedActions: response.suggestedActions || [],
      experiences: response.experiences || [],
      provider: aiProvider.getProviderInfo(),
      fallback: response.fallback || false
    });
  } catch (error) {
    console.error('❌ AI Chat Error:', error.message);
    console.error(error.stack);
    const fallbackResponse = getFallbackResponse(req.body.message);
    res.status(200).json({
      success: true,
      reply: fallbackResponse,
      fallback: true,
      error: error.message
    });
  }
};

/* ================= AI PLANNER ================= */

export const aiPlanner = async (req, res) => {
  try {
    const { destination, days, budget, travelers, preferences, interests, travelStyle, startDate } = req.body;

    if (!destination || !days || !budget) {
      return res.status(400).json({
        success: false,
        message: "Destination, days, and budget are required"
      });
    }

    // Use planner service (which now uses Listings only)
    const response = await plannerService.createPlan({
      destination,
      days: parseInt(days),
      budget: parseFloat(budget),
      travelers: travelers || 1,
      preferences,
      interests: interests || [],
      travelStyle: travelStyle || 'balanced',
      startDate
    });

    res.json({
      success: response.success,
      plan: response.plan,
      provider: aiProvider.getProviderInfo(),
      fallback: response.fallback || false
    });
  } catch (error) {
    console.error('AI Planner Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ================= AI RECOMMENDATIONS ================= */

export const aiRecommendations = async (req, res) => {
  try {
    const { query, userId, limit = 10, minPrice, maxPrice, location } = req.query;

    // Get user context
    let userContext = null;
    if (userId || req.user) {
      userContext = await getUserContext(userId || req.user?._id);
    }

    // Get experiences from search service
    const searchResults = await searchService.searchListings(query || '', {
      limit: parseInt(limit),
      filters: {
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        location
      }
    });

    // Transform to experiences
    const experiences = searchResults.experiences;

    res.json({
      success: true,
      recommendations: experiences,
      total: searchResults.total,
      source: 'listing',
      personalized: !!userContext,
      provider: aiProvider.getProviderInfo(),
      fallback: false
    });
  } catch (error) {
    console.error('AI Recommendations Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ================= AI SEARCH ================= */

export const aiSearch = async (req, res) => {
  try {
    const { query, limit = 20, page = 1, sortBy, filters } = req.query;
    
    const results = await searchService.searchListings(query, {
      limit: parseInt(limit),
      page: parseInt(page),
      sortBy,
      filters: filters ? JSON.parse(filters) : {}
    });

    res.json({
      success: true,
      ...results
    });
  } catch (error) {
    console.error('AI Search Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ================= TRENDING EXPERIENCES ================= */

export const getTrendingExperiences = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const experiences = await searchService.getTrendingExperiences(parseInt(limit));
    
    res.json({
      success: true,
      experiences,
      total: experiences.length
    });
  } catch (error) {
    console.error('Get Trending Experiences Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ================= FEATURED EXPERIENCES ================= */

export const getFeaturedExperiences = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const experiences = await searchService.getFeaturedExperiences(parseInt(limit));
    
    res.json({
      success: true,
      experiences,
      total: experiences.length
    });
  } catch (error) {
    console.error('Get Featured Experiences Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ================= SWITCH AI PROVIDER (Admin Only) ================= */

export const switchAIProvider = async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const { provider } = req.body;
    const availableProviders = ['gemini', 'openai'];

    if (!availableProviders.includes(provider)) {
      return res.status(400).json({
        success: false,
        message: `Provider must be one of: ${availableProviders.join(', ')}`
      });
    }

    const result = aiProvider.switchProvider(provider);

    res.json({
      success: true,
      message: `AI provider switched to ${provider}`,
      provider: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ================= GET AI PROVIDER INFO ================= */

export const getAIProviderInfo = async (req, res) => {
  try {
    const info = aiProvider.getProviderInfo();
    
    res.json({
      success: true,
      ...info
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ================= HELPER FUNCTIONS ================= */

// Get user context
const getUserContext = async (userId) => {
  if (!userId) return null;

  try {
    const user = await User.findById(userId);
    const bookings = await Booking.find({ user: userId, status: 'confirmed' })
      .populate('listingId') // Changed from 'tour' to 'listingId'
      .limit(5);

    const reviews = await Review.find({ user: userId })
      .populate('listingId'); // Changed from 'tour' to 'listingId'

    // Get favorite locations
    const locations = {};
    bookings.forEach(b => {
      if (b.listingId?.location) {
        locations[b.listingId.location] = (locations[b.listingId.location] || 0) + 1;
      }
    });
    const favoriteLocations = Object.keys(locations).sort((a, b) => locations[b] - locations[a]);

    return {
      name: user?.name,
      preferences: user?.preferences || {},
      pastBookings: bookings.map(b => ({
        title: b.listingId?.title,
        location: b.listingId?.location,
        rating: b.listingId?.averageRating
      })),
      reviews: reviews.map(r => ({
        experience: r.listingId?.title,
        rating: r.rating
      })),
      favoriteLocations,
      interests: user?.interests || []
    };
  } catch (error) {
    console.error("Error getting user context:", error);
    return null;
  }
};

// Get relevant experiences from database (LISTINGS ONLY)
const getRelevantExperiences = async (message) => {
  try {
    if (!message) return [];

    const keywords = message.toLowerCase().split(' ').filter(w => w.length > 3);
    
    const listings = await Listing.find({
      status: 'approved',
      $or: [
        { title: { $regex: keywords.join('|'), $options: 'i' } },
        { location: { $regex: keywords.join('|'), $options: 'i' } },
        { description: { $regex: keywords.join('|'), $options: 'i' } },
        { businessType: { $regex: keywords.join('|'), $options: 'i' } }
      ]
    })
    .limit(5)
    .populate('provider', 'businessName name avatar')
    .lean();

    return transformToExperiences(listings);
  } catch (error) {
    console.error("Error getting relevant experiences:", error);
    return [];
  }
};

// Get fallback response
const getFallbackResponse = (message) => {
  const msg = message?.toLowerCase() || '';
  
  if (msg.includes('kigali') || msg.includes('city')) {
    return "Kigali is beautiful! 🌆 Don't miss the Genocide Memorial, local markets, and vibrant nightlife. Check out our Kigali City experiences for the full experience!";
  }
  
  if (msg.includes('gorilla') || msg.includes('volcano')) {
    return "Gorilla trekking is an unforgettable experience! 🦍 Volcanoes National Park offers once-in-a-lifetime encounters. Contact us for availability and permits!";
  }
  
  if (msg.includes('safari') || msg.includes('wildlife') || msg.includes('animal')) {
    return "Rwanda's Akagera National Park offers incredible safari experiences! 🐘 See the Big Five and amazing birdlife. Book your safari adventure today!";
  }
  
  if (msg.includes('lake kivu') || msg.includes('lake')) {
    return "Lake Kivu is stunning! 🌊 Enjoy boat experiences, swimming, and beautiful sunsets. Perfect for relaxation after gorilla trekking!";
  }
  
  if (msg.includes('nyungwe') || msg.includes('forest')) {
    return "Nyungwe Forest is amazing! 🌿 Experience the canopy walk, chimpanzee trekking, and incredible biodiversity. A must-visit for nature lovers!";
  }
  
  const responses = [
    "Thank you for your question! 🇷🇼 Rwanda has amazing experiences including Kigali City tours, Akagera National Park safaris, Volcanoes National Park trekking, Nyungwe Forest adventures, and Lake Kivu relaxation. Which one interests you?",
    "I appreciate your interest in Rwanda! 🌍 We have incredible experiences including city tours, gorilla trekking, safaris, and cultural experiences. What kind of experience are you looking for?",
    "Great question! ✨ Rwanda offers diverse experiences from urban adventures in Kigali to wildlife encounters in our national parks. Our team can help you plan the perfect trip!"
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};