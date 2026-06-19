import {
  Search,
  Bell,
  UserCircle,
  PanelLeft,
} from "lucide-react";

export default function AdminNavbar({
  collapsed,
  setCollapsed,
}) {
  return (
    <header
      className="
        sticky top-0 z-50
        flex items-center justify-between
        px-6 h-16
        bg-white/70 dark:bg-gray-900/70
        backdrop-blur-xl
        border-b border-gray-200 dark:border-gray-800
      "
    >

      {/* LEFT */}
      <div className="flex items-center gap-3">

        {/* Sidebar toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <PanelLeft size={18} />
        </button>

        {/* Search */}
        <div className="
          hidden md:flex items-center gap-2
          bg-gray-100 dark:bg-gray-800
          px-3 py-2 rounded-xl
          w-80
        ">
          <Search size={16} className="text-gray-500" />
          <input
            placeholder="Search..."
            className="bg-transparent outline-none text-sm w-full"
          />
        </div>

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2">
          <UserCircle size={28} />
          <span className="text-sm font-medium hidden sm:block">
            Admin
          </span>
        </div>

      </div>
    </header>
  );
}