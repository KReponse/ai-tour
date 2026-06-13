import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

export default function AdminLayout({
  children,
}) {

  const [open, setOpen] =
    useState(false);

  return (
    <div className="flex">

      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {open && (
        <div className="fixed z-50 lg:hidden">
          <AdminSidebar />
        </div>
      )}

      <div className="lg:ml-72 flex-1 min-h-screen bg-gray-100">

        <AdminNavbar
          toggleSidebar={() =>
            setOpen(!open)
          }
        />

        <main className="p-6">
          {children}
        </main>

      </div>
    </div>
  );
}