import { useEffect, useState } from "react";
import axios from "axios";
import {
  Loader2,
  Shield,
  User,
  Search,
  UserCog,
} from "lucide-react";

const API = "http://localhost:5000/api/admin";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${API}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  // SAFE SEARCH (fixes your toLowerCase crash)
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
      await axios.put(
        `${API}/users/${id}`,
        { role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchUsers();
    } catch (error) {
      console.log("Role update error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const roleColors = {
    admin:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    provider:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    traveler:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  };

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3">

        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Users Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage system users and roles
          </p>
        </div>

        {/* SEARCH */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* EMPTY STATE */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-10 text-center">
          <User className="mx-auto mb-3 text-gray-400" size={40} />
          <h2 className="text-xl font-semibold">No Users Found</h2>
          <p className="text-gray-500 mt-2">
            Try adjusting your search or wait for new users.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-lg">

          <table className="w-full">

            {/* HEADER */}
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {filtered.map((u) => (
                <tr
                  key={u?._id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
                >
                  {/* NAME */}
                  <td className="p-4 font-medium text-gray-900 dark:text-white">
                    {u?.name || "Unknown"}
                  </td>

                  {/* EMAIL */}
                  <td className="p-4 text-gray-600 dark:text-gray-300">
                    {u?.email || "No email"}
                  </td>

                  {/* ROLE */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        roleColors[u?.role] || roleColors.traveler
                      }`}
                    >
                      {u?.role || "traveler"}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="p-4 flex gap-2 flex-wrap">

                    <button
                      onClick={() => updateRole(u._id, "traveler")}
                      className="px-3 py-2 rounded-xl bg-gray-600 hover:bg-gray-700 text-white"
                    >
                      Traveler
                    </button>

                    <button
                      onClick={() => updateRole(u._id, "provider")}
                      className="px-3 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white"
                    >
                      Provider
                    </button>

                    <button
                      onClick={() => updateRole(u._id, "admin")}
                      className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1"
                    >
                      <Shield size={16} />
                      Admin
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
};

export default Users;