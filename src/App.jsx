// src/App.jsx

import React from 'react';

import {
  Routes,
  Route,
} from 'react-router-dom';

import Layout from './components/layout/Layout';

import ProtectedRoute from './components/ProtectedRoute';

import FloatingAIButton from './components/FloatingAIButton';

// PAGES
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
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import CustomRequest from './pages/CustomRequest';
import AIChat from './pages/AIChat';


function App() {
  return (
    <Layout>

      <Routes>

        {/* PUBLIC ROUTES */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/explore"
          element={<Explore />}
        />

        <Route
          path="/destination/:id"
          element={<DestinationDetails />}
        />

        <Route
          path="/reviews"
          element={<Reviews />}
        />

        <Route
          path="/signup"
          element={<SignUp />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        {/* PROTECTED ROUTES */}

        <Route
          path="/ai-planner"
          element={
            <ProtectedRoute>
              <AIPlanner />
            </ProtectedRoute>
          }
        />

        <Route
          path="/booking/:id"
          element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          }
        />

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
              <Notifications />
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
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
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

      </Routes>

      <FloatingAIButton />

    </Layout>
  );
}

export default App;