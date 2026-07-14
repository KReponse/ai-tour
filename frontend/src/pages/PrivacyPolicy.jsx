// src/pages/PrivacyPolicy.jsx

import React from 'react';
import { Shield, Lock, Eye, User, Database, Mail } from 'lucide-react';

// ===============================
// AI TOUR COLORS
// ===============================
// Teal  : #0D9488
// Gold  : #F59E0B
// Slate : #374151
// White : #FFFFFF
// ===============================

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: Database,
      title: 'Information We Collect',
      content: 'We collect information you provide directly, such as your name, email, phone number, and travel preferences. We also collect data about your usage of our platform to improve your experience.',
    },
    {
      icon: Eye,
      title: 'How We Use Your Information',
      content: 'Your data helps us personalize travel recommendations, process bookings, send relevant updates, and improve our services. We never sell your personal information to third parties.',
    },
    {
      icon: Shield,
      title: 'Data Security',
      content: 'We implement industry-standard security measures including encryption, secure servers, and regular security audits to protect your personal information.',
    },
    {
      icon: User,
      title: 'Your Rights',
      content: 'You have the right to access, modify, or delete your personal data. Contact us to exercise these rights or to request a copy of your data.',
    },
    {
      icon: Lock,
      title: 'Cookies',
      content: 'We use cookies to enhance your experience, remember your preferences, and analyze site traffic. You can control cookie settings in your browser.',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto px-4 py-8">

      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0D9488] to-[#F59E0B] p-12 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-10 h-10" />
            <h1 className="text-4xl md:text-5xl font-black">Privacy Policy</h1>
          </div>
          <p className="text-white/90 text-lg max-w-2xl">
            Your privacy matters to us. Learn how we protect and handle your data.
          </p>
          <p className="text-white/60 text-sm mt-4">Last updated: June 2025</p>
        </div>
      </section>

      {/* SECTIONS */}
      <div className="space-y-6">
        {sections.map((section, idx) => {
          const Icon = section.icon;
          return (
            <div key={idx} className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 hover:shadow-md transition">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#0D9488]/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-[#0D9488]" />
                </div>
                <h2 className="text-xl font-bold text-[#374151] dark:text-white">{section.title}</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed pl-4 border-l-4 border-[#0D9488]/30">
                {section.content}
              </p>
            </div>
          );
        })}
      </div>

      {/* CONTACT */}
      <div className="bg-[#0D9488]/5 rounded-3xl p-8 text-center border border-[#0D9488]/20">
        <Mail className="w-12 h-12 text-[#0D9488] mx-auto mb-4" />
        <h3 className="text-xl font-bold text-[#374151] dark:text-white">Questions about Privacy?</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">Contact our privacy team:</p>
        <a href="mailto:privacy@aitour.rw" className="text-[#0D9488] font-semibold hover:underline">
          privacy@aitour.rw
        </a>
      </div>
    </div>
  );
};

export default PrivacyPolicy;