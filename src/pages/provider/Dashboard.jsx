// src/pages/provider/Dashboard.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  CalendarCheck,
  Wallet,
  MapPin,
  ArrowUpRight,
  Loader2,
  Sparkles,
  Plus,
  TrendingUp,
  BarChart3,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { getProviderStats, getRecentRequests } from '../../services/providerService';

// ===============================
// AI TOUR COLORS
// ===============================
// Teal  : #0D9488
// Gold  : #F59E0B
// Slate : #374151
// White : #FFFFFF
// ===============================

const Dashboard = () => {
  const navigate = useNavigate();
  const [providerStats, setProviderStats] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const analyticsResponse = await getProviderStats();
        const bookingsResponse = await getRecentRequests();

        const analytics = analyticsResponse?.analytics || {};

        setProviderStats([
          { title: "Total Bookings", value: analytics.totalBookings || 0, growth: "+12%" },
          { title: "Travelers", value: analytics.totalTravelers || 0, growth: "+8%" },
          { title: "Tours", value: analytics.totalTours || 0, growth: "+5%" },
          { title: "Revenue", value: `$${analytics.totalRevenue || 0}`, growth: "+15%" },
        ]);

        setRecentRequests(bookingsResponse?.bookings || []);
      } catch (error) {
        console.error("Dashboard Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const iconMap = {
    "Total Bookings": CalendarCheck,
    "Travelers": Users,
    "Tours": MapPin,
    "Revenue": Wallet,
  };

  const colors = [
    "from-[#0D9488] to-[#0f766e]",
    "from-[#F59E0B] to-[#d97706]",
    "from-[#0D9488] to-[#0f766e]",
    "from-[#F59E0B] to-[#d97706]",
  ];

  const getStatusBadge = (status) => {
    const styles = {
      confirmed: { bg: 'bg-[#0D9488]/10', text: 'text-[#0D9488]', icon: CheckCircle },
      pending: { bg: 'bg-[#F59E0B]/10', text: 'text-[#F59E0B]', icon: Clock },
      cancelled: { bg: 'bg-red-100', text: 'text-red-600', icon: XCircle },
    };
    return styles[status] || styles.pending;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488]/20" />
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488] border-t-transparent animate-spin" />
        </div>
        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">

      {/* HEADER - Updated with AI Tour colors */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#F59E0B] flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-[#374151] dark:text-white">
                Provider Dashboard
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Welcome back to AI Tour Rwanda
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/provider/add-tour')}
          className="h-12 px-6 rounded-2xl bg-gradient-to-r from-[#0D9488] to-[#F59E0B] text-white font-semibold shadow-lg shadow-[#0D9488]/30 hover:scale-105 transition-all duration-300 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create New Tour
        </button>
      </div>

      {/* STATS - Updated with AI Tour colors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {Array.isArray(providerStats) && providerStats.map((item, index) => {
          const Icon = iconMap[item.title];
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {item.title}
                  </p>
                  <h2 className="text-3xl font-black text-[#374151] dark:text-white mt-2">
                    {item.value}
                  </h2>
                </div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white bg-gradient-to-r ${colors[index]} shadow-lg`}>
                  {Icon && <Icon className="w-7 h-7" />}
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2 text-[#0D9488] text-sm font-medium bg-[#0D9488]/5 px-3 py-1.5 rounded-full w-fit">
                <ArrowUpRight className="w-4 h-4" />
                <span>{item.growth}</span>
                <span className="text-gray-400 text-xs">vs last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* RECENT BOOKINGS - Updated with AI Tour colors */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#0D9488]/10 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5 text-[#0D9488]" />
            </div>
            <h2 className="text-2xl font-black text-[#374151] dark:text-white">
              Recent Bookings
            </h2>
          </div>
          <button
            onClick={() => navigate('/provider/bookings')}
            className="text-sm text-[#0D9488] hover:text-[#0D9488]/80 font-medium flex items-center gap-1 transition"
          >
            View All
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {recentRequests.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <CalendarCheck className="w-8 h-8 text-gray-400" />
            </div>
            <p className="font-medium">No bookings yet</p>
            <p className="text-sm">Bookings will appear here once travelers make reservations</p>
          </div>
        ) : (
          <div className="space-y-3">
            {Array.isArray(recentRequests) && recentRequests.slice(0, 5).map((item) => {
              const statusStyle = getStatusBadge(item.status);
              const StatusIcon = statusStyle.icon;
              
              return (
                <div
                  key={item._id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-[#374151] dark:text-white">
                        {item.tour?.title || "Tour"}
                      </h3>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                        <StatusIcon className="w-3 h-3" />
                        {item.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Traveler: {item.user?.name || item.fullName || "Unknown"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(item.travelDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-4 py-1.5 rounded-full bg-[#0D9488]/10 text-[#0D9488] text-sm font-bold">
                      ${item.totalPrice || item.tour?.price || 0}
                    </span>
                    <button
                      onClick={() => navigate(`/provider/bookings/${item._id}`)}
                      className="p-2 rounded-xl hover:bg-[#0D9488]/10 transition"
                    >
                      <Eye className="w-4 h-4 text-gray-400 hover:text-[#0D9488]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => navigate('/provider/tours')}
          className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-[#0D9488] transition-all duration-300 hover:shadow-lg"
        >
          <MapPin className="w-6 h-6 text-[#0D9488] mx-auto mb-2" />
          <p className="text-sm font-semibold text-[#374151] dark:text-white">My Tours</p>
        </button>
        <button
          onClick={() => navigate('/provider/add-tour')}
          className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-[#F59E0B] transition-all duration-300 hover:shadow-lg"
        >
          <Plus className="w-6 h-6 text-[#F59E0B] mx-auto mb-2" />
          <p className="text-sm font-semibold text-[#374151] dark:text-white">Add Tour</p>
        </button>
        <button
          onClick={() => navigate('/provider/analytics')}
          className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-[#0D9488] transition-all duration-300 hover:shadow-lg"
        >
          <TrendingUp className="w-6 h-6 text-[#0D9488] mx-auto mb-2" />
          <p className="text-sm font-semibold text-[#374151] dark:text-white">Analytics</p>
        </button>
        <button
          onClick={() => navigate('/provider/profile')}
          className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-[#F59E0B] transition-all duration-300 hover:shadow-lg"
        >
          <Users className="w-6 h-6 text-[#F59E0B] mx-auto mb-2" />
          <p className="text-sm font-semibold text-[#374151] dark:text-white">Profile</p>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;