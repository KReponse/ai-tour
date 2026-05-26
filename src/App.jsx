import { Routes, Route, Outlet } from 'react-router-dom';

import Layout from './components/layout/Layout';


import FloatingAIButton from './components/FloatingAIButton';

import Home from './pages/Home';
import Explore from './pages/Explore';
import AIPlanner from './pages/AIPlanner';
import Booking from './pages/Booking';
import Trips from './pages/Trips';
import Reviews from './pages/Reviews';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import DestinationDetails from './pages/DestinationDetails';
import TripResults from './pages/TripResults';
import RequestTrip from './pages/RequestTrip';
import Payment from './pages/Payment';
import EditProfile from './pages/EditProfile';

import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import CustomRequest from './pages/CustomRequest';
import AIChat from './pages/AIChat';
import Register from './pages/Register';

import AdminDashboard from './pages/admin/AdminDashboard';

import ProviderDashboard from './pages/provider/Dashboard';
import Requests from './pages/provider/Requests';
import Bookings from './pages/provider/Bookings';
import Travelers from './pages/provider/Travelers';
import Analytics from './pages/provider/Analytics';
import Earnings from './pages/provider/Earnings';
import ProviderProfile from './pages/provider/Profile';
import ProviderSettings from './pages/provider/Settings';
import AddTour from './pages/provider/AddTour';

import DashboardLayout from './layouts/DashboardLayout';
import MyTours from './pages/provider/MyTours';
import EditTour from './pages/provider/EditTour';
import ProtectedRoute from './routes/ProtectedRoute';



function App() {
  return (
    <>
      <Routes>

        {/* ================= USER SITE ================= */}
        <Route
          element={
            <Layout>
              <Outlet />
            </Layout>
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
            element={<ProtectedRoute><Notifications /></ProtectedRoute>}
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

        </Route>

     {/* ================= PROVIDER DASHBOARD ================= */}

<Route
  path="/provider"
  element={
    <ProtectedRoute
      allowedRoles={[
        'provider',
      ]}
    >
      <DashboardLayout />
    </ProtectedRoute>
  }
>

  <Route
    path="dashboard"
    element={
      <ProviderDashboard />
    }
  />

  <Route
    path="requests"
    element={<Requests />}
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
    element={
      <ProviderProfile />
    }
  />

  <Route
    path="settings"
    element={
      <ProviderSettings />
    }
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
    <ProtectedRoute
      allowedRoles={[
        'admin',
      ]}
    >
      <AdminDashboard />
    </ProtectedRoute>
  }
/>

      </Routes>

      <FloatingAIButton />
    </>
  );
}

export default App;