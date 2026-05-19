
import React, { useState } from 'react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Plane,
  Sparkles,
} from 'lucide-react';

import { loginUser } from '../services/authService';

import { useAuth } from '../contexts/AuthContext';


const Login = () => {

  const navigate = useNavigate();

  const { login } = useAuth();

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      email: '',
      password: '',
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data =
        await loginUser(formData);

      console.log(data);

      // LOGIN USER
      login(
        data.user,
        data.token
      );

      // REDIRECT
      navigate('/');

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data
          ?.message ||
          'Login failed'
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-black px-4 py-10">

      <div className="w-full max-w-md">

        {/* LOGO */}
        <div className="text-center mb-8">

          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-2xl mb-5">

            <Plane className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
            AI Tour
          </h1>

          <p className="text-gray-600 dark:text-gray-400">
            Welcome back traveler ✈️
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-800 p-6 md:p-8">

          <div className="flex items-center gap-2 mb-6">

            <Sparkles className="w-5 h-5 text-blue-600" />

            <h2 className="text-2xl font-bold dark:text-white">
              Login
            </h2>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* EMAIL */}
            <div>

              <label className="block text-sm font-medium mb-2 dark:text-white">
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
                  className="w-full h-14 pl-12 pr-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>

              <label className="block text-sm font-medium mb-2 dark:text-white">
                Password
              </label>

              <div className="relative">

                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                  className="w-full h-14 pl-12 pr-14 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* FORGOT */}
            <div className="flex justify-end">

              <button
                type="button"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-lg shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-70"
            >
              {loading
                ? 'Signing In...'
                : 'Login'}
            </button>
          </form>

          {/* REGISTER */}
          <div className="mt-6 text-center">

            <p className="text-gray-600 dark:text-gray-400">
              Don’t have an account?
            </p>

            <Link
              to="/register"
              className="inline-block mt-2 text-blue-600 font-semibold hover:underline"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

