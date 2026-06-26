// src/pages/provider/Bookings.jsx

import React, { useEffect, useState } from 'react';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  CreditCard,
  Eye,
  XCircle,
  CheckCircle,
  Clock,
  Loader2,
  Search,
  Filter,
  ChevronDown,
  Sparkles,
  User,
  MapPin,
  Mail,
  Phone,
} from 'lucide-react';
import { getProviderBookings } from '../../services/bookingService';

// ===============================
// AI TOUR COLORS
// ===============================
// Teal  : #0D9488
// Gold  : #F59E0B
// Slate : #374151
// White : #FFFFFF
// ===============================

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = await getProviderBookings(token);
      setBookings(data.bookings || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Status styles with AI Tour colors
  const getStatusStyle = (status) => {
    const styles = {
      confirmed: {
        bg: 'bg-[#0D9488]/10 dark:bg-[#0D9488]/20',
        text: 'text-[#0D9488] dark:text-[#0D9488]',
        icon: CheckCircle,
        label: 'Confirmed',
      },
      pending: {
        bg: 'bg-[#F59E0B]/10 dark:bg-[#F59E0B]/20',
        text: 'text-[#F59E0B] dark:text-[#F59E0B]',
        icon: Clock,
        label: 'Pending',
      },
      cancelled: {
        bg: 'bg-red-100 dark:bg-red-900/20',
        text: 'text-red-600 dark:text-red-400',
        icon: XCircle,
        label: 'Cancelled',
      },
    };
    return styles[status] || styles.pending;
  };

  const getPaymentStyle = (status) => {
    const styles = {
      paid: {
        bg: 'bg-[#0D9488]/10 dark:bg-[#0D9488]/20',
        text: 'text-[#0D9488] dark:text-[#0D9488]',
      },
      pending: {
        bg: 'bg-[#F59E0B]/10 dark:bg-[#F59E0B]/20',
        text: 'text-[#F59E0B] dark:text-[#F59E0B]',
      },
      failed: {
        bg: 'bg-red-100 dark:bg-red-900/20',
        text: 'text-red-600 dark:text-red-400',
      },
    };
    return styles[status] || styles.pending;
  };

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.tour?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488]/20" />
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488] border-t-transparent animate-spin" />
        </div>
        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading bookings...</p>
      </div>
    );
  }

  const statusCounts = {
    all: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* HEADER - Updated with AI Tour colors */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#F59E0B] flex items-center justify-center shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-[#374151] dark:text-white">
                Bookings
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Manage all traveler bookings
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Sparkles className="w-4 h-4 text-[#0D9488]" />
          <span>{bookings.length} total bookings</span>
        </div>
      </div>

      {/* SEARCH & FILTER - Updated with AI Tour colors */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by tour, traveler name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition outline-none"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-12 px-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none"
          >
            <option value="all">All ({statusCounts.all})</option>
            <option value="confirmed">Confirmed ({statusCounts.confirmed})</option>
            <option value="pending">Pending ({statusCounts.pending})</option>
            <option value="cancelled">Cancelled ({statusCounts.cancelled})</option>
          </select>
        </div>
      </div>

      {/* EMPTY STATE */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-16 text-center border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="w-20 h-20 rounded-full bg-[#0D9488]/10 flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-10 h-10 text-[#0D9488]" />
          </div>
          <h2 className="text-2xl font-bold text-[#374151] dark:text-white">
            No Bookings Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Bookings will appear here once travelers make reservations'}
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          {filteredBookings.map((booking) => {
            const statusStyle = getStatusStyle(booking.status);
            const paymentStyle = getPaymentStyle(booking.paymentStatus);
            const StatusIcon = statusStyle.icon;

            return (
              <div
                key={booking._id}
                className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                  
                  {/* LEFT */}
                  <div className="space-y-4 flex-1">
                    <div>
                      <h2 className="text-xl font-bold text-[#374151] dark:text-white">
                        {booking.tour?.title || 'Tour'}
                      </h2>
                      <div className="flex flex-wrap items-center gap-4 mt-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <User className="w-4 h-4 text-[#0D9488]" />
                          Traveler: {booking.fullName}
                        </p>
                        {booking.email && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Mail className="w-4 h-4 text-[#F59E0B]" />
                            {booking.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* DATE */}
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Travel Date</p>
                        <h3 className="font-semibold text-[#374151] dark:text-white">
                          {new Date(booking.travelDate).toLocaleDateString()}
                        </h3>
                      </div>

                      {/* PRICE */}
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
                        <h3 className="font-semibold text-[#0D9488]">
                          ${booking.tour?.price || 0}
                        </h3>
                      </div>

                      {/* PAYMENT */}
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Payment</p>
                        <div className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold mt-1 ${paymentStyle.bg} ${paymentStyle.text}`}>
                          {booking.paymentStatus || 'Pending'}
                        </div>
                      </div>

                      {/* STATUS */}
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                        <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold mt-1 ${statusStyle.bg} ${statusStyle.text}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusStyle.label}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ACTIONS - Updated with AI Tour colors */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="px-5 h-11 rounded-2xl bg-gradient-to-r from-[#0D9488] to-[#0f766e] hover:scale-[1.02] text-white font-semibold transition-all duration-300 flex items-center gap-2 shadow-md shadow-[#0D9488]/25"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>

                    {booking.status !== 'cancelled' && (
                      <button
                        className="px-5 h-11 rounded-2xl border-2 border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 font-semibold flex items-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Cancel
                      </button>
                    )}
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
                  <p className="text-sm text-gray-500">Tour</p>
                  <p className="font-semibold text-[#374151] dark:text-white">
                    {selectedBooking.tour?.title}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <p className="text-sm text-gray-500">Traveler</p>
                  <p className="font-semibold text-[#374151] dark:text-white">
                    {selectedBooking.fullName}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold text-[#374151] dark:text-white">
                    {selectedBooking.email}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-semibold text-[#374151] dark:text-white">
                    {selectedBooking.phone || 'N/A'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <p className="text-sm text-gray-500">Travel Date</p>
                  <p className="font-semibold text-[#374151] dark:text-white">
                    {new Date(selectedBooking.travelDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <p className="text-sm text-gray-500">Travelers</p>
                  <p className="font-semibold text-[#374151] dark:text-white">
                    {selectedBooking.travelers}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-semibold text-[#0D9488]">
                    ${selectedBooking.tour?.price || 0}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <p className="text-sm text-gray-500">Booking ID</p>
                  <p className="font-mono font-semibold text-[#0D9488] text-xs">
                    {selectedBooking._id?.slice(0, 12)}...
                  </p>
                </div>
              </div>
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

export default Bookings;