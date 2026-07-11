// frontend/src/pages/admin/AdminPayments.jsx

import React, { useEffect, useState } from 'react';
import { CreditCard, Eye, Loader2, Search, Filter, DollarSign } from 'lucide-react';
import API from '../../services/api';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchPayments();
    fetchStats();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      // ✅ FIX: Use /admin/payments/all
      const response = await API.get('/admin/payments/all');
      setPayments(response.data.payments || response.data.data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // ✅ FIX: Use /admin/payments/stats
      const response = await API.get('/admin/payments/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching payment stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#0D9488]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-[#0D9488]/10 flex items-center justify-center">
          <CreditCard className="w-6 h-6 text-[#0D9488]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#374151] dark:text-white">All Payments</h1>
          <p className="text-sm text-gray-500">Manage all payments on the platform</p>
        </div>
      </div>

      {/* Stats Summary */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold text-[#0D9488]">${stats.totalRevenue || 0}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-500">Pending Payments</p>
            <p className="text-2xl font-bold text-[#F59E0B]">{stats.pendingPayments || 0}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-500">Refunded</p>
            <p className="text-2xl font-bold text-gray-500">{stats.refundedPayments || 0}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-500">Failed</p>
            <p className="text-2xl font-bold text-red-500">{stats.failedPayments || 0}</p>
          </div>
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search payments..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="refunded">Refunded</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Payments Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {payments.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  No payments found
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-6 py-4 text-sm font-mono text-[#0D9488]">
                    #{payment._id?.slice(-8) || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {payment.user?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-[#0D9488]">
                    ${payment.amount || 0}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                      payment.status === 'paid' ? 'bg-[#0D9488]/10 text-[#0D9488]' :
                      payment.status === 'pending' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                      payment.status === 'refunded' ? 'bg-gray-100 text-gray-500' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {payment.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 hover:bg-[#0D9488]/10 rounded-lg transition">
                      <Eye className="w-4 h-4 text-[#0D9488]" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPayments;