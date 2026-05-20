import React, {
  useState,
} from 'react';

import { Outlet } from 'react-router-dom';

import ProviderSidebar from '../components/dashboard/ProviderSidebar';

const DashboardLayout = () => {

  const [collapsed, setCollapsed] =
    useState(false);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">

      {/* SIDEBAR */}
      <ProviderSidebar
        collapsed={collapsed}
        onToggle={() =>
          setCollapsed(!collapsed)
        }
      />

      {/* MAIN CONTENT */}
      <main
        className={`
          transition-all
          duration-300
          pt-20
          p-6
          ${
            collapsed
              ? 'ml-20'
              : 'ml-72'
          }
        `}
      >

        {/* IMPORTANT */}
        <Outlet />

      </main>

    </div>
  );
};

export default DashboardLayout;