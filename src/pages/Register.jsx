
import React, { useState } from 'react';

import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  MapPin,
  Sparkles,
  Globe,
  ShieldCheck,
} from 'lucide-react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import { registerUser } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      fullName: '',
      email: '',
      phone: '',
      country: '',
      password: '',
      role: 'user',
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
        await registerUser(
          formData
        );

      console.log(data);

    // LOGIN USER GLOBALLY
login(
  data.user,
  data.token
);

// ROLE-BASED REDIRECT
if (data.user.role === 'admin') {

  navigate('/admin');

} else if (
  data.user.role === 'provider'
) {

  navigate('/provider');

} else {

  navigate('/');

}

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data
          ?.message ||
          'Registration failed'
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-black flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-6xl grid lg:grid-cols-2 bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800">

        {/* LEFT SIDE */}
        <div className="hidden lg:flex relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white p-10 flex-col justify-between overflow-hidden">

          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white"></div>

            <div className="absolute bottom-10 right-10 w-52 h-52 rounded-full bg-white"></div>
          </div>

          <div className="relative z-10">

            <div className="flex items-center gap-3 mb-10">

              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Globe className="w-7 h-7" />
              </div>

              <div>
                <h1 className="text-3xl font-black">
                  AI Tour Rwanda
                </h1>

                <p className="text-white/80">
                  Smart Tourism Platform
                </p>
              </div>
            </div>

            <h2 className="text-5xl font-black leading-tight mb-6">
              Create Your
              <br />
              AI Travel Account
            </h2>

            <p className="text-lg text-white/90 leading-relaxed">
              Join Rwanda’s next-generation tourism ecosystem powered by AI.
            </p>
          </div>

          <div className="relative z-10 space-y-4">

            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-green-300" />

              <span>
                Secure Authentication
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-yellow-300" />

              <span>
                AI-Powered Experiences
              </span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6 text-pink-300" />

              <span>
                Explore Rwanda Smarter
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="p-6 md:p-10">

          <div className="mb-8 text-center lg:text-left">

            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
              Create Account
            </h2>

            <p className="text-gray-500 dark:text-gray-400">
              Start your AI-powered tourism journey
            </p>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* FULL NAME */}
            <div>

              <label className="block text-sm font-medium mb-2 dark:text-white">
                Full Name
              </label>

              <div className="relative">

                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full h-14 pl-12 pr-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

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
                  placeholder="example@gmail.com"
                  required
                  className="w-full h-14 pl-12 pr-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* PHONE + COUNTRY */}
            <div className="grid md:grid-cols-2 gap-5">

              <div>

                <label className="block text-sm font-medium mb-2 dark:text-white">
                  Phone Number
                </label>

                <div className="relative">

                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+250..."
                    required
                    className="w-full h-14 pl-12 pr-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>

                <label className="block text-sm font-medium mb-2 dark:text-white">
                  Country
                </label>

                <div className="relative">

                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Rwanda"
                    required
                    className="w-full h-14 pl-12 pr-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* ROLE */}
            <div>

              <label className="block text-sm font-medium mb-2 dark:text-white">
                Account Type
              </label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full h-14 px-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              >

                <option value="user">
                  Client / Traveler
                </option>

                <option value="provider">
                  Service Provider
                </option>

              </select>
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
                  placeholder="Create strong password"
                  required
                  className="w-full h-14 pl-12 pr-14 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white font-bold text-lg shadow-xl hover:scale-[1.02] transition-all duration-300"
            >
              {loading
                ? 'Creating Account...'
                : 'Create Account'}
            </button>
          </form>

          {/* LOGIN */}
          <div className="mt-8 text-center">

            <p className="text-gray-500 dark:text-gray-400">

              Already have an account?{' '}

              <Link
                to="/login"
                className="text-blue-600 font-bold hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

