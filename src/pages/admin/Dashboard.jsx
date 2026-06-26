// src/pages/admin/AdminDashboard.jsx

import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  Users,
  UserCheck,
  MapPin,
  Calendar,
  Mail,
  TrendingUp,
  DollarSign,
  Loader2,
  Sparkles,
  Shield,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// ===============================
// AI TOUR COLORS
// ===============================
// Teal  : #0D9488
// Gold  : #F59E0B
// Slate : #374151
// White : #FFFFFF
// ===============================

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api/admin";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProviders: 0,
    totalTours: 0,
    totalBookings: 0,
    totalRequests: 0,
    totalRevenue: 0,
    pendingRequests: 0,
  });

  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${API}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(data.stats || {});
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488]/20" />
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488] border-t-transparent animate-spin" />
        </div>
        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading dashboard...</p>
      </div>
    );
  }

  // Cards with AI Tour colors
  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      gradient: "from-[#0D9488] to-[#0f766e]",
      textColor: "text-[#0D9488]",
    },
    {
      title: "Providers",
      value: stats.totalProviders,
      icon: UserCheck,
      gradient: "from-[#F59E0B] to-[#d97706]",
      textColor: "text-[#F59E0B]",
    },
    {
      title: "Tours",
      value: stats.totalTours,
      icon: MapPin,
      gradient: "from-[#0D9488] to-[#0f766e]",
      textColor: "text-[#0D9488]",
    },
    {
      title: "Bookings",
      value: stats.totalBookings,
      icon: Calendar,
      gradient: "from-[#F59E0B] to-[#d97706]",
      textColor: "text-[#F59E0B]",
    },
    {
      title: "Requests",
      value: stats.totalRequests,
      icon: Mail,
      gradient: "from-[#374151] to-[#1f2937]",
      textColor: "text-[#374151] dark:text-white",
    },
    {
      title: "Revenue",
      value: `$${stats.totalRevenue}`,
      icon: DollarSign,
      gradient: "from-[#0D9488] to-[#F59E0B]",
      textColor: "text-[#0D9488]",
    },
  ];

  const chartData = [
    { name: "Users", value: stats.totalUsers },
    { name: "Providers", value: stats.totalProviders },
    { name: "Tours", value: stats.totalTours },
    { name: "Bookings", value: stats.totalBookings },
  ];

  return (
    <div className="space-y-8 animate-fade-in">

      {/* HEADER - Updated with AI Tour colors */}
      <div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#F59E0B] flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[#374151] dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              AI Tour Rwanda platform overview
            </p>
          </div>
        </div>
      </div>

      {/* KPI CARDS - Updated with AI Tour colors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {card.title}
                  </p>
                  <h2 className={`text-3xl font-black mt-2 ${card.textColor}`}>
                    {card.value}
                  </h2>
                </div>
                <div
                  className={`p-4 rounded-2xl bg-gradient-to-r ${card.gradient} text-white group-hover:scale-110 transition-all duration-300 shadow-lg`}
                >
                  <Icon size={25} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CHART AREA */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* CHART - Updated with AI Tour colors */}
        <div className="xl:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-xl text-[#374151] dark:text-white">
              Platform Growth
            </h2>
            <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
              Overview
            </span>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  borderColor: '#e5e7eb',
                  borderRadius: '12px',
                  padding: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#0D9488"
                strokeWidth={4}
                dot={{ fill: '#0D9488', r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* SIDE PANEL - Updated with AI Tour colors */}
        <div className="space-y-6">
          {/* Revenue Card */}
          <div className="rounded-3xl p-6 text-white bg-gradient-to-br from-[#0D9488] to-[#F59E0B] shadow-lg shadow-[#0D9488]/30">
            <TrendingUp size={35} className="opacity-80" />
            <h2 className="text-2xl font-black mt-4">Revenue</h2>
            <p className="opacity-80 mt-2 text-sm">Current platform earnings</p>
            <h1 className="text-4xl font-black mt-5">${stats.totalRevenue}</h1>
          </div>

          {/* Pending Requests - Updated colors */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  Pending Requests
                </p>
                <h2 className="text-4xl font-black text-[#F59E0B] mt-3">
                  {stats.pendingRequests}
                </h2>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#F59E0B]/10 flex items-center justify-center">
                <Mail className="w-6 h-6 text-[#F59E0B]" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
              Awaiting review
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400">Total Revenue</p>
                <p className="text-lg font-bold text-[#0D9488]">${stats.totalRevenue}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Conversion Rate</p>
                <p className="text-lg font-bold text-[#F59E0B]">
                  {stats.totalUsers > 0 
                    ? Math.round((stats.totalBookings / stats.totalUsers) * 100) 
                    : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;