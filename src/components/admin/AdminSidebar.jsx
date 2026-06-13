import {
  LayoutDashboard,
  Map,
  Users,
  UserCircle,
  BarChart3,
  Settings,
  LogOut
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menu = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Tours",
    path: "/admin/tours",
    icon: Map,
  },
  {
    name: "Providers",
    path: "/admin/providers",
    icon: UserCircle,
  },
  {
    name: "Travelers",
    path: "/admin/travelers",
    icon: Users,
  },
  {
    name: "Analytics",
    path: "/admin/analytics",
    icon: BarChart3,
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  return (
    <aside className="w-72 bg-slate-900 text-white h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-slate-700">
        <h1 className="font-bold text-2xl">
          AI Tour Rwanda
        </h1>
      </div>

      <nav className="p-4 space-y-2">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-xl transition ${
                isActive
                  ? "bg-blue-600"
                  : "hover:bg-slate-800"
              }`
            }
          >
            <item.icon size={20} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-6 w-full px-4">
        <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-red-500 hover:bg-red-600">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}