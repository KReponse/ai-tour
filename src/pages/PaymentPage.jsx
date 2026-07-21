// src/pages/PaymentPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  CreditCard,
  Smartphone,
  Wallet,
  ShieldCheck,
  Lock,
  ArrowLeft,
  Loader2,
  CheckCircle,
  XCircle,
  Sparkles,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Clock,
  AlertCircle,
  Building2,
  Mail,
  Phone,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { createCheckout } from '../services/paymentService';
import { getBookingById } from '../services/bookingService';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

// ===============================
// AI TOUR COLORS
// ===============================
// Teal  : #0D9488
// Gold  : #F59E0B
// Slate : #374151
// White : #FFFFFF
// ===============================

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');

  // ✅ Fetch booking from backend
  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    } else {
      setError('No booking found');
      setFetching(false);
    }
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      setFetching(true);
      setError('');
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please login to continue');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      const data = await getBookingById(bookingId, token);
      setBooking(data.booking);
    } catch (error) {
      console.error('Error fetching booking:', error);
      
      if (error.response?.status === 401) {
        setError('Please login to view this payment');
        setTimeout(() => navigate('/login'), 2000);
      } else if (error.response?.status === 404) {
        setError('Booking not found');
      } else {
        setError('Failed to load booking details. Please try again.');
      }
    } finally {
      setFetching(false);
    }
  };

  // ✅ Get the entity (listing or tour)
  const getEntity = () => {
    return booking?.listing || booking?.tour || null;
  };

  const getEntityTitle = () => {
    const entity = getEntity();
    return entity?.title || 'Experience';
  };

  const getEntityLocation = () => {
    const entity = getEntity();
    return entity?.location || 'Location not specified';
  };

  const getEntityImage = () => {
    const entity = getEntity();
    if (!entity) return null;
    return (
      entity.coverImage ||
      entity.galleryImages?.[0] ||
      entity.images?.[0] ||
      entity.image ||
      null
    );
  };

  const getEntityPrice = () => {
    const entity = getEntity();
    return entity?.price || 0;
  };

  const getTotalPrice = () => {
    return booking?.totalPrice || (getEntityPrice() * (booking?.numberOfPeople || 1));
  };

  const getProviderName = () => {
    return booking?.provider?.name || booking?.provider || 'Provider';
  };

  // ✅ Handle Payment
  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }

    if (!booking || !booking._id) {
      toast.error('Booking not found. Please try again.');
      return;
    }

    // ✅ Check if booking is already paid
    if (booking.paymentStatus === 'paid') {
      toast.error('This booking has already been paid');
      navigate(`/trip/${booking._id}`);
      return;
    }

    // ✅ Check if booking is cancelled
    if (booking.status === 'cancelled' || booking.status === 'rejected') {
      toast.error('This booking has been cancelled and cannot be paid');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await createCheckout(booking._id);
      
      console.log('✅ Checkout response:', response);
      
      if (response.url) {
        // ✅ Redirect to Stripe checkout
        window.location.href = response.url;
      } else if (response.sessionId) {
        // ✅ Navigate to success with session ID
        navigate('/payment-success', {
          state: {
            sessionId: response.sessionId,
            bookingId: booking._id,
          },
        });
      } else {
        setError('Failed to create payment session. Please try again.');
        toast.error('Payment initialization failed');
      }

    } catch (error) {
      console.error('❌ Payment error:', error);
      const errorMsg = error.response?.data?.message || 'Payment initialization failed. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Loading state
  if (fetching) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488]/20" />
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488] border-t-transparent animate-spin" />
        </div>
        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading payment details...</p>
      </div>
    );
  }

  // Error state
  if (error || !booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 text-center p-6">
        <div className="w-24 h-24 mx-auto rounded-full bg-red-500/10 flex items-center justify-center mb-6">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-[#374151] dark:text-white mb-2">
          Payment Error
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          {error || 'Unable to process payment. Please try again.'}
        </p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => navigate('/my-trips')}
            className="px-6 py-3 rounded-xl bg-[#0D9488] text-white font-bold hover:bg-[#0D9488]/90 transition"
          >
            My Trips
          </button>
          <button
            onClick={() => navigate('/explore')}
            className="px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-[#374151] dark:text-white font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            Explore Experiences
          </button>
        </div>
      </div>
    );
  }

  const total = getTotalPrice();
  const entity = getEntity();
  const entityTitle = getEntityTitle();
  const entityLocation = getEntityLocation();
  const entityImage = getEntityImage();
  const providerName = getProviderName();

  // ✅ Check if already paid
  const isPaid = booking.paymentStatus === 'paid';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-[#0D9488] transition mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#F59E0B] flex items-center justify-center shadow-lg">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-[#374151] dark:text-white">
              Secure Payment
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Complete your payment securely for {entityTitle}
            </p>
          </div>
        </div>

        {/* Already Paid Warning */}
        {isPaid && (
          <div className="mb-6 p-4 rounded-2xl bg-[#0D9488]/10 border border-[#0D9488]/20 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-[#0D9488]" />
            <span className="text-[#0D9488] font-medium">
              This booking has already been paid. No further action needed.
            </span>
            <Link
              to={`/trip/${booking._id}`}
              className="ml-auto px-4 py-2 rounded-xl bg-[#0D9488] text-white text-sm font-medium hover:bg-[#0D9488]/80 transition"
            >
              View Trip
            </Link>
          </div>
        )}

        {/* Error */}
        {error && !isPaid && (
          <div className="mb-6 p-4 rounded-2xl bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
            <button
              onClick={() => setError('')}
              className="ml-auto text-sm underline hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN - Payment Form */}
          <div className="lg:col-span-2 space-y-6">

            {/* Booking Summary */}
            <Card className="p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-[#374151] dark:text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#F59E0B]" />
                Booking Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Experience</span>
                  <span className="font-semibold text-[#374151] dark:text-white">
                    {entityTitle}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Location</span>
                  <span className="font-semibold text-[#374151] dark:text-white">
                    {entityLocation}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Provider</span>
                  <span className="font-semibold text-[#374151] dark:text-white">
                    {providerName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Travel Date</span>
                  <span className="font-semibold text-[#374151] dark:text-white">
                    {booking.startDate ? formatDate(booking.startDate) : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Travelers</span>
                  <span className="font-semibold text-[#374151] dark:text-white">
                    {booking.numberOfPeople || 1} {booking.numberOfPeople > 1 ? 'people' : 'person'}
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-[#374151] dark:text-white">
                      Total Amount
                    </span>
                    <span className="text-3xl font-bold text-[#0D9488]">
                      ${total}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 text-right">
                    ${getEntityPrice()} × {booking.numberOfPeople || 1} traveler{booking.numberOfPeople > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </Card>

            {/* Payment Method */}
            {!isPaid && (
              <Card className="p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
                <h2 className="text-xl font-bold text-[#374151] dark:text-white mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#0D9488]" />
                  Payment Method
                </h2>

                <form onSubmit={handlePayment} className="space-y-5">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { id: 'card', label: '💳 Card', color: '#0D9488' },
                      { id: 'mobile', label: '📱 Mobile Money', color: '#F59E0B' },
                      { id: 'paypal', label: '💰 PayPal', color: '#374151' },
                    ].map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-4 rounded-2xl border-2 transition-all duration-200 text-center ${
                          paymentMethod === method.id
                            ? `border-[${method.color}] bg-[${method.color}]/10 shadow-md`
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <span className="text-sm font-medium">{method.label}</span>
                        {paymentMethod === method.id && (
                          <div className="mt-1">
                            <CheckCircle className="w-3 h-3 mx-auto text-[#0D9488]" />
                          </div>
                        )}
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

                  <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      SSL Encrypted
                    </span>
                    <span>•</span>
                    <span>Secure Checkout</span>
                    <span>•</span>
                    <span>No fees</span>
                  </div>
                </form>
              </Card>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: ShieldCheck, label: 'Secure Payment', color: 'text-[#0D9488]' },
                { icon: Lock, label: 'Encrypted Data', color: 'text-[#0D9488]' },
                { icon: CheckCircle, label: 'Instant Confirmation', color: 'text-[#0D9488]' },
                { icon: Users, label: '24/7 Support', color: 'text-[#F59E0B]' },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                    <Icon className={`w-4 h-4 ${item.color}`} />
                    <span className="text-xs font-medium text-[#374151] dark:text-white">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT SIDEBAR - Order Summary */}
          <div className="space-y-6">
            <Card className="p-6 rounded-3xl sticky top-24 border border-gray-100 dark:border-gray-800 shadow-xl">
              <h2 className="text-xl font-bold text-[#374151] dark:text-white mb-6">
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-500">Booking ID</span>
                  <span className="font-semibold text-[#374151] dark:text-white text-xs">
                    {booking.bookingCode || booking._id?.slice(0, 8) || 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-500">Experience</span>
                  <span className="font-semibold text-[#374151] dark:text-white text-sm text-right max-w-[55%]">
                    {entityTitle}
                  </span>
                </div>

                <div className="flex justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-500">Travelers</span>
                  <span className="font-semibold text-[#374151] dark:text-white">
                    {booking.numberOfPeople || 1}
                  </span>
                </div>

                <div className="flex justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-500">Travel Date</span>
                  <span className="font-semibold text-[#374151] dark:text-white">
                    {booking.startDate ? formatDate(booking.startDate) : 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-500">Price per person</span>
                  <span className="font-semibold text-[#374151] dark:text-white">
                    ${getEntityPrice()}
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

              {/* Payment Status */}
              <div className="mt-6 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Payment Status</span>
                  <span className={`text-sm font-semibold ${
                    booking.paymentStatus === 'paid' ? 'text-[#0D9488]' :
                    booking.paymentStatus === 'pending' ? 'text-[#F59E0B]' :
                    'text-gray-400'
                  }`}>
                    {booking.paymentStatus || 'Pending'}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-500">Booking Status</span>
                  <span className={`text-sm font-semibold capitalize ${
                    booking.status === 'confirmed' ? 'text-[#0D9488]' :
                    booking.status === 'pending_payment' ? 'text-[#F59E0B]' :
                    booking.status === 'completed' ? 'text-green-600' :
                    'text-gray-400'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-[#0D9488]/10 to-[#F59E0B]/10 border border-[#0D9488]/20 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-[#0D9488] flex-shrink-0" />
                <p className="text-sm text-[#374151] dark:text-white">
                  Your payment is <span className="font-semibold text-[#0D9488]">protected</span> and <span className="font-semibold text-[#0D9488]">encrypted</span>.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;