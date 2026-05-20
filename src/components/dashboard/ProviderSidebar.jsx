// src/components/dashboard/ProviderSidebar.jsx

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
} from 'lucide-react';

import { NavLink } from 'react-router-dom';

import clsx from 'clsx';

const ProviderSidebar = ({
  collapsed,
  onToggle,
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
  ];

  return (
    <aside
      className={clsx(
        `
        fixed
        left-0
        top-16
        h-[calc(100vh-4rem)]
        bg-white/90
        dark:bg-gray-950/90
        backdrop-blur-xl
        border-r
        border-gray-200
        dark:border-gray-800
        shadow-xl
        transition-all
        duration-300
        z-40
        overflow-hidden
        `,
        collapsed
          ? 'w-20'
          : 'w-72'
      )}
    >

      <div className="flex flex-col h-full">

        {/* HEADER */}
        <div className="px-4 py-6 border-b border-gray-200 dark:border-gray-800">

          {!collapsed ? (

            <div>

              <h2 className="text-xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Provider Panel
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                AI Tour Rwanda
              </p>

            </div>

          ) : (

            <div className="flex justify-center">

              <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600" />

            </div>

          )}
        </div>

        {/* NAVIGATION */}
        <div className="flex-1 overflow-y-auto py-5 px-3 space-y-2">

          {navItems.map((item) => (

            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  `
                  flex
                  items-center
                  rounded-2xl
                  transition-all
                  duration-300
                  px-4
                  py-3
                  group
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
                  collapsed
                    ? 'justify-center'
                    : 'gap-4'
                )
              }
            >

              <item.icon
                className="
                  w-5
                  h-5
                  transition-transform
                  duration-300
                  group-hover:scale-110
                  flex-shrink-0
                "
              />

              {!collapsed && (

                <span className="font-semibold text-sm truncate">
                  {item.name}
                </span>

              )}

            </NavLink>

          ))}
        </div>

        {/* FOOTER */}
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
              hover:bg-gray-200
              dark:hover:bg-gray-700
              transition-all
            "
          >

            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}

          </button>

        </div>
      </div>
    </aside>
  );
};

export default ProviderSidebar;