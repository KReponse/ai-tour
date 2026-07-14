// src/pages/Profile.jsx

import {
  useEffect,
  useState,
  useRef,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import {
  Mail,
  Phone,
  MapPin,
  LogOut,
  Edit2,
  Loader2,
  Star,
  Calendar,
  RefreshCw,
  Briefcase,
  ShieldCheck,
  ArrowRight,
  User,
  Sparkles,
  Camera,
  CheckCircle,
} from "lucide-react";

import Card, {
  CardContent
} from "../components/ui/Card";

import Button from "../components/ui/Button";

import {
  useAuth
} from "../contexts/AuthContext";

// ===============================
// AI TOUR COLORS
// ===============================
// Teal  : #0D9488
// Gold  : #F59E0B
// Slate : #374151
// White : #FFFFFF
// ===============================

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Profile = () => {
  const navigate = useNavigate();
  const { logout, user: authUser } = useAuth();
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // ✅ Helper for image URLs
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    if (path.startsWith('/uploads/')) return `${API_URL}${path}`;
    if (path.startsWith('data:image')) return path;
    return `${API_URL}/uploads/${path}`;
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      console.log("🔍 Token exists:", !!token);
      console.log("🔍 Token preview:", token?.substring(0, 30) + "...");

      if (!token) {
        console.warn("⚠️ No token found");
        setError("Please login to view your profile");
        setLoading(false);
        // Redirect to login after 2 seconds
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      console.log("🔍 Fetching profile from:", `${API}/users/me`);
      
      let userData = null;
      let bookingsData = [];
      let reviewsData = [];

      // ✅ Fetch user data (required)
      try {
        const u = await axios.get(`${API}/users/me`, { 
          headers,
          timeout: 10000 
        });
        console.log("✅ User data fetched:", u.data);
        userData = u.data.user;
      } catch (err) {
        console.error("❌ User fetch error:", err.message);
        console.error("❌ Response status:", err.response?.status);
        console.error("❌ Response data:", err.response?.data);
        
        if (err.response?.status === 401) {
          setError("Session expired. Please login again.");
          localStorage.removeItem('token');
          setTimeout(() => navigate('/login'), 2000);
          setLoading(false);
          return;
        }
        
        setError(err.response?.data?.message || "Failed to load user data");
        setLoading(false);
        return;
      }

      // ✅ Fetch bookings (optional)
      try {
        const b = await axios.get(`${API}/bookings/my-bookings`, { headers });
        bookingsData = b.data.bookings || [];
        console.log("✅ Bookings fetched:", bookingsData.length);
      } catch (err) {
        console.error("❌ Bookings fetch error:", err.message);
        bookingsData = [];
      }

      // ✅ Fetch reviews (optional)
      try {
        const r = await axios.get(`${API}/reviews/my-reviews`, { headers });
        reviewsData = r.data.reviews || [];
        console.log("✅ Reviews fetched:", reviewsData.length);
      } catch (err) {
        console.error("❌ Reviews fetch error:", err.message);
        reviewsData = [];
      }

      setUser(userData);
      setBookings(bookingsData);
      setReviews(reviewsData);
      setError(null);
      
      console.log("✅ Profile loaded successfully");
    } catch (err) {
      console.error("❌ Profile fetch error:", err);
      setError(err.message || "Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ✅ Handle profile image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setUploading(true);
      setUploadSuccess(false);

      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API}/users/avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        setUploadSuccess(true);
        setUser(prev => ({
          ...prev,
          avatar: response.data.avatar || response.data.user?.avatar
        }));
        await fetchProfile();
        setTimeout(() => setUploadSuccess(false), 3000);
      }
    } catch (error) {
      console.error('❌ Upload error:', error);
      alert(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((a, b) => a + (b.rating || 0), 0) / reviews.length).toFixed(1)
    : 0;

  const avatarUrl = user?.avatar ? getImageUrl(user.avatar) : null;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488]/20" />
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488] border-t-transparent animate-spin" />
        </div>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
          <RefreshCw className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-red-500 mb-3">{error}</p>
        <Button onClick={fetchProfile} className="bg-[#0D9488] text-white hover:bg-[#0D9488]/80">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4">

      {/* HEADER */}
      <Card className="border border-gray-100 dark:border-gray-800 shadow-xl rounded-3xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#0D9488] to-[#F59E0B] h-2" />
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {/* Profile Image */}
            <div className="relative group">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={user?.name || 'Profile'}
                  className="w-24 h-24 rounded-full object-cover border-4 border-[#0D9488] shadow-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0D9488] to-[#F59E0B] text-white flex items-center justify-center text-4xl font-black shadow-lg shadow-[#0D9488]/30">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              )}

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-0 right-0 p-2 rounded-full bg-[#0D9488] text-white shadow-lg hover:bg-[#0D9488]/80 transition disabled:opacity-50"
                title="Upload profile picture"
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {uploadSuccess && (
                <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1 border-2 border-white dark:border-gray-800">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            <div>
              <h1 className="text-3xl font-black text-[#374151] dark:text-white">
                {user?.name}
              </h1>
              <p className="text-gray-500 flex items-center gap-2 text-sm">
                <Mail size={16} className="text-[#0D9488]" />
                {user?.email}
              </p>
              <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold ${
                user?.role === 'admin'
                  ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                  : user?.role === 'provider'
                  ? 'bg-[#0D9488]/10 text-[#0D9488] dark:bg-[#0D9488]/20'
                  : 'bg-[#F59E0B]/10 text-[#F59E0B] dark:bg-[#F59E0B]/20'
              }`}>
                {user?.role || 'Traveler'}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <Link to="/edit-profile">
              <Button className="bg-gradient-to-r from-[#0D9488] to-[#F59E0B] text-white shadow-lg shadow-[#0D9488]/30 hover:scale-[1.02] transition">
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>

            <Button
              variant="outline"
              onClick={logout}
              className="border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* PROVIDER ACTION */}
      {authUser?.role === "traveler" && (
        <Card className="border border-gray-100 dark:border-gray-800 shadow-lg rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-5">
              <div>
                <h2 className="text-xl font-black text-[#374151] dark:text-white flex items-center gap-2">
                  <Briefcase className="text-[#0D9488]" />
                  Become Provider
                </h2>
                <p className="text-gray-500 mt-2">
                  Start offering tours and travel services on AI Tour Rwanda.
                </p>
              </div>
              <Link to="/provider/request">
                <Button className="bg-gradient-to-r from-[#0D9488] to-[#F59E0B] text-white shadow-lg shadow-[#0D9488]/30 hover:scale-[1.02] transition">
                  Apply Now
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {authUser?.role === "provider" && (
        <Card className="border border-gray-100 dark:border-gray-800 shadow-lg rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-5">
              <div>
                <h2 className="text-xl font-black text-[#374151] dark:text-white flex items-center gap-2">
                  <ShieldCheck className="text-[#0D9488]" />
                  Provider Account
                </h2>
                <p className="text-gray-500 mt-2">
                  Manage tours, bookings and travelers.
                </p>
              </div>
              <Link to="/provider/dashboard">
                <Button className="bg-gradient-to-r from-[#0D9488] to-[#F59E0B] text-white shadow-lg shadow-[#0D9488]/30 hover:scale-[1.02] transition">
                  Open Dashboard
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-5">
        <Card className="border border-gray-100 dark:border-gray-800 shadow-lg rounded-2xl hover:shadow-xl transition">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Total Bookings</p>
              <h2 className="text-3xl font-black text-[#374151] dark:text-white">
                {bookings.length}
              </h2>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#0D9488]/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-[#0D9488]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 dark:border-gray-800 shadow-lg rounded-2xl hover:shadow-xl transition">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Total Reviews</p>
              <h2 className="text-3xl font-black text-[#374151] dark:text-white">
                {reviews.length}
              </h2>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#F59E0B]/10 flex items-center justify-center">
              <Star className="w-6 h-6 text-[#F59E0B]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 dark:border-gray-800 shadow-lg rounded-2xl hover:shadow-xl transition">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Average Rating</p>
              <h2 className="text-3xl font-black text-[#374151] dark:text-white">
                {avgRating}
              </h2>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#F59E0B]/10 flex items-center justify-center">
              <Star className="w-6 h-6 text-[#F59E0B] fill-[#F59E0B]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* INFO */}
      <Card className="border border-gray-100 dark:border-gray-800 shadow-lg rounded-3xl">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-black text-[#374151] dark:text-white flex items-center gap-2">
            <User className="w-5 h-5 text-[#0D9488]" />
            Profile Information
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
              <Phone size={18} className="text-[#0D9488]" />
              {user?.phone || "No phone number"}
            </div>

            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
              <MapPin size={18} className="text-[#F59E0B]" />
              {user?.country || "No country set"}
            </div>

            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
              <Calendar size={18} className="text-[#0D9488]" />
              Member since {user?.createdAt 
                ? new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                : 'N/A'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tip */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0D9488]/5 to-[#F59E0B]/5 border border-[#0D9488]/10">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-[#374151] dark:text-white">
              💡 Profile Tips
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Add a profile photo to help providers recognize you. Keep your contact information up to date for booking confirmations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;