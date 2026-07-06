// src/components/provider/ProviderMobileNavbar.jsx

import React from "react";
import {
  Menu,
  Bell,
  UserCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";

// ===============================
// AI TOUR COLORS
// ===============================
// Teal  : #0D9488
// Gold  : #F59E0B
// Slate : #374151
// White : #FFFFFF
// ===============================

const ProviderMobileNavbar = ({
  onMenuClick,
  unreadCount = 0,
  onNotificationClick,
  user,
}) => {
  const navigate = useNavigate();

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 h-16 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="h-full px-4 flex items-center justify-between">
        
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="w-11 h-11 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:scale-105 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
          >
            <Menu className="w-5 h-5 text-gray-700 dark:text-white" />
          </button>

          {/* LOGO */}
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="AI Tour"
              className="w-10 h-10 object-contain"
            />

            <div>
              <h1 className="text-lg font-black bg-gradient-to-r from-[#0D9488] to-[#F59E0B] bg-clip-text text-transparent leading-none">
                AI Tour
              </h1>

              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                Provider Center
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          <button
            onClick={onNotificationClick}
            className="relative w-11 h-11 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:scale-105 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
          >
            <Bell className="w-5 h-5 text-gray-700 dark:text-white" />
            
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center border-2 border-white dark:border-gray-950 animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* PROFILE */}
          {user ? (
            <button
              onClick={() => navigate("/provider/profile")}
              className="relative group"
            >
              <img
                src={user.avatar || "/default-avatar.png"}
                alt={user.name || "Profile"}
                className="w-11 h-11 rounded-2xl object-cover border-2 border-[#0D9488] group-hover:border-[#F59E0B] transition-all duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${user?.name || 'Provider'}&background=0D9488&color=fff&size=44`;
                }}
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-950">
                <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
              </span>
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="w-11 h-11 rounded-2xl bg-gradient-to-r from-[#0D9488] to-[#F59E0B] flex items-center justify-center text-white shadow-lg shadow-[#0D9488]/30 hover:scale-105 transition-all duration-300"
            >
              <UserCircle size={25} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default ProviderMobileNavbar;