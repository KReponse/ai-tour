// src/components/provider/ProviderBottomNav.jsx

import React from 'react';

import {
  LayoutDashboard,
  CalendarClock,
  PlusCircle,
  BarChart3,
  User,
} from 'lucide-react';

import {
  NavLink,
} from 'react-router-dom';

const ProviderBottomNav = () => {

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
      name: 'Add',
      path: '/provider/add-tour',
      icon: PlusCircle,
    },
    {
      name: 'Analytics',
      path: '/provider/analytics',
      icon: BarChart3,
    },
    {
      name: 'Profile',
      path: '/provider/profile',
      icon: User,
    },
  ];

  return (
    <div
      className="
        lg:hidden
        fixed
        bottom-0
        left-0
        right-0
        z-50
        bg-white/90
        dark:bg-gray-950/90
        backdrop-blur-xl
        border-t
        border-gray-200
        dark:border-gray-800
      "
    >

      <div className="grid grid-cols-5 h-20 px-2">

        {navItems.map((item) => (

          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `
              flex
              flex-col
              items-center
              justify-center
              gap-1
              rounded-2xl
              transition-all
              ${
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-500 dark:text-gray-400'
              }
              `
            }
          >

            <item.icon className="w-6 h-6" />

            <span className="text-[11px] font-semibold">
              {item.name}
            </span>

          </NavLink>

        ))}

      </div>

    </div>
  );
};

export default ProviderBottomNav;