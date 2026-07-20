// frontend/src/contexts/AuthContext.jsx
// ✅ UPDATED - Handle accessToken and refreshToken

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
// Backend: traveler, provider, admin
// Frontend: traveler, provider, admin
// ===============================

const ROLE_MAP = {
  'traveler': 'traveler',
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
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);

  /*
  =========================
  CLEAR SESSION
  =========================
  */
  const clearSession = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setToken(null);
    setRefreshToken(null);
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
        
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        
        console.log("✅ User refreshed:", userData.email);
        return true;
      }
      return false;
    } catch (error) {
      console.log("❌ Refresh user failed:", error.response?.status, error.message);
      
      // ✅ If token is invalid (401), clear session
      if (error.response?.status === 401) {
        clearSession();
      }
      return false;
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
        const savedRefreshToken = localStorage.getItem("refreshToken");

        if (savedUser && savedToken) {
          setUser(JSON.parse(savedUser));
          setToken(savedToken);
          if (savedRefreshToken) {
            setRefreshToken(savedRefreshToken);
          }
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
  const login = (userData, accessToken, refreshTokenData = null) => {
    if (!userData || !accessToken) {
      return false;
    }

    setUser(userData);
    setToken(accessToken);
    if (refreshTokenData) {
      setRefreshToken(refreshTokenData);
    }

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", accessToken);
    if (refreshTokenData) {
      localStorage.setItem("refreshToken", refreshTokenData);
    }

    console.log("✅ User logged in:", userData.email);
    return true;
  };

  /*
  =========================
  LOGOUT
  =========================
  */
  const logout = () => {
    clearSession();
    console.log("👋 User logged out");
  };

  /*
  =========================
  UPDATE USER (For EditProfile)
  =========================
  */
  const updateUser = (userData) => {
    if (!userData) return;
    
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    console.log("✅ User updated:", userData.email);
  };

  /*
  =========================
  REFRESH TOKEN
  =========================
  */
  const refreshAccessToken = async () => {
    try {
      const savedRefreshToken = localStorage.getItem("refreshToken");
      if (!savedRefreshToken) {
        console.warn("⚠️ No refresh token available");
        return false;
      }

      const response = await axios.post(
        `${API_URL}/auth/refresh-token`,
        { refreshToken: savedRefreshToken }
      );

      if (response.data.accessToken) {
        const newToken = response.data.accessToken;
        setToken(newToken);
        localStorage.setItem("token", newToken);
        
        if (response.data.refreshToken) {
          setRefreshToken(response.data.refreshToken);
          localStorage.setItem("refreshToken", response.data.refreshToken);
        }
        
        console.log("✅ Token refreshed successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("❌ Token refresh failed:", error.message);
      clearSession();
      return false;
    }
  };

  /*
  =========================
  ROLE HELPERS
  =========================
  */

  // Get user role in frontend format
  const getUserRole = () => {
    if (!user) return null;
    return mapRole(user.role);
  };

  // Check if user has a specific role
  const hasRole = (role) => {
    if (!user) return false;
    const userRole = user.role;
    
    // Map frontend role to backend role
    const roleMap = {
      'traveler': ['traveler', 'user'],
      'provider': ['provider'],
      'admin': ['admin'],
    };
    
    const backendRoles = roleMap[role] || [role];
    return backendRoles.includes(userRole);
  };

  // Check if user is admin
  const isAdmin = hasRole('admin');

  // Check if user is provider
  const isProvider = hasRole('provider');

  // Check if user is traveler
  const isTraveler = hasRole('traveler');

  // Check if provider is approved
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
    refreshToken,
    loading,

    login,
    logout,
    refreshUser,
    updateUser,
    refreshAccessToken,

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