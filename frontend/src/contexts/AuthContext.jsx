// frontend/src/contexts/AuthContext.jsx
// ✅ OPTIMIZED - Faster token refresh with better error handling

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
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
  
  // ✅ Prevent multiple refresh attempts
  const isRefreshing = useRef(false);
  const refreshPromise = useRef(null);

  /*
  =========================
  CLEAR SESSION
  =========================
  */
  const clearSession = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setToken(null);
    setRefreshToken(null);
  }, []);

  /*
  =========================
  REFRESH USER
  =========================
  */
  const refreshUser = useCallback(async () => {
    try {
      const savedToken = localStorage.getItem("token");
      if (!savedToken) return false;

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
      if (error.response?.status === 401) {
        clearSession();
      }
      return false;
    }
  }, [clearSession]);

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
  }, [refreshUser, clearSession]);

  /*
  =========================
  LOGIN
  =========================
  */
  const login = useCallback((userData, accessToken, refreshTokenData = null) => {
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
  }, []);

  /*
  =========================
  LOGOUT
  =========================
  */
  const logout = useCallback(() => {
    clearSession();
    console.log("👋 User logged out");
  }, [clearSession]);

  /*
  =========================
  UPDATE USER
  =========================
  */
  const updateUser = useCallback((userData) => {
    if (!userData) return;
    
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    console.log("✅ User updated:", userData.email);
  }, []);

  /*
  =========================
  REFRESH TOKEN - OPTIMIZED with deduplication
  =========================
  */
  const refreshAccessToken = useCallback(async () => {
    // ✅ Prevent multiple concurrent refresh attempts
    if (isRefreshing.current) {
      console.log("⏳ Token refresh already in progress, waiting...");
      return refreshPromise.current;
    }

    isRefreshing.current = true;
    
    refreshPromise.current = (async () => {
      try {
        const savedRefreshToken = localStorage.getItem("refreshToken");
        if (!savedRefreshToken) {
          console.warn("⚠️ No refresh token available");
          clearSession();
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
        clearSession();
        return false;
      } catch (error) {
        console.error("❌ Token refresh failed:", error.message);
        clearSession();
        return false;
      } finally {
        isRefreshing.current = false;
        refreshPromise.current = null;
      }
    })();

    return refreshPromise.current;
  }, [clearSession]);

  /*
  =========================
  ROLE HELPERS
  =========================
  */

  const getUserRole = useCallback(() => {
    if (!user) return null;
    return mapRole(user.role);
  }, [user]);

  const hasRole = useCallback((role) => {
    if (!user) return false;
    const userRole = user.role;
    
    const roleMap = {
      'traveler': ['traveler', 'user'],
      'provider': ['provider'],
      'admin': ['admin'],
    };
    
    const backendRoles = roleMap[role] || [role];
    return backendRoles.includes(userRole);
  }, [user]);

  const isAdmin = hasRole('admin');
  const isProvider = hasRole('provider');
  const isTraveler = hasRole('traveler');
  const isApprovedProvider = isProvider && user?.verificationStatus === "approved";
  const isPendingProvider = isProvider && user?.verificationStatus === "pending";
  const isRejectedProvider = isProvider && user?.verificationStatus === "rejected";

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
    displayRole: getUserRole(),
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