import React, { useEffect, useState, useMemo } from 'react';
import {
  MapPin,
  Clock3,
  Users,
  Pencil,
  Trash2,
  Eye,
  Plus,
  Search,
  Filter,
  TrendingUp,
  Star,
  Calendar,
  ChevronDown,
  X,
  AlertCircle,
  CheckCircle,
  DollarSign,
  BarChart3,
  Share2,
  Copy,
  Download,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  getTours,
  deleteTour,
  toggleTourStatus,
} from '../../services/tourService';
import { useAuth } from '../../contexts/AuthContext';

const MyTours = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [notification, setNotification] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  // AI-Powered Analytics
  const analytics = useMemo(() => {
    const totalTours = tours.length;
    const totalRevenue = tours.reduce((sum, tour) => sum + (tour.price || 0), 0);
    const avgPrice = totalRevenue / totalTours || 0;
    const topPerforming = [...tours].sort((a, b) => (b.views || 0) - (a.views || 0))[0];
    const popularLocations = tours.reduce((acc, tour) => {
      acc[tour.location] = (acc[tour.location] || 0) + 1;
      return acc;
    }, {});
    
    return {
      totalTours,
      totalRevenue,
      avgPrice,
      topPerforming,
      popularLocations,
      completion: (tours.filter(t => t.status === 'active').length / totalTours) * 100 || 0,
    };
  }, [tours]);

  // Fetch tours
  useEffect(() => {
    fetchTours();
  }, []);

  // Filter and sort tours
  useEffect(() => {
    let result = [...tours];
    
    // Search filter
    if (searchTerm) {
      result = result.filter(tour => 
        tour.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(tour => tour.status === statusFilter);
    }
    
    // Sorting
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
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }
    
    setFilteredTours(result);
  }, [tours, searchTerm, statusFilter, sortBy]);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const data = await getTours();
      setTours(data.tours || data || []);
    } catch (error) {
      console.error(error);
      showNotification('Failed to load tours', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/provider/tours/edit/${id}`);
  };

  const handleView = (id) => {
    navigate(`/tour/${id}`);
  };

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
      showNotification(`${selectedTour.title} has been deleted successfully`, 'success');
      setShowDeleteModal(false);
      setSelectedTour(null);
    } catch (error) {
      console.error(error);
      showNotification(error.response?.data?.message || 'Failed to delete tour', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleStatusToggle = async (tour) => {
    try {
      const newStatus = tour.status === 'active' ? 'inactive' : 'active';
      await toggleTourStatus(tour._id, token);
      await fetchTours();
      showNotification(`Tour ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`, 'success');
    } catch (error) {
      console.error(error);
      showNotification('Failed to update tour status', 'error');
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleShare = async (tour) => {
    const url = `${window.location.origin}/tour/${tour._id}`;
    try {
      await navigator.clipboard.writeText(url);
      showNotification('Link copied to clipboard!', 'success');
    } catch (err) {
      showNotification('Failed to copy link', 'error');
    }
  };

  const handleExport = () => {
    const data = JSON.stringify(tours, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tours-export-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Tours exported successfully!', 'success');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 dark:border-blue-900 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Loading your amazing tours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 animate-slide-in-right ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3`}>
          {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {notification.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* AI Stats Banner */}
        {analytics.totalTours > 0 && (
          <div className="mb-8 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-8 h-8 animate-pulse" />
                <div>
                  <h3 className="text-lg font-bold">AI Analytics Dashboard</h3>
                  <p className="text-sm opacity-90">Your tour performance insights</p>
                </div>
              </div>
              <button
                onClick={() => setShowStats(!showStats)}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl font-semibold transition-all backdrop-blur-sm"
              >
                {showStats ? 'Hide Stats' : 'View Stats'}
              </button>
            </div>
            
            {showStats && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-sm opacity-90">Total Tours</p>
                  <p className="text-2xl font-bold">{analytics.totalTours}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-sm opacity-90">Total Revenue</p>
                  <p className="text-2xl font-bold">${analytics.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-sm opacity-90">Avg. Price</p>
                  <p className="text-2xl font-bold">${analytics.avgPrice.toFixed(0)}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-sm opacity-90">Completion Rate</p>
                  <p className="text-2xl font-bold">{analytics.completion.toFixed(0)}%</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Header */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              My Tours
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              {analytics.totalTours} {analytics.totalTours === 1 ? 'tour' : 'tours'} • {analytics.totalRevenue > 0 && `$${analytics.totalRevenue.toLocaleString()} total value`}
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className="h-12 px-5 rounded-xl border-2 border-gray-300 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 font-semibold flex items-center gap-2 transition-all"
            >
              <Download className="w-5 h-5" />
              Export
            </button>
            <button
              onClick={() => navigate('/provider/add-tour')}
              className="h-12 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Tour
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        {tours.length > 0 && (
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-12 px-4 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-12 px-4 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-purple-500"
              >
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="h-12 px-4 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                {viewMode === 'grid' ? 'List View' : 'Grid View'}
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredTours.length === 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-16 text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-12 h-12 text-blue-500" />
            </div>
            <h2 className="text-2xl font-black dark:text-white mb-2">
              {searchTerm || statusFilter !== 'all' ? 'No matching tours found' : 'Start Your Journey'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Create your first tour and share amazing experiences with travelers'}
            </p>
            {(searchTerm || statusFilter !== 'all') ? (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-semibold hover:bg-gray-200 transition"
              >
                Clear Filters
              </button>
            ) : (
              <button
                onClick={() => navigate('/provider/add-tour')}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create First Tour
              </button>
            )}
          </div>
        )}

        {/* Tours Grid/List */}
        {filteredTours.length > 0 && (
          <div className={viewMode === 'grid' 
            ? "grid lg:grid-cols-2 xl:grid-cols-3 gap-6" 
            : "space-y-4"
          }>
            {filteredTours.map((tour, index) => (
              <div
                key={tour._id}
                className={`group bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden animate-fade-in-up ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Image */}
                <div className={viewMode === 'grid' ? 'relative h-56 overflow-hidden' : 'relative w-48 h-48 flex-shrink-0 overflow-hidden'}>
                  <img
                    src={tour.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={tour.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={() => handleStatusToggle(tour)}
                      className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-xl ${
                        tour.status === 'active'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-500 text-white'
                      }`}
                    >
                      {tour.status || 'active'}
                    </button>
                  </div>
                  {tour.isFeatured && (
                    <div className="absolute top-3 left-3">
                      <div className="bg-yellow-500 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Featured
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className={viewMode === 'grid' ? 'p-6 space-y-4' : 'flex-1 p-6 space-y-4'}>
                  <div>
                    <h2 className="text-xl font-black text-gray-900 dark:text-white line-clamp-1">
                      {tour.title}
                    </h2>
                    <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="line-clamp-1">{tour.location}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <Eye className="w-4 h-4" />
                        <span>{tour.views || 0} views</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{tour.rating || 0}</span>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      ${tour.price}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock3 className="w-3 h-3" />
                        Duration
                      </div>
                      <p className="font-bold dark:text-white text-sm mt-1">{tour.duration}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Users className="w-3 h-3" />
                        Travelers
                      </div>
                      <p className="font-bold dark:text-white text-sm mt-1">{tour.travelers} max</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => handleView(tour._id)}
                      className="flex-1 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 transition-all"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(tour._id)}
                      className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all"
                    >
                      <Pencil className="w-4 h-4 dark:text-white" />
                    </button>
                    <button
                      onClick={() => handleShare(tour)}
                      className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all"
                    >
                      <Share2 className="w-4 h-4 dark:text-white" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(tour)}
                      className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/40 flex items-center justify-center transition-all"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedTour && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 animate-scale-up">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Delete Tour
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete <span className="font-semibold">"{selectedTour.title}"</span>? This action cannot be undone and all associated data will be permanently removed.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleteLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Forever'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes scaleUp {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
        
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
        
        .animate-scale-up {
          animation: scaleUp 0.2s ease-out;
        }
        
        .animate-fade-in {
          animation: fadeInUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MyTours;