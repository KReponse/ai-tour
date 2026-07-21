// src/pages/admin/ManagementListings.jsx

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  Users,
  Image,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  RefreshCw,
  TrendingUp,
  Shield,
  Ban,
  Trash2,
  MoreVertical,
} from 'lucide-react';
import {
  getAdminListings,
  approveListing,
  rejectListing,
  suspendListing,
  deleteListingAdmin,
} from '../../services/adminService';
import ListingStatusBadge from '../../components/listing/ListingStatusBadge';
import ListingDetailsDrawer from '../../components/admin/listings/ListingDetailsDrawer';
import RejectListingModal from '../../components/admin/listings/RejectListingModal';
import SuspendListingModal from '../../components/admin/listings/SuspendListingModal';
import DeleteListingModal from '../../components/admin/listings/DeleteListingModal';

// ── Brand tokens ─────────────────────────────────────────────────
const TEAL = '#0D9488';
const GOLD = '#F59E0B';
const SLATE = '#374151';

// ── Helpers ──────────────────────────────────────────────────────
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getImageUrl = (image) => {
  if (!image) return null;
  if (image.startsWith('http')) return image;
  if (image.startsWith('/')) return image;
  return `${API_URL}/uploads/${image}`;
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const BUSINESS_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'tour_operator', label: 'Tour Operator' },
  { value: 'guide', label: 'Guide' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'lodge', label: 'Lodge' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'cafe', label: 'Café' },
  { value: 'transport', label: 'Transport' },
  { value: 'events', label: 'Events' },
  { value: 'shop', label: 'Shop' },
  { value: 'other', label: 'Other' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'suspended', label: 'Suspended' },
];

// ── Analytics Card ──────────────────────────────────────────────
const AnalyticsCard = ({ title, value, icon: Icon, color, bgColor }) => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
        <p className="text-3xl font-black text-[#374151] dark:text-white mt-1">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bgColor}`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
    </div>
  </div>
);

// ── Main Component ──────────────────────────────────────────────
const ManagementListings = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [businessTypeFilter, setBusinessTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Modal states
  const [selectedListing, setSelectedListing] = useState(null);
  const [showDetailsDrawer, setShowDetailsDrawer] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notification, setNotification] = useState(null);

  // ── Analytics ──
  const analytics = useMemo(() => {
    const total = listings.length;
    const pending = listings.filter(l => l.status === 'pending').length;
    const approved = listings.filter(l => l.status === 'approved').length;
    const rejected = listings.filter(l => l.status === 'rejected').length;
    const suspended = listings.filter(l => l.status === 'suspended').length;
    const today = listings.filter(l => {
      const today = new Date().toDateString();
      return new Date(l.createdAt).toDateString() === today;
    }).length;

    return { total, pending, approved, rejected, suspended, today };
  }, [listings]);

  // ── Fetch Listings ──
  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminListings();
      const list = data.listings || [];
      setListings(list);
      setFilteredListings(list);
    } catch (error) {
      console.error('❌ Error fetching listings:', error);
      setError(error.response?.data?.message || 'Failed to load listings');
      showNotification('Failed to load listings', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // ── Filter & Sort ──
  useEffect(() => {
    let result = [...listings];

    // Search
    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(l =>
        l.title?.toLowerCase().includes(term) ||
        l.location?.toLowerCase().includes(term) ||
        l.provider?.name?.toLowerCase().includes(term) ||
        l.businessType?.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(l => l.status === statusFilter);
    }

    // Business type filter
    if (businessTypeFilter !== 'all') {
      result = result.filter(l => l.businessType === businessTypeFilter);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'price-high':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'price-low':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      default:
        break;
    }

    setFilteredListings(result);
  }, [listings, search, statusFilter, businessTypeFilter, sortBy]);

  // ── Notifications ──
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // ── Actions ──
  const handleApprove = async (id) => {
    try {
      setActionLoading(id);
      await approveListing(id);
      showNotification('✅ Listing approved successfully!', 'success');
      await fetchListings();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to approve', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id, reason) => {
    try {
      setActionLoading(id);
      await rejectListing(id, reason);
      showNotification('❌ Listing rejected', 'success');
      setShowRejectModal(false);
      await fetchListings();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to reject', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSuspend = async (id, reason) => {
    try {
      setActionLoading(id);
      await suspendListing(id, reason);
      showNotification('⛔ Listing suspended', 'success');
      setShowSuspendModal(false);
      await fetchListings();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to suspend', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      setActionLoading(id);
      await deleteListingAdmin(id);
      showNotification('🗑️ Listing deleted', 'success');
      setShowDeleteModal(false);
      await fetchListings();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to delete', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488]/20" />
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488] border-t-transparent animate-spin" />
        </div>
        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading listings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* ── Notification ── */}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl text-white flex items-center gap-3 ${
            notification.type === 'success' ? 'bg-[#0D9488]' :
            notification.type === 'error' ? 'bg-red-500' :
            'bg-[#F59E0B]'
          }`}
        >
          {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
          {notification.type === 'error' && <XCircle className="w-5 h-5" />}
          {notification.message}
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#374151] dark:text-white">
            Listing Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Review and manage all provider listings
          </p>
        </div>
        <button
          onClick={fetchListings}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* ── Analytics Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <AnalyticsCard
          title="Total"
          value={analytics.total}
          icon={Building2}
          color="text-[#374151]"
          bgColor="bg-gray-100 dark:bg-gray-800"
        />
        <AnalyticsCard
          title="Pending"
          value={analytics.pending}
          icon={Clock}
          color="text-[#F59E0B]"
          bgColor="bg-[#F59E0B]/10"
        />
        <AnalyticsCard
          title="Approved"
          value={analytics.approved}
          icon={CheckCircle}
          color="text-[#0D9488]"
          bgColor="bg-[#0D9488]/10"
        />
        <AnalyticsCard
          title="Rejected"
          value={analytics.rejected}
          icon={XCircle}
          color="text-red-600"
          bgColor="bg-red-100"
        />
        <AnalyticsCard
          title="Suspended"
          value={analytics.suspended}
          icon={Ban}
          color="text-[#F59E0B]"
          bgColor="bg-[#F59E0B]/10"
        />
        <AnalyticsCard
          title="Today"
          value={analytics.today}
          icon={Calendar}
          color="text-[#0D9488]"
          bgColor="bg-[#0D9488]/10"
        />
      </div>

      {/* ── Filters ── */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, location, provider..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none transition dark:text-white"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none dark:text-white min-w-[140px]"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* Business Type Filter */}
          <select
            value={businessTypeFilter}
            onChange={(e) => setBusinessTypeFilter(e.target.value)}
            className="h-10 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none dark:text-white min-w-[160px]"
          >
            {BUSINESS_TYPES.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#0D9488] focus:border-transparent outline-none dark:text-white min-w-[140px]"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="price-high">Price: High to Low</option>
            <option value="price-low">Price: Low to High</option>
          </select>
        </div>
      </div>

      {/* ── Listings Table ── */}
      {filteredListings.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-16 text-center border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <Building2 className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">
            No listings found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {search || statusFilter !== 'all' || businessTypeFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'No listings have been submitted yet'}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Listing
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Provider
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredListings.map((listing) => (
                  <tr
                    key={listing._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
                  >
                    {/* Listing */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 min-w-[180px]">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                          {listing.coverImage ? (
                            <img
                              src={getImageUrl(listing.coverImage)}
                              alt={listing.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Image className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-[#374151] dark:text-white line-clamp-1">
                            {listing.title}
                          </p>
                          <p className="text-xs text-gray-500 line-clamp-1">
                            {listing.listingType || 'Listing'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Provider */}
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-[#374151] dark:text-white">
                        {listing.provider?.name || 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {listing.provider?.email || ''}
                      </p>
                    </td>

                    {/* Type */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                        {listing.businessType?.replace('_', ' ') || 'N/A'}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {listing.location || 'N/A'}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3">
                      <span className="font-semibold text-[#0D9488]">
                        ${listing.price || 0}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <ListingStatusBadge status={listing.status} size="sm" />
                    </td>

                    {/* Created */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-500">
                        {formatDate(listing.createdAt)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        {/* View */}
                        <button
                          onClick={() => {
                            setSelectedListing(listing);
                            setShowDetailsDrawer(true);
                          }}
                          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-400 hover:text-[#0D9488]"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Approve */}
                        {listing.status === 'pending' && (
                          <button
                            onClick={() => handleApprove(listing._id)}
                            disabled={actionLoading === listing._id}
                            className="p-2 rounded-xl hover:bg-[#0D9488]/10 transition text-gray-400 hover:text-[#0D9488] disabled:opacity-50"
                            title="Approve"
                          >
                            {actionLoading === listing._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                          </button>
                        )}

                        {/* Reject */}
                        {listing.status === 'pending' && (
                          <button
                            onClick={() => {
                              setSelectedListing(listing);
                              setShowRejectModal(true);
                            }}
                            className="p-2 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/20 transition text-gray-400 hover:text-red-600"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}

                        {/* Suspend */}
                        {listing.status === 'approved' && (
                          <button
                            onClick={() => {
                              setSelectedListing(listing);
                              setShowSuspendModal(true);
                            }}
                            className="p-2 rounded-xl hover:bg-[#F59E0B]/10 transition text-gray-400 hover:text-[#F59E0B]"
                            title="Suspend"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}

                        {/* Delete */}
                        <button
                          onClick={() => {
                            setSelectedListing(listing);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/20 transition text-gray-400 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-sm text-gray-500">
            <span>Showing {filteredListings.length} of {listings.length} listings</span>
            <span>Last updated: {new Date().toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      <ListingDetailsDrawer
        isOpen={showDetailsDrawer}
        onClose={() => setShowDetailsDrawer(false)}
        listing={selectedListing}
        onApprove={handleApprove}
        onReject={(id, reason) => {
          setShowDetailsDrawer(false);
          setSelectedListing(listings.find(l => l._id === id));
          setShowRejectModal(true);
        }}
        onSuspend={(id, reason) => {
          setShowDetailsDrawer(false);
          setSelectedListing(listings.find(l => l._id === id));
          setShowSuspendModal(true);
        }}
        onDelete={(id) => {
          setShowDetailsDrawer(false);
          setSelectedListing(listings.find(l => l._id === id));
          setShowDeleteModal(true);
        }}
        actionLoading={actionLoading}
      />

      <RejectListingModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        listing={selectedListing}
        onConfirm={handleReject}
        loading={actionLoading === selectedListing?._id}
      />

      <SuspendListingModal
        isOpen={showSuspendModal}
        onClose={() => setShowSuspendModal(false)}
        listing={selectedListing}
        onConfirm={handleSuspend}
        loading={actionLoading === selectedListing?._id}
      />

      <DeleteListingModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        listing={selectedListing}
        onConfirm={handleDelete}
        loading={actionLoading === selectedListing?._id}
      />
    </div>
  );
};

export default ManagementListings;