// src/components/layout/Sidebar.jsx - Add onToggle prop
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, Compass, Bot, CalendarCheck, Plane, 
  Star, User, Bell, ChevronLeft, ChevronRight 
} from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ collapsed, onToggle }) => { // Make sure onToggle is received
  const { user } = useAuth();

const publicLinks = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/explore', icon: Compass, label: 'Explore' },
  { path: '/ai-planner', icon: Bot, label: 'AI Planner' },
  { path: '/booking', icon: CalendarCheck, label: 'Booking' },
  { path: '/trips', icon: Plane, label: 'Trips' },
  { path: '/reviews', icon: Star, label: 'Reviews' },
  { path: '/profile', icon: User, label: 'Profile' },
  { path: '/notifications', icon: Bell, label: 'Notifications' }
];

const providerLinks = [
  { path: '/provider', icon: Home, label: 'Dashboard' },
  { path: '/provider/requests', icon: Compass, label: 'Requests' },
  { path: '/provider/bookings', icon: CalendarCheck, label: 'Bookings' },
  { path: '/provider/profile', icon: User, label: 'Profile' }
];

const adminLinks = [
  { path: '/admin', icon: Home, label: 'Dashboard' },
  { path: '/admin/users', icon: User, label: 'Users' },
  { path: '/admin/providers', icon: Compass, label: 'Providers' },
  { path: '/admin/bookings', icon: CalendarCheck, label: 'Bookings' },
  { path: '/admin/analytics', icon: Star, label: 'Analytics' }
];

const navItems =
  user?.role === 'admin'
    ? adminLinks
    : user?.role === 'provider'
    ? providerLinks
    : publicLinks;
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