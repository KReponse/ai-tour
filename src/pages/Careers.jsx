// src/pages/Careers.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Users, 
  Award, 
  Clock, 
  MapPin, 
  DollarSign,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Mail,
  Globe,
  Heart,
  Coffee,
  Laptop,
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

const Careers = () => {
  const [activeTab, setActiveTab] = useState('openings');

  const perks = [
    { icon: Heart, title: 'Health Insurance', desc: 'Comprehensive medical coverage' },
    { icon: Coffee, title: 'Flexible Work', desc: 'Remote & hybrid options' },
    { icon: Laptop, title: 'Tech Equipment', desc: 'Laptop & work setup provided' },
    { icon: Globe, title: 'Travel Perks', desc: 'Discounted tours & experiences' },
  ];

  const openings = [
    {
      title: 'Senior Full-Stack Developer',
      department: 'Engineering',
      location: 'Kigali, Rwanda',
      type: 'Full-time',
      salary: '$60k - $80k',
    },
    {
      title: 'Tourism Operations Manager',
      department: 'Operations',
      location: 'Kigali, Rwanda',
      type: 'Full-time',
      salary: '$40k - $55k',
    },
    {
      title: 'AI Engineer - Travel Recommendations',
      department: 'AI/ML',
      location: 'Remote',
      type: 'Full-time',
      salary: '$70k - $90k',
    },
    {
      title: 'Customer Experience Specialist',
      department: 'Support',
      location: 'Kigali, Rwanda',
      type: 'Full-time',
      salary: '$25k - $35k',
    },
    {
      title: 'Marketing & Content Lead',
      department: 'Marketing',
      location: 'Remote',
      type: 'Part-time',
      salary: '$30k - $45k',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto px-4 py-8">

      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0D9488] to-[#F59E0B] p-12 text-white">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur mb-6">
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">Join Our Team</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            Careers at
            <span className="block text-white/90">AI Tour Rwanda</span>
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Build the future of tourism in Rwanda with us. Join a passionate team using AI to transform travel experiences.
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 text-center border border-gray-100 dark:border-gray-800">
          <div className="text-3xl font-black text-[#0D9488]">15+</div>
          <p className="text-sm text-gray-500">Team Members</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 text-center border border-gray-100 dark:border-gray-800">
          <div className="text-3xl font-black text-[#F59E0B]">4</div>
          <p className="text-sm text-gray-500">Open Positions</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 text-center border border-gray-100 dark:border-gray-800">
          <div className="text-3xl font-black text-[#0D9488]">5</div>
          <p className="text-sm text-gray-500">Countries Served</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 text-center border border-gray-100 dark:border-gray-800">
          <div className="text-3xl font-black text-[#F59E0B]">10K+</div>
          <p className="text-sm text-gray-500">Happy Travelers</p>
        </div>
      </section>

      {/* PERKS */}
      <section>
        <h2 className="text-3xl font-black text-[#374151] dark:text-white text-center mb-8">
          Why Work With Us?
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {perks.map((perk, idx) => {
            const Icon = perk.icon;
            return (
              <div key={idx} className="bg-white dark:bg-gray-900 rounded-2xl p-6 text-center border border-gray-100 dark:border-gray-800 hover:shadow-xl transition">
                <div className="w-14 h-14 rounded-2xl bg-[#0D9488]/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-[#0D9488]" />
                </div>
                <h3 className="font-bold text-[#374151] dark:text-white">{perk.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{perk.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* OPENINGS */}
      <section>
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <h2 className="text-3xl font-black text-[#374151] dark:text-white">
            Open Positions
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('openings')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === 'openings'
                  ? 'bg-[#0D9488] text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              All Openings
            </button>
            <button
              onClick={() => setActiveTab('remote')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === 'remote'
                  ? 'bg-[#0D9488] text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              Remote
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {openings.map((job, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition group">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-[#374151] dark:text-white group-hover:text-[#0D9488] transition">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {job.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {job.type}
                    </span>
                    <span className="flex items-center gap-1 text-[#0D9488] font-semibold">
                      <DollarSign className="w-4 h-4" />
                      {job.salary}
                    </span>
                  </div>
                </div>
                <Link to={`/careers/${job.title.toLowerCase().replace(/\s/g, '-')}`}>
                  <Button className="bg-gradient-to-r from-[#0D9488] to-[#F59E0B] text-white hover:scale-[1.02] transition">
                    Apply Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 text-center">
        <Mail className="w-12 h-12 text-[#0D9488] mx-auto mb-4" />
        <h2 className="text-2xl font-black text-[#374151] dark:text-white mb-2">
          Don't see the right role?
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Send us your resume and we'll keep you in mind for future opportunities.
        </p>
        <a
          href="mailto:careers@aitour.rw"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#0D9488] text-white font-semibold hover:scale-[1.02] transition"
        >
          Send Application
          <Mail className="w-5 h-5" />
        </a>
      </section>
    </div>
  );
};

export default Careers;