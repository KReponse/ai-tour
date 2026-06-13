import React from 'react';
import { Outlet } from 'react-router-dom';

import AdminSidebar from '../components/admin/AdminSidebar';
import AdminNavbar from '../components/admin/AdminNavbar';

const AdminLayout = () => {

  return (

    <div className="flex">

      <AdminSidebar />

      <div className="flex-1">

        <AdminNavbar />

        <div className="p-6">

          <Outlet />

        </div>

      </div>

    </div>

  );

};

export default AdminLayout;