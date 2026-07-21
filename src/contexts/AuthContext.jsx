// src/contexts/AuthContext.jsx

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";

// ===============================
// AI TOUR COLORS
// ===============================
// Teal  : #0D9488
// Gold  : #F59E0B
// Slate : #374151
// White : #FFFFFF
// ===============================

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ===============================
// ROLE MAPPING
// ===============================
// Backend: user, provider, admin
// Frontend: traveler, provider, admin
// ===============================

const ROLE_MAP = {
  'user': 'traveler',
  'provider': 'provider',
  'admin': 'admin',
};

const mapRole = (role) => {
  return ROLE_MAP[role] || role;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  /*
  =========================
  CLEAR SESSION
  =========================
  */
  const clearSession = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  /*
  =========================
  REFRESH USER ⭐
  =========================
  */
  const refreshUser = async () => {
    try {
      const savedToken = localStorage.getItem("token");
      if (!savedToken) return;

      const response = await axios.get(
        `${API_URL}/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        }
      );

      if (response.data.user) {
        const userData = response.data.user;
        
        // ✅ Keep role as is from backend (user, provider, admin)
        // Frontend will map when needed
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        
        console.log("✅ User refreshed:", userData);
      }
    } catch (error) {
      console.log("❌ Refresh user failed:", error);
    }
  };

  /*
  =========================
  RESTORE SESSION
  =========================
  */
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const savedUser = localStorage.getItem("user");
        const savedToken = localStorage.getItem("token");

        if (savedUser && savedToken) {
          setUser(JSON.parse(savedUser));
          setToken(savedToken);
          await refreshUser();
        }
      } catch (error) {
        console.log("❌ Auth restore error:", error);
        clearSession();
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  /*
  =========================
  LOGIN
  =========================
  */
  const login = (userData, userToken) => {
    if (!userData || !userToken) {
      return false;
    }

    setUser(userData);
    setToken(userToken);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userToken);

    return true;
  };

  /*
  =========================
  LOGOUT
  =========================
  */
  const logout = () => {
    clearSession();
  };

  /*
  =========================
  ✅ UPDATE USER (For EditProfile)
  =========================
  */
  const updateUser = (userData) => {
    if (!userData) return;
    
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    console.log("✅ User updated:", userData);
  };

  /*
  =========================
  ROLE HELPERS (Updated)
  =========================
  */

  // Get user role in frontend format
  const getUserRole = () => {
    if (!user) return null;
    return mapRole(user.role);
  };

  // Check if user has a specific role (works with both formats)
  const hasRole = (role) => {
    if (!user) return false;
    const userRole = user.role;
    
    // Check both formats
    if (role === 'traveler' && userRole === 'user') return true;
    return userRole === role;
  };

  // ✅ Updated: Check if user is admin
  const isAdmin = hasRole('admin');

  // ✅ Updated: Check if user is provider
  const isProvider = hasRole('provider');

  // ✅ Updated: Check if user is traveler (includes 'user' from backend)
  const isTraveler = hasRole('traveler') || user?.role === 'user';

  // ✅ Updated: Check if provider is approved
  const isApprovedProvider = isProvider && user?.verificationStatus === "approved";

  // Check if provider is pending
  const isPendingProvider = isProvider && user?.verificationStatus === "pending";

  // Check if provider is rejected
  const isRejectedProvider = isProvider && user?.verificationStatus === "rejected";

  // Get display role
  const displayRole = getUserRole();

  const value = {
    user,
    token,
    loading,

    login,
    logout,
    refreshUser,
    updateUser, // ✅ Added for EditProfile

    isAuthenticated: Boolean(token),

    // Role checks
    isAdmin,
    isProvider,
    isTraveler,

    isApprovedProvider,
    isPendingProvider,
    isRejectedProvider,

    // Helpers
    hasRole,
    getUserRole,
    displayRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};