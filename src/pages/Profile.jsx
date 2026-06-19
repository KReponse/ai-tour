import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Mail,
  Phone,
  MapPin,
  Settings,
  LogOut,
  Edit2,
  Loader2,
  Star,
  Calendar,
  RefreshCw,
} from "lucide-react";

import Card, { CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import { useAuth } from "../contexts/AuthContext";

const API = "http://localhost:5000/api";

const Profile = () => {
  const { logout } = useAuth();

  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const [u, b, r] = await Promise.all([
        axios.get(`${API}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API}/bookings/my`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API}/reviews/my`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setUser(u.data.user);
      setBookings(b.data.bookings || []);
      setReviews(r.data.reviews || []);
      setError(null);

    } catch (err) {
      console.log(err);
      setError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((a, b) => a + (b.rating || 0), 0) /
          reviews.length
        ).toFixed(1)
      : 0;

  // LOADING
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // ERROR STATE
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-3">{error}</p>

        <Button onClick={fetchProfile}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* HEADER */}
      <Card>
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">

          <div className="flex items-center gap-4">

            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center text-2xl font-bold">
              {user?.name?.charAt(0) || "U"}
            </div>

            <div>
              <h1 className="text-2xl font-bold">{user?.name}</h1>

              <p className="text-gray-500 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {user?.email}
              </p>

              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                {user?.role}
              </span>
            </div>

          </div>

          <div className="flex gap-3">
            <Link to="/edit-profile">
              <Button>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>

            <Button variant="outline" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

        </CardContent>
      </Card>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <Card>
          <CardContent className="p-5 flex justify-between">
            <div>
              <p className="text-gray-500">Bookings</p>
              <h2 className="text-2xl font-bold">{bookings.length}</h2>
            </div>
            <Calendar className="text-blue-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex justify-between">
            <div>
              <p className="text-gray-500">Reviews</p>
              <h2 className="text-2xl font-bold">{reviews.length}</h2>
            </div>
            <Star className="text-yellow-500" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex justify-between">
            <div>
              <p className="text-gray-500">Avg Rating</p>
              <h2 className="text-2xl font-bold">{avgRating}</h2>
            </div>
            <Star className="text-yellow-500" />
          </CardContent>
        </Card>

      </div>

      {/* INFO */}
      <Card>
        <CardContent className="p-5 space-y-3">

          <h2 className="font-semibold text-lg">Profile Info</h2>

          <div className="flex items-center gap-3 text-gray-600">
            <Phone className="w-4 h-4" />
            {user?.phone || "No phone"}
          </div>

          <div className="flex items-center gap-3 text-gray-600">
            <MapPin className="w-4 h-4" />
            {user?.country || "No country"}
          </div>

        </CardContent>
      </Card>

    </div>
  );
};

export default Profile;