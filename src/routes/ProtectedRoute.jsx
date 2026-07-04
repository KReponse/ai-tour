// src/routes/ProtectedRoute.jsx

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// ===============================
// ROLE MAPPING
// ===============================
const ROLE_MAP = {
  'user': 'traveler',
  'provider': 'provider',
  'admin': 'admin',
};

const mapRole = (role) => ROLE_MAP[role] || role;

const ProtectedRoute = ({
  children,
  allowedRoles = [],
  requireApproval = false,
}) => {
  const { user, loading } = useAuth();

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488]/20" />
          <div className="absolute inset-0 rounded-full border-4 border-[#0D9488] border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  // =========================
  // NOT LOGGED IN
  // =========================
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // =========================
  // GET USER ROLE (Frontend format)
  // =========================
  let userRole = user.role;
  
  // Map backend role to frontend format
  if (userRole === 'user') {
    userRole = 'traveler';
  }
  // provider and admin stay the same

  // =========================
  // ROLE CHECK
  // =========================
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Redirect based on role
    if (userRole === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (userRole === 'provider') {
      return <Navigate to="/provider/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  // =========================
  // PROVIDER APPROVAL CHECK
  // =========================
  if (
    allowedRoles.includes("provider") &&
    userRole === "provider" &&
    user.verificationStatus !== "approved"
  ) {
    return <Navigate to="/provider/pending" replace />;
  }

  // =========================
  // TRAVELER TRYING PROVIDER AREA
  // =========================
  if (
    allowedRoles.includes("provider") &&
    userRole !== "provider"
  ) {
    return <Navigate to="/provider/request" replace />;
  }

  return children;
};

export default ProtectedRoute;