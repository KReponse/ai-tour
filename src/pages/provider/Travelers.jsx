// src/pages/provider/Travelers.jsx

import React, { useEffect, useState } from 'react';
import {
  Users,
  Loader2,
  Mail,
  Phone,
  Calendar,
  Search,
  Filter,
  ChevronDown,
  Sparkles,
  User,
  MapPin,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
} from 'lucide-react';
import { getProviderTravelers } from '../../services/bookingService';

// ===============================
// AI TOUR COLORS
// ===============================
// Teal  : #0D9488
// Gold  : #F59E0B
// Slate : #374151
// White : #FFFFFF
// ===============================

const Travelers = () => {
  const [travelers, setTravelers] = useState([]);
  const [filteredTravelers, setFilteredTravelers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTraveler, setSelectedTraveler] = useState(null);

  useEffect(() => {
    fetchTravelers();
  }, []);

  useEffect(() => {
    filterTravelers();
  }, [travelers, searchTerm]);

  const fetchTravelers = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = await getProviderTravelers(token);
      setTravelers(data.travelers || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filterTravelers = () => {
    if (!searchTerm) {
      setFilteredTravelers(travelers);
      return;
    }
    const filtered = travelers.filter(
      (t) =>
        t.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.tour?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTravelers(filtered);
  };

  const getPaymentBadge = (status) => {
    const styles = {
      paid: {
        bg: 'bg-[#0D9488]/10 dark:bg-[#0D9488]/20',
        text: 'text-[#0D9488] dark:text-[#0D9488]',
        icon: CheckCircle,
        label: 'Paid',
      },
      pending: {
        bg: 'bg-[#F59E0B]/10 dark:bg-[#F59E0B]/20',
        text: 'text-[#F59E0B] dark:text-[#F59E0B]',
        icon: Clock,
        label: 'Pending',
      },
      failed: {
        bg: 'bg-red-100 dark:bg-red-900/20',
        text: 'text-red-600 dark:text-red-400',
        icon: XCircle,
        label: 'Failed',
      },
    };
    return styles[status] || styles.pending;
  };

  const getStatusBadge = (status) => {
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488]/20" />
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488] border-t-transparent animate-spin" />
        </div>
        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading travelers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">

      {/* HEADER - Updated with AI Tour colors */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#F59E0B] flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-[#374151] dark:text-white">
                Travelers
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                All travelers who booked tours
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Sparkles className="w-4 h-4 text-[#0D9488]" />
          <span>{travelers.length} total travelers</span>
        </div>
      </div>

      {/* SEARCH - Updated with AI Tour colors */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email, phone, or tour..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-12 pl-12 pr-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition outline-none"
        />
      </div>

      {/* TABLE - Updated with AI Tour colors */}
      {filteredTravelers.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-16 text-center border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="w-20 h-20 rounded-full bg-[#0D9488]/10 flex items-center justify-center mx-auto mb-4">
            <Users className="w-10 h-10 text-[#0D9488]" />
          </div>
          <h2 className="text-2xl font-bold text-[#374151] dark:text-white">
            No Travelers Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {searchTerm ? 'Try adjusting your search' : 'Travelers will appear here once bookings are made'}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Traveler
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Tour
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Travel Date
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Payment
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTravelers.map((traveler) => {
                  const paymentStyle = getPaymentBadge(traveler.paymentStatus);
                  const statusStyle = getStatusBadge(traveler.status);
                  const PaymentIcon = paymentStyle.icon;
                  const StatusIcon = statusStyle.icon;

                  return (
                    <tr
                      key={traveler._id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200"
                    >
                      <td className="p-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0D9488] to-[#F59E0B] flex items-center justify-center text-white text-sm font-bold">
                              {traveler.fullName?.charAt(0) || 'T'}
                            </div>
                            <h3 className="font-bold text-[#374151] dark:text-white">
                              {traveler.fullName || 'Unknown'}
                            </h3>
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-10">
                            <div className="flex items-center gap-2">
                              <Mail size={14} className="text-[#0D9488]" />
                              {traveler.email || 'N/A'}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Phone size={14} className="text-[#F59E0B]" />
                              {traveler.phone || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 text-[#374151] dark:text-white">
                        {traveler.tour?.title || 'N/A'}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2 text-[#374151] dark:text-white">
                          <Calendar size={16} className="text-[#0D9488]" />
                          {traveler.travelDate
                            ? new Date(traveler.travelDate).toLocaleDateString()
                            : 'N/A'}
                        </div>
                      </td>

                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${paymentStyle.bg} ${paymentStyle.text}`}>
                          <PaymentIcon className="w-3.5 h-3.5" />
                          {paymentStyle.label}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusStyle.label}
                        </span>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => setSelectedTraveler(traveler)}
                          className="p-2 rounded-xl hover:bg-[#0D9488]/10 transition text-gray-400 hover:text-[#0D9488]"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
            <span>Showing {filteredTravelers.length} of {travelers.length} travelers</span>
            <span>Last updated: {new Date().toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Traveler Details Modal */}
      {selectedTraveler && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#374151] dark:text-white">
                Traveler Details
              </h2>
              <button
                onClick={() => setSelectedTraveler(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition"
              >
                <XCircle className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0D9488] to-[#F59E0B] flex items-center justify-center text-white text-2xl font-bold">
                  {selectedTraveler.fullName?.charAt(0) || 'T'}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#374151] dark:text-white">
                    {selectedTraveler.fullName}
                  </h3>
                  <p className="text-sm text-gray-500">{selectedTraveler.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-semibold text-[#374151] dark:text-white">
                    {selectedTraveler.phone || 'N/A'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <p className="text-sm text-gray-500">Tour</p>
                  <p className="font-semibold text-[#374151] dark:text-white">
                    {selectedTraveler.tour?.title || 'N/A'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <p className="text-sm text-gray-500">Travel Date</p>
                  <p className="font-semibold text-[#374151] dark:text-white">
                    {selectedTraveler.travelDate
                      ? new Date(selectedTraveler.travelDate).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <p className="text-sm text-gray-500">Travelers</p>
                  <p className="font-semibold text-[#374151] dark:text-white">
                    {selectedTraveler.travelers || 1}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <p className="text-sm text-gray-500">Booking ID</p>
                <p className="font-mono font-semibold text-[#0D9488] text-xs">
                  {selectedTraveler._id}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedTraveler(null)}
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

export default Travelers;