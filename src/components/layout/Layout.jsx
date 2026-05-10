// src/components/layout/Layout.jsx
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

const Layout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex pt-16">
        {!isMobile && <Sidebar collapsed={sidebarCollapsed} />}
        <main className={`flex-1 transition-all duration-300 ${!isMobile && !sidebarCollapsed ? 'ml-64' : 'ml-0'} p-4 md:p-6 pb-20 md:pb-6`}>
          {children}
        </main>
      </div>
      {isMobile && <BottomNav />}
    </div>
  );
};

export default Layout;