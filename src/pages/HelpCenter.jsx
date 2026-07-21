// src/pages/HelpCenter.jsx

import React, { useState } from 'react';
import { 
  Search, 
  MessageCircle, 
  BookOpen, 
  Users, 
  Shield, 
  CreditCard,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
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

const HelpCenter = () => {
  const [expanded, setExpanded] = useState(null);

  const categories = [
    { icon: BookOpen, label: 'Booking Help', color: '#0D9488' },
    { icon: Users, label: 'Account & Profile', color: '#F59E0B' },
    { icon: Shield, label: 'Safety & Trust', color: '#374151' },
    { icon: CreditCard, label: 'Payments & Refunds', color: '#0D9488' },
  ];

  const faqs = [
    {
      question: 'How do I book a tour?',
      answer: 'Browse tours on our Explore page, select your preferred tour, and click "Book Now". Follow the steps to complete your booking.',
    },
    {
      question: 'What is the cancellation policy?',
      answer: 'You can cancel up to 24 hours before the tour for a full refund. Cancellations within 24 hours may incur a 50% fee.',
    },
    {
      question: 'How do I contact a provider?',
      answer: 'Each tour listing has a provider profile with contact information. You can also use our chat feature to message providers directly.',
    },
    {
      question: 'Is my payment secure?',
      answer: 'Yes, all payments are processed through secure, encrypted channels. We accept Visa, Mastercard, MTN MoMo, and Airtel Money.',
    },
    {
      question: 'How do I become a provider?',
      answer: 'Go to your profile and click "Become a Provider". Fill in the application form and wait for admin approval.',
    },
    {
      question: 'What if I have a problem during a tour?',
      answer: 'Contact our 24/7 support team immediately. We\'ll help resolve any issues with the provider.',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto px-4 py-8">

      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0D9488] to-[#F59E0B] p-12 text-white text-center">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-black mb-4">Help Center</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Find answers to your questions and get the support you need.
          </p>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <button key={idx} className="bg-white dark:bg-gray-900 rounded-3xl p-6 text-center border border-gray-100 dark:border-gray-800 hover:shadow-xl transition group">
              <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background: `${cat.color}15` }}>
                <Icon className="w-7 h-7" style={{ color: cat.color }} />
              </div>
              <p className="font-semibold text-[#374151] dark:text-white">{cat.label}</p>
            </button>
          );
        })}
      </section>

      {/* SEARCH */}
      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search for help..."
          className="w-full pl-12 pr-4 h-14 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition outline-none"
        />
      </div>

      {/* FAQs */}
      <section>
        <h2 className="text-3xl font-black text-[#374151] dark:text-white text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => {
            const isExpanded = expanded === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition"
              >
                <button
                  onClick={() => setExpanded(isExpanded ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-semibold text-[#374151] dark:text-white">{faq.question}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-[#0D9488] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#0D9488] flex-shrink-0" />
                  )}
                </button>
                {isExpanded && (
                  <div className="px-5 pb-5 text-gray-600 dark:text-gray-300 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CONTACT */}
      <section className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 text-center">
        <MessageCircle className="w-12 h-12 text-[#0D9488] mx-auto mb-4" />
        <h2 className="text-2xl font-black text-[#374151] dark:text-white mb-2">
          Still have questions?
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Our support team is here to help you 24/7.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="mailto:support@aitour.rw" className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0D9488] text-white font-semibold hover:scale-[1.02] transition">
            <Mail className="w-5 h-5" />
            Email Support
          </a>
          <a href="tel:+250791468299" className="flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-[#0D9488] text-[#0D9488] font-semibold hover:bg-[#0D9488]/10 transition">
            <Phone className="w-5 h-5" />
            Call Us
          </a>
        </div>
      </section>
    </div>
  );
};

export default HelpCenter;