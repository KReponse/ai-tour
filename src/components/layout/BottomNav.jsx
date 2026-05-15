import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Bot, Plane, User } from 'lucide-react';
import clsx from 'clsx';

const BottomNav = () => {
  const [visible, setVisible] = useState(true);
  let lastScrollY = 0;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        // scroll down → hide
        setVisible(false);
      } else {
        // scroll up → show
        setVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/explore', icon: Compass, label: 'Explore' },
    { path: '/ai-planner', icon: Bot, label: 'AI' },
    { path: '/trips', icon: Plane, label: 'Trips' },
    { path: '/profile', icon: User, label: 'Profile' }
  ];

  return (
    <nav
      className={clsx(
        'fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300',
        visible ? 'translate-y-0' : 'translate-y-full'
      )}
    >
      <div className="glass-effect bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-around items-center py-2">

          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => clsx(
                'flex flex-col items-center p-2 rounded-lg transition-all duration-200',
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </NavLink>
          ))}

        </div>
      </div>
    </nav>
  );
};

export default BottomNav;