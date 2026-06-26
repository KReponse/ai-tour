// src/components/admin/AdminNavbar.jsx

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Bell,
  UserCircle,
  PanelLeft,
  ChevronDown,
  Sun,
  Moon,
  LogOut,
  Settings,
  Sparkles,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { useAuth } from "../../contexts/AuthContext";

// ===============================
// AI TOUR COLORS
// ===============================
// Teal  : #0D9488
// Gold  : #F59E0B
// Slate : #374151
// White : #FFFFFF
// ===============================

export default function AdminNavbar({
  collapsed,
  setCollapsed,
  onMobileMenu,
}) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [dark, setDark] = useState(
    localStorage.getItem("adminTheme") === "dark"
  );

  const profileRef = useRef();
  const notificationRef = useRef();

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("adminTheme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("adminTheme", "light");
    }
  }, [dark]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 transition-all duration-300 shadow-sm">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-4">
          {/* MENU */}
          <button
            onClick={() => {
              if (window.innerWidth < 1024) {
                onMobileMenu();
              } else {
                setCollapsed(!collapsed);
              }
            }}
            className="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-all duration-300 hover:scale-105"
          >
            <PanelLeft size={20} className="text-gray-700 dark:text-gray-300" />
          </button>

          {/* LOGO - Updated with AI Tour colors */}
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="logo"
              className="w-9 h-9 rounded-xl object-contain"
            />
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <h1 className="font-black bg-gradient-to-r from-[#0D9488] to-[#F59E0B] bg-clip-text text-transparent">
                  AI Tour Rwanda
                </h1>
                <Shield className="w-3.5 h-3.5 text-[#0D9488]" />
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                Admin Portal
              </p>
            </div>
          </div>

          {/* SEARCH */}
          <div className="hidden md:flex ml-5 items-center gap-3 bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 h-11 w-72 lg:w-96 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#0D9488] focus-within:bg-white dark:focus-within:bg-gray-900">
            <Search size={18} className="text-gray-500" />
            <input
              placeholder="Search dashboard..."
              className="bg-transparent outline-none w-full text-sm dark:text-white placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* THEME */}
          <button
            onClick={() => setDark(!dark)}
            className="w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-all duration-300 hover:scale-105"
          >
            {dark ? (
              <Sun size={19} className="text-[#F59E0B]" />
            ) : (
              <Moon size={19} className="text-gray-700 dark:text-gray-300" />
            )}
          </button>

          {/* NOTIFICATIONS */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="relative w-10 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-all duration-300 hover:scale-105"
            >
              <Bell size={20} className="text-gray-700 dark:text-gray-300" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border-2 border-white dark:border-gray-900" />
            </button>

            {notificationOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-4 z-50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-[#374151] dark:text-white">
                    Notifications
                  </h3>
                  <span className="text-xs text-[#0D9488] font-medium">Mark all read</span>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 text-center">
                  <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No new notifications
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* PROFILE - Updated with AI Tour colors */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 px-3 py-2 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0D9488] to-[#F59E0B] text-white flex items-center justify-center shadow-md shadow-[#0D9488]/25">
                <UserCircle size={22} />
              </div>

              <div className="hidden sm:block text-left">
                <p className="text-sm font-bold text-[#374151] dark:text-white">
                  {user?.name || "Admin"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Super Admin
                </p>
              </div>

              <ChevronDown size={16} className={`text-gray-500 transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 mb-2">
                  <p className="font-bold text-[#374151] dark:text-white">
                    {user?.name || "Admin"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user?.email || "admin@aitour.rw"}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/admin/settings");
                  }}
                  className="w-full flex gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition text-[#374151] dark:text-white"
                >
                  <Settings size={18} className="text-[#0D9488]" />
                  Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}