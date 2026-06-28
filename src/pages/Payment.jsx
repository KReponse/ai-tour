// src/pages/Payment.jsx

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Smartphone,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Lock,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { createCheckout } from '../services/paymentService';
import { useAuth } from '../contexts/AuthContext';

// ===============================
// AI TOUR COLORS
// ===============================
// Teal  : #0D9488
// Gold  : #F59E0B
// Slate : #374151
// White : #FFFFFF
// ===============================

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingData, setBookingData] = useState(null);

  // Get booking data from location state
  useEffect(() => {
    if (location.state) {
      setBookingData(location.state);
    } else {
      // Try to get from sessionStorage
      const saved = sessionStorage.getItem('bookingData');
      if (saved) {
        try {
          setBookingData(JSON.parse(saved));
        } catch (e) {
          console.error('Error parsing booking data:', e);
        }
      }
    }
  }, [location]);

  // Prevent direct access
  if (!bookingData) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4">
        <Card className="p-8 rounded-3xl text-center border border-gray-100 dark:border-gray-800">
          <div className="w-20 h-20 rounded-full bg-[#0D9488]/10 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-10 h-10 text-[#0D9488]" />
          </div>
          <h2 className="text-2xl font-bold text-[#374151] dark:text-white mb-4">
            No Booking Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Please complete your booking first.
          </p>
          <Button
            onClick={() => navigate('/booking')}
            className="bg-gradient-to-r from-[#0D9488] to-[#F59E0B]"
          >
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  const { tour, booking, formData, totalPrice } = bookingData;
  const total = totalPrice || tour?.price * formData?.travelers || 0;

  // ===============================
  // ✅ HANDLE PAYMENT - Backend Integration
  // ===============================
  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please login to continue');
      navigate('/login');
      return;
    }

    if (!booking || !booking._id) {
      alert('Booking not found. Please try again.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // ✅ Call backend to create Stripe checkout session
      const response = await createCheckout(booking._id);
      
      console.log('✅ Checkout response:', response);
      
      if (response.url) {
        // ✅ Redirect to Stripe checkout
        window.location.href = response.url;
      } else if (response.sessionId) {
        // ✅ Or navigate to success with session ID
        navigate('/payment-success', {
          state: {
            sessionId: response.sessionId,
            bookingId: booking._id,
          },
        });
      } else {
        setError('Failed to create payment session. Please try again.');
      }

    } catch (error) {
      console.error('❌ Payment error:', error);
      setError(error.response?.data?.message || 'Payment initialization failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-[#0D9488] transition mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back</span>
      </button>

      {/* ERROR */}
      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-8">

          {/* HEADER */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#F59E0B] flex items-center justify-center shadow-lg">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-[#374151] dark:text-white">
                  Payment
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  Complete your booking securely.
                </p>
              </div>
            </div>
          </div>

          {/* TOUR SUMMARY */}
          <Card className="p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-bold mb-4 text-[#374151] dark:text-white">
              Booking Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Tour</span>
                <span className="font-semibold text-[#374151] dark:text-white">
                  {tour?.title || 'Tour'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Location</span>
                <span className="font-semibold text-[#374151] dark:text-white">
                  {tour?.location || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Travelers</span>
                <span className="font-semibold text-[#374151] dark:text-white">
                  {formData?.travelers || 1}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Travel Date</span>
                <span className="font-semibold text-[#374151] dark:text-white">
                  {formData?.travelDate || 'N/A'}
                </span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-[#374151] dark:text-white">
                    Total
                  </span>
                  <span className="text-3xl font-bold text-[#0D9488]">
                    ${total}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* PAYMENT FORM */}
          <Card className="p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-bold mb-6 text-[#374151] dark:text-white">
              Payment Details
            </h2>

            <form onSubmit={handlePayment} className="space-y-5">
              {/* Payment Method Selection */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { id: 'card', label: '💳 Card', color: '#0D9488' },
                  { id: 'mobile', label: '📱 Mobile', color: '#F59E0B' },
                  { id: 'paypal', label: '💰 PayPal', color: '#374151' },
                ].map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-3 rounded-xl border-2 transition ${
                      paymentMethod === method.id
                        ? `border-[${method.color}] bg-[${method.color}]/10`
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <span className="text-sm font-medium">{method.label}</span>
                  </button>
                ))}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-2xl text-lg bg-gradient-to-r from-[#0D9488] to-[#F59E0B] shadow-lg shadow-[#0D9488]/30 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    Pay ${total} Securely
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-gray-400">
                🔒 Your payment is secure and encrypted
              </p>
            </form>
          </Card>
        </div>

        {/* RIGHT SIDEBAR */}
        <div>
          <Card className="p-6 rounded-3xl sticky top-24 border border-gray-100 dark:border-gray-800 shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-[#374151] dark:text-white">
              Order Summary
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Booking ID</span>
                <span className="font-semibold text-[#374151] dark:text-white text-xs">
                  {booking?._id?.slice(0, 8) || 'N/A'}
                </span>
              </div>

              <div className="flex justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-semibold text-[#374151] dark:text-white">
                  ${total}
                </span>
              </div>

              <div className="flex justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Taxes</span>
                <span className="font-semibold text-[#374151] dark:text-white">
                  $0.00
                </span>
              </div>

              <div className="flex justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500">Service Fee</span>
                <span className="font-semibold text-[#374151] dark:text-white">
                  $0.00
                </span>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <span className="text-xl font-bold text-[#374151] dark:text-white">
                  Total
                </span>
                <span className="text-3xl font-bold text-[#0D9488]">
                  ${total}
                </span>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="mt-6 p-4 rounded-2xl bg-[#0D9488]/10 dark:bg-[#0D9488]/20 border border-[#0D9488]/20 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#0D9488] flex-shrink-0" />
              <p className="text-sm text-[#0D9488] dark:text-[#0D9488]">
                Your payment is protected and encrypted.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Payment;