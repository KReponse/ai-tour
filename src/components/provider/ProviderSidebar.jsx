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
} from 'lucide-react';

import { NavLink } from 'react-router-dom';

import clsx from 'clsx';

const ProviderSidebar = ({
  collapsed,
  onToggle,
  mobile,
  onClose,
}) => {

  const navItems = [
    {
      name: 'Dashboard',
      path: '/provider/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Requests',
      path: '/provider/requests',
      icon: CalendarClock,
    },
    {
      name: 'Bookings',
      path: '/provider/bookings',
      icon: CalendarCheck,
    },
    {
      name: 'Travelers',
      path: '/provider/travelers',
      icon: Users,
    },
    {
      name: 'Analytics',
      path: '/provider/analytics',
      icon: BarChart3,
    },
    {
      name: 'Earnings',
      path: '/provider/earnings',
      icon: Wallet,
    },
    {
      name: 'Reviews',
      path: '/provider/reviews',
      icon: Star,
    },
    {
      name: 'Profile',
      path: '/provider/profile',
      icon: User,
    },
    {
      name: 'Settings',
      path: '/provider/settings',
      icon: Settings,
    },
    {
      name: 'Add Tour',
      path: '/provider/add-tour',
      icon: PlusCircle,
    },
    {
      name: 'My Tours',
      path: '/provider/tours',
      icon: Map,
    },
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
        bg-white/90
        dark:bg-gray-950/90
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
        mobile
          ? 'w-72'
          : collapsed
          ? 'w-20'
          : 'w-72'
      )}
    >

      {/* ================= HEADER ================= */}
      <div
        className="
          px-5
          py-6
          border-b
          border-gray-200
          dark:border-gray-800
          flex
          items-center
          justify-between
        "
      >

        {!collapsed || mobile ? (

          <div>

            <h2
              className="
                text-2xl
                font-black
                bg-gradient-to-r
                from-blue-600
                to-purple-600
                bg-clip-text
                text-transparent
              "
            >
              Provider Panel
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              AI Tour Rwanda
            </p>

          </div>

        ) : (

          <div className="mx-auto">

            <div
              className="
                w-11
                h-11
                rounded-2xl
                bg-gradient-to-r
                from-blue-600
                to-purple-600
              "
            />

          </div>

        )}

        {/* MOBILE CLOSE */}
        {mobile && (

          <button
            onClick={onClose}
            className="
              w-10
              h-10
              rounded-xl
              bg-gray-100
              dark:bg-gray-800
              flex
              items-center
              justify-center
            "
          >

            <X className="w-5 h-5 dark:text-white" />

          </button>

        )}

      </div>

      {/* ================= NAVIGATION ================= */}
      <div
        className="
          flex-1
          overflow-y-auto
          py-5
          px-3
          space-y-2
        "
      >

        {navItems.map((item) => (

          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => {
              if (mobile && onClose) {
                onClose();
              }
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
                    bg-gradient-to-r
                    from-blue-600
                    to-purple-600
                    text-white
                    shadow-lg
                  `
                  : `
                    text-gray-700
                    dark:text-gray-300
                    hover:bg-gray-100
                    dark:hover:bg-gray-800
                  `,
                collapsed && !mobile
                  ? 'justify-center'
                  : 'gap-4'
              )
            }
          >

            <item.icon
              className="
                w-5
                h-5
                transition-all
                duration-300
                group-hover:scale-110
                flex-shrink-0
              "
            />

            {(!collapsed || mobile) && (

              <span
                className="
                  font-semibold
                  text-sm
                  truncate
                "
              >
                {item.name}
              </span>

            )}

          </NavLink>

        ))}

      </div>

      {/* ================= FOOTER ================= */}
      {!mobile && (

        <div
          className="
            p-4
            border-t
            border-gray-200
            dark:border-gray-800
          "
        >

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
              hover:bg-gray-200
              dark:hover:bg-gray-700
              transition-all
            "
          >

            {collapsed ? (
              <ChevronRight className="w-5 h-5 dark:text-white" />
            ) : (
              <ChevronLeft className="w-5 h-5 dark:text-white" />
            )}

          </button>

        </div>

      )}

    </aside>

  );

};

export default ProviderSidebar;