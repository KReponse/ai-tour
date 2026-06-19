import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminNavbar from "../components/admin/AdminNavbar";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* Sidebar */}
      <aside className="hidden lg:block">
        <AdminSidebar />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-72">

        {/* Navbar */}
        <AdminNavbar />

        {/* Page Content */}
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
}