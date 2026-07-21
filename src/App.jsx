// src/App.jsx

import React, { useState } from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';

import MainLayout from './components/layout/Layout';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';

import FloatingAIButton from './components/ui/FloatingAIButton';
import AIWidget from './components/ai/AIWidget';

// User Pages
import Home from './pages/Home';
import Dashboard from "./pages/Dashboard";
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
// ⚠️ TourDetails - Keep for backward compatibility (will redirect)
import TourDetails from './pages/TourDetails';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import MyBookings from './pages/MyBookings';
import AIChat from './pages/AIChat';
import CustomRequest from './pages/CustomRequest';
import MyReviews from './pages/MyReviews';
import BookingDetails from './pages/BookingDetails';
import TripDetails from './pages/TripDetails';
import PaymentPage from './pages/PaymentPage';
import ReviewDetails from './pages/ReviewDetails';

// ✅ IMPORT Review Page
import Review from './pages/Review';

// ✅ Provider Notifications
import ProviderNotifications from './pages/provider/ProviderNotifications';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Footer Pages
import About from './pages/About';
import Contact from './pages/Contact';
import HelpCenter from './pages/HelpCenter';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import Careers from './pages/Careers';
import Blog from './pages/Blog';
import FAQs from './pages/FAQs';

// Admin Pages
import Users from './pages/admin/Users';
// ⚠️ Tours - Keep for backward compatibility (will redirect)
import Tours from './pages/admin/Tours';
import Providers from './pages/admin/Providers';
import AdminRequests from './pages/admin/Requests';
import AdminNotifications from './pages/admin/Notifications';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProviderRequests from './pages/admin/ProviderRequests';
import AdminReviews from './pages/admin/Reviews';
import ProviderRequestDetails from "./pages/admin/ProviderRequestDetails";
import ManagementListings from './pages/admin/ManagementListings';

// ✅ NEW: Admin Booking & Payment Pages
import AdminBookings from './pages/admin/AdminBookings';
import AdminPayments from './pages/admin/AdminPayments';
import VerifyEmail from './pages/VerifyEmail';

// Provider Pages
import ProviderDashboard from './pages/provider/Dashboard';
import ProviderRequests from './pages/provider/Requests';
import Bookings from './pages/provider/Bookings';
import Travelers from './pages/provider/Travelers';
import Analytics from './pages/provider/Analytics';
import Earnings from './pages/provider/Earnings';
import ProviderProfile from './pages/provider/Profile';
import ProviderSettings from './pages/provider/Settings';
// ⚠️ AddTour - Keep for backward compatibility (will redirect)
import AddTour from './pages/provider/AddTour';
// ⚠️ MyTours - Keep for backward compatibility (will redirect)
import MyTours from './pages/provider/MyTours';
// ⚠️ EditTour - Keep for backward compatibility (will redirect)
import EditTour from './pages/provider/EditTour';
import ProviderStatus from './pages/provider/ProviderStatus';
import ProviderPending from './pages/ProviderPending';
import ProviderRequest from './pages/ProviderRequest';
import ProviderReviews from './pages/provider/Reviews';
import ProfileEdit from './pages/provider/ProfileEdit';

// Listing Pages (Primary)
import ListingDetails from './pages/ListingDetails';
import MyListings from './pages/provider/MyListings';
import AddListing from './pages/provider/AddListing';
import EditListing from './pages/provider/EditListing';

import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);

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
          
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />

          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/reviews/:reviewId" element={<ReviewDetails />} />

          {/* ========================= */}
          {/* ✅ PROTECTED ROUTES      */}
          {/* ========================= */}

          {/* AI Planner */}
          <Route
            path="/ai-planner"
            element={
              <ProtectedRoute>
                <AIPlanner />
              </ProtectedRoute>
            }
          />

          {/* ✅ BOOKING FORM (uses listing ID) */}
          <Route
            path="/booking/:listingId"
            element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            }
          />

          {/* ✅ BOOKING DETAILS (uses booking ID) */}
          <Route
            path="/booking-details/:bookingId"
            element={
              <ProtectedRoute>
                <BookingDetails />
              </ProtectedRoute>
            }
          />

          {/* ✅ TRIP DETAILS (uses booking ID) */}
          <Route
            path="/trip/:bookingId"
            element={
              <ProtectedRoute>
                <TripDetails />
              </ProtectedRoute>
            }
          />

          {/* ✅ PAYMENT PAGE (uses booking ID) */}
          <Route
            path="/payment/:bookingId"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />

          {/* ⚠️ Legacy: Keep for backward compatibility */}
          <Route
            path="/trips"
            element={
              <ProtectedRoute>
                <Trips />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
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
            path="/provider/request"
            element={
              <ProtectedRoute allowedRoles={["traveler"]}>
                <ProviderRequest />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trip-results"
            element={
              <ProtectedRoute>
                <TripResults />
              </ProtectedRoute>
            }
          />

          <Route
            path="/request-trip"
            element={
              <ProtectedRoute>
                <RequestTrip />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/custom-request"
            element={
              <ProtectedRoute>
                <CustomRequest />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ai-chat"
            element={
              <ProtectedRoute>
                <AIChat />
              </ProtectedRoute>
            }
          />

          {/* ✅ REVIEW ROUTE (Add this) */}
          <Route
            path="/review/:bookingId"
            element={
              <ProtectedRoute>
                <Review />
              </ProtectedRoute>
            }
          />

          {/* ⚠️ Legacy: TourDetails redirects to ListingDetails */}
          <Route path="/tour/:id" element={<TourDetails />} />
          
          {/* ✅ Primary: ListingDetails */}
          <Route path="/listing/:id" element={<ListingDetails />} />

          {/* ⚠️ Legacy: My Bookings (keep for backward compatibility) */}
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
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-reviews"
            element={
              <ProtectedRoute>
                <MyReviews />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reviews"
            element={
              <ProtectedRoute>
                <Reviews />
              </ProtectedRoute>
            }
          />

          {/* ⚠️ Legacy: Payment pages (keep for backward compatibility) */}
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancel" element={<PaymentCancel />} />
        </Route>

        {/* ================= PROVIDER STATUS ================= */}
        <Route
          path="/provider/status"
          element={
            <ProtectedRoute allowedRoles={["traveler", "provider"]}>
              <ProviderStatus />
            </ProtectedRoute>
          }
        />

        <Route
          path="/provider/pending"
          element={
            <ProtectedRoute allowedRoles={["provider"]}>
              <ProviderPending />
            </ProtectedRoute>
          }
        />

        {/* ================= PROVIDER DASHBOARD ================= */}
        <Route
          path="/provider"
          element={
            <ProtectedRoute allowedRoles={["provider"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<ProviderDashboard />} />
          <Route path="requests" element={<ProviderRequests />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="travelers" element={<Travelers />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="profile" element={<ProviderProfile />} />
          <Route path="settings" element={<ProviderSettings />} />
          
          {/* ✅ Provider Notifications */}
          <Route path="notifications" element={<ProviderNotifications />} />
          
          {/* ⚠️ Legacy: Tour routes (redirect to Listing equivalents) */}
          <Route path="add-tour" element={<AddTour />} />
          <Route path="tours" element={<MyTours />} />
          <Route path="tours/edit/:id" element={<EditTour />} />
          
          <Route path="pending" element={<ProviderPending />} />
          <Route path="reviews" element={<ProviderReviews />} />
          <Route path="profile/edit" element={<ProfileEdit />} />
          
          {/* ✅ Primary: Listing Routes */}
          <Route path="listings" element={<MyListings />} />
          <Route path="add-listing" element={<AddListing />} />
          <Route path="listings/edit/:id" element={<EditListing />} />
          
        </Route>

        {/* ================= ADMIN DASHBOARD ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="providers" element={<Providers />} />
          
          {/* ✅ NEW: Admin Bookings */}
          <Route path="bookings" element={<AdminBookings />} />
          
          {/* ✅ NEW: Admin Payments */}
          <Route path="payments" element={<AdminPayments />} />
          
          {/* ⚠️ Legacy: Tours route (redirect to Listings) */}
          <Route path="tours" element={<Tours />} />
          
          <Route path="requests" element={<AdminRequests />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="provider-requests" element={<AdminProviderRequests />} />
          <Route path="reviews" element={<AdminReviews />} />
          
          {/* ✅ Primary: Admin Listing Management */}
          <Route path="listings" element={<ManagementListings />} />
          
          <Route path="provider-requests/:id" element={<ProviderRequestDetails />} />
        </Route>
      </Routes>

      {/* AI Widget */}
      <AIWidget 
        isOpen={isWidgetOpen} 
        onClose={() => setIsWidgetOpen(false)} 
      />

      <FloatingAIButton onOpen={() => setIsWidgetOpen(true)} />
    </>
  );
}

export default App;