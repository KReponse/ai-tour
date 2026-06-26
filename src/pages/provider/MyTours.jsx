import React, {
  useEffect,
  useState,
  useMemo
} from "react";

import {
  MapPin,
  Clock3,
  Users,
  Pencil,
  Trash2,
  Eye,
  Plus,
  Search,
  TrendingUp,
  Star,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Share2,
  Download,
  Sparkles,
  X,
  LayoutGrid,
  List,
  Filter
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  getProviderTours,
  deleteTour,
  toggleTourStatus
} from "../../services/tourService";

import { useAuth } from "../../contexts/AuthContext";

// ===============================
// IMAGE HELPERS
// ===============================
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=500',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=500',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500',
  'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=500',
];

const getFallbackImage = (seed) => {
  const index = typeof seed === 'number' ? seed : Math.floor(Math.random() * FALLBACK_IMAGES.length);
  return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
};

const getImageUrl = (image) => {
  if (!image) return null;
  if (image.startsWith('http')) return image;
  if (image.startsWith('/')) return image;
  return `${API_URL}/uploads/${image}`;
};

const getTourImage = (tour) => {
  if (tour.coverImage) return getImageUrl(tour.coverImage);
  if (tour.images && tour.images.length > 0) return getImageUrl(tour.images[0]);
  if (tour.image) return getImageUrl(tour.image);
  return null;
};

const MyTours = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  // ===============================
  // STATES
  // ===============================
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [notification, setNotification] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [imageErrors, setImageErrors] = useState({});

  // ===============================
  // AI TOUR ANALYTICS
  // ===============================
  const analytics = useMemo(() => {
    const totalTours = tours.length;
    const totalRevenue = tours.reduce((sum, tour) => sum + Number(tour.price || 0), 0);
    const avgPrice = totalRevenue / totalTours || 0;
    
    const topPerforming = [...tours].sort((a, b) => (b.views || 0) - (a.views || 0))[0];
    
    const locations = tours.reduce((acc, tour) => {
      const place = tour.location || "Unknown";
      acc[place] = (acc[place] || 0) + 1;
      return acc;
    }, {});
    
    const approvedTours = tours.filter(tour => tour.status === "approved").length;
    const pendingTours = tours.filter(tour => tour.status === "pending").length;
    const rejectedTours = tours.filter(tour => tour.status === "rejected").length;

    return {
      totalTours,
      totalRevenue,
      avgPrice,
      topPerforming,
      locations,
      approvedTours,
      pendingTours,
      rejectedTours,
      completion: totalTours ? (approvedTours / totalTours) * 100 : 0
    };
  }, [tours]);

  // ===============================
  // LOAD TOURS
  // ===============================
  useEffect(() => {
    fetchTours();
  }, []);

  // ===============================
  // FILTER SYSTEM
  // ===============================
  useEffect(() => {
    let result = [...tours];

    if (searchTerm) {
      result = result.filter(tour =>
        tour.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      result = result.filter(tour => tour.status === statusFilter);
    }

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "popular":
        result.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    setFilteredTours(result);
  }, [tours, searchTerm, statusFilter, sortBy]);

  // ===============================
  // FETCH FUNCTION
  // ===============================
  const fetchTours = async () => {
  try {
    setLoading(true);

    const data = await getProviderTours(token);

    setTours(data.tours || []);

  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  // ===============================
  // NAVIGATION
  // ===============================
  const handleEdit = (id) => {
    navigate(`/provider/tours/edit/${id}`);
  };

  const handleView = (id) => {
    navigate(`/tour/${id}`);
  };

  // ===============================
  // DELETE
  // ===============================
  const handleDeleteClick = (tour) => {
    setSelectedTour(tour);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTour) return;

    try {
      setDeleteLoading(true);
      await deleteTour(selectedTour._id, token);
      await fetchTours();
      showNotification(`${selectedTour.title} deleted successfully`, "success");
      setShowDeleteModal(false);
      setSelectedTour(null);
    } catch (error) {
      console.error(error);
      showNotification(error.response?.data?.message || "Delete failed", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  // ===============================
  // STATUS TOGGLE
  // ===============================
  const handleStatusToggle = async (tour) => {
    try {
      await toggleTourStatus(tour._id, token);
      await fetchTours();
      showNotification("Tour status updated", "success");
    } catch (error) {
      console.error(error);
      showNotification("Failed updating status", "error");
    }
  };

  // ===============================
  // NOTIFICATION
  // ===============================
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // ===============================
  // SHARE
  // ===============================
  const handleShare = async (tour) => {
    const url = `${window.location.origin}/tour/${tour._id}`;
    try {
      await navigator.clipboard.writeText(url);
      showNotification("Tour link copied", "success");
    } catch (error) {
      showNotification("Copy failed", "error");
    }
  };

  // ===============================
  // EXPORT
  // ===============================
  const handleExport = () => {
    const data = JSON.stringify(tours, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ai-tour-export.json";
    a.click();
    URL.revokeObjectURL(url);
    showNotification("Export completed", "success");
  };

  // ===============================
  // GET STATUS BADGE
  // ===============================
  const getStatusBadge = (status) => {
    const styles = {
      approved: {
        bg: "bg-[#0D9488]/10",
        text: "text-[#0D9488]",
        label: "Approved"
      },
      pending: {
        bg: "bg-[#F59E0B]/10",
        text: "text-[#F59E0B]",
        label: "Pending"
      },
      rejected: {
        bg: "bg-red-100",
        text: "text-red-600",
        label: "Rejected"
      }
    };
    return styles[status] || styles.pending;
  };

  // ===============================
  // HANDLE IMAGE ERROR
  // ===============================
  const handleImageError = (tourId) => {
    setImageErrors(prev => ({ ...prev, [tourId]: true }));
  };

  // ===============================
  // GET IMAGE WITH FALLBACK
  // ===============================
  const getImageWithFallback = (tour) => {
    if (imageErrors[tour._id]) {
      return getFallbackImage(tour._id);
    }
    const image = getTourImage(tour);
    return image || getFallbackImage(tour._id);
  };

  // ===============================
  // LOADING SCREEN
  // ===============================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-[#374151]/10">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto">
            <div className="w-20 h-20 rounded-full border-4 border-[#0D9488]/20" />
            <div className="absolute top-0 left-0 w-20 h-20 rounded-full border-4 border-[#0D9488] border-t-transparent animate-spin" />
          </div>
          <p className="mt-4 font-semibold text-[#374151] dark:text-white">
            Loading your AI Tours...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-[#374151]/10 dark:from-gray-950 dark:via-gray-900 dark:to-black">
      
      {/* NOTIFICATION */}
      {notification && (
        <div className={`fixed top-5 right-5 z-50 px-6 py-4 rounded-2xl shadow-2xl text-white flex items-center gap-3 ${
          notification.type === "success" ? "bg-[#0D9488]" : "bg-red-500"
        }`}>
          {notification.type === "success" ? <CheckCircle /> : <AlertCircle />}
          {notification.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* AI ANALYTICS */}
        {analytics.totalTours > 0 && (
          <div className="mb-8 rounded-3xl p-6 text-white shadow-2xl bg-gradient-to-r from-[#0D9488] via-[#F59E0B] to-[#374151]">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-9 h-9" />
                <div>
                  <h3 className="text-xl font-black">AI Tour Analytics</h3>
                  <p className="text-sm opacity-90">Smart insights for your tourism business</p>
                </div>
              </div>
              <button
                onClick={() => setShowStats(!showStats)}
                className="bg-white/20 hover:bg-white/30 px-5 py-2 rounded-xl font-bold transition"
              >
                {showStats ? "Hide Stats" : "View Stats"}
              </button>
            </div>

            {showStats && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/20 rounded-xl p-4">
                  <p>Total Tours</p>
                  <strong className="text-3xl">{analytics.totalTours}</strong>
                </div>
                <div className="bg-white/20 rounded-xl p-4">
                  <p>Revenue</p>
                  <strong className="text-3xl">${analytics.totalRevenue.toLocaleString()}</strong>
                </div>
                <div className="bg-white/20 rounded-xl p-4">
                  <p>Avg Price</p>
                  <strong className="text-3xl">${analytics.avgPrice.toFixed(0)}</strong>
                </div>
                <div className="bg-white/20 rounded-xl p-4">
                  <p>Approved</p>
                  <strong className="text-3xl">{analytics.completion.toFixed(0)}%</strong>
                </div>
              </div>
            )}
          </div>
        )}

        {/* HEADER */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-[#374151] to-[#0D9488] bg-clip-text text-transparent">
              My Tours
            </h1>
            <p className="mt-2 text-gray-500 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#0D9488]" />
              {analytics.totalTours} Tours
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="h-12 px-4 rounded-xl border-2 border-[#374151]/20 hover:border-[#0D9488] font-bold flex items-center gap-2 transition"
            >
              {viewMode === "grid" ? <List className="w-5 h-5" /> : <LayoutGrid className="w-5 h-5" />}
            </button>

            <button
              onClick={handleExport}
              className="h-12 px-5 rounded-xl border-2 border-[#374151]/20 hover:border-[#F59E0B] font-bold flex items-center gap-2 transition"
            >
              <Download className="w-5 h-5" />
              Export
            </button>

            <button
              onClick={() => navigate("/provider/add-tour")}
              className="h-12 px-6 rounded-xl bg-gradient-to-r from-[#0D9488] via-[#F59E0B] to-[#374151] text-white font-black shadow-lg hover:scale-105 transition flex items-center gap-2"
            >
              <Plus />
              Add New Tour
            </button>
          </div>
        </div>

        {/* SEARCH FILTERS */}
        {tours.length > 0 && (
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-3 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tours..."
                className="w-full h-12 pl-12 rounded-xl border focus:ring-2 focus:ring-[#0D9488] dark:bg-gray-800"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-12 rounded-xl border px-4 dark:bg-gray-800"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-12 rounded-xl border px-4 dark:bg-gray-800"
            >
              <option value="newest">Newest</option>
              <option value="popular">Popular</option>
              <option value="price-low">Low Price</option>
              <option value="price-high">High Price</option>
            </select>
          </div>
        )}

        {/* EMPTY STATE */}
        {filteredTours.length === 0 && tours.length === 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-16 text-center shadow-xl border border-gray-200 dark:border-gray-800">
            <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center bg-[#0D9488]/10">
              <TrendingUp className="w-12 h-12 text-[#0D9488]" />
            </div>
            <h2 className="text-3xl font-black mt-6 text-[#374151] dark:text-white">
              No Tours Yet
            </h2>
            <p className="text-gray-500 mt-2">
              Create your first AI Tour experience
            </p>
            <button
              onClick={() => navigate("/provider/add-tour")}
              className="mt-6 px-8 py-3 rounded-xl bg-[#0D9488] hover:bg-[#0D9488]/90 text-white font-black flex items-center gap-2 mx-auto"
            >
              <Plus />
              Create Tour
            </button>
          </div>
        )}

        {/* EMPTY FILTER RESULT */}
        {filteredTours.length === 0 && tours.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-16 text-center shadow-xl border border-gray-200 dark:border-gray-800">
            <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center bg-[#F59E0B]/10">
              <Search className="w-12 h-12 text-[#F59E0B]" />
            </div>
            <h2 className="text-3xl font-black mt-6 text-[#374151] dark:text-white">
              No Tours Found
            </h2>
            <p className="text-gray-500 mt-2">
              Try adjusting your search or filters
            </p>
          </div>
        )}

        {/* TOUR CARDS */}
        {filteredTours.length > 0 && (
          <div className={
            viewMode === "grid"
              ? "grid lg:grid-cols-2 xl:grid-cols-3 gap-6"
              : "space-y-5"
          }>
            {filteredTours.map((tour) => {
              const statusStyle = getStatusBadge(tour.status);
              const imageUrl = getImageWithFallback(tour);
              
              return (
                <div
                  key={tour._id}
                  className="group bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
                >
                  {/* IMAGE */}
                  <div className="relative h-56 overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img
                      src={imageUrl}
                      alt={tour.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      onError={() => handleImageError(tour._id)}
                      loading="lazy"
                    />

                    {/* STATUS */}
                    <button
                      onClick={() => handleStatusToggle(tour)}
                      className={`absolute top-4 right-4 px-4 py-1 rounded-full text-xs font-black ${statusStyle.bg} ${statusStyle.text}`}
                    >
                      {statusStyle.label}
                    </button>

                    {/* BOOKINGS COUNT */}
                    {tour.bookings && tour.bookings > 0 && (
                      <div className="absolute top-4 left-4 bg-[#0D9488] text-white px-3 py-1 rounded-lg text-xs font-black flex items-center gap-1">
                        <Users size={14} />
                        {tour.bookings} Bookings
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="p-6 space-y-4">
                    <h2 className="text-xl font-black text-[#374151] dark:text-white">
                      {tour.title}
                    </h2>

                    <div className="flex items-center gap-2 text-gray-500">
                      <MapPin size={17} className="text-[#0D9488]" />
                      {tour.location}
                    </div>

                    {/* STATS */}
                    <div className="flex justify-between items-center">
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye size={15} />
                          {tour.views || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star size={15} className="text-[#F59E0B]" />
                          {tour.rating || 0}
                        </span>
                      </div>
                      <div className="font-black text-[#0D9488] text-lg">
                        ${tour.price}
                      </div>
                    </div>

                    {/* DETAILS */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                        <Clock3 size={16} className="text-[#0D9488]" />
                        <p className="font-bold text-sm dark:text-white">
                          {tour.duration || "N/A"}
                        </p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                        <Users size={16} className="text-[#F59E0B]" />
                        <p className="font-bold text-sm dark:text-white">
                          {tour.travelers || 0} Travelers
                        </p>
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-2 pt-3">
                      <button
                        onClick={() => handleView(tour._id)}
                        className="flex-1 h-10 rounded-xl bg-[#0D9488] hover:bg-[#0D9488]/90 text-white font-bold flex items-center justify-center gap-2"
                      >
                        <Eye size={16} />
                        View
                      </button>

                      <button
                        onClick={() => handleEdit(tour._id)}
                        className="w-10 rounded-xl bg-[#374151] text-white flex items-center justify-center hover:bg-[#374151]/80 transition"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => handleShare(tour)}
                        className="w-10 rounded-xl bg-[#F59E0B] text-white flex items-center justify-center hover:bg-[#F59E0B]/80 transition"
                      >
                        <Share2 size={16} />
                      </button>

                      <button
                        onClick={() => handleDeleteClick(tour)}
                        className="w-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* DELETE MODAL */}
        {showDeleteModal && selectedTour && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 max-w-md w-full shadow-2xl">
              <div className="flex justify-between">
                <h3 className="text-2xl font-black text-[#374151] dark:text-white">
                  Delete Tour?
                </h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition"
                >
                  <X />
                </button>
              </div>

              <p className="mt-4 text-gray-500 dark:text-gray-400">
                Are you sure you want to delete:
                <br />
                <b className="text-[#374151] dark:text-white">{selectedTour.title}</b>
              </p>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 border rounded-xl py-3 font-bold text-[#374151] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  Cancel
                </button>

                <button
                  disabled={deleteLoading}
                  onClick={handleDeleteConfirm}
                  className="flex-1 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition disabled:opacity-50"
                >
                  {deleteLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTours;