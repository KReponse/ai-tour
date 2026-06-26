// src/components/layout/Footer.jsx

import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Globe,
  Send,
  Heart,
  Sparkles,
} from 'lucide-react';

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import logo from '../../assets/images/logo.png';

// ===============================
// AI TOUR COLORS
// ===============================
// Teal  : #0D9488
// Gold  : #F59E0B
// Slate : #374151
// White : #FFFFFF
// ===============================

const Footer = () => {
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'AI Planner', path: '/ai-planner' },
    { name: 'Trips', path: '/trips' },
    { name: 'Reviews', path: '/reviews' },
  ];

  // ✅ Company Links with proper paths
  const companyLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Careers', path: '/careers' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  // ✅ Support Links with proper paths
  const supportLinks = [
    { name: 'Help Center', path: '/help' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms & Conditions', path: '/terms' },
    { name: 'FAQs', path: '/faqs' },
  ];

  return (
    <footer className="relative mt-24 bg-gradient-to-br from-[#374151]/95 via-[#1a1a2e] to-[#0D9488]/10 text-white overflow-hidden">

      {/* BACKGROUND EFFECT */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#0D9488] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#F59E0B] rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#0D9488] rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-16">

        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* BRAND */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <img src={logo} alt="AI Tour" className="w-12 h-12 object-contain" />
              <div>
                <h2 className="text-2xl font-black bg-gradient-to-r from-[#0D9488] to-[#F59E0B] bg-clip-text text-transparent">
                  AI Tour Rwanda
                </h2>
                <p className="text-sm text-gray-400">Smart Tourism Platform</p>
              </div>
            </div>

            <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
              Discover Rwanda with AI-powered travel planning,
              smart recommendations, bookings, and unforgettable experiences.
            </p>

            {/* CONTACT */}
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-[#0D9488]" />
                <span>aitourrwanda@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-[#F59E0B]" />
                <span>+250 791 468 299</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-[#0D9488]" />
                <span>Kigali, Rwanda</span>
              </div>
            </div>

            {/* SOCIALS */}
            <div className="flex items-center gap-4 mt-6">
              {[
                { Icon: Facebook, color: '#1877F2' },
                { Icon: Instagram, color: '#E4405F' },
                { Icon: Twitter, color: '#1DA1F2' },
                { Icon: Linkedin, color: '#0A66C2' },
                { Icon: Youtube, color: '#FF0000' },
              ].map(({ Icon, color }, index) => (
                <motion.a
                  key={index}
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-[#0D9488] transition-all duration-300"
                  style={{ color: 'white' }}
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-lg font-bold mb-5 text-white">Quick Links</h3>
            <div className="space-y-3">
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="block text-gray-400 hover:text-[#0D9488] transition duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* COMPANY - ✅ Using Link instead of a */}
          <div>
            <h3 className="text-lg font-bold mb-5 text-white">Company</h3>
            <div className="space-y-3">
              {companyLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="block text-gray-400 hover:text-[#0D9488] transition duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* SUPPORT - ✅ Using Link instead of a */}
          <div>
            <h3 className="text-lg font-bold mb-5 text-white">Support</h3>
            <div className="space-y-3">
              {supportLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="block text-gray-400 hover:text-[#0D9488] transition duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* NEWSLETTER */}
        <div className="mt-16 rounded-3xl bg-white/5 border border-white/10 p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="text-[#F59E0B]" />
              <h3 className="text-2xl font-bold text-white">Travel Smarter with AI</h3>
            </div>
            <p className="text-gray-400">
              Subscribe for AI travel tips, destination updates,
              and exclusive Rwanda experiences.
            </p>
          </div>

          {/* INPUT */}
          <div className="flex w-full lg:w-auto items-center gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full lg:w-80 h-14 px-5 rounded-2xl bg-white/10 border border-white/10 outline-none text-white placeholder:text-gray-400 focus:border-[#0D9488] transition focus:ring-2 focus:ring-[#0D9488]/30"
            />
            <button className="h-14 px-6 rounded-2xl bg-gradient-to-r from-[#0D9488] to-[#F59E0B] font-semibold hover:scale-105 transition duration-300 flex items-center gap-2 shadow-lg shadow-[#0D9488]/30">
              <Send size={18} />
              Subscribe
            </button>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 text-center md:text-left">
            © {new Date().getFullYear()} AI Tour Rwanda. All rights reserved.
          </p>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Built with</span>
            <Heart size={16} className="text-red-500 fill-red-500 animate-pulse" />
            <span>in Rwanda 🇷🇼</span>
            <span className="text-[#0D9488] ml-1">✦</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;