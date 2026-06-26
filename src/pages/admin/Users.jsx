// src/pages/admin/Users.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Loader2,
  Shield,
  User,
  Search,
  UserCog,
  Sparkles,
  Mail,
  Users as UsersIcon,
  CheckCircle,
  XCircle,
} from "lucide-react";

// ===============================
// AI TOUR COLORS
// ===============================
// Teal  : #0D9488
// Gold  : #F59E0B
// Slate : #374151
// White : #FFFFFF
// ===============================

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api/admin";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${API}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const list = data.users || [];
      setUsers(list);
      setFiltered(list);
    } catch (error) {
      console.log("Fetch users error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // SAFE SEARCH
  useEffect(() => {
    const result = users.filter((u) => {
      const name = u?.name || "";
      const email = u?.email || "";
      return (
        name.toLowerCase().includes(search.toLowerCase()) ||
        email.toLowerCase().includes(search.toLowerCase())
      );
    });
    setFiltered(result);
  }, [search, users]);

  const updateRole = async (id, role) => {
    try {
      setActionLoading(id);
      await axios.put(
        `${API}/users/${id}`,
        { role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchUsers();
    } catch (error) {
      console.log("Role update error:", error);
    } finally {
      setActionLoading(null);
    }
  };

  // Role colors with AI Tour colors
  const getRoleBadge = (role) => {
    const styles = {
      admin: {
        bg: "bg-[#0D9488]/10 dark:bg-[#0D9488]/20",
        text: "text-[#0D9488] dark:text-[#0D9488]",
        icon: Shield,
      },
      provider: {
        bg: "bg-[#F59E0B]/10 dark:bg-[#F59E0B]/20",
        text: "text-[#F59E0B] dark:text-[#F59E0B]",
        icon: UserCog,
      },
      traveler: {
        bg: "bg-[#374151]/10 dark:bg-[#374151]/20",
        text: "text-[#374151] dark:text-white",
        icon: User,
      },
    };
    return styles[role] || styles.traveler;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px]">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488]/20" />
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488] border-t-transparent animate-spin" />
        </div>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">

      {/* HEADER - Updated with AI Tour colors */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#F59E0B] flex items-center justify-center shadow-lg">
            <UsersIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#374151] dark:text-white">
              Users Management
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
              Manage system users and roles • {filtered.length} users
            </p>
          </div>
        </div>

        {/* SEARCH - Updated with AI Tour colors */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-white focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition outline-none"
          />
        </div>
      </div>

      {/* EMPTY STATE - Updated with AI Tour colors */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-16 text-center shadow-sm">
          <div className="w-20 h-20 rounded-full bg-[#0D9488]/10 flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-[#0D9488]" />
          </div>
          <h2 className="text-2xl font-bold text-[#374151] dark:text-white">No Users Found</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {search ? "Try adjusting your search" : "Users will appear here once they register"}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm">
          <table className="w-full">
            {/* HEADER */}
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">User</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Email</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Role</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {filtered.map((u) => {
                const roleBadge = getRoleBadge(u?.role);
                const RoleIcon = roleBadge.icon;

                return (
                  <tr
                    key={u?._id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200"
                  >
                    {/* NAME */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0D9488] to-[#F59E0B] flex items-center justify-center text-white text-xs font-bold">
                          {u?.name?.charAt(0) || "U"}
                        </div>
                        <span className="font-medium text-[#374151] dark:text-white">
                          {u?.name || "Unknown"}
                        </span>
                      </div>
                    </td>

                    {/* EMAIL */}
                    <td className="p-4 text-gray-600 dark:text-gray-300 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Mail size={14} className="text-[#0D9488]" />
                        {u?.email || "No email"}
                      </div>
                    </td>

                    {/* ROLE */}
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${roleBadge.bg} ${roleBadge.text}`}>
                        <RoleIcon className="w-3.5 h-3.5" />
                        {u?.role || "traveler"}
                      </span>
                    </td>

                    {/* ACTIONS - Updated with AI Tour colors */}
                    <td className="p-4">
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => updateRole(u._id, "traveler")}
                          disabled={actionLoading === u._id}
                          className="px-3 py-1.5 rounded-xl bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium transition-all duration-300 disabled:opacity-50"
                        >
                          {actionLoading === u._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "Traveler"
                          )}
                        </button>

                        <button
                          onClick={() => updateRole(u._id, "provider")}
                          disabled={actionLoading === u._id}
                          className="px-3 py-1.5 rounded-xl bg-[#F59E0B] hover:bg-[#F59E0B]/80 text-white text-sm font-medium transition-all duration-300 disabled:opacity-50"
                        >
                          Provider
                        </button>

                        <button
                          onClick={() => updateRole(u._id, "admin")}
                          disabled={actionLoading === u._id}
                          className="px-3 py-1.5 rounded-xl bg-[#0D9488] hover:bg-[#0D9488]/80 text-white text-sm font-medium transition-all duration-300 flex items-center gap-1 disabled:opacity-50"
                        >
                          <Shield size={14} />
                          Admin
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
            <span>Showing {filtered.length} of {users.length} users</span>
            <span>Last updated: {new Date().toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;