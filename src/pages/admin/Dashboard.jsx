import { useEffect, useState } from "react";
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

const API = "http://localhost:5000/api/admin";

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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats(data.stats || {});
    } catch (error) {
      console.log("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  const chartData = [
    { name: "Users", value: stats.totalUsers },
    { name: "Providers", value: stats.totalProviders },
    { name: "Tours", value: stats.totalTours },
    { name: "Bookings", value: stats.totalBookings },
  ];

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "from-blue-500 to-blue-700",
    },
    {
      title: "Providers",
      value: stats.totalProviders,
      icon: UserCheck,
      color: "from-green-500 to-green-700",
    },
    {
      title: "Tours",
      value: stats.totalTours,
      icon: MapPin,
      color: "from-purple-500 to-purple-700",
    },
    {
      title: "Bookings",
      value: stats.totalBookings,
      icon: Calendar,
      color: "from-orange-500 to-orange-700",
    },
    {
      title: "Requests",
      value: stats.totalRequests,
      icon: Mail,
      color: "from-pink-500 to-pink-700",
    },
    {
      title: "Revenue",
      value: `$${stats.totalRevenue}`,
      icon: DollarSign,
      color: "from-emerald-500 to-emerald-700",
    },
  ];

  return (
    <div className="p-6 space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Welcome back — here is your SaaS overview
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{card.title}</p>
                  <h2 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">
                    {card.value}
                  </h2>
                </div>

                <div
                  className={`p-3 rounded-xl bg-gradient-to-r ${card.color} text-white`}
                >
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Platform Overview
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* RIGHT STATS */}
        <div className="space-y-4">

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-5">
            <TrendingUp />
            <h3 className="text-xl font-bold mt-2">
              Revenue Growth
            </h3>
            <p className="text-sm opacity-80 mt-1">
              Real-time platform performance
            </p>
            <h2 className="text-2xl font-bold mt-3">
              ${stats.totalRevenue}
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Pending Requests
            </h3>
            <p className="text-3xl font-bold text-orange-500 mt-2">
              {stats.pendingRequests}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;