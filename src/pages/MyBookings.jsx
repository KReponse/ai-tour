// src/pages/MyBookings.jsx

import React, { useEffect, useState } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  CreditCard,
  Loader2,
  Eye,
  XCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  Sparkles,
  DollarSign,
  Star,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  getMyBookings,
  cancelBooking,
} from '../services/bookingService';

// ===============================
// AI TOUR COLORS
// ===============================
// Teal  : #0D9488
// Gold  : #F59E0B
// Slate : #374151
// White : #FFFFFF
// ===============================

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelling, setCancelling] = useState(null);

  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith('http')) return image;
    if (image.startsWith('/')) return image;
    return `${API_URL}/uploads/${image}`;
  };

  const getEntity = (booking) => {
    return booking?.listing || booking?.tour || null;
  };

  const getEntityImage = (booking) => {
    const entity = getEntity(booking);
    if (!entity) return 'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=500';
    
    return (
      getImageUrl(entity.coverImage) ||
      getImageUrl(entity.galleryImages?.[0]) ||
      getImageUrl(entity.images?.[0]) ||
      getImageUrl(entity.image) ||
      'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=500'
    );
  };

  const getEntityTitle = (booking) => {
    const entity = getEntity(booking);
    return entity?.title || 'Experience';
  };

  const getEntityLocation = (booking) => {
    const entity = getEntity(booking);
    return entity?.location || 'Location not specified';
  };

  const getEntityLink = (booking) => {
    if (booking?.listing) {
      return `/listing/${booking.listing._id || booking.listing}`;
    }
    if (booking?.tour) {
      return `/tour/${booking.tour._id || booking.tour}`;
    }
    return '#';
  };

  const handleCancel = async (bookingId) => {
    const confirmCancel = window.confirm(
      'Are you sure you want to cancel this booking?'
    );
    if (!confirmCancel) return;

    try {
      setCancelling(bookingId);
      const token = localStorage.getItem('token');
      await cancelBooking(bookingId, token);

      setBookings(
        bookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: 'cancelled' }
            : booking
        )
      );

      alert('Booking cancelled successfully');
    } catch (error) {
      console.log(error);
      alert('Failed to cancel booking');
    } finally {
      setCancelling(null);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = await getMyBookings(token);
      console.log('✅ Bookings from backend:', data);
      
      let bookingsList = [];
      if (data && data.bookings) {
        bookingsList = data.bookings;
      } else if (data && Array.isArray(data)) {
        bookingsList = data;
      }
      
      // ✅ Debug: Log each booking's ID
      bookingsList.forEach((booking, index) => {
        console.log(`📊 Booking ${index + 1} ID:`, booking._id);
      });
      
      setBookings(bookingsList);
    } catch (error) {
      console.error('❌ Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      draft: {
        bg: 'bg-gray-100 dark:bg-gray-800',
        text: 'text-gray-500 dark:text-gray-400',
        icon: Clock,
        label: 'Draft',
      },
      pending_payment: {
        bg: 'bg-[#F59E0B]/10 dark:bg-[#F59E0B]/20',
        text: 'text-[#F59E0B] dark:text-[#F59E0B]',
        icon: Clock,
        label: 'Pending Payment',
      },
      paid: {
        bg: 'bg-[#0D9488]/10 dark:bg-[#0D9488]/20',
        text: 'text-[#0D9488] dark:text-[#0D9488]',
        icon: CheckCircle,
        label: 'Paid',
      },
      confirmed: {
        bg: 'bg-[#0D9488]/10 dark:bg-[#0D9488]/20',
        text: 'text-[#0D9488] dark:text-[#0D9488]',
        icon: CheckCircle,
        label: 'Confirmed',
      },
      in_progress: {
        bg: 'bg-blue-100 dark:bg-blue-900/20',
        text: 'text-blue-600 dark:text-blue-400',
        icon: Clock,
        label: 'In Progress',
      },
      completed: {
        bg: 'bg-green-100 dark:bg-green-900/20',
        text: 'text-green-600 dark:text-green-400',
        icon: CheckCircle,
        label: 'Completed',
      },
      review_eligible: {
        bg: 'bg-[#F59E0B]/10 dark:bg-[#F59E0B]/20',
        text: 'text-[#F59E0B] dark:text-[#F59E0B]',
        icon: Star,
        label: 'Ready for Review',
      },
      cancelled: {
        bg: 'bg-red-100 dark:bg-red-900/20',
        text: 'text-red-600 dark:text-red-400',
        icon: XCircle,
        label: 'Cancelled',
      },
      rejected: {
        bg: 'bg-red-100 dark:bg-red-900/20',
        text: 'text-red-600 dark:text-red-400',
        icon: XCircle,
        label: 'Rejected',
      },
      refunded: {
        bg: 'bg-gray-100 dark:bg-gray-800',
        text: 'text-gray-500 dark:text-gray-400',
        icon: CheckCircle,
        label: 'Refunded',
      },
    };
    return styles[status] || styles.pending_payment;
  };

  const getPaymentBadge = (status) => {
    const styles = {
      paid: 'text-[#0D9488]',
      pending: 'text-[#F59E0B]',
      unpaid: 'text-gray-400',
      failed: 'text-red-600',
      refunded: 'text-gray-400',
    };
    return styles[status] || styles.pending;
  };

  const getTravelDate = (booking) => {
    if (booking.travelDate) return booking.travelDate;
    if (booking.startDate) return booking.startDate;
    return null;
  };

  const canCancel = (status) => {
    return ['pending_payment', 'paid', 'confirmed'].includes(status);
  };

  const canPay = (status) => {
    return status === 'pending_payment';
  };

  const canReview = (booking) => {
    return (booking.status === 'completed' || booking.status === 'review_eligible') 
           && !booking.reviewSubmitted 
           && !booking.canReview === false;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488]/20" />
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488] border-t-transparent animate-spin" />
        </div>
        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 text-gray-900 dark:text-white">
      {/* HEADER */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#F59E0B] flex items-center justify-center shadow-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-[#374151] dark:text-white">
              My Bookings
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'} found
            </p>
          </div>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 p-16 text-center">
          <div className="w-20 h-20 rounded-full bg-[#0D9488]/10 flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-10 h-10 text-[#0D9488]" />
          </div>
          <h2 className="text-2xl font-bold text-[#374151] dark:text-white mb-2">
            No Bookings Yet
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Explore experiences and make your first booking.
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#0D9488] to-[#F59E0B] text-white font-bold shadow-lg shadow-[#0D9488]/30 hover:scale-[1.02] transition"
          >
            Explore Experiences
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => {
            const statusStyle = getStatusBadge(booking.status);
            const StatusIcon = statusStyle.icon;
            const travelDate = getTravelDate(booking);
            const paymentColor = getPaymentBadge(booking.paymentStatus);
            const imageUrl = getEntityImage(booking);
            const entityTitle = getEntityTitle(booking);
            const entityLocation = getEntityLocation(booking);
            const entityLink = getEntityLink(booking);
            
            const isCancellable = canCancel(booking.status);
            const isPayable = canPay(booking.status);
            const isReviewable = canReview(booking);

            // ✅ Debug: Log booking ID for review link
            if (isReviewable) {
              console.log('📤 Reviewable booking ID:', booking._id);
            }

            return (
              <div
                key={booking._id || booking.id}
                className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-1 duration-300 border border-gray-100 dark:border-gray-800 overflow-hidden"
              >
                <div className="grid md:grid-cols-4">
                  {/* IMAGE */}
                  <div className="relative">
                    <img
                      src={imageUrl}
                      alt={entityTitle}
                      className="w-full h-full object-cover min-h-[220px]"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=500';
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${statusStyle.bg} ${statusStyle.text}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusStyle.label}
                      </span>
                    </div>
                    
                    {booking.totalPrice && (
                      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        ${booking.totalPrice}
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="md:col-span-3 p-6">
                    <div className="flex flex-wrap justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-[#374151] dark:text-white">
                          {entityTitle}
                        </h2>
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mt-2">
                          <MapPin size={16} className="text-[#0D9488]" />
                          {entityLocation}
                        </div>
                        {booking.bookingCode && (
                          <p className="text-xs text-gray-400 mt-1">
                            Ref: {booking.bookingCode}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mt-6">
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                        <Calendar size={18} className="text-[#0D9488]" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Travel Date</p>
                          <p className="font-semibold text-[#374151] dark:text-white">
                            {travelDate ? new Date(travelDate).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                        <Users size={18} className="text-[#F59E0B]" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Travelers</p>
                          <p className="font-semibold text-[#374151] dark:text-white">
                            {booking.numberOfPeople || booking.travelers || 1}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                        <CreditCard size={18} className="text-[#0D9488]" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Payment</p>
                          <p className={`font-semibold ${paymentColor}`}>
                            {booking.paymentStatus || 'Pending'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link
                        to={`/trip/${booking._id}`}
                        className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#0D9488] to-[#0f766e] hover:scale-[1.02] text-white font-semibold transition-all duration-300 flex items-center gap-2 shadow-md shadow-[#0D9488]/25"
                      >
                        <Eye size={18} />
                        View Details
                      </Link>

                      {isPayable && (
                        <Link
                          to={`/payment/${booking._id}`}
                          className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#d97706] hover:scale-[1.02] text-white font-semibold transition-all duration-300 flex items-center gap-2 shadow-md shadow-[#F59E0B]/25"
                        >
                          <CreditCard size={18} />
                          Pay Now
                        </Link>
                      )}

                      {isReviewable && booking._id && (
                        <Link
                          to={`/review/${booking._id}`}
                          className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#0D9488] to-[#F59E0B] hover:scale-[1.02] text-white font-semibold transition-all duration-300 flex items-center gap-2 shadow-md shadow-[#0D9488]/25"
                        >
                          <Star size={18} />
                          Leave Review
                        </Link>
                      )}

                      {isCancellable && (
                        <button
                          onClick={() => handleCancel(booking._id)}
                          disabled={cancelling === booking._id}
                          className="px-5 py-3 rounded-xl border-2 border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 font-semibold flex items-center gap-2 disabled:opacity-50"
                        >
                          {cancelling === booking._id ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Cancelling...
                            </>
                          ) : (
                            <>
                              <XCircle size={18} />
                              Cancel Booking
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#374151] dark:text-white">
                Booking Details
              </h2>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition"
              >
                <XCircle className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="font-semibold text-[#374151] dark:text-white">
                    {getEntityTitle(selectedBooking)}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <p className="text-sm text-gray-500">Status</p>
                  <p className={`font-semibold capitalize ${
                    selectedBooking.status === 'confirmed' ? 'text-[#0D9488]' :
                    selectedBooking.status === 'pending_payment' ? 'text-[#F59E0B]' :
                    selectedBooking.status === 'completed' ? 'text-green-600' :
                    'text-red-600'
                  }`}>
                    {selectedBooking.status}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <p className="text-sm text-gray-500">Travel Date</p>
                  <p className="font-semibold text-[#374151] dark:text-white">
                    {getTravelDate(selectedBooking) 
                      ? new Date(getTravelDate(selectedBooking)).toLocaleDateString() 
                      : 'N/A'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <p className="text-sm text-gray-500">Travelers</p>
                  <p className="font-semibold text-[#374151] dark:text-white">
                    {selectedBooking.numberOfPeople || selectedBooking.travelers || 1}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <p className="text-sm text-gray-500">Total Price</p>
                  <p className="font-semibold text-[#0D9488]">
                    ${selectedBooking.totalPrice || 0}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <p className="text-sm text-gray-500">Payment Status</p>
                  <p className={`font-semibold ${getPaymentBadge(selectedBooking.paymentStatus)}`}>
                    {selectedBooking.paymentStatus || 'Pending'}
                  </p>
                </div>
              </div>
              
              {selectedBooking.bookingCode && (
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <p className="text-sm text-gray-500">Booking Reference</p>
                  <p className="font-mono font-semibold text-[#0D9488]">
                    {selectedBooking.bookingCode}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedBooking(null)}
              className="mt-6 w-full py-3 rounded-2xl bg-gradient-to-r from-[#0D9488] to-[#F59E0B] text-white font-bold shadow-lg shadow-[#0D9488]/30 hover:scale-[1.02] transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;