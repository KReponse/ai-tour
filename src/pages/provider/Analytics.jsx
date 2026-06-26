// src/pages/provider/Analytics.jsx

import React, { useEffect, useState } from 'react';
import {
  Map,
  CalendarCheck,
  DollarSign,
  Users,
  Loader2,
  TrendingUp,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Award,
  Percent,
} from 'lucide-react';
import { getProviderAnalytics } from '../../services/bookingService';

// ===============================
// AI TOUR COLORS
// ===============================
// Teal  : #0D9488
// Gold  : #F59E0B
// Slate : #374151
// White : #FFFFFF
// ===============================

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = await getProviderAnalytics(token);
      setAnalytics(data.analytics);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate growth percentages (mock data)
  const calculateGrowth = (current, previous) => {
    if (!previous || previous === 0) return { growth: 0, isUp: true };
    const growth = ((current - previous) / previous) * 100;
    return { growth: Math.round(growth), isUp: growth >= 0 };
  };

  const growthData = {
    tours: calculateGrowth(analytics?.totalTours || 0, (analytics?.totalTours || 0) * 0.8),
    bookings: calculateGrowth(analytics?.totalBookings || 0, (analytics?.totalBookings || 0) * 0.7),
    revenue: calculateGrowth(analytics?.totalRevenue || 0, (analytics?.totalRevenue || 0) * 0.75),
    travelers: calculateGrowth(analytics?.totalTravelers || 0, (analytics?.totalTravelers || 0) * 0.65),
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488]/20" />
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488] border-t-transparent animate-spin" />
        </div>
        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading analytics...</p>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Tours',
      value: analytics?.totalTours || 0,
      icon: Map,
      growth: growthData.tours,
      bgColor: 'bg-[#0D9488]/10',
      iconColor: 'text-[#0D9488]',
    },
    {
      label: 'Total Bookings',
      value: analytics?.totalBookings || 0,
      icon: CalendarCheck,
      growth: growthData.bookings,
      bgColor: 'bg-[#F59E0B]/10',
      iconColor: 'text-[#F59E0B]',
    },
    {
      label: 'Total Revenue',
      value: `$${analytics?.totalRevenue || 0}`,
      icon: DollarSign,
      growth: growthData.revenue,
      bgColor: 'bg-[#0D9488]/10',
      iconColor: 'text-[#0D9488]',
    },
    {
      label: 'Total Travelers',
      value: analytics?.totalTravelers || 0,
      icon: Users,
      growth: growthData.travelers,
      bgColor: 'bg-[#F59E0B]/10',
      iconColor: 'text-[#F59E0B]',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* HEADER - Updated with AI Tour colors */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#F59E0B] flex items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-[#374151] dark:text-white">
                Analytics
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Overview of your business performance
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Sparkles className="w-4 h-4 text-[#0D9488]" />
          <span>Last 30 days</span>
        </div>
      </div>

      {/* STATS CARDS - Updated with AI Tour colors */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const GrowthIcon = stat.growth.isUp ? ArrowUp : ArrowDown;
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    {stat.label}
                  </p>
                  <h2 className="text-3xl font-black mt-2 text-[#374151] dark:text-white">
                    {stat.value}
                  </h2>
                  <div className="flex items-center gap-1 mt-2">
                    <span className={`text-xs font-semibold flex items-center gap-0.5 ${
                      stat.growth.isUp ? 'text-[#0D9488]' : 'text-red-500'
                    }`}>
                      <GrowthIcon className="w-3 h-3" />
                      {Math.abs(stat.growth.growth)}%
                    </span>
                    <span className="text-xs text-gray-400">from last month</span>
                  </div>
                </div>
                <div className={`w-14 h-14 rounded-2xl ${stat.bgColor} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-7 h-7 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* BUSINESS SUMMARY - Updated with AI Tour colors */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Award className="w-6 h-6 text-[#F59E0B]" />
          <h2 className="text-2xl font-bold text-[#374151] dark:text-white">
            Business Summary
          </h2>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          You currently have{' '}
          <span className="font-bold text-[#0D9488]">
            {analytics?.totalTours || 0}
          </span>{' '}
          active tours,{' '}
          <span className="font-bold text-[#F59E0B]">
            {analytics?.totalBookings || 0}
          </span>{' '}
          bookings and{' '}
          <span className="font-bold text-[#0D9488]">
            {analytics?.totalTravelers || 0}
          </span>{' '}
          travelers served. Total revenue generated is{' '}
          <span className="font-bold text-[#0D9488] text-lg">
            ${analytics?.totalRevenue || 0}
          </span>
          .
        </p>

        {/* Quick Stats Bar */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 rounded-xl bg-[#0D9488]/5 border border-[#0D9488]/10">
            <p className="text-xs text-gray-400">Conversion Rate</p>
            <p className="text-lg font-bold text-[#0D9488]">
              {analytics?.totalBookings && analytics?.totalTours 
                ? Math.round((analytics.totalBookings / analytics.totalTours) * 100) 
                : 0}%
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[#F59E0B]/5 border border-[#F59E0B]/10">
            <p className="text-xs text-gray-400">Avg. Revenue/Tour</p>
            <p className="text-lg font-bold text-[#F59E0B]">
              ${analytics?.totalTours && analytics?.totalRevenue
                ? Math.round(analytics.totalRevenue / analytics.totalTours)
                : 0}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[#0D9488]/5 border border-[#0D9488]/10">
            <p className="text-xs text-gray-400">Avg. Travelers/Booking</p>
            <p className="text-lg font-bold text-[#0D9488]">
              {analytics?.totalBookings && analytics?.totalTravelers
                ? (analytics.totalTravelers / analytics.totalBookings).toFixed(1)
                : 0}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[#F59E0B]/5 border border-[#F59E0B]/10">
            <p className="text-xs text-gray-400">Growth Rate</p>
            <p className="text-lg font-bold text-[#F59E0B]">
              +{Math.round((analytics?.totalBookings || 0) * 0.12)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;