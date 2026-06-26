// src/pages/PaymentCancel.jsx

import { Link, useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft, Home, AlertCircle, Sparkles } from 'lucide-react';

// ===============================
// AI TOUR COLORS
// ===============================
// Teal  : #0D9488
// Gold  : #F59E0B
// Slate : #374151
// White : #FFFFFF
// ===============================

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 p-4">

      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 md:p-12 text-center max-w-md w-full border border-gray-100 dark:border-gray-800 animate-fade-in">

        {/* Icon */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-red-500/20 animate-ping"></div>
            <XCircle className="w-12 h-12 text-red-500" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-[#374151] dark:text-white mb-3">
          Payment Cancelled
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mb-2">
          Your payment was not completed.
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">
          No charges have been made to your account.
        </p>

        {/* Helpful Message */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-2xl p-4 mb-8 text-left">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                Need help?
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5">
                If you experienced any issues, please contact our support team.
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 flex items-center justify-center gap-2 h-12 px-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 text-[#374151] dark:text-white font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Try Again
          </button>

          <Link
            to="/explore"
            className="flex-1 flex items-center justify-center gap-2 h-12 px-6 rounded-2xl bg-gradient-to-r from-[#0D9488] to-[#F59E0B] text-white font-semibold shadow-lg shadow-[#0D9488]/30 hover:scale-[1.02] transition-all duration-300"
          >
            <Home className="w-4 h-4" />
            Browse Tours
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Need assistance?{' '}
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
          <span>AI Tour Rwanda</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;