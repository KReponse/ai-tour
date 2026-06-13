import { Routes, Route, Outlet } from 'react-router-dom';

import MainLayout from './components/layout/Layout';

import FloatingAIButton from './components/FloatingAIButton';

import Home from './pages/Home';
import Explore from './pages/Explore';
import AIPlanner from './pages/AIPlanner';
import Booking from './pages/Booking';
import Trips from './pages/Trips';
import Reviews from './pages/Reviews';
import Profile from './pages/Profile';
import UserNotifications from './pages/Notifications';
import DestinationDetails from './pages/DestinationDetails';
import TripResults from './pages/TripResults';
import RequestTrip from './pages/RequestTrip';
import Payment from './pages/Payment';
import EditProfile from './pages/EditProfile';
import TourDetails from './pages/TourDetails';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';

import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import CustomRequest from './pages/CustomRequest';
import AIChat from './pages/AIChat';
import Register from './pages/Register';


import Users from './pages/admin/Users';
import Tours from './pages/admin/Tours';
import Providers from './pages/admin/Providers';
import AdminRequests from './pages/admin/Requests';
import AdminNotifications from './pages/admin/Notifications';

import ProviderDashboard from './pages/provider/Dashboard';
import ProviderRequests from './pages/provider/Requests';
import Bookings from './pages/provider/Bookings';
import Travelers from './pages/provider/Travelers';
import Analytics from './pages/provider/Analytics';
import Earnings from './pages/provider/Earnings';
import ProviderProfile from './pages/provider/Profile';
import ProviderSettings from './pages/provider/Settings';
import AddTour from './pages/provider/AddTour';
import MyTours from './pages/provider/MyTours';
import EditTour from './pages/provider/EditTour';

import DashboardLayout from './layouts/DashboardLayout';

import ProtectedRoute from './routes/ProtectedRoute';

import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/admin/Dashboard';
import AdminLayout from './layouts/AdminLayout';
  




function App() {
  return (
    <>
      <Routes>

        {/* ================= USER SITE ================= */}
        <Route
          element={
            <MainLayout>
              <Outlet />
            </MainLayout>
          }
        >
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/destination/:id" element={<DestinationDetails />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* PROTECTED ROUTES */}
          <Route
            path="/ai-planner"
            element={<ProtectedRoute><AIPlanner /></ProtectedRoute>}
          />

          <Route
            path="/booking/:id"
            element={<ProtectedRoute><Booking /></ProtectedRoute>}
          />

          <Route
            path="/trips"
            element={<ProtectedRoute><Trips /></ProtectedRoute>}
          />

          <Route
            path="/profile"
            element={<ProtectedRoute><Profile /></ProtectedRoute>}
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <UserNotifications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trip-results"
            element={<ProtectedRoute><TripResults /></ProtectedRoute>}
          />

          <Route
            path="/request-trip"
            element={<ProtectedRoute><RequestTrip /></ProtectedRoute>}
          />

          <Route
            path="/payment"
            element={<ProtectedRoute><Payment /></ProtectedRoute>}
          />

          <Route
            path="/edit-profile"
            element={<ProtectedRoute><EditProfile /></ProtectedRoute>}
          />

          <Route
            path="/custom-request"
            element={<ProtectedRoute><CustomRequest /></ProtectedRoute>}
          />

          <Route
            path="/ai-chat"
            element={<ProtectedRoute><AIChat /></ProtectedRoute>}
          />

          <Route path="/tour/:id" element={<TourDetails />} />

          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment-success"
            element={<PaymentSuccess />}
          />

          <Route
            path="/payment-cancel"
            element={<PaymentCancel />}
          />
        </Route>

        {/* ================= PROVIDER DASHBOARD ================= */}

        <Route
          path="/provider"
          element={
            <ProtectedRoute allowedRoles={['provider']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="dashboard"
            element={<ProviderDashboard />}
          />

          <Route
            path="requests"
            element={<ProviderRequests />}
          />

          <Route
            path="bookings"
            element={<Bookings />}
          />

          <Route
            path="travelers"
            element={<Travelers />}
          />

          <Route
            path="analytics"
            element={<Analytics />}
          />

          <Route
            path="earnings"
            element={<Earnings />}
          />

          <Route
            path="reviews"
            element={<Reviews />}
          />

          <Route
            path="profile"
            element={<ProviderProfile />}
          />

          <Route
            path="settings"
            element={<ProviderSettings />}
          />

          <Route
            path="add-tour"
            element={<AddTour />}
          />

          <Route
            path="tours"
            element={<MyTours />}
          />

          <Route
            path="tours/edit/:id"
            element={<EditTour />}
          />
        </Route>

        {/* ================= ADMIN ================= */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<AdminDashboard />}
          />

          <Route
            path="users"
            element={<Users />}
          />

          <Route
            path="tours"
            element={<Tours />}
          />

          <Route
            path="providers"
            element={<Providers />}
          />

          <Route
            path="requests"
            element={<AdminRequests />}
          />

          <Route
            path="notifications"
            element={<AdminNotifications />}
          />
        </Route>

      </Routes>

      <FloatingAIButton />
    </>
  );
}

export default App;