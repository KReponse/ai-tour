// src/pages/provider/MyListings.jsx

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  TrendingUp,
  Sparkles,
  BarChart3,
  Download,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  LayoutGrid,
  List,
  Filter,
  X,
} from 'lucide-react';
import { getMyListings, deleteListing, toggleListingStatus } from '../../services/listingService';
import { useAuth } from '../../contexts/AuthContext';
import ListingCard from '../../components/listing/ListingCard';
import { getBusinessConfig } from '../../config/listingConfigs';

// ── Helpers ──────────────────────────────────────────────────────
const getStatusCount = (listings, status) => {
  return listings.filter((l) => l.status === status).length;
};

// ── Main Component ──────────────────────────────────────────────
const MyListings = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [notification, setNotification] = useState(null);

  // ── Analytics ──────────────────────────────────────────────────
  const analytics = useMemo(() => {
    const total = listings.length;
    const approved = getStatusCount(listings, 'approved');
    const pending = getStatusCount(listings, 'pending');
    const rejected = getStatusCount(listings, 'rejected');
    const totalRevenue = listings.reduce((sum, l) => sum + Number(l.price || 0), 0);
    const avgPrice = totalRevenue / total || 0;

    return { total, approved, pending, rejected, totalRevenue, avgPrice };
  }, [listings]);

  // ── Fetch Listings ─────────────────────────────────────────────
  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMyListings(token);
      const list = data.listings || [];
      setListings(list);
      setFilteredListings(list);
    } catch (error) {
      console.error('❌ Error fetching listings:', error);
      showNotification('Failed to load listings', 'error');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // ── Filter & Sort ─────────────────────────────────────────────
  useEffect(() => {
    let result = [...listings];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (l) =>
          l.title?.toLowerCase().includes(term) ||
          l.location?.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((l) => l.status === statusFilter);
    }

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'popular':
        result.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    setFilteredListings(result);
  }, [listings, searchTerm, statusFilter, sortBy]);

  // ── Actions ────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      await deleteListing(id, token);
      await fetchListings();
      showNotification('Listing deleted successfully', 'success');
    } catch (error) {
      console.error('❌ Delete error:', error);
      showNotification(error.response?.data?.message || 'Delete failed', 'error');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleListingStatus(id, token);
      await fetchListings();
      showNotification('Status updated', 'success');
    } catch (error) {
      console.error('❌ Status toggle error:', error);
      showNotification('Failed to update status', 'error');
    }
  };

  const handleToggleFavorite = (id) => {
    // Will be implemented when favorites system is ready
    showNotification('Favorites coming soon!', 'info');
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // ── Loading ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-[#374151]/10">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto">
            <div className="w-20 h-20 rounded-full border-4 border-[#0D9488]/20" />
            <div className="absolute top-0 left-0 w-20 h-20 rounded-full border-4 border-[#0D9488] border-t-transparent animate-spin" />
          </div>
          <p className="mt-4 font-semibold text-[#374151] dark:text-white">
            Loading your listings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-[#374151]/10 dark:from-gray-950 dark:via-gray-900 dark:to-black p-6">
      {/* ── Notification ── */}
      {notification && (
        <div
          className={`fixed top-5 right-5 z-50 px-6 py-4 rounded-2xl shadow-2xl text-white flex items-center gap-3 ${
            notification.type === 'success'
              ? 'bg-[#0D9488]'
              : notification.type === 'error'
              ? 'bg-red-500'
              : 'bg-[#F59E0B]'
          }`}
        >
          {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
          {notification.type === 'error' && <XCircle className="w-5 h-5" />}
          {notification.type === 'info' && <AlertCircle className="w-5 h-5" />}
          {notification.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* ── Analytics Banner ── */}
        {analytics.total > 0 && (
          <div className="mb-8 rounded-3xl p-6 text-white shadow-2xl bg-gradient-to-r from-[#0D9488] via-[#F59E0B] to-[#374151]">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-9 h-9" />
                <div>
                  <h3 className="text-xl font-black">Listing Analytics</h3>
                  <p className="text-sm opacity-90">Smart insights for your business</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/20 rounded-xl p-3 text-center">
                  <p className="text-xs opacity-80">Total</p>
                  <strong className="text-2xl">{analytics.total}</strong>
                </div>
                <div className="bg-white/20 rounded-xl p-3 text-center">
                  <p className="text-xs opacity-80">Approved</p>
                  <strong className="text-2xl text-[#0D9488]">{analytics.approved}</strong>
                </div>
                <div className="bg-white/20 rounded-xl p-3 text-center">
                  <p className="text-xs opacity-80">Pending</p>
                  <strong className="text-2xl text-[#F59E0B]">{analytics.pending}</strong>
                </div>
                <div className="bg-white/20 rounded-xl p-3 text-center">
                  <p className="text-xs opacity-80">Avg Price</p>
                  <strong className="text-2xl">${analytics.avgPrice.toFixed(0)}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Header ── */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-[#374151] to-[#0D9488] bg-clip-text text-transparent">
              My Listings
            </h1>
            <p className="mt-2 text-gray-500 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#0D9488]" />
              {analytics.total} Listings
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="h-12 px-4 rounded-xl border-2 border-[#374151]/20 hover:border-[#0D9488] font-bold flex items-center gap-2 transition"
            >
              {viewMode === 'grid' ? <List className="w-5 h-5" /> : <LayoutGrid className="w-5 h-5" />}
            </button>

            <button
              onClick={() => navigate('/provider/add-listing')}
              className="h-12 px-6 rounded-xl bg-gradient-to-r from-[#0D9488] via-[#F59E0B] to-[#374151] text-white font-black shadow-lg hover:scale-105 transition flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Listing
            </button>
          </div>
        </div>

        {/* ── Search & Filters ── */}
        {listings.length > 0 && (
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-3 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search listings..."
                className="w-full h-12 pl-12 pr-4 rounded-xl border focus:ring-2 focus:ring-[#0D9488] dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-12 rounded-xl border px-4 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending ({getStatusCount(listings, 'pending')})</option>
              <option value="approved">Approved ({getStatusCount(listings, 'approved')})</option>
              <option value="rejected">Rejected ({getStatusCount(listings, 'rejected')})</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-12 rounded-xl border px-4 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option value="newest">Newest</option>
              <option value="popular">Popular</option>
              <option value="price-low">Low Price</option>
              <option value="price-high">High Price</option>
            </select>
          </div>
        )}

        {/* ── Empty State ── */}
        {listings.length === 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-16 text-center shadow-xl border border-gray-200 dark:border-gray-800">
            <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center bg-[#0D9488]/10">
              <TrendingUp className="w-12 h-12 text-[#0D9488]" />
            </div>
            <h2 className="text-3xl font-black mt-6 text-[#374151] dark:text-white">
              No Listings Yet
            </h2>
            <p className="text-gray-500 mt-2">Create your first listing on AI Tour</p>
            <button
              onClick={() => navigate('/provider/add-listing')}
              className="mt-6 px-8 py-3 rounded-xl bg-[#0D9488] hover:bg-[#0D9488]/90 text-white font-black flex items-center gap-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              Create Listing
            </button>
          </div>
        )}

        {/* ── Empty Filter Result ── */}
        {listings.length > 0 && filteredListings.length === 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-16 text-center shadow-xl border border-gray-200 dark:border-gray-800">
            <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center bg-[#F59E0B]/10">
              <Search className="w-12 h-12 text-[#F59E0B]" />
            </div>
            <h2 className="text-3xl font-black mt-6 text-[#374151] dark:text-white">
              No Listings Found
            </h2>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
          </div>
        )}

        {/* ── Listings Grid ── */}
        {filteredListings.length > 0 && (
          <div
            className={
              viewMode === 'grid'
                ? 'grid lg:grid-cols-2 xl:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {filteredListings.map((listing) => (
              <ListingCard
                key={listing._id}
                listing={listing}
                compact={viewMode === 'list'}
                onDelete={handleDelete}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListings;