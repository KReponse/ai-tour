import {
  Bell,
  UserCircle,
  Menu
} from "lucide-react";

export default function AdminNavbar({
  toggleSidebar
}) {
  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">

      <button
        className="lg:hidden"
        onClick={toggleSidebar}
      >
        <Menu />
      </button>

      <h2 className="font-semibold text-xl">
        Admin Dashboard
      </h2>

      <div className="flex items-center gap-4">
        <Bell />

        <div className="flex items-center gap-2">
          <UserCircle size={30} />
          <span>Admin</span>
        </div>
      </div>
    </header>
  );
}