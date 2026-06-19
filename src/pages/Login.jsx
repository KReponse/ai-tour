
import React, { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

import { loginUser } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/images/logo.png";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
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
      setError("");

      const data =
        await loginUser(formData);

      login(
        data.user,
        data.token
      );

      if (
        data.user.role ===
        "provider"
      ) {
        navigate(
          "/provider/dashboard"
        );
      } else if (
        data.user.role ===
        "admin"
      ) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      setError(
        error.response?.data
          ?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
      min-h-screen

      flex
      items-center
      justify-center

      bg-gradient-to-br
      from-primary/10
      via-white
      to-accent/10

      dark:from-dark
      dark:via-gray-950
      dark:to-black

      px-4
      py-10
    "
    >
      <div className="w-full max-w-md">
        {/* LOGO */}

        <div className="text-center mb-8">
          <div
className="
w-28
h-28
mx-auto

rounded-[32px]

bg-white

dark:bg-gray-900

flex
items-center
justify-center

shadow-2xl

mb-5

p-3

border
border-gray-100
dark:border-gray-800
"
>
<img
  src={logo}
  alt="AI Tour Logo"
  className="
  w-full
  h-full
  object-contain
  "
/>
</div>

          <h1
            className="
            text-4xl
            font-black
            text-dark
            dark:text-white
          "
          >
            AI Tour
          </h1>

          <p
            className="
            text-gray-500
            mt-2
          "
          >
            Discover. Plan. Travel Smarter.
          </p>
        </div>

        {/* CARD */}

        <div
          className="
          bg-white/90
          dark:bg-gray-900/90

          backdrop-blur-2xl

          rounded-[32px]

          shadow-2xl

          border
          border-white/20
          dark:border-gray-800

          p-8
        "
        >
          <div className="mb-6">
            <h2
              className="
              text-3xl
              font-black
              text-dark
              dark:text-white
            "
            >
              Welcome Back
            </h2>

            <p className="text-gray-500 mt-1">
              Sign in to continue
              your journey
            </p>
          </div>

          {/* ERROR */}

          {error && (
            <div
              className="
              mb-5

              rounded-2xl

              bg-red-50
              border
              border-red-200

              text-red-600

              px-4
              py-3
            "
            >
              {error}
            </div>
          )}

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* EMAIL */}

            <div>
              <label
                className="
                block
                text-sm
                font-medium
                mb-2

                dark:text-white
              "
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2

                  w-5
                  h-5

                  text-gray-400
                "
                />

                <input
                  type="email"
                  name="email"
                  value={
                    formData.email
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter your email"
                  required
                  className="
                  w-full
                  h-14

                  pl-12
                  pr-4

                  rounded-2xl

                  bg-gray-50
                  dark:bg-gray-800

                  border
                  border-gray-200
                  dark:border-gray-700

                  dark:text-white

                  focus:border-primary
                  focus:ring-4
                  focus:ring-primary/20

                  outline-none
                  transition
                "
                />
              </div>
            </div>

            {/* PASSWORD */}

            <div>
              <label
                className="
                block
                text-sm
                font-medium
                mb-2

                dark:text-white
              "
              >
                Password
              </label>

              <div className="relative">
                <Lock
                  className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2

                  w-5
                  h-5

                  text-gray-400
                "
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={
                    formData.password
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Enter password"
                  required
                  className="
                  w-full
                  h-14

                  pl-12
                  pr-14

                  rounded-2xl

                  bg-gray-50
                  dark:bg-gray-800

                  border
                  border-gray-200
                  dark:border-gray-700

                  dark:text-white

                  focus:border-primary
                  focus:ring-4
                  focus:ring-primary/20

                  outline-none
                  transition
                "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2

                  text-gray-400
                "
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* FORGOT PASSWORD */}

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="
                text-primary
                font-semibold

                hover:text-accent

                transition
              "
              >
                Forgot Password?
              </Link>
            </div>

            {/* BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="
              w-full
              h-14

              rounded-2xl

              bg-gradient-to-r
              from-primary
              to-accent

              text-white
              font-bold

              shadow-xl

              hover:scale-[1.02]

              transition-all

              disabled:opacity-70
              disabled:cursor-not-allowed
            "
            >
              {loading ? (
                <div
                  className="
                  flex
                  items-center
                  justify-center
                  gap-2
                "
                >
                  <Loader2
                    className="
                    w-5
                    h-5
                    animate-spin
                  "
                  />

                  Signing In...
                </div>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* REGISTER */}

          <div className="mt-8 text-center">
            <p className="text-gray-500">
              Don't have an account?
            </p>

            <Link
              to="/register"
              className="
              inline-block
              mt-2

              font-bold

              text-primary

              hover:text-accent

              transition
            "
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

