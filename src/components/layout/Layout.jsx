// src/components/layout/Layout.jsx

import React, {
  useState,
  useEffect,
} from 'react';

import { Outlet } from 'react-router-dom';

import Navbar from './Navbar';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import Footer from './Footer';

const Layout = () => {

  const [isMobile, setIsMobile] =
    useState(
      window.innerWidth < 768
    );

  const [
    sidebarCollapsed,
    setSidebarCollapsed,
  ] = useState(false);

  useEffect(() => {

    const handleResize = () => {
      setIsMobile(
        window.innerWidth < 768
      );
    };

    window.addEventListener(
      'resize',
      handleResize
    );

    return () =>
      window.removeEventListener(
        'resize',
        handleResize
      );

  }, []);

  return (
    <div className="w-full min-h-screen overflow-x-hidden bg-background dark:bg-gray-950 transition-colors duration-300">

      {/* NAVBAR */}
      <Navbar
        onMenuClick={() =>
          setSidebarCollapsed(
            !sidebarCollapsed
          )
        }
      />

      <div className="flex pt-16">

        {/* SIDEBAR */}
        {!isMobile && (
          <Sidebar
            collapsed={
              sidebarCollapsed
            }
            onToggle={() =>
              setSidebarCollapsed(
                !sidebarCollapsed
              )
            }
          />
        )}

        {/* MAIN CONTENT */}
        <main
          className={`
            flex-1
            transition-all
            duration-300
            min-h-screen
            ${
              !isMobile
                ? sidebarCollapsed
                  ? 'ml-20'
                  : 'ml-64'
                : 'ml-0'
            }
            p-4
            md:p-6
            pb-20
            md:pb-6
          `}
        >

          {/* PAGE CONTENT */}
          <Outlet />

          {/* FOOTER */}
          <Footer />

        </main>
      </div>

      {/* MOBILE NAV */}
      {isMobile && <BottomNav />}

    </div>
  );
};

export default Layout;