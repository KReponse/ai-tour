// src/pages/Notifications.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import { 
  Bell, 
  Calendar, 
  Star, 
  Gift, 
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  Mail,
  Users,
  TrendingUp,
  AlertCircle,
  Check,
} from "lucide-react";
import io from "socket.io-client";
import Card, { CardContent } from "../components/ui/Card";

// ===============================
// AI TOUR COLORS
// ===============================
// Teal  : #0D9488
// Gold  : #F59E0B
// Slate : #374151
// White : #FFFFFF
// ===============================

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const socket = io(import.meta.env.VITE_API_URL || "http://localhost:5000");

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingRead, setMarkingRead] = useState(null);

  const token = localStorage.getItem("token");

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const user = JSON.parse(localStorage.getItem("user"));
    if (user?._id) {
      socket.emit("join", user._id);
    }

    socket.on("notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socket.off("notification");
      socket.disconnect();
    };
  }, []);

  const markRead = async (id) => {
    try {
      setMarkingRead(id);
      await axios.patch(
        `${API}/notifications/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        )
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);
    } finally {
      setMarkingRead(null);
    }
  };

  const markAllRead = async () => {
    try {
      await axios.patch(
        `${API}/notifications/read-all`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    const icons = {
      booking: Calendar,
      payment: CreditCard,
      review: Star,
      tour: Compass,
      provider: Users,
      promotion: Gift,
      system: Bell,
      alert: AlertCircle,
    };
    return icons[type] || Bell;
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px]">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488]/20" />
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488] border-t-transparent animate-spin" />
        </div>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 px-4 py-6">
      {/* HEADER - Updated with AI Tour colors */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#F59E0B] flex items-center justify-center shadow-lg">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#374151] dark:text-white">
                Notifications
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Real-time updates from system
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <span className="px-3 py-1.5 rounded-full bg-[#0D9488]/10 text-[#0D9488] text-xs font-bold">
              {unreadCount} unread
            </span>
          )}
          {notifications.some(n => !n.isRead) && (
            <button
              onClick={markAllRead}
              className="text-sm text-[#0D9488] hover:text-[#0D9488]/80 font-medium transition flex items-center gap-1"
            >
              <Check className="w-4 h-4" />
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* NOTIFICATIONS LIST */}
      {notifications.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-[#0D9488]/10 flex items-center justify-center mx-auto mb-4">
            <Bell className="w-10 h-10 text-[#0D9488]" />
          </div>
          <h2 className="text-2xl font-bold text-[#374151] dark:text-white mb-2">
            No Notifications
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            You're all caught up! Check back later for updates.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            const Icon = getNotificationIcon(n.type);
            const isUnread = !n.isRead;

            return (
              <Card
                key={n._id}
                className={`transition-all duration-300 hover:shadow-md ${
                  isUnread ? 'border-l-[3px] border-l-[#0D9488]' : 'opacity-75'
                }`}
              >
                <CardContent className="p-4 flex gap-4 items-start">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isUnread 
                      ? 'bg-[#0D9488]/10 dark:bg-[#0D9488]/20' 
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      isUnread ? 'text-[#0D9488]' : 'text-gray-400 dark:text-gray-500'
                    }`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`font-semibold text-sm ${
                        isUnread ? 'text-[#374151] dark:text-white' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {n.title}
                      </h3>
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-[#0D9488] animate-pulse" />
                      )}
                    </div>
                    <p className={`text-sm mt-0.5 ${
                      isUnread ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'
                    }`}>
                      {n.message}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* Actions */}
                  {isUnread && (
                    <button
                      onClick={() => markRead(n._id)}
                      disabled={markingRead === n._id}
                      className="text-xs text-[#0D9488] hover:text-[#0D9488]/80 font-medium transition flex-shrink-0 disabled:opacity-50"
                    >
                      {markingRead === n._id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        'Mark read'
                      )}
                    </button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;