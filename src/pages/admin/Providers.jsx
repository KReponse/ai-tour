// src/pages/admin/Providers.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Ban,
  Eye,
  Search,
  Sparkles,
  Users,
  Mail,
  Shield,
  Clock,
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

const Providers = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

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
      setActionLoading(id);
      await axios.patch(
        `${API}/providers/${id}/${action}`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchProviders();
    } catch (err) {
      console.log(err);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = providers.filter((p) => {
    const name = p?.name || "";
    const email = p?.email || "";
    const status = p?.verificationStatus || "";

    const matchStatus = filter === "all" ? true : status === filter;
    const matchSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase());

    return matchStatus && matchSearch;
  });

  const statusBadge = (status) => {
    const styles = {
      pending: {
        bg: "bg-[#F59E0B]/10 dark:bg-[#F59E0B]/20",
        text: "text-[#F59E0B] dark:text-[#F59E0B]",
        icon: Clock,
      },
      approved: {
        bg: "bg-[#0D9488]/10 dark:bg-[#0D9488]/20",
        text: "text-[#0D9488] dark:text-[#0D9488]",
        icon: CheckCircle,
      },
      rejected: {
        bg: "bg-red-100 dark:bg-red-900/20",
        text: "text-red-600 dark:text-red-400",
        icon: XCircle,
      },
      suspended: {
        bg: "bg-gray-200 dark:bg-gray-700",
        text: "text-gray-700 dark:text-gray-300",
        icon: Ban,
      },
      under_review: {
        bg: "bg-[#0D9488]/10 dark:bg-[#0D9488]/20",
        text: "text-[#0D9488] dark:text-[#0D9488]",
        icon: Clock,
      },
    };
    return styles[status] || styles.pending;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px]">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488]/20" />
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488] border-t-transparent animate-spin" />
        </div>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading providers...</p>
      </div>
    );
  }

  const statusCounts = {
    all: providers.length,
    pending: providers.filter(p => p.verificationStatus === 'pending').length,
    approved: providers.filter(p => p.verificationStatus === 'approved').length,
    rejected: providers.filter(p => p.verificationStatus === 'rejected').length,
    suspended: providers.filter(p => p.verificationStatus === 'suspended').length,
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-fade-in">

      {/* HEADER - Updated with AI Tour colors */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#F59E0B] flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#374151] dark:text-white">
              Providers Approval
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Super admin verification & control panel
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Sparkles className="w-4 h-4 text-[#0D9488]" />
          <span>{providers.length} total providers</span>
        </div>
      </div>

      {/* FILTER BAR - Updated with AI Tour colors */}
      <div className="flex flex-col md:flex-row gap-3 justify-between">
        <div className="flex gap-2 flex-wrap">
          {["all", "pending", "approved", "rejected", "suspended"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                filter === s
                  ? "bg-[#0D9488] text-white shadow-lg shadow-[#0D9488]/30"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {s} ({statusCounts[s] || 0})
            </button>
          ))}
        </div>

        {/* SEARCH - Updated with AI Tour colors */}
        <div className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-xl focus-within:ring-2 focus-within:ring-[#0D9488] transition">
          <Search size={16} className="text-gray-400" />
          <input
            placeholder="Search providers..."
            className="outline-none bg-transparent text-sm dark:text-white placeholder:text-gray-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE - Updated with AI Tour colors */}
      <div className="overflow-x-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Provider</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Email</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-500">
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <p>No providers found</p>
                  <p className="text-sm">Try adjusting your filters or search</p>
                </td>
              </tr>
            ) : (
              filtered.map((p) => {
                const badge = statusBadge(p.verificationStatus);
                const StatusIcon = badge.icon;

                return (
                  <tr key={p._id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0D9488] to-[#F59E0B] flex items-center justify-center text-white text-xs font-bold">
                          {p.name?.charAt(0) || 'P'}
                        </div>
                        <span className="font-medium text-[#374151] dark:text-white">
                          {p.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-500 dark:text-gray-400 text-sm">{p.email}</td>

                    {/* STATUS */}
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${badge.bg} ${badge.text}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {p.verificationStatus}
                      </span>
                    </td>

                    {/* ACTIONS - Updated with AI Tour colors */}
                    <td className="p-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => updateStatus(p._id, "approve")}
                        disabled={actionLoading === p._id}
                        className="bg-[#0D9488] hover:bg-[#0D9488]/80 text-white px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all duration-300 text-sm font-medium disabled:opacity-50"
                      >
                        {actionLoading === p._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        Approve
                      </button>

                      <button
                        onClick={() => {
                          const reason = prompt("Rejection reason:");
                          if (reason) updateStatus(p._id, "reject", reason);
                        }}
                        disabled={actionLoading === p._id}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all duration-300 text-sm font-medium disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>

                      <button
                        onClick={() => updateStatus(p._id, "suspend")}
                        disabled={actionLoading === p._id}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all duration-300 text-sm font-medium disabled:opacity-50"
                      >
                        <Ban className="w-4 h-4" />
                        Suspend
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <span>Showing {filtered.length} of {providers.length} providers</span>
          <span>Last updated: {new Date().toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default Providers;