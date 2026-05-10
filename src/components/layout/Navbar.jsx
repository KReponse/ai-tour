// src/components/layout/Navbar.jsx
import React, { useState } from 'react';
import { Menu, Search, Bell, User, Bot } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import SearchBar from '../common/SearchBar';
import { Link } from 'react-router-dom';

const Navbar = ({ onMenuClick }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect backdrop-blur-md bg-white/80 dark:bg-gray-900/80">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link to="/" className="flex items-center space-x-2">
              <Bot className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold gradient-text">AI Tour</span>
            </Link>
          </div>

          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-slide-down">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold">Notifications</h3>
                  </div>
                  <div className="p-4 text-center text-gray-500">
                    No new notifications
                  </div>
                </div>
              )}
            </div>

            <ThemeToggle />
            
            <Link to="/profile" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="md:hidden mt-3">
          <SearchBar />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;