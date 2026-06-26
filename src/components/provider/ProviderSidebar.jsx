// src/components/provider/ProviderSidebar.jsx

import React from 'react';
import {
  LayoutDashboard,
  CalendarClock,
  CalendarCheck,
  Users,
  BarChart3,
  Wallet,
  Star,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Map,
  X,
  Sparkles,
  TrendingUp,
  Home,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

// ===============================
// AI TOUR COLORS
// ===============================
// Teal  : #0D9488
// Gold  : #F59E0B
// Slate : #374151
// White : #FFFFFF
// ===============================

const ProviderSidebar = ({
  collapsed,
  onToggle,
  mobile,
  onClose,
}) => {
  const navItems = [
    { name: 'Dashboard', path: '/provider/dashboard', icon: LayoutDashboard },
    { name: 'Requests', path: '/provider/requests', icon: CalendarClock },
    { name: 'Bookings', path: '/provider/bookings', icon: CalendarCheck },
    { name: 'Travelers', path: '/provider/travelers', icon: Users },
    { name: 'Analytics', path: '/provider/analytics', icon: TrendingUp },
    { name: 'Earnings', path: '/provider/earnings', icon: Wallet },
    { name: 'Reviews', path: '/provider/reviews', icon: Star },
    { name: 'My Tours', path: '/provider/tours', icon: Map },
    { name: 'Add Tour', path: '/provider/add-tour', icon: PlusCircle },
    { name: 'Profile', path: '/provider/profile', icon: User },
    { name: 'Settings', path: '/provider/settings', icon: Settings },
  ];

  return (
    <aside
      className={clsx(
        `
        fixed
        left-0
        top-0
        md:top-16
        h-screen
        md:h-[calc(100vh-4rem)]
        bg-white/95
        dark:bg-gray-950/95
        backdrop-blur-2xl
        border-r
        border-gray-200
        dark:border-gray-800
        shadow-2xl
        transition-all
        duration-300
        z-50
        overflow-hidden
        flex
        flex-col
        `,
        mobile ? 'w-72' : collapsed ? 'w-20' : 'w-72'
      )}
    >
      {/* ================= HEADER - Updated with AI Tour colors ================= */}
      <div className="px-5 py-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        {!collapsed || mobile ? (
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0D9488] to-[#F59E0B] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-black bg-gradient-to-r from-[#0D9488] to-[#F59E0B] bg-clip-text text-transparent">
                Provider Panel
              </h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-10">
              AI Tour Rwanda
            </p>
          </div>
        ) : (
          <div className="mx-auto">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#F59E0B] flex items-center justify-center shadow-md shadow-[#0D9488]/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
        )}

        {/* MOBILE CLOSE */}
        {mobile && (
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <X className="w-5 h-5 dark:text-white" />
          </button>
        )}
      </div>

      {/* ================= NAVIGATION - Updated with AI Tour colors ================= */}
      <div className="flex-1 overflow-y-auto py-5 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (mobile && onClose) onClose();
              }}
              className={({ isActive }) =>
                clsx(
                  `
                  relative
                  flex
                  items-center
                  rounded-2xl
                  transition-all
                  duration-300
                  px-4
                  py-3
                  group
                  overflow-hidden
                  `,
                  isActive
                    ? `
                      bg-[#0D9488]/10
                      text-[#0D9488]
                      dark:bg-[#0D9488]/20
                      shadow-md
                      shadow-[#0D9488]/10
                    `
                    : `
                      text-gray-700
                      dark:text-gray-300
                      hover:bg-[#0D9488]/5
                      dark:hover:bg-[#0D9488]/10
                      hover:text-[#0D9488]
                    `,
                  collapsed && !mobile ? 'justify-center' : 'gap-4'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={clsx(
                      'w-5 h-5 transition-all duration-300 group-hover:scale-110 flex-shrink-0',
                      isActive ? 'text-[#0D9488]' : 'text-gray-500 dark:text-gray-400 group-hover:text-[#0D9488]'
                    )}
                  />
                  {(!collapsed || mobile) && (
                    <span
                      className={clsx(
                        'font-semibold text-sm truncate transition-colors duration-300',
                        isActive ? 'text-[#0D9488]' : 'text-gray-700 dark:text-gray-300 group-hover:text-[#0D9488]'
                      )}
                    >
                      {item.name}
                    </span>
                  )}
                  {isActive && !collapsed && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-[#0D9488]" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* ================= FOOTER ================= */}
      {!mobile && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={onToggle}
            className="
              hidden
              md:flex
              items-center
              justify-center
              w-full
              h-12
              rounded-2xl
              bg-gray-100
              dark:bg-gray-800
              hover:bg-[#0D9488]/10
              dark:hover:bg-[#0D9488]/20
              hover:text-[#0D9488]
              transition-all
              duration-300
              group
            "
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5 dark:text-white group-hover:text-[#0D9488] transition" />
            ) : (
              <ChevronLeft className="w-5 h-5 dark:text-white group-hover:text-[#0D9488] transition" />
            )}
          </button>
        </div>
      )}
    </aside>
  );
};

export default ProviderSidebar;