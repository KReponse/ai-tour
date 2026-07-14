// src/pages/Terms.jsx

import React from 'react';
import { FileText, CheckCircle, AlertCircle, BookOpen, Scale, Shield, Users } from 'lucide-react';

// ===============================
// AI TOUR COLORS
// ===============================
// Teal  : #0D9488
// Gold  : #F59E0B
// Slate : #374151
// White : #FFFFFF
// ===============================

const Terms = () => {
  const sections = [
    {
      icon: BookOpen,
      title: 'Acceptance of Terms',
      content: 'By using AI Tour Rwanda, you agree to these Terms and Conditions. If you disagree, please do not use our platform.',
    },
    {
      icon: Users,
      title: 'User Accounts',
      content: 'You are responsible for maintaining the security of your account. You must provide accurate information and keep it updated.',
    },
    {
      icon: Scale,
      title: 'Booking and Payments',
      content: 'Bookings are subject to provider availability. Payments are processed securely, and cancellations are subject to provider policies.',
    },
    {
      icon: Shield,
      title: 'Provider Responsibilities',
      content: 'Providers must deliver services as described, maintain quality standards, and respond to traveler inquiries promptly.',
    },
    {
      icon: AlertCircle,
      title: 'Limitation of Liability',
      content: 'AI Tour acts as a platform connecting travelers and providers. We are not liable for the quality of services provided by third parties.',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto px-4 py-8">

      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0D9488] to-[#F59E0B] p-12 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-10 h-10" />
            <h1 className="text-4xl md:text-5xl font-black">Terms & Conditions</h1>
          </div>
          <p className="text-white/90 text-lg max-w-2xl">
            Read our terms to understand your rights and responsibilities when using AI Tour.
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
                <div className="w-12 h-12 rounded-2xl bg-[#F59E0B]/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-[#F59E0B]" />
                </div>
                <h2 className="text-xl font-bold text-[#374151] dark:text-white">{section.title}</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed pl-4 border-l-4 border-[#F59E0B]/30">
                {section.content}
              </p>
            </div>
          );
        })}
      </div>

      {/* CONTACT */}
      <div className="bg-[#F59E0B]/5 rounded-3xl p-8 text-center border border-[#F59E0B]/20">
        <p className="text-gray-500 dark:text-gray-400">
          For questions about our Terms, contact us at{' '}
          <a href="mailto:legal@aitour.rw" className="text-[#0D9488] font-semibold hover:underline">
            legal@aitour.rw
          </a>
        </p>
      </div>
    </div>
  );
};

export default Terms;