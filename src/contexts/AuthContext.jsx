import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  /*
  =========================
  RESTORE SESSION
  =========================
  */
  useEffect(() => {
    const restoreSession = () => {
      try {
        const savedUser = localStorage.getItem("user");
        const savedToken = localStorage.getItem("token");

        if (savedUser && savedToken) {
          setUser(JSON.parse(savedUser));
          setToken(savedToken);
        }
      } catch (error) {
        console.error("Auth restore error:", error);
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
    if (!userData || !userToken) return false;

    setUser(userData);
    setToken(userToken);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userToken);

    return true;
  };

  /*
  =========================
  REFRESH USER (NEW ⭐)
  =========================
  */
  const refreshUser = async () => {
    try {
      const savedToken = localStorage.getItem("token");

      if (!savedToken) return;

      const { data } = await axios.get(
        "http://localhost:5000/api/auth/me",
        {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        }
      );

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    } catch (error) {
      console.log("Refresh user failed:", error);
    }
  };

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
  LOGOUT
  =========================
  */
  const logout = () => {
    clearSession();
  };

  /*
  =========================
  ROLE HELPERS
  =========================
  */
  const isAdmin = user?.role === "admin";
  const isProvider = user?.role === "provider";
  const isTraveler = user?.role === "traveler";

  const isApprovedProvider =
    user?.role === "provider" &&
    user?.verificationStatus === "approved";

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    refreshUser, // ⭐ NEW
    isAuthenticated: Boolean(token),
    isAdmin,
    isProvider,
    isTraveler,
    isApprovedProvider,
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