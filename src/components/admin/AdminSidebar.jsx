import React from "react";
import { Link, useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  Map,
  Calendar,
  Bell,
  ShieldCheck,
} from "lucide-react";

const AdminSidebar = () => {

  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: Users,
    },
    {
      name: "Tours",
      path: "/admin/tours",
      icon: Map,
    },
    {
      name: "Requests",
      path: "/admin/requests",
      icon: Calendar,
    },
    {
  name: "Provider Requests",
  path: "/admin/provider-requests",
  icon: ShieldCheck
},
    {
      name: "Notifications",
      path: "/admin/notifications",
      icon: Bell,
    },
  ];

  return (
    <aside
      className="
      w-64
      min-h-screen
      bg-white
      dark:bg-gray-900
      border-r
      border-gray-200
      dark:border-gray-800
      p-5
    "
    >
      <h2
        className="
        text-2xl
        font-black
        mb-8
        text-blue-600
      "
      >
        AI Tour Admin
      </h2>

      <nav className="space-y-2">
        {menuItems.map((item) => {

          const Icon = item.icon;

          const active =
            location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-xl
                transition-all

                ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }
              `}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSidebar;