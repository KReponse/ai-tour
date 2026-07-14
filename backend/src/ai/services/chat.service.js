// backend/src/ai/services/chat.service.js
// ✅ FIXED - Added cacheEnabled property

import aiProvider from '../providers/providerInterface.js';
import chatPrompt from '../prompts/chat.prompt.js';
import systemPrompt from '../prompts/system.prompt.js';
import Listing from '../../models/Listing.js';
import { transformToExperiences } from '../utils/experienceTransformer.js';
import aiCache from '../utils/aiCache.js';

class ChatService {
  constructor() {
    this.sessions = new Map();
    this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
    this.cacheEnabled = process.env.AI_CACHE_ENABLED !== 'false'; // ✅ Added
    console.log('🤖 Chat Service initialized');
    console.log(`📦 Cache ${this.cacheEnabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * ✅ Get or create a session
   */
  getOrCreateSession(sessionId, userId) {
    // If session exists and is valid, return it
    if (sessionId && this.sessions.has(sessionId)) {
      const session = this.sessions.get(sessionId);
      // Check if session expired
      if (Date.now() - session.lastActivity < this.sessionTimeout) {
        session.lastActivity = Date.now();
        return session;
      } else {
        // Session expired, delete it
        this.sessions.delete(sessionId);
      }
    }

    // Create new session
    const newSession = {
      id: sessionId || `session_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      userId: userId || null,
      createdAt: Date.now(),
      lastActivity: Date.now(),
      messages: [],
      intent: 'greet',
      lastResults: [],
      lastMessage: null
    };

    this.sessions.set(newSession.id, newSession);
    console.log(`📌 New session created: ${newSession.id}`);
    return newSession;
  }

  /**
   * Clean up expired sessions
   */
  cleanupSessions() {
    const now = Date.now();
    let cleaned = 0;
    for (const [id, session] of this.sessions) {
      if (now - session.lastActivity > this.sessionTimeout) {
        this.sessions.delete(id);
        cleaned++;
      }
    }
    if (cleaned > 0) {
      console.log(`🧹 Cleaned up ${cleaned} expired sessions`);
    }
  }

  async sendMessage(params) {
    const startTime = Date.now();
    
    try {
      const {
        message,
        sessionId,
        userId,
        userContext = {},
        language = 'en',
        chatHistory = []
      } = params;

      console.log('📤 Chat Service: Processing message...');
      console.log(`📌 Session: ${sessionId || 'new'}, User: ${userId || 'guest'}`);
      console.log(`📌 Message: ${message.substring(0, 50)}...`);

      // ✅ Get or create session
      const session = this.getOrCreateSession(sessionId, userId);

      // ✅ Detect intent
      const intent = chatPrompt.detectIntent(message);
      console.log(`📌 Intent detected: ${intent}`);

      // ✅ Check cache for similar queries
      let cachedResponse = null;
      if (this.cacheEnabled) {
        try {
          const cacheKey = aiCache.getKey({ message, intent, language, userContext });
          cachedResponse = aiCache.get(cacheKey);
          if (cachedResponse) {
            console.log('📦 Using cached response');
            return {
              ...cachedResponse,
              cached: true,
              responseTime: Date.now() - startTime
            };
          }
        } catch (cacheError) {
          console.warn('⚠️ Cache error:', cacheError.message);
        }
      }

      // ✅ Search Listings
      const searchResults = await this.searchListingsByIntent(message, intent, userContext);
      console.log(`📌 Found ${searchResults.length} relevant listings`);

      // ✅ Transform Listings to Experiences
      const experiences = transformToExperiences(searchResults);
      console.log(`📌 Transformed ${experiences.length} listings to experiences`);

      // ✅ Get user context from database
      const enrichedContext = await this.enrichUserContext(userId, userContext);

      // ✅ Build enhanced prompt
      const userPrompt = chatPrompt.build({
        message,
        experiences: experiences.slice(0, 5),
        userContext: enrichedContext,
        language,
        intent,
        totalResults: searchResults.length
      });

      // ✅ Build messages with system prompt
      const systemPromptText = systemPrompt.build ? systemPrompt.build() : systemPrompt.base;
      
      const messages = [
        { role: 'system', content: systemPromptText }
      ];

      // ✅ Add chat history
      if (chatHistory.length > 0) {
        const recentHistory = chatHistory.slice(-6);
        recentHistory.forEach(msg => {
          messages.push({
            role: msg.role,
            content: msg.content
          });
        });
      }

      messages.push({ role: 'user', content: userPrompt });

      // ✅ Get AI response
      const response = await aiProvider.chat(messages, {
        temperature: 0.7,
        maxTokens: 500
      });

      // ✅ Format response
      const formattedResponse = {
        success: true,
        reply: response.content,
        experiences: experiences.slice(0, 5),
        intent,
        totalResults: searchResults.length,
        fallback: response.fallback || false,
        sessionId: session.id,
        responseTime: Date.now() - startTime,
        provider: aiProvider.getProviderInfo()
      };

      // ✅ Extract actions and suggestions
      const quickReplies = chatPrompt.getQuickReplies(intent);
      formattedResponse.quickReplies = quickReplies;

      // ✅ Update session
      session.lastMessage = message;
      session.intent = intent;
      session.lastActivity = Date.now();
      session.lastResults = searchResults.slice(0, 5);
      this.sessions.set(session.id, session);

      // ✅ Cache response if not fallback
      if (this.cacheEnabled && !response.fallback) {
        try {
          const cacheKey = aiCache.getKey({ message, intent, language, userContext });
          aiCache.set(cacheKey, formattedResponse);
        } catch (cacheError) {
          console.warn('⚠️ Cache set error:', cacheError.message);
        }
      }

      console.log(`📥 Chat Service: Response generated in ${formattedResponse.responseTime}ms`);

      return formattedResponse;

    } catch (error) {
      console.error('❌ Chat Service Error:', error);
      return {
        success: false,
        reply: this.getFallbackResponse(params.message, params.language),
        fallback: true,
        error: error.message,
        responseTime: Date.now() - startTime
      };
    }
  }

  /**
   * Search Listings by intent - Enhanced with fallback
   */
  async searchListingsByIntent(message, intent, userContext) {
    const keywords = this.extractKeywords(message);
    
    // If no keywords, return featured listings
    if (keywords.length === 0) {
      const defaultListings = await Listing.find({ 
        status: 'approved',
        isFeatured: true
      })
      .populate('provider', 'name businessName avatar')
      .limit(5)
      .lean();
      
      return defaultListings;
    }
    
    // Build search query with broader matching
    let searchQuery = {
      status: 'approved',
      $or: [
        { title: { $regex: keywords.join('|'), $options: 'i' } },
        { location: { $regex: keywords.join('|'), $options: 'i' } },
        { description: { $regex: keywords.join('|'), $options: 'i' } },
        { businessType: { $regex: keywords.join('|'), $options: 'i' } },
        { tags: { $in: keywords.map(k => new RegExp(k, 'i')) } },
        { category: { $regex: keywords.join('|'), $options: 'i' } }
      ]
    };

    // Apply intent-specific filters
    if (intent === 'booking' || intent === 'plan') {
      searchQuery.status = 'approved';
    }

    if (intent === 'experience' || intent === 'recommend') {
      searchQuery.$or.push({ averageRating: { $gte: 3.5 } });
    }

    // If intent is 'location', boost location search
    if (intent === 'location') {
      searchQuery.$or = [
        { location: { $regex: keywords.join('|'), $options: 'i' } },
        { title: { $regex: keywords.join('|'), $options: 'i' } },
        { description: { $regex: keywords.join('|'), $options: 'i' } }
      ];
    }

    // Fetch listings from database
    let listings = await Listing.find(searchQuery)
      .populate('provider', 'name businessName avatar')
      .lean();

    // If no results found, try broader search
    if (listings.length === 0 && keywords.length > 0) {
      console.log('🔍 No exact matches, trying broader search...');
      
      const broadQuery = {
        status: 'approved',
        $or: keywords.map(k => ({
          $or: [
            { title: { $regex: k, $options: 'i' } },
            { location: { $regex: k, $options: 'i' } },
            { description: { $regex: k, $options: 'i' } },
            { businessType: { $regex: k, $options: 'i' } }
          ]
        }))
      };
      
      listings = await Listing.find(broadQuery)
        .populate('provider', 'name businessName avatar')
        .lean();
    }

    // If STILL no results, return featured listings
    if (listings.length === 0) {
      console.log('🔍 No results found, returning featured listings...');
      listings = await Listing.find({ 
        status: 'approved',
        isFeatured: true
      })
      .populate('provider', 'name businessName avatar')
      .limit(5)
      .lean();
    }

    // Score and rank listings
    listings = this.scoreAndRankListings(listings, message, userContext);

    // Apply limit
    return listings.slice(0, 15);
  }

  /**
   * Extract keywords from message
   */
  extractKeywords(message) {
    const stopWords = ['the', 'a', 'an', 'for', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'of', 'from', 'up', 'down', 'off', 'over', 'under', 'so', 'very', 'too', 'much', 'more', 'most', 'some', 'any', 'such', 'my', 'your', 'our', 'their', 'please', 'want', 'need', 'looking', 'find', 'help', 'can', 'will', 'would', 'could', 'should'];
    
    const words = message.toLowerCase()
      .replace(/[^a-zA-Z\s]/g, '')
      .split(' ')
      .filter(w => w.length > 2 && !stopWords.includes(w));
    
    return [...new Set(words)];
  }

  /**
   * Score and rank listings
   */
  scoreAndRankListings(listings, message, userContext) {
    const keywords = this.extractKeywords(message);
    
    return listings.map(listing => {
      let score = 0;
      
      // Title match (highest weight)
      const titleWords = listing.title?.toLowerCase().split(' ') || [];
      const titleMatches = keywords.filter(k => titleWords.some(w => w.includes(k)));
      score += titleMatches.length * 10;
      
      // Location match
      const locationWords = listing.location?.toLowerCase().split(' ') || [];
      const locationMatches = keywords.filter(k => locationWords.some(w => w.includes(k)));
      score += locationMatches.length * 5;
      
      // Business Type match
      const businessType = listing.businessType?.toLowerCase() || '';
      const typeMatches = keywords.filter(k => businessType.includes(k));
      score += typeMatches.length * 3;
      
      // Rating bonus
      if (listing.averageRating) {
        score += (listing.averageRating - 3) * 2;
      }
      
      // Reviews bonus
      if (listing.totalReviews && listing.totalReviews > 10) {
        score += Math.min(listing.totalReviews / 100, 5);
      }
      
      // Price relevance
      if (keywords.some(k => ['budget', 'cheap', 'affordable', 'cost', 'price', 'expensive', 'luxury'].includes(k))) {
        const isBudget = ['budget', 'cheap', 'affordable'].some(k => keywords.includes(k));
        const isLuxury = ['luxury', 'expensive', 'premium'].some(k => keywords.includes(k));
        
        if (isBudget && listing.price < 100) score += 5;
        if (isLuxury && listing.price > 300) score += 5;
      }
      
      // User preference bonus
      if (userContext?.interests) {
        const interestMatches = userContext.interests.filter(interest =>
          listing.tags?.some(tag => tag.toLowerCase().includes(interest.toLowerCase()))
        );
        score += interestMatches.length * 2;
      }
      
      // Location preference bonus
      if (userContext?.favoriteLocations) {
        const locationMatch = userContext.favoriteLocations.some(loc =>
          listing.location?.toLowerCase().includes(loc.toLowerCase())
        );
        if (locationMatch) score += 3;
      }
      
      return { ...listing, score };
    }).sort((a, b) => b.score - a.score);
  }

  /**
   * Enrich user context from database
   */
  async enrichUserContext(userId, context) {
    if (!userId) return context;

    try {
      const User = await import('../../models/User.js');
      const Booking = await import('../../models/Booking.js');

      const user = await User.default.findById(userId).select('name preferences');
      const bookings = await Booking.default.find({ user: userId, status: 'completed' })
        .populate('listing', 'title location businessType')
        .limit(10)
        .lean();

      const pastBookings = bookings.map(b => ({
        title: b.listing?.title || 'Unknown',
        location: b.listing?.location || 'Unknown',
        type: b.listing?.businessType || 'Unknown',
        date: b.startDate || b.createdAt
      }));

      const favoriteLocations = [...new Set(pastBookings.map(b => b.location).filter(Boolean))];
      const favoriteTypes = [...new Set(pastBookings.map(b => b.type).filter(Boolean))];

      return {
        ...context,
        name: user?.name || context.name,
        pastBookings,
        favoriteLocations,
        favoriteTypes,
        preferences: user?.preferences || context.interests || []
      };
    } catch (error) {
      console.warn('⚠️ Error enriching user context:', error.message);
      return context;
    }
  }

  /**
   * Get fallback response
   */
  getFallbackResponse(message, language = 'en') {
    const responses = {
      en: [
        "Thank you for your question! 🇷🇼 Please browse our experiences or contact our travel experts for personalized assistance.",
        "I appreciate your interest in Rwanda! 🌍 Explore our amazing experiences or reach out to our team for more information.",
        "Great question! ✨ Please visit our website to see all available experiences and book directly."
      ],
      fr: [
        "Merci pour votre question ! 🇷🇼 Veuillez parcourir nos expériences ou contacter nos experts en voyage.",
        "Je vous remercie de votre intérêt pour le Rwanda ! 🌍 Explorez nos expériences ou contactez notre équipe."
      ],
      rw: [
        "Murakoze kubaza! 🇷🇼 Reba ibyo ushobora gukora cyangwa uvuge nabashoboza kugutera inkunga."
      ],
      sw: [
        "Asante kwa swali lako! 🇷🇼 Tafadhali tembelea tovuti yetu kuona uzoefu wote na uweke nafasi moja kwa moja."
      ]
    };

    const langResponses = responses[language] || responses.en;
    
    // Check for specific keywords
    const lower = message?.toLowerCase() || '';
    if (lower.includes('kigali')) {
      return "Kigali is beautiful! 🌆 Don't miss the Genocide Memorial, local markets, and vibrant nightlife. Check out our Kigali experiences!";
    }
    if (lower.includes('gorilla') || lower.includes('gorillas')) {
      return "Gorilla trekking is unforgettable! 🦍 Contact us for availability and permits! Book your gorilla experience today!";
    }
    if (lower.includes('safari')) {
      return "Akagera offers incredible safari! 🐘 See the Big Five and amazing birdlife. Book your safari experience now!";
    }
    if (lower.includes('lake kivu')) {
      return "Lake Kivu is stunning! 🏖️ Perfect for boat tours, swimming, and relaxing sunsets. Explore Lake Kivu experiences!";
    }
    if (lower.includes('nyungwe')) {
      return "Nyungwe Forest is amazing! 🌿 Don't miss the canopy walk and chimpanzee trekking. Book your Nyungwe experience!";
    }

    return langResponses[Math.floor(Math.random() * langResponses.length)];
  }
}

// Singleton instance
const chatService = new ChatService();
export default chatService;