// src/pages/PaymentSuccess.jsx

import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Sparkles, Calendar, ArrowRight, Home } from 'lucide-react';

// ===============================
// AI TOUR COLORS
// ===============================
// Teal  : #0D9488
// Gold  : #F59E0B
// Slate : #374151
// White : #FFFFFF
// ===============================

const PaymentSuccess = () => {
  const navigate = useNavigate();

  // Get booking reference from URL or state
  const bookingRef = new URLSearchParams(window.location.search).get('ref') || 'AI-' + Math.random().toString(36).substring(2, 8).toUpperCase();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 p-4">

      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 md:p-12 text-center max-w-md w-full border border-gray-100 dark:border-gray-800 animate-fade-in">

        {/* Success Animation */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-[#0D9488]/10 dark:bg-[#0D9488]/20 flex items-center justify-center mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-[#0D9488]/20 animate-ping"></div>
            <div className="absolute inset-2 rounded-full border-4 border-[#F59E0B]/20 animate-ping animation-delay-150"></div>
            <CheckCircle className="w-12 h-12 text-[#0D9488] relative z-10" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-[#374151] dark:text-white mb-2">
          Payment Successful! 🎉
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mb-1">
          Your booking has been confirmed successfully.
        </p>

        {/* Booking Reference */}
        <div className="mt-4 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-400">Booking Reference</p>
          <p className="text-lg font-bold text-[#0D9488] font-mono tracking-wider">
            {bookingRef}
          </p>
        </div>

        {/* What's Next */}
        <div className="mt-6 text-left bg-gradient-to-r from-[#0D9488]/5 to-[#F59E0B]/5 rounded-2xl p-4 border border-[#0D9488]/10">
          <h3 className="text-sm font-bold text-[#374151] dark:text-white mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#0D9488]" />
            What's Next?
          </h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-[#0D9488]">✓</span>
              <span>You'll receive a confirmation email shortly</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0D9488]">✓</span>
              <span>Your booking is secured and confirmed</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0D9488]">✓</span>
              <span>Prepare for your amazing Rwanda adventure!</span>
            </li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Link
            to="/my-bookings"
            className="flex-1 flex items-center justify-center gap-2 h-12 px-6 rounded-2xl bg-gradient-to-r from-[#0D9488] to-[#F59E0B] text-white font-semibold shadow-lg shadow-[#0D9488]/30 hover:scale-[1.02] transition-all duration-300"
          >
            <Calendar className="w-4 h-4" />
            View My Bookings
          </Link>

          <button
            onClick={() => navigate('/explore')}
            className="flex-1 flex items-center justify-center gap-2 h-12 px-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 text-[#374151] dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
          >
            <Home className="w-4 h-4" />
            Explore More
          </button>
        </div>

        {/* Share */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
          <span>Share your excitement:</span>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'AI Tour Rwanda Booking',
                  text: `I just booked my trip with AI Tour Rwanda! 🎉`,
                  url: window.location.href,
                }).catch(() => {});
              }
            }}
            className="text-[#0D9488] hover:underline font-medium"
          >
            Share →
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Need help?{' '}
            <a
              href="mailto:support@aitour.rw"
              className="text-[#0D9488] hover:underline font-medium"
            >
              Contact Support
            </a>
          </p>
        </div>

        {/* Brand */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
          <Sparkles className="w-3 h-3 text-[#0D9488]" />
          <span>AI Tour Rwanda • Book with Confidence</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;