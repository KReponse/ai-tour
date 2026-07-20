// src/pages/VerifyEmail.jsx
// ✅ NEW - Email Verification Page

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import { verifyEmail } from '../services/authService';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await verifyEmail(token);
        if (response.success) {
          setStatus('success');
          setMessage(response.message || 'Email verified successfully! You can now log in.');
        } else {
          setStatus('error');
          setMessage(response.message || 'Invalid or expired verification link.');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage(error.response?.data?.message || 'Failed to verify email. Please try again.');
      }
    };

    if (token) {
      verify();
    } else {
      setStatus('error');
      setMessage('No verification token provided.');
    }
  }, [token]);

  // ─── Loading State ────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#0D9488] mb-4" />
        <h2 className="text-xl font-semibold text-[#374151] dark:text-white">Verifying your email...</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Please wait while we confirm your email address.</p>
      </div>
    );
  }

  // ─── Success State ────────────────────────────────────────────
  if (status === 'success') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center max-w-md mx-auto text-center px-4">
        <div className="w-20 h-20 rounded-full bg-[#0D9488]/10 flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-[#0D9488]" />
        </div>
        <h2 className="text-2xl font-bold text-[#374151] dark:text-white">Email Verified! ✅</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          {message || 'Your email has been successfully verified. You can now log in to your account.'}
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <Link
            to="/login"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#0D9488] to-[#F59E0B] text-white font-semibold hover:scale-[1.02] transition"
          >
            Log In Now
          </Link>
          <Link
            to="/"
            className="px-6 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700 text-[#374151] dark:text-white font-semibold hover:border-[#0D9488] hover:text-[#0D9488] transition"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  // ─── Error State ──────────────────────────────────────────────
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center max-w-md mx-auto text-center px-4">
      <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
        <XCircle className="w-10 h-10 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-[#374151] dark:text-white">Verification Failed</h2>
      <p className="text-gray-500 dark:text-gray-400 mt-2">{message}</p>
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <Link
          to="/login"
          className="px-6 py-3 rounded-2xl bg-[#0D9488] text-white font-semibold hover:bg-[#0D9488]/90 transition"
        >
          Go to Login
        </Link>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700 text-[#374151] dark:text-white font-semibold hover:border-[#0D9488] hover:text-[#0D9488] transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;