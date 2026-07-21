// src/pages/FAQs.jsx

import React, { useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  HelpCircle,
  BookOpen,
  Users,
  Shield,
  CreditCard,
  MapPin,
  Calendar,
  DollarSign,
  MessageCircle,
  Mail,
  Phone,
  CheckCircle,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

// ===============================
// AI TOUR COLORS
// ===============================
// Teal  : #0D9488
// Gold  : #F59E0B
// Slate : #374151
// White : #FFFFFF
// ===============================

const FAQs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const categories = [
    { id: 'all', label: 'All', icon: HelpCircle },
    { id: 'booking', label: 'Booking', icon: Calendar },
    { id: 'payments', label: 'Payments', icon: DollarSign },
    { id: 'account', label: 'Account', icon: Users },
    { id: 'tours', label: 'Tours', icon: MapPin },
    { id: 'safety', label: 'Safety', icon: Shield },
  ];

  const faqs = [
    // Booking FAQs
    {
      id: 1,
      category: 'booking',
      question: 'How do I book a tour?',
      answer: 'Browse tours on our Explore page, select your preferred tour, and click "Book Now". Follow the steps to complete your booking. You\'ll receive a confirmation email once your booking is confirmed.',
    },
    {
      id: 2,
      category: 'booking',
      question: 'Can I modify my booking after confirmation?',
      answer: 'Yes, you can modify your booking up to 48 hours before the tour date. Contact our support team or the provider directly to request changes.',
    },
    {
      id: 3,
      category: 'booking',
      question: 'What if the provider cancels my tour?',
      answer: 'If a provider cancels your tour, you will receive a full refund. We will also help you find alternative tours or experiences.',
    },

    // Payments FAQs
    {
      id: 4,
      category: 'payments',
      question: 'What payment methods do you accept?',
      answer: 'We accept Visa, Mastercard, MTN MoMo, Airtel Money, and PayPal. All payments are processed through secure, encrypted channels.',
    },
    {
      id: 5,
      category: 'payments',
      question: 'Is my payment information secure?',
      answer: 'Yes, all payment information is encrypted and processed through PCI-compliant payment gateways. We never store your full card details.',
    },
    {
      id: 6,
      category: 'payments',
      question: 'What is your refund policy?',
      answer: 'You can cancel up to 24 hours before the tour for a full refund. Cancellations within 24 hours may incur a 50% fee. Refunds are processed within 5-7 business days.',
    },

    // Account FAQs
    {
      id: 7,
      category: 'account',
      question: 'How do I create an account?',
      answer: 'Click "Register" on the top right corner of our website. Fill in your details, verify your email, and you\'re ready to start booking tours.',
    },
    {
      id: 8,
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'Click "Forgot Password" on the login page. Enter your email address and we\'ll send you a password reset link.',
    },
    {
      id: 9,
      category: 'account',
      question: 'Can I delete my account?',
      answer: 'Yes, you can delete your account by going to Settings > Account > Delete Account. This action is permanent and cannot be undone.',
    },

    // Tours FAQs
    {
      id: 10,
      category: 'tours',
      question: 'How do I become a provider?',
      answer: 'Go to your profile and click "Become a Provider". Fill in the application form with your business details. Your application will be reviewed by our admin team.',
    },
    {
      id: 11,
      category: 'tours',
      question: 'What tours are available in Rwanda?',
      answer: 'We offer a wide variety of tours including gorilla trekking, safari adventures, cultural experiences, city tours, hiking, and luxury retreats.',
    },
    {
      id: 12,
      category: 'tours',
      question: 'Are the tours suitable for families?',
      answer: 'Yes, many of our tours are family-friendly. Look for the "Family-friendly" tag when browsing tours, or contact us for recommendations.',
    },

    // Safety FAQs
    {
      id: 13,
      category: 'safety',
      question: 'Is it safe to travel in Rwanda?',
      answer: 'Rwanda is one of the safest countries in Africa. We work with verified providers who maintain high safety standards. Always follow local guidelines and travel insurance is recommended.',
    },
    {
      id: 14,
      category: 'safety',
      question: 'How are providers verified?',
      answer: 'All providers undergo a thorough verification process including business registration, background checks, and quality reviews by our team.',
    },
    {
      id: 15,
      category: 'safety',
      question: 'What should I do in case of an emergency?',
      answer: 'Contact our 24/7 support team immediately. We will help coordinate with local authorities and ensure your safety.',
    },
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto px-4 py-8">

      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0D9488] to-[#F59E0B] p-12 text-white text-center">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur mb-6">
            <HelpCircle className="w-5 h-5" />
            <span className="font-medium">Frequently Asked Questions</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            Got Questions?
            <span className="block text-white/90">We've Got Answers</span>
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Find quick answers to the most common questions about AI Tour Rwanda.
          </p>
        </div>
      </section>

      {/* SEARCH */}
      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search for answers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 h-14 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition outline-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
      </div>

      {/* CATEGORIES */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-[#0D9488] text-white shadow-lg shadow-[#0D9488]/30'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* FAQ LIST */}
      {filteredFaqs.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-16 text-center border border-gray-100 dark:border-gray-800 shadow-sm">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#374151] dark:text-white">No results found</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Try adjusting your search or category filter
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-w-4xl mx-auto">
          {filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            return (
              <div
                key={faq.id}
                className={`bg-white dark:bg-gray-900 rounded-2xl border transition-all duration-300 ${
                  isExpanded
                    ? 'border-[#0D9488] shadow-lg shadow-[#0D9488]/10'
                    : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                }`}
              >
                <button
                  onClick={() => toggleExpand(faq.id)}
                  className="w-full flex items-center justify-between p-5 text-left group"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      isExpanded ? 'bg-[#0D9488]' : 'bg-gray-300 dark:bg-gray-600'
                    }`} />
                    <span className={`font-semibold ${
                      isExpanded ? 'text-[#0D9488]' : 'text-[#374151] dark:text-white'
                    }`}>
                      {faq.question}
                    </span>
                  </div>
                  <div className={`p-1 rounded-lg transition-colors flex-shrink-0 ml-4 ${
                    isExpanded ? 'bg-[#0D9488]/10 text-[#0D9488]' : 'text-gray-400 group-hover:text-[#0D9488]'
                  }`}>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </button>
                {isExpanded && (
                  <div className="px-5 pb-5 pl-12">
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                      <CheckCircle className="w-3 h-3 text-[#0D9488]" />
                      <span>Category: {faq.category}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* STILL HAVE QUESTIONS */}
      <section className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 text-center shadow-sm">
        <div className="flex items-center justify-center gap-2 mb-4">
          <MessageCircle className="w-8 h-8 text-[#0D9488]" />
          <h2 className="text-2xl font-black text-[#374151] dark:text-white">
            Still Have Questions?
          </h2>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Our support team is here to help you 24/7.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="/contact"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#0D9488] to-[#F59E0B] text-white font-semibold shadow-lg shadow-[#0D9488]/30 hover:scale-[1.02] transition-all duration-300"
          >
            <Mail className="w-5 h-5" />
            Contact Us
          </a>
          <a
            href="/help"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700 text-[#374151] dark:text-white font-semibold hover:border-[#0D9488] hover:text-[#0D9488] transition-all duration-300"
          >
            <BookOpen className="w-5 h-5" />
            Help Center
          </a>
        </div>
        <div className="mt-4 flex justify-center items-center gap-4 text-sm text-gray-400">
          <a href="mailto:support@aitour.rw" className="hover:text-[#0D9488] transition">
            support@aitour.rw
          </a>
          <span>•</span>
          <a href="tel:+250791468299" className="hover:text-[#0D9488] transition">
            +250 791 468 299
          </a>
        </div>
      </section>
    </div>
  );
};

export default FAQs;