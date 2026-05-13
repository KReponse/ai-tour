// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
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




function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/ai-planner" element={<AIPlanner />} />
        <Route path="/booking/:id"  element={<Booking />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/destination/:id" element={<DestinationDetails />} />
        <Route path="/trip-results" element={<TripResults />} />
        <Route path="/request-trip" element={<RequestTrip />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/custom-request" element={<CustomRequest />} />
      </Routes>
    </Layout>
  );
}

export default App;