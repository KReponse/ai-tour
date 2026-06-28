// src/pages/Trips.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle, 
  MoreVertical,
  Loader2,
  Sparkles,
  Plane,
  Users,
  Star,
  TrendingUp,
  ChevronDown,
  ArrowRight,
  DollarSign,
} from 'lucide-react';
import Card, { CardImage, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { getMyBookings, cancelBooking } from '../services/bookingService';
import { useAuth } from '../contexts/AuthContext';

// ===============================
// AI TOUR COLORS
// ===============================
// Teal  : #0D9488
// Gold  : #F59E0B
// Slate : #374151
// White : #FFFFFF
// ===============================

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Trips = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTrip, setExpandedTrip] = useState(null);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const data = await getMyBookings(token);
      console.log('✅ Bookings from backend:', data);
      
      if (data && data.bookings) {
        setBookings(data.bookings);
      } else if (data && Array.isArray(data)) {
        setBookings(data);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error('❌ Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
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

      // Update local state
      setBookings(
        bookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: 'cancelled' }
            : booking
        )
      );

      alert('Booking cancelled successfully');
    } catch (error) {
      console.error('❌ Error cancelling booking:', error);
      alert('Failed to cancel booking');
    } finally {
      setCancelling(null);
    }
  };

  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith('http')) return image;
    if (image.startsWith('/')) return image;
    return `${API_URL}/uploads/${image}`;
  };

  const getTourImage = (tour) => {
    if (tour?.coverImage) return getImageUrl(tour.coverImage);
    if (tour?.galleryImages && tour.galleryImages.length > 0) return getImageUrl(tour.galleryImages[0]);
    if (tour?.images && tour.images.length > 0) return getImageUrl(tour.images[0]);
    if (tour?.image) return getImageUrl(tour.image);
    return 'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=500';
  };

  // Get travel date from booking
  const getTravelDate = (booking) => {
    if (booking.startDate) return booking.startDate;
    if (booking.travelDate) return booking.travelDate;
    return null;
  };

  // Get travelers count
  const getTravelers = (booking) => {
    return booking.numberOfPeople || booking.travelers || 1;
  };

  // Get total price
  const getTotalPrice = (booking) => {
    return booking.totalPrice || booking.tour?.price || 0;
  };

  // Filter bookings by status
  const upcomingBookings = bookings.filter(
    b => b.status === 'confirmed' || b.status === 'pending'
  );
  
  const pastBookings = bookings.filter(
    b => b.status === 'completed' || b.status === 'cancelled' || b.status === 'rejected'
  );

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'bg-[#0D9488]/10 text-[#0D9488] border-[#0D9488]/20',
      pending: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
      cancelled: 'bg-red-100 text-red-600 border-red-200',
      completed: 'bg-[#0D9488]/10 text-[#0D9488] border-[#0D9488]/20',
      rejected: 'bg-red-100 text-red-600 border-red-200',
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      confirmed: CheckCircle,
      pending: Clock,
      cancelled: XCircle,
      completed: CheckCircle,
      rejected: XCircle,
    };
    return icons[status] || Clock;
  };

  const TripCard = ({ booking }) => {
    const tour = booking.tour || {};
    const StatusIcon = getStatusIcon(booking.status);
    const isExpanded = expandedTrip === booking._id;
    const travelDate = getTravelDate(booking);
    const travelers = getTravelers(booking);
    const totalPrice = getTotalPrice(booking);
    const isCancellable = booking.status === 'confirmed' || booking.status === 'pending';

    return (
      <Card hover className="overflow-hidden border border-gray-100 dark:border-gray-800 rounded-3xl">
        <div className="grid md:grid-cols-3">
          {/* Image */}
          <div className="relative md:col-span-1">
            <img
              src={getTourImage(tour)}
              alt={tour.title || 'Tour'}
              className="w-full h-48 md:h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=500';
              }}
            />
            <div className="absolute top-3 left-3">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(booking.status)}`}>
                <StatusIcon className="w-3 h-3" />
                {booking.status}
              </span>
            </div>
            
            {/* Price Badge */}
            {totalPrice > 0 && (
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                {totalPrice}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="md:col-span-2 p-5">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-bold text-[#374151] dark:text-white line-clamp-1">
                  {tour.title || 'Tour'}
                </h3>
                <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mt-1">
                  <MapPin className="w-4 h-4 mr-1 text-[#0D9488]" />
                  <span>{tour.location || 'Location not specified'}</span>
                </div>
                {booking.bookingCode && (
                  <p className="text-xs text-gray-400 mt-1">
                    Ref: {booking.bookingCode}
                  </p>
                )}
              </div>
              <button 
                onClick={() => setExpandedTrip(isExpanded ? null : booking._id)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition"
              >
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2">
                <Calendar className="w-4 h-4 mr-2 text-[#0D9488]" />
                <span className="text-sm">
                  {travelDate 
                    ? new Date(travelDate).toLocaleDateString()
                    : 'Date not set'}
                </span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2">
                <Users className="w-4 h-4 mr-2 text-[#F59E0B]" />
                <span className="text-sm">
                  {travelers} {travelers > 1 ? 'Travelers' : 'Traveler'}
                </span>
              </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
              <div className="mb-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 animate-fade-in">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Booking Reference</p>
                    <p className="font-mono font-semibold text-[#0D9488] text-xs">
                      {booking.bookingCode || booking._id?.slice(0, 8)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Payment Status</p>
                    <p className={`font-semibold ${
                      booking.paymentStatus === 'paid' || booking.paymentStatus === 'Paid'
                        ? 'text-[#0D9488]'
                        : 'text-[#F59E0B]'
                    }`}>
                      {booking.paymentStatus || 'Pending'}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">Total Price</p>
                    <p className="font-bold text-[#0D9488]">${totalPrice}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Link to={`/tour/${tour._id}`} className="flex-1">
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="w-full bg-gradient-to-r from-[#0D9488] to-[#F59E0B] shadow-lg shadow-[#0D9488]/30 hover:scale-[1.02] transition text-sm"
                >
                  View Details
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              {isCancellable && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleCancel(booking._id)}
                  disabled={cancelling === booking._id}
                  className="border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                >
                  {cancelling === booking._id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Cancel'
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488]/20" />
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488] border-t-transparent animate-spin" />
        </div>
        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading your trips...</p>
      </div>
    );
  }

  const currentBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-8 animate-fade-in pb-20 md:pb-6">

      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#F59E0B] flex items-center justify-center shadow-lg">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#374151] dark:text-white">
                My Trips
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Manage your upcoming and past adventures
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Sparkles className="w-4 h-4 text-[#0D9488]" />
          <span>{bookings.length} total bookings</span>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-6 py-3 font-semibold transition-all relative ${
            activeTab === 'upcoming'
              ? 'text-[#0D9488]'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Upcoming
            <span className="text-xs bg-[#0D9488]/10 text-[#0D9488] px-2 py-0.5 rounded-full">
              {upcomingBookings.length}
            </span>
          </div>
          {activeTab === 'upcoming' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0D9488]"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-6 py-3 font-semibold transition-all relative ${
            activeTab === 'past'
              ? 'text-[#0D9488]'
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Past Trips
            <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">
              {pastBookings.length}
            </span>
          </div>
          {activeTab === 'past' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0D9488]"></div>
          )}
        </button>
      </div>

      {/* TRIP LIST */}
      {currentBookings.length > 0 ? (
        <div className="space-y-6">
          {currentBookings.map(booking => (
            <TripCard key={booking._id} booking={booking} />
          ))}
        </div>
      ) : (
        <div className="col-span-full text-center py-16 bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800">
          {activeTab === 'upcoming' ? (
            <>
              <div className="w-20 h-20 rounded-full bg-[#0D9488]/10 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-[#0D9488]" />
              </div>
              <h3 className="text-xl font-bold text-[#374151] dark:text-white mb-2">
                No upcoming trips
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Start planning your next adventure
              </p>
              <Link to="/explore">
                <Button className="bg-gradient-to-r from-[#0D9488] to-[#F59E0B] shadow-lg shadow-[#0D9488]/30 hover:scale-[1.02] transition">
                  Explore Destinations
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-[#374151] dark:text-white mb-2">
                No past trips yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Your completed trips will appear here
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Trips;