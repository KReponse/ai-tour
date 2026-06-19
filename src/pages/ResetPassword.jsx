import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import axios from "axios";

const API = "http://localhost:5000/api/auth";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid or missing reset token");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!validatePassword(formData.password)) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${API}/reset-password/${token}`,
        {
          password: formData.password,
        }
      );

      setSubmitted(true);

      setTimeout(() => {
        navigate("/login");
      }, 2500);

    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Reset failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
  SUCCESS SCREEN
  ========================= */
  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center animate-fade-in">

          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />

          <h2 className="text-2xl font-bold">
            Password Reset Successful
          </h2>

          <p className="text-gray-500 mt-2">
            Redirecting to login...
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            Create New Password
          </h1>
          <p className="text-gray-500 mt-2">
            Choose a strong and secure password
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">

          {/* ERROR */}
          {error && (
            <div className="mb-4 text-red-600 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium">
                New Password
              </label>

              <div className="relative mt-2">

                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value,
                    })
                  }
                  className="w-full h-12 pl-10 pr-10 border rounded-xl dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                  placeholder="Enter new password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-500" />
                  )}
                </button>

              </div>
            </div>

            {/* CONFIRM */}
            <div>
              <label className="text-sm font-medium">
                Confirm Password
              </label>

              <div className="relative mt-2">

                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full h-12 pl-10 pr-10 border rounded-xl dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
                  placeholder="Confirm new password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-500" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-500" />
                  )}
                </button>

              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-teal-600 to-orange-500 text-white font-semibold rounded-xl hover:scale-[1.02] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;