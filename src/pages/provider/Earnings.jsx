// src/pages/provider/Earnings.jsx

import React, { useEffect, useState } from 'react';
import {
  Wallet,
  CreditCard,
  Loader2,
  Users,
  TrendingUp,
  ArrowUpRight,
  Clock,
  CheckCircle,
  Sparkles,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { getProviderEarnings } from '../../services/bookingService';

// ===============================
// AI TOUR COLORS
// ===============================
// Teal  : #0D9488
// Gold  : #F59E0B
// Slate : #374151
// White : #FFFFFF
// ===============================

const Earnings = () => {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = await getProviderEarnings(token);
      setEarnings(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488]/20" />
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488] border-t-transparent animate-spin" />
        </div>
        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading earnings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">

      {/* HEADER - Updated with AI Tour colors */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#F59E0B] flex items-center justify-center shadow-lg">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-[#374151] dark:text-white">
                Earnings
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Track your revenue and payments
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Sparkles className="w-4 h-4 text-[#0D9488]" />
          <span>Last 30 days</span>
        </div>
      </div>

      {/* STATS - Updated with AI Tour colors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TOTAL EARNINGS */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                Total Earnings
              </p>
              <h2 className="text-4xl font-black text-[#0D9488] mt-2">
                ${earnings?.totalEarnings || 0}
              </h2>
              <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                <ArrowUpRight className="w-3 h-3" />
                <span>+12% from last month</span>
              </div>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-[#0D9488] to-[#0f766e] text-white flex items-center justify-center shadow-lg shadow-[#0D9488]/25">
              <Wallet className="w-7 h-7" />
            </div>
          </div>
        </div>

        {/* PAID BOOKINGS */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                Paid Bookings
              </p>
              <h2 className="text-4xl font-black text-[#F59E0B] mt-2">
                {earnings?.paidBookings || 0}
              </h2>
              <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                <ArrowUpRight className="w-3 h-3" />
                <span>+8% from last month</span>
              </div>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-[#F59E0B] to-[#d97706] text-white flex items-center justify-center shadow-lg shadow-[#F59E0B]/25">
              <Users className="w-7 h-7" />
            </div>
          </div>
        </div>

        {/* TRANSACTIONS */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                Transactions
              </p>
              <h2 className="text-4xl font-black text-[#374151] dark:text-white mt-2">
                {earnings?.bookings?.length || 0}
              </h2>
              <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                <ArrowUpRight className="w-3 h-3" />
                <span>+5% from last month</span>
              </div>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-[#374151] to-[#1f2937] text-white flex items-center justify-center shadow-lg shadow-[#374151]/25">
              <CreditCard className="w-7 h-7" />
            </div>
          </div>
        </div>
      </div>

      {/* RECENT TRANSACTIONS - Updated with AI Tour colors */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#0D9488]/10 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-[#0D9488]" />
            </div>
            <h2 className="text-2xl font-black text-[#374151] dark:text-white">
              Recent Transactions
            </h2>
          </div>
          <span className="text-sm text-gray-400">
            {earnings?.bookings?.length || 0} total
          </span>
        </div>

        {earnings?.bookings?.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-gray-400" />
            </div>
            <p className="font-medium">No transactions yet</p>
            <p className="text-sm">Transactions will appear once bookings are confirmed</p>
          </div>
        ) : (
          <div className="space-y-3">
            {earnings?.bookings?.map((booking) => (
              <div
                key={booking._id}
                className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#0D9488] to-[#F59E0B] text-white flex items-center justify-center shadow-md">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#374151] dark:text-white">
                      {booking.fullName || 'Traveler'}
                    </h3>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {booking.tour?.title || 'Tour'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="px-4 py-1.5 rounded-full bg-[#0D9488]/10 text-[#0D9488] dark:bg-[#0D9488]/20 dark:text-[#0D9488] font-bold text-sm">
                    ${booking.totalPrice || booking.tour?.price || 0}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#0D9488]/10 text-[#0D9488] text-xs font-semibold">
                    <CheckCircle className="w-3 h-3" />
                    Paid
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-[#0D9488]/5 to-[#F59E0B]/5 border border-[#0D9488]/20 rounded-3xl p-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-[#0D9488]" />
          <div>
            <h3 className="font-bold text-[#374151] dark:text-white">
              Earnings Summary
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total earnings of ${earnings?.totalEarnings || 0} from {earnings?.paidBookings || 0} paid bookings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earnings;