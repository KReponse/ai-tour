// src/components/layout/Sidebar.jsx

import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Compass,
  Bot,
  CalendarCheck,
  Plane,
  Star,
  User,
  Bell,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Shield,
  FileCheck,
  Settings,
  LayoutDashboard,
  TrendingUp,
} from "lucide-react";
import clsx from "clsx";
import { useAuth } from "../../contexts/AuthContext";

// ===============================
// AI TOUR COLORS
// ===============================
// Teal  : #0D9488
// Gold  : #F59E0B
// Slate : #374151
// White : #FFFFFF
// ===============================

const Sidebar = ({ collapsed, onToggle }) => {
  const { user } = useAuth();

  /*
  =========================
  TRAVELER LINKS
  =========================
  */
  const travelerLinks = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/explore", icon: Compass, label: "Explore" },
    { path: "/ai-planner", icon: Bot, label: "AI Planner" },
    { path: "/my-bookings", icon: CalendarCheck, label: "My Bookings" },
    { path: "/trips", icon: Plane, label: "Trips" },
    { path: "/reviews", icon: Star, label: "Reviews" },
    { path: "/profile", icon: User, label: "Profile" },
    { path: "/notifications", icon: Bell, label: "Notifications" },
    { path: "/provider/request", icon: Briefcase, label: "Become Provider" },
  ];

  /*
  =========================
  PROVIDER LINKS
  =========================
  */
  const providerLinks = [
    { path: "/provider", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/provider/tours", icon: Compass, label: "My Tours" },
    { path: "/provider/add-tour", icon: Briefcase, label: "Add Tour" },
    { path: "/provider/bookings", icon: CalendarCheck, label: "Bookings" },
    { path: "/provider/travelers", icon: User, label: "Travelers" },
    { path: "/provider/analytics", icon: TrendingUp, label: "Analytics" },
    { path: "/provider/profile", icon: User, label: "Profile" },
    { path: "/provider/settings", icon: Settings, label: "Settings" },
  ];

  /*
  =========================
  ADMIN LINKS
  =========================
  */
  const adminLinks = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/users", icon: User, label: "Users" },
    { path: "/admin/providers", icon: Shield, label: "Providers" },
    { path: "/admin/provider-requests", icon: FileCheck, label: "Provider Requests" },
    { path: "/admin/tours", icon: Compass, label: "Tours" },
    { path: "/admin/notifications", icon: Bell, label: "Notifications" },
  ];

  let navItems = travelerLinks;

  if (user?.role === "provider") {
    navItems = providerLinks;
  }

  if (user?.role === "admin") {
    navItems = adminLinks;
  }

  return (
    <aside
      className={clsx(
        "fixed left-0 top-16 h-[calc(100vh-4rem)]",
        "bg-white/80 dark:bg-gray-900/80",
        "backdrop-blur-md",
        "border-r",
        "border-gray-200 dark:border-gray-700",
        "transition-all duration-300 z-40",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 py-6">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  "flex items-center px-4 py-3 mx-2 my-1 rounded-xl",
                  "transition-all duration-200",
                  "hover:bg-[#0D9488]/10 dark:hover:bg-[#0D9488]/20",
                  isActive
                    ? "bg-[#0D9488]/10 dark:bg-[#0D9488]/20 text-[#0D9488] dark:text-[#0D9488]"
                    : "text-gray-700 dark:text-gray-300 hover:text-[#0D9488]",
                  collapsed ? "justify-center" : "space-x-3"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={clsx(
                      "w-5 h-5 transition-colors",
                      isActive
                        ? "text-[#0D9488]"
                        : "text-gray-500 dark:text-gray-400 group-hover:text-[#0D9488]"
                    )}
                  />
                  {!collapsed && (
                    <span
                      className={clsx(
                        "font-medium transition-colors",
                        isActive
                          ? "text-[#0D9488]"
                          : "text-gray-700 dark:text-gray-300"
                      )}
                    >
                      {item.label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Collapse Toggle Button */}
        <button
          onClick={onToggle}
          className="
            hidden
            md:flex
            items-center
            justify-center
            p-2
            m-4
            rounded-xl
            hover:bg-[#0D9488]/10
            dark:hover:bg-[#0D9488]/20
            text-gray-500
            dark:text-gray-400
            hover:text-[#0D9488]
            transition
          "
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;