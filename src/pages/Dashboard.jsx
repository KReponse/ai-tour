// src/pages/Dashboard.jsx

import React, { useEffect, useState } from "react";
import {
  Calendar,
  Heart,
  User,
  Map,
  Loader2,
  Sparkles,
  TrendingUp,
  Briefcase,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getMyBookings } from "../services/bookingService";
import { getMyProviderRequest } from "../services/providerService";

// ===============================
// AI TOUR COLORS
// ===============================
// Teal  : #0D9488
// Gold  : #F59E0B
// Slate : #374151
// White : #FFFFFF
// ===============================

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [providerRequest, setProviderRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const bookingsData = await getMyBookings(token);
      setBookings(bookingsData.bookings || []);

      try {
        const providerData = await getMyProviderRequest();
        setProviderRequest(providerData.request);
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="relative w-20 h-20">
          <div className="w-20 h-20 rounded-full border-4 border-[#0D9488]/20" />
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488] border-t-transparent animate-spin" />
        </div>
        <p className="mt-6 text-lg font-semibold text-[#374151] dark:text-white">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#F59E0B] flex items-center justify-center shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-[#374151] dark:text-white">
                Welcome {user?.name || 'Traveler'}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#0D9488]" />
                Manage your travel experience
              </p>
            </div>
          </div>
        </div>

        {/* PROVIDER FLOW - Updated colors */}
        {user?.role === "traveler" && !providerRequest && (
          <div className="mb-10 rounded-3xl p-8 text-white bg-gradient-to-r from-[#0D9488] to-[#F59E0B] shadow-xl shadow-[#0D9488]/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h2 className="text-3xl font-black">Become A Provider</h2>
              </div>
              <p className="text-white/90 max-w-md">
                Offer tours and travel services on AI Tour and start earning.
              </p>
              <Link
                to="/provider/request"
                className="inline-block mt-5 px-8 py-3.5 rounded-xl bg-white text-[#0D9488] font-bold shadow-lg hover:scale-[1.02] transition-all duration-300"
              >
                Apply Now →
              </Link>
            </div>
          </div>
        )}

        {providerRequest?.status === "pending" && (
          <div className="mb-10 p-8 rounded-3xl bg-[#F59E0B]/10 border-2 border-[#F59E0B]/30 dark:bg-[#F59E0B]/20">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-8 h-8 text-[#F59E0B]" />
              <h2 className="text-2xl font-bold text-[#F59E0B]">
                Provider Application Pending
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Your application is currently under review by our team.
              We'll notify you once it's processed.
            </p>
          </div>
        )}

        {providerRequest?.status === "approved" && (
          <div className="mb-10 p-8 rounded-3xl bg-[#0D9488]/10 border-2 border-[#0D9488]/30 dark:bg-[#0D9488]/20">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="w-8 h-8 text-[#0D9488]" />
              <h2 className="text-2xl font-bold text-[#0D9488]">
                Provider Approved! 🎉
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Your provider account is active. Start managing your tours.
            </p>
            <Link
              to="/provider/dashboard"
              className="inline-block mt-4 px-8 py-3.5 rounded-xl bg-[#0D9488] text-white font-bold shadow-lg shadow-[#0D9488]/30 hover:scale-[1.02] transition-all duration-300"
            >
              Open Dashboard →
            </Link>
          </div>
        )}

        {providerRequest?.status === "rejected" && (
          <div className="mb-10 p-8 rounded-3xl bg-red-100 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-800">
            <div className="flex items-center gap-3 mb-3">
              <XCircle className="w-8 h-8 text-red-600" />
              <h2 className="text-2xl font-bold text-red-600">
                Application Rejected
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              {providerRequest.adminNotes || 'Please review your application and try again.'}
            </p>
            <Link
              to="/provider/request"
              className="inline-block mt-4 px-8 py-3.5 rounded-xl bg-red-600 text-white font-bold shadow-lg shadow-red-600/30 hover:scale-[1.02] transition-all duration-300"
            >
              Apply Again →
            </Link>
          </div>
        )}

        {/* STATS - Updated colors */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-[#0D9488]/10 flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-[#0D9488]" />
            </div>
            <h2 className="text-3xl font-bold text-[#374151] dark:text-white">
              {bookings.length}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">Total Bookings</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-red-500" />
            </div>
            <h2 className="text-3xl font-bold text-[#374151] dark:text-white">
              0
            </h2>
            <p className="text-gray-500 dark:text-gray-400">Favorites</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-[#F59E0B]/10 flex items-center justify-center mb-4">
              <Map className="w-6 h-6 text-[#F59E0B]" />
            </div>
            <h2 className="text-3xl font-bold text-[#374151] dark:text-white">
              {bookings.filter((b) => b.status === "confirmed").length}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">Confirmed Trips</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-[#0D9488]/10 flex items-center justify-center mb-4">
              <User className="w-6 h-6 text-[#0D9488]" />
            </div>
            <h2 className="text-xl font-bold text-[#374151] dark:text-white capitalize">
              {user?.role || 'Traveler'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">Account Type</p>
          </div>
        </div>

        {/* RECENT BOOKINGS SECTION */}
        {bookings.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#374151] dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#0D9488]" />
                Recent Bookings
              </h2>
              <Link to="/my-bookings" className="text-sm text-[#0D9488] hover:underline font-medium">
                View All →
              </Link>
            </div>
            <div className="space-y-4">
              {bookings.slice(0, 5).map((booking) => (
                <div key={booking._id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
                  <div>
                    <p className="font-semibold text-[#374151] dark:text-white">
                      {booking.tour?.title || 'Tour'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      booking.status === 'confirmed'
                        ? 'bg-[#0D9488]/10 text-[#0D9488]'
                        : booking.status === 'pending'
                        ? 'bg-[#F59E0B]/10 text-[#F59E0B]'
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {booking.status}
                    </span>
                    <Link
                      to={`/booking/${booking._id}`}
                      className="text-sm text-[#0D9488] hover:underline"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;