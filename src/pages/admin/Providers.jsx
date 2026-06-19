import { useEffect, useState } from "react";
import axios from "axios";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Ban,
  Eye,
  Search,
} from "lucide-react";

const API = "http://localhost:5000/api/admin";

const Providers = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  const fetchProviders = async () => {
    try {
      const { data } = await axios.get(`${API}/providers`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProviders(data.providers || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const updateStatus = async (id, action, reason = "") => {
    try {
      await axios.patch(
        `${API}/providers/${id}/${action}`,
        { reason },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchProviders();
    } catch (err) {
      console.log(err);
    }
  };

  const filtered = providers.filter((p) => {
  const name = p?.name || "";
  const email = p?.email || "";
  const status = p?.verificationStatus || "";

  const matchStatus =
    filter === "all" ? true : status === filter;

  const matchSearch =
    name.toLowerCase().includes(search.toLowerCase()) ||
    email.toLowerCase().includes(search.toLowerCase());

  return matchStatus && matchSearch;
});


  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const statusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      approved: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
      suspended: "bg-gray-200 text-gray-700",
      under_review: "bg-blue-100 text-blue-700",
    };

    return styles[status] || styles.pending;
  };

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Providers Approval
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Super admin verification & control panel
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-3 justify-between">

        <div className="flex gap-2 flex-wrap">
          {["all", "pending", "approved", "rejected", "suspended"].map(
            (s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-xl text-sm ${
                  filter === s
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800"
                }`}
              >
                {s}
              </button>
            )
          )}
        </div>

        {/* SEARCH */}
        <div className="flex items-center gap-2 bg-white dark:bg-gray-900 border px-3 py-2 rounded-xl">
          <Search size={16} />
          <input
            placeholder="Search providers..."
            className="outline-none bg-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white dark:bg-gray-900 border rounded-2xl">
        <table className="w-full">

          <thead>
            <tr className="border-b">
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((p) => (
              <tr key={p._id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">

                <td className="p-4 font-medium">{p.name}</td>
                <td className="p-4 text-gray-500">{p.email}</td>

                {/* STATUS */}
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${statusBadge(p.verificationStatus)}`}>
                    {p.verificationStatus}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="p-4 flex flex-wrap gap-2">

                  {/* APPROVE */}
                  <button
                    onClick={() => updateStatus(p._id, "approve")}
                    className="bg-green-600 text-white px-3 py-2 rounded-xl flex items-center gap-1"
                  >
                    <CheckCircle size={16} />
                    Approve
                  </button>

                  {/* REJECT */}
                  <button
                    onClick={() => {
                      const reason = prompt("Rejection reason:");
                      if (reason) updateStatus(p._id, "reject", reason);
                    }}
                    className="bg-red-600 text-white px-3 py-2 rounded-xl flex items-center gap-1"
                  >
                    <XCircle size={16} />
                    Reject
                  </button>

                  {/* SUSPEND */}
                  <button
                    onClick={() => updateStatus(p._id, "suspend")}
                    className="bg-gray-700 text-white px-3 py-2 rounded-xl flex items-center gap-1"
                  >
                    <Ban size={16} />
                    Suspend
                  </button>

                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default Providers;