// frontend/src/pages/Login.jsx
// ✅ UPDATED - Handle accessToken and refreshToken from API

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { loginUser } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/images/logo.png";

// ===============================
// AI TOUR COLORS
// ===============================
// Teal  : #0D9488
// Gold  : #F59E0B
// Slate : #374151
// White : #FFFFFF
// ===============================

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const data = await loginUser(formData);
      
      console.log("🔐 Login response:", data);

      // ✅ Check for accessToken (new API format)
      if (data.accessToken) {
        // ✅ Store tokens
        localStorage.setItem("token", data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }
        
        // ✅ Call login function from AuthContext
        login(data.user, data.accessToken);

        // ✅ Redirect based on role
        if (data.user?.role === "admin") {
          navigate("/admin");
        } else if (data.user?.role === "provider") {
          navigate("/provider/dashboard");
        } else {
          navigate("/");
        }
      } else {
        // ✅ Fallback for old API format
        if (data.token) {
          login(data.user, data.token);
          navigate("/");
        } else {
          setError("Login successful but no token received");
        }
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      setError(error.response?.data?.message || error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0D9488]/5 via-white to-[#F59E0B]/5 dark:from-gray-950 dark:via-gray-900 dark:to-black px-4 py-10">

      <div className="w-full max-w-md">
        {/* LOGO - Updated with AI Tour colors */}
        <div className="text-center mb-8">
          <div className="w-28 h-28 mx-auto rounded-[32px] bg-white dark:bg-gray-900 flex items-center justify-center shadow-2xl shadow-[#0D9488]/20 mb-5 p-3 border border-gray-100 dark:border-gray-800">
            <img src={logo} alt="AI Tour Logo" className="w-full h-full object-contain" />
          </div>

          <h1 className="text-4xl font-black text-[#374151] dark:text-white">
            AI Tour
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-[#0D9488]" />
            Discover. Plan. Travel Smarter.
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-[32px] shadow-2xl border border-white/20 dark:border-gray-800 p-8">

          <div className="mb-6">
            <h2 className="text-3xl font-black text-[#374151] dark:text-white">
              Welcome Back
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Sign in to continue your journey
            </p>
          </div>

          {/* ERROR - Updated colors */}
          {error && (
            <div className="mb-5 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium mb-2 text-[#374151] dark:text-white">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full h-14 pl-12 pr-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 dark:text-white focus:border-[#0D9488] focus:ring-4 focus:ring-[#0D9488]/20 outline-none transition"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium mb-2 text-[#374151] dark:text-white">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                  className="w-full h-14 pl-12 pr-14 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 dark:text-white focus:border-[#0D9488] focus:ring-4 focus:ring-[#0D9488]/20 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* FORGOT PASSWORD - Updated colors */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-[#0D9488] font-semibold hover:text-[#0D9488]/80 transition"
              >
                Forgot Password?
              </Link>
            </div>

            {/* BUTTON - Updated with AI Tour colors */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#0D9488] to-[#F59E0B] text-white font-bold shadow-xl shadow-[#0D9488]/30 hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing In...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  Login
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </button>
          </form>

          {/* REGISTER - Updated colors */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">Don't have an account?</p>
            <Link
              to="/register"
              className="inline-block mt-2 font-bold text-[#0D9488] hover:text-[#0D9488]/80 transition"
            >
              Create Account →
            </Link>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
            <p className="text-xs text-center text-gray-400 dark:text-gray-500">
              <span className="font-medium text-[#0D9488]">💡 Demo Credentials</span><br />
              Email: demo@aitour.rw | Password: demo123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;