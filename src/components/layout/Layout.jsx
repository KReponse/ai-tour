// src/components/layout/Layout.jsx - Add missing useState import
import React, { useState, useEffect } from 'react'; // Make sure useState is imported
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
<div className="w-full min-h-screen overflow-x-hidden bg-background">
      <Navbar onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className="flex pt-16">
        {!isMobile && <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />}
        <main className={`flex-1 transition-all duration-300 ${!isMobile && !sidebarCollapsed ? 'ml-64' : 'ml-0'} p-4 md:p-6 pb-20 md:pb-6`}>
          {children}
        </main>
      </div>
      {isMobile && <BottomNav />}
    </div>
  );
};

export default Layout;