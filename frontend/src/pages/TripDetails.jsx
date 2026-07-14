// src/pages/TripDetails.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Users,
  CreditCard,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  DollarSign,
  User,
  Mail,
  Phone,
  FileText,
  Printer,
  Share2,
  Sparkles,
  AlertCircle,
  MessageCircle,
  Star,
  Shield,
  Award,
  Eye,
  Download,
  Check,
  TrendingUp,
  CalendarDays,
} from 'lucide-react';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { getBookingById, cancelBooking } from '../services/bookingService';
import { createCheckout } from '../services/paymentService';
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

const TripDetails = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const data = await getBookingById(bookingId, token);
      setBooking(data.booking);
    } catch (error) {
      console.error('Error fetching booking:', error);
      
      if (error.response?.status === 401) {
        setError('Please login to view trip details');
        setTimeout(() => navigate('/login'), 2000);
      } else if (error.response?.status === 404) {
        setError('Trip not found');
      } else {
        setError('Failed to load trip details. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      await cancelBooking(bookingId, token);
      await fetchBooking();
      toast.success('Booking cancelled successfully');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePayNow = async () => {
    try {
      setActionLoading(true);
      toast.loading('Initializing payment...');
      
      const result = await createCheckout(bookingId);
      
      if (result.url) {
        toast.dismiss();
        window.location.href = result.url;
      } else {
        toast.dismiss();
        toast.error('Failed to create payment session');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.dismiss();
      
      // Show more specific error message
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to initiate payment. Please try again.';
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
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

  const formatDateTime = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  const getEntityLink = () => {
    if (booking?.listing) {
      const listingId = booking.listing._id || booking.listing;
      return `/listing/${listingId}`;
    }
    if (booking?.tour) {
      const tourId = booking.tour._id || booking.tour;
      return `/tour/${tourId}`;
    }
    return '#';
  };

  // ✅ Get booking code
  const getBookingCode = () => {
    return booking?.bookingCode || booking?._id?.slice(-8)?.toUpperCase() || 'N/A';
  };

  // ✅ Status configuration
  const getStatusConfig = (status) => {
    const configs = {
      draft: {
        icon: FileText,
        label: 'Draft',
        color: 'text-gray-500',
        bg: 'bg-gray-100',
        border: 'border-gray-200',
        text: 'Draft',
        progress: 0,
      },
      pending_payment: {
        icon: Clock,
        label: 'Pending Payment',
        color: 'text-[#F59E0B]',
        bg: 'bg-[#F59E0B]/10',
        border: 'border-[#F59E0B]/20',
        text: 'Awaiting Payment',
        progress: 20,
      },
      paid: {
        icon: CreditCard,
        label: 'Paid',
        color: 'text-[#0D9488]',
        bg: 'bg-[#0D9488]/10',
        border: 'border-[#0D9488]/20',
        text: 'Payment Received',
        progress: 40,
      },
      confirmed: {
        icon: CheckCircle,
        label: 'Confirmed',
        color: 'text-[#0D9488]',
        bg: 'bg-[#0D9488]/10',
        border: 'border-[#0D9488]/20',
        text: 'Confirmed!',
        progress: 60,
      },
      in_progress: {
        icon: TrendingUp,
        label: 'In Progress',
        color: 'text-[#0D9488]',
        bg: 'bg-[#0D9488]/10',
        border: 'border-[#0D9488]/20',
        text: 'Trip in Progress',
        progress: 80,
      },
      completed: {
        icon: CheckCircle,
        label: 'Completed',
        color: 'text-green-600',
        bg: 'bg-green-100',
        border: 'border-green-200',
        text: 'Trip Completed!',
        progress: 100,
      },
      review_eligible: {
        icon: Star,
        label: 'Ready for Review',
        color: 'text-[#F59E0B]',
        bg: 'bg-[#F59E0B]/10',
        border: 'border-[#F59E0B]/20',
        text: 'Ready for Review',
        progress: 100,
      },
      cancelled: {
        icon: XCircle,
        label: 'Cancelled',
        color: 'text-red-500',
        bg: 'bg-red-500/10',
        border: 'border-red-500/20',
        text: 'Cancelled',
        progress: 0,
      },
      rejected: {
        icon: XCircle,
        label: 'Rejected',
        color: 'text-red-500',
        bg: 'bg-red-500/10',
        border: 'border-red-500/20',
        text: 'Rejected',
        progress: 0,
      },
      failed_payment: {
        icon: XCircle,
        label: 'Payment Failed',
        color: 'text-red-500',
        bg: 'bg-red-500/10',
        border: 'border-red-500/20',
        text: 'Payment Failed',
        progress: 0,
      },
    };
    return configs[status] || configs.pending_payment;
  };

  // ✅ Check if actions are available
  const canCancel = () => {
    return ['pending_payment', 'paid', 'confirmed'].includes(booking?.status);
  };

  const canPay = () => {
    return booking?.status === 'pending_payment';
  };

  const canReview = () => {
    return (booking?.status === 'completed' || booking?.status === 'review_eligible') && 
           !booking?.reviewSubmitted;
  };

  const isPastTrip = () => {
    return booking?.startDate && new Date(booking.startDate) < new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="relative w-20 h-20">
          <div className="w-20 h-20 rounded-full border-4 border-[#0D9488]/20" />
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488] border-t-transparent animate-spin" />
        </div>
        <p className="mt-6 text-lg font-semibold text-[#374151] dark:text-white">
          Loading Trip Details...
        </p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 text-center p-6">
        <div className="w-24 h-24 mx-auto rounded-full bg-red-500/10 flex items-center justify-center mb-6">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-[#374151] dark:text-white mb-2">
          Trip Not Found
        </h1>
        <p className="text-gray-500 dark:text-gray-400">{error || 'The trip you\'re looking for doesn\'t exist.'}</p>
        <button
          onClick={() => navigate('/trips')}
          className="mt-6 px-6 py-3 rounded-xl bg-[#0D9488] text-white font-bold hover:bg-[#0D9488]/90 transition"
        >
          View My Trips
        </button>
      </div>
    );
  }

  const statusConfig = getStatusConfig(booking.status);
  const StatusIcon = statusConfig.icon;
  const entity = getEntity();
  const entityTitle = getEntityTitle();
  const entityLocation = getEntityLocation();
  const entityImage = getEntityImage();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/trips')}
          className="flex items-center gap-2 text-gray-500 hover:text-[#0D9488] transition mb-6 no-print"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to My Trips</span>
        </button>

        {/* Header */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-3xl font-bold text-[#374151] dark:text-white">
                  Trip Details
                </h1>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusConfig.bg} ${statusConfig.color} border ${statusConfig.border}`}>
                  <span className="flex items-center gap-1">
                    <StatusIcon className="w-4 h-4" />
                    {statusConfig.label}
                  </span>
                </span>
                {['pending_payment', 'paid', 'confirmed', 'in_progress'].includes(booking.status) && (
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-600 border border-green-200">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Active
                    </span>
                  </span>
                )}
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                Booking Reference: <span className="font-mono font-semibold text-[#0D9488]">{getBookingCode()}</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2 no-print">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Print</span>
              </button>
              <button
                onClick={() => {
                  navigator.share?.({
                    title: `Trip ${getBookingCode()}`,
                    text: `Trip: ${entityTitle}`,
                    url: window.location.href,
                  });
                }}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 p-6 mb-6">
          <h2 className="text-lg font-bold text-[#374151] dark:text-white mb-4 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-[#0D9488]" />
            Trip Timeline
          </h2>
          <div className="relative">
            <div className="flex items-center justify-between">
              {[
                { label: 'Booking Created', status: true },
                { label: 'Payment', status: ['paid', 'confirmed', 'in_progress', 'completed', 'review_eligible'].includes(booking.status) },
                { label: 'Confirmed', status: ['confirmed', 'in_progress', 'completed', 'review_eligible'].includes(booking.status) },
                { label: 'In Progress', status: ['in_progress', 'completed', 'review_eligible'].includes(booking.status) },
                { label: 'Completed', status: ['completed', 'review_eligible'].includes(booking.status) },
              ].map((step, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.status
                      ? 'bg-[#0D9488] text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                  }`}>
                    {step.status ? <Check className="w-5 h-5" /> : index + 1}
                  </div>
                  <p className={`text-xs mt-2 text-center ${
                    step.status
                      ? 'text-[#0D9488] font-semibold'
                      : 'text-gray-400'
                  }`}>
                    {step.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Trip Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Experience Information */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 p-6">
              <h2 className="text-xl font-bold text-[#374151] dark:text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#F59E0B]" />
                Experience Information
              </h2>
              {entity ? (
                <div className="space-y-4">
                  <Link
                    to={getEntityLink()}
                    className="block hover:opacity-80 transition"
                  >
                    <h3 className="text-lg font-semibold text-[#0D9488]">
                      {entityTitle}
                    </h3>
                  </Link>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <MapPin className="w-4 h-4 text-[#0D9488]" />
                      <span>{entityLocation}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <Calendar className="w-4 h-4 text-[#0D9488]" />
                      <span>{entity.duration || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <Users className="w-4 h-4 text-[#0D9488]" />
                      <span>Max {entity.capacity || entity.travelers || 10} travelers</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <DollarSign className="w-4 h-4 text-[#0D9488]" />
                      <span>${entity.price || 0} per person</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">Experience information unavailable</p>
              )}
            </div>

            {/* Booking Details */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 p-6">
              <h2 className="text-xl font-bold text-[#374151] dark:text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#0D9488]" />
                Booking Details
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Booking Date
                    </label>
                    <p className="text-[#374151] dark:text-white font-medium">
                      {formatDateTime(booking.createdAt)}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </label>
                    <p className={`font-medium ${statusConfig.color}`}>
                      {statusConfig.text}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Travel Date
                    </label>
                    <p className="text-[#374151] dark:text-white font-medium">
                      {booking.startDate ? formatDate(booking.startDate) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Number of Travelers
                    </label>
                    <p className="text-[#374151] dark:text-white font-medium">
                      {booking.numberOfPeople || 1} {booking.numberOfPeople > 1 ? 'people' : 'person'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Total Amount
                    </label>
                    <p className="text-2xl font-bold text-[#0D9488]">
                      ${booking.totalPrice || 0}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Payment Status
                    </label>
                    <p className={`font-medium ${
                      booking.paymentStatus === 'paid' ? 'text-[#0D9488]' :
                      booking.paymentStatus === 'pending' ? 'text-[#F59E0B]' :
                      'text-gray-400'
                    }`}>
                      {booking.paymentStatus || 'Pending'}
                    </p>
                  </div>
                </div>
                {booking.specialRequests && (
                  <div>
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Special Requests
                    </label>
                    <p className="text-[#374151] dark:text-white mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      {booking.specialRequests}
                    </p>
                  </div>
                )}
                {booking.cancellationReason && (
                  <div>
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Cancellation Reason
                    </label>
                    <p className="text-red-600 dark:text-red-400 mt-1 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                      {booking.cancellationReason}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 p-6">
              <h2 className="text-xl font-bold text-[#374151] dark:text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-[#0D9488]" />
                Contact Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Full Name
                  </label>
                  <p className="text-[#374151] dark:text-white font-medium">
                    {booking.user?.name || booking.fullName || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Email
                  </label>
                  <p className="text-[#374151] dark:text-white font-medium">
                    {booking.user?.email || booking.email || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Phone
                  </label>
                  <p className="text-[#374151] dark:text-white font-medium">
                    {booking.user?.phone || booking.phone || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 p-6">
              <h2 className="text-lg font-bold text-[#374151] dark:text-white mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                {entity && (
                  <Link to={getEntityLink()}>
                    <Button variant="outline" className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      View Experience
                    </Button>
                  </Link>
                )}
                
                {/* ✅ Pay Now Button */}
                {canPay() && (
                  <button
                    onClick={handlePayNow}
                    disabled={actionLoading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0D9488] to-[#F59E0B] text-white font-bold hover:scale-[1.02] transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {actionLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CreditCard className="w-4 h-4" />
                    )}
                    {actionLoading ? 'Processing...' : 'Pay Now'}
                  </button>
                )}
                
                {/* ✅ Leave Review Button */}
                {canReview() && (
                  <Link
                    to={`/review/${bookingId}`}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0D9488] to-[#F59E0B] text-white font-bold hover:scale-[1.02] transition flex items-center justify-center gap-2"
                  >
                    <Star className="w-4 h-4" />
                    Leave a Review
                  </Link>
                )}
                
                {/* ✅ Cancel Button */}
                {canCancel() && !isPastTrip() && (
                  <button
                    onClick={handleCancel}
                    disabled={actionLoading}
                    className="w-full py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition disabled:opacity-50"
                  >
                    {actionLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      'Cancel Trip'
                    )}
                  </button>
                )}
                
                <button
                  onClick={() => navigate('/trips')}
                  className="w-full py-3 rounded-xl bg-[#0D9488] text-white font-bold hover:bg-[#0D9488]/90 transition"
                >
                  View My Trips
                </button>
              </div>
            </div>

            {/* Support */}
            <div className="bg-gradient-to-br from-[#0D9488]/5 to-[#F59E0B]/5 rounded-3xl border border-[#0D9488]/10 p-6">
              <h3 className="font-bold text-[#374151] dark:text-white mb-2">
                Need Help?
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Have questions about your trip? Contact our support team.
              </p>
              <button
                onClick={() => navigate('/contact')}
                className="w-full py-2 rounded-xl bg-[#0D9488] text-white hover:bg-[#0D9488]/90 transition flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Contact Support
              </button>
            </div>

            {/* Trust Badge */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-[#F59E0B] mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#F59E0B]" />
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Secure booking • Best price guarantee • 24/7 support
              </p>
            </div>

            {/* Booking Code */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-4 text-center border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-400">Booking Reference</p>
              <p className="font-mono font-bold text-[#0D9488] text-sm mt-1">
                {getBookingCode()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ FIXED: Changed jsx to jsx="true" */}
      <style jsx="true">{`
        @media print {
          .no-print {
            display: none !important;
          }
          .min-h-screen {
            min-height: auto !important;
            padding: 0 !important;
          }
          .max-w-5xl {
            max-width: 100% !important;
            margin: 0 !important;
          }
          button {
            display: none !important;
          }
          a {
            text-decoration: none !important;
          }
          .bg-white {
            background: white !important;
          }
          .shadow-lg {
            box-shadow: none !important;
          }
          .border {
            border: 1px solid #e5e7eb !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TripDetails;