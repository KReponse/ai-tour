import React, { useState } from 'react';

import { Outlet } from 'react-router-dom';

import ProviderSidebar from '../components/dashboard/ProviderSidebar';

const DashboardLayout = () => {

  const [collapsed, setCollapsed] =
    useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      <ProviderSidebar
        collapsed={collapsed}
        onToggle={() =>
          setCollapsed(!collapsed)
        }
      />

      <main
        className={`
          transition-all
          duration-300
          pt-24
          px-6
          pb-10
          ${collapsed ? 'ml-20' : 'ml-72'}
        `}
      >

        <Outlet />

      </main>
    </div>
  );
};

export default DashboardLayout;