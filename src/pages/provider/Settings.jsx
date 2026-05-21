import React, {
  useState,
} from 'react';

import {
  Bell,
  Shield,
  Moon,
  Globe,
  Lock,
} from 'lucide-react';

const Settings = () => {

  const [
    notifications,
    setNotifications,
  ] = useState(true);

  const [
    darkMode,
    setDarkMode,
  ] = useState(false);

  const [
    language,
    setLanguage,
  ] = useState('English');

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>

        <h1 className="text-3xl font-black text-gray-900 dark:text-white">
          Settings
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your account preferences and security
        </p>

      </div>

      {/* SETTINGS CARDS */}
      <div className="grid gap-6">

        {/* NOTIFICATIONS */}
        <div className="
          bg-white
          dark:bg-gray-900
          border
          border-gray-200
          dark:border-gray-800
          rounded-3xl
          p-6
          shadow-sm
        ">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">

              <div className="
                w-14
                h-14
                rounded-2xl
                bg-gradient-to-r
                from-blue-600
                to-purple-600
                text-white
                flex
                items-center
                justify-center
              ">

                <Bell className="w-6 h-6" />

              </div>

              <div>

                <h2 className="text-xl font-bold dark:text-white">
                  Notifications
                </h2>

                <p className="text-gray-500 text-sm">
                  Enable booking and trip alerts
                </p>

              </div>

            </div>

            <button
              onClick={() =>
                setNotifications(
                  !notifications
                )
              }
              className={`
                w-16
                h-8
                rounded-full
                transition-all
                relative
                ${
                  notifications
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }
              `}
            >

              <div
                className={`
                  absolute
                  top-1
                  w-6
                  h-6
                  rounded-full
                  bg-white
                  transition-all
                  ${
                    notifications
                      ? 'left-9'
                      : 'left-1'
                  }
                `}
              />

            </button>

          </div>

        </div>

        {/* DARK MODE */}
        <div className="
          bg-white
          dark:bg-gray-900
          border
          border-gray-200
          dark:border-gray-800
          rounded-3xl
          p-6
          shadow-sm
        ">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">

              <div className="
                w-14
                h-14
                rounded-2xl
                bg-gradient-to-r
                from-gray-700
                to-black
                text-white
                flex
                items-center
                justify-center
              ">

                <Moon className="w-6 h-6" />

              </div>

              <div>

                <h2 className="text-xl font-bold dark:text-white">
                  Dark Mode
                </h2>

                <p className="text-gray-500 text-sm">
                  Switch dashboard appearance
                </p>

              </div>

            </div>

            <button
              onClick={() =>
                setDarkMode(!darkMode)
              }
              className={`
                w-16
                h-8
                rounded-full
                transition-all
                relative
                ${
                  darkMode
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }
              `}
            >

              <div
                className={`
                  absolute
                  top-1
                  w-6
                  h-6
                  rounded-full
                  bg-white
                  transition-all
                  ${
                    darkMode
                      ? 'left-9'
                      : 'left-1'
                  }
                `}
              />

            </button>

          </div>

        </div>

        {/* LANGUAGE */}
        <div className="
          bg-white
          dark:bg-gray-900
          border
          border-gray-200
          dark:border-gray-800
          rounded-3xl
          p-6
          shadow-sm
        ">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">

              <div className="
                w-14
                h-14
                rounded-2xl
                bg-gradient-to-r
                from-orange-500
                to-yellow-500
                text-white
                flex
                items-center
                justify-center
              ">

                <Globe className="w-6 h-6" />

              </div>

              <div>

                <h2 className="text-xl font-bold dark:text-white">
                  Language
                </h2>

                <p className="text-gray-500 text-sm">
                  Select preferred language
                </p>

              </div>

            </div>

            <select
              value={language}
              onChange={(e) =>
                setLanguage(
                  e.target.value
                )
              }
              className="
                h-12
                px-5
                rounded-2xl
                border
                border-gray-200
                dark:border-gray-700
                bg-gray-50
                dark:bg-gray-800
                dark:text-white
                outline-none
              "
            >

              <option>
                English
              </option>

              <option>
                French
              </option>

              <option>
                Kinyarwanda
              </option>

              <option>
                Swahili
              </option>

            </select>

          </div>

        </div>

        {/* SECURITY */}
        <div className="
          bg-white
          dark:bg-gray-900
          border
          border-gray-200
          dark:border-gray-800
          rounded-3xl
          p-6
          shadow-sm
        ">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">

              <div className="
                w-14
                h-14
                rounded-2xl
                bg-gradient-to-r
                from-red-500
                to-pink-500
                text-white
                flex
                items-center
                justify-center
              ">

                <Shield className="w-6 h-6" />

              </div>

              <div>

                <h2 className="text-xl font-bold dark:text-white">
                  Security
                </h2>

                <p className="text-gray-500 text-sm">
                  Update your password
                </p>

              </div>

            </div>

            <button
              className="
                h-12
                px-6
                rounded-2xl
                bg-gradient-to-r
                from-blue-600
                to-purple-600
                text-white
                font-semibold
              "
            >

              <div className="flex items-center gap-2">

                <Lock className="w-4 h-4" />

                Change Password

              </div>

            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Settings;