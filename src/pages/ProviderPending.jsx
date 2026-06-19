import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Clock,
  CheckCircle,
  Home,
  LogOut,
  Building2,
  ShieldCheck,
} from "lucide-react";

import logo from "../assets/images/logo.png";
import { useAuth } from "../contexts/AuthContext";

const ProviderPending = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  /* =========================
  AUTO REDIRECT IF APPROVED
  ========================= */
  useEffect(() => {
    if (user?.role === "provider") {
      navigate("/provider/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-teal-50 via-white to-yellow-50 dark:from-gray-950 dark:via-gray-900 dark:to-black">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-[32px] shadow-2xl border border-white/20 dark:border-gray-800 p-8 md:p-10 text-center"
      >

        {/* LOGO */}
        <div className="w-24 h-24 mx-auto rounded-[30px] bg-gradient-to-br from-teal-600 to-orange-500 flex items-center justify-center shadow-xl mb-6">
          <img src={logo} alt="AI Tour Logo" className="w-14 h-14 object-contain" />
        </div>

        <h1 className="text-4xl font-black text-gray-900 dark:text-white">
          AI Tour
        </h1>

        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Smart Travel Powered by AI
        </p>

        {/* STATUS ICON */}
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mt-8 w-20 h-20 mx-auto rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center"
        >
          <Clock className="w-10 h-10 text-yellow-600" />
        </motion.div>

        <h2 className="mt-6 text-2xl font-black dark:text-white">
          Provider Account Pending
        </h2>

        <p className="mt-3 text-gray-600 dark:text-gray-300 leading-relaxed">
          Thank you for joining AI Tour. Your tourism business profile is currently under review by our admin team.
        </p>

        {/* STATUS CARD */}
        <div className="mt-8 p-5 rounded-2xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-left">

          <div className="flex items-center gap-3">
            <Building2 className="text-yellow-600" />

            <div>
              <h3 className="font-bold dark:text-white">
                Business Verification
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Waiting for admin approval
              </p>
            </div>
          </div>

        </div>

        {/* FEATURES */}
        <div className="mt-6 space-y-3 text-left">

          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <CheckCircle className="text-green-500" />
            Account created successfully
          </div>

          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <ShieldCheck className="text-teal-600" />
            Secure provider verification
          </div>

        </div>

        {/* BUTTONS */}
        <div className="mt-8 grid md:grid-cols-2 gap-4">

          <Link
            to="/"
            className="h-14 rounded-2xl bg-gradient-to-r from-teal-600 to-orange-500 text-white font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition"
          >
            <Home size={20} />
            Home
          </Link>

          <button
            onClick={handleLogout}
            className="h-14 rounded-2xl border border-gray-200 dark:border-gray-700 font-bold text-gray-700 dark:text-white flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <LogOut size={20} />
            Logout
          </button>

        </div>

      </motion.div>

    </div>
  );
};

export default ProviderPending;