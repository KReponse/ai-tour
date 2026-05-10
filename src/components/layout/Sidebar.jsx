// src/components/layout/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, Compass, Bot, CalendarCheck, Plane, 
  Star, User, Bell, ChevronLeft, ChevronRight 
} from 'lucide-react';
import clsx from 'clsx';

const Sidebar = ({ collapsed, onToggle }) => {
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/explore', icon: Compass, label: 'Explore' },
    { path: '/ai-planner', icon: Bot, label: 'AI Planner' },
    { path: '/booking', icon: CalendarCheck, label: 'Booking' },
    { path: '/trips', icon: Plane, label: 'Trips' },
    { path: '/reviews', icon: Star, label: 'Reviews' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/notifications', icon: Bell, label: 'Notifications' }
  ];

  return (
    <aside className={clsx(
      'fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white/80 dark:bg-gray-900/80 backdrop-blur-md',
      'border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40',
      collapsed ? 'w-20' : 'w-64'
    )}>
      <div className="flex flex-col h-full">
        <div className="flex-1 py-6">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => clsx(
                'flex items-center px-4 py-3 mx-2 my-1 rounded-xl transition-all duration-200',
                'hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10',
                isActive ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300',
                collapsed ? 'justify-center' : 'space-x-3'
              )}
            >
              <item.icon className="w-5 h-5" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </div>
        
        <button
          onClick={onToggle}
          className="hidden md:flex items-center justify-center p-2 m-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;