// src/components/provider/ProviderNavbar.jsx

import React, {
  useState,
  useEffect,
  useRef,
} from "react";

import {
  Bell,
  Search,
  Moon,
  Sun,
  MessageCircle,
  Menu,
  ChevronDown,
  Settings,
  User,
  LogOut,
  PlusCircle,
  Sparkles,
  LayoutDashboard,
  ClipboardList, // ✅ Added for Listings
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../contexts/AuthContext";
import logo from "../../assets/images/logo.png";

// ===============================
// AI TOUR COLORS
// ===============================
// Teal  : #0D9488
// Gold  : #F59E0B
// Slate : #374151
// White : #FFFFFF
// ===============================

const ProviderNavbar = ({
  onMenuClick,
  unreadCount = 0,
  messageCount = 0,
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef();

  /* ================= DARK MODE ================= */
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  /* ================= CLOSE DROPDOWN ================= */
  useEffect(() => {
    const closeDropdown = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", closeDropdown);
    return () => document.removeEventListener("mousedown", closeDropdown);
  }, []);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="h-full px-4 lg:px-8 flex items-center justify-between">

        {/* ================= LEFT ================= */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden w-11 h-11 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:scale-105 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
          >
            <Menu className="w-5 h-5 dark:text-white" />
          </button>

          {/* LOGO */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/provider/dashboard")}
          >
            <img
              src={logo}
              alt="AI Tour"
              className="w-11 h-11 object-contain"
            />

            <div>
              <h1 className="text-xl font-black bg-gradient-to-r from-[#0D9488] to-[#F59E0B] bg-clip-text text-transparent">
                AI Tour
              </h1>

              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Provider Center
              </p>
            </div>
          </div>
        </div>

        {/* ================= SEARCH ================= */}
        <div className="hidden lg:flex flex-1 max-w-2xl mx-10">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              // ✅ Updated placeholder - Tours → Listings
              placeholder="Search listings, bookings, travelers..."
              className="w-full h-12 pl-12 rounded-2xl bg-gray-100 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-[#0D9488] dark:text-white transition placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="flex items-center gap-2 lg:gap-3">

          {/* DARK MODE */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-11 h-11 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:scale-105 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-[#F59E0B]" />
            ) : (
              <Moon className="w-5 h-5 dark:text-white" />
            )}
          </button>

          {/* MESSAGE */}
          <button
            onClick={() => navigate("/provider/messages")}
            className="relative w-11 h-11 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:scale-105 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
          >
            <MessageCircle className="w-5 h-5 dark:text-white" />
            {messageCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#0D9488] text-white text-xs font-bold flex items-center justify-center border-2 border-white dark:border-gray-950">
                {messageCount > 9 ? '9+' : messageCount}
              </span>
            )}
          </button>

          {/* NOTIFICATIONS */}
          <button
            onClick={() => navigate("/provider/notifications")}
            className="relative w-11 h-11 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:scale-105 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
          >
            <Bell className="w-5 h-5 dark:text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center border-2 border-white dark:border-gray-950 animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* PROFILE */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 px-3 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
            >
              <div className="relative">
                <img
                  src={user?.avatar || "/default-avatar.png"}
                  className="w-9 h-9 rounded-xl object-cover border-2 border-[#0D9488]"
                  alt="profile"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${user?.name || 'Provider'}&background=0D9488&color=fff&size=36`;
                  }}
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-900">
                  <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
                </span>
              </div>

              <div className="hidden md:block text-left">
                <h3 className="text-sm font-bold text-[#374151] dark:text-white">
                  {user?.name || "Provider"}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Service Provider {/* ✅ Updated from "Tour Provider" */}
                </p>
              </div>

              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* DROPDOWN */}
            {profileOpen && (
              <div className="absolute right-0 mt-3 w-64 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden">
                <div className="p-5 border-b border-gray-100 dark:border-gray-800">
                  <h3 className="font-black text-[#374151] dark:text-white">
                    {user?.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                </div>

                <div className="p-2 space-y-1">
                  <button
                    onClick={() => navigate("/provider/dashboard")}
                    className="w-full h-12 rounded-2xl flex items-center gap-3 hover:bg-[#0D9488]/10 dark:hover:bg-[#0D9488]/20 px-4 text-[#374151] dark:text-white transition-all duration-200"
                  >
                    <LayoutDashboard className="w-4 h-4 text-[#0D9488]" />
                    Dashboard
                  </button>

                  {/* ✅ NEW: My Listings */}
                  <button
                    onClick={() => navigate("/provider/listings")}
                    className="w-full h-12 rounded-2xl flex items-center gap-3 hover:bg-[#0D9488]/10 dark:hover:bg-[#0D9488]/20 px-4 text-[#374151] dark:text-white transition-all duration-200"
                  >
                    <ClipboardList className="w-4 h-4 text-[#0D9488]" />
                    My Listings
                  </button>

                  {/* ✅ UPDATED: Add Listing (replaces Add Tour) */}
                  <button
                    onClick={() => navigate("/provider/add-listing")}
                    className="w-full h-12 rounded-2xl flex items-center gap-3 hover:bg-[#0D9488]/10 dark:hover:bg-[#0D9488]/20 px-4 text-[#374151] dark:text-white transition-all duration-200"
                  >
                    <PlusCircle className="w-4 h-4 text-[#F59E0B]" />
                    Add Listing
                  </button>

                  <button
                    onClick={() => navigate("/provider/profile")}
                    className="w-full h-12 rounded-2xl flex items-center gap-3 hover:bg-[#0D9488]/10 dark:hover:bg-[#0D9488]/20 px-4 text-[#374151] dark:text-white transition-all duration-200"
                  >
                    <User className="w-4 h-4 text-[#0D9488]" />
                    Profile
                  </button>

                  <button
                    onClick={() => navigate("/provider/settings")}
                    className="w-full h-12 rounded-2xl flex items-center gap-3 hover:bg-[#0D9488]/10 dark:hover:bg-[#0D9488]/20 px-4 text-[#374151] dark:text-white transition-all duration-200"
                  >
                    <Settings className="w-4 h-4 text-gray-400" />
                    Settings
                  </button>

                  {/* ⚠️ LEGACY: Add Tour (kept for backward compatibility) */}
                  {/* Hidden from dropdown - users should use Add Listing */}

                  <div className="border-t border-gray-100 dark:border-gray-800 my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full h-12 rounded-2xl flex items-center gap-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default ProviderNavbar;