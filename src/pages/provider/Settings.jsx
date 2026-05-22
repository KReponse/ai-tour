import React, {
  useState,
} from 'react';

import {
  Bell,
  Lock,
  Globe,
  Moon,
  ShieldCheck,
  Save,
} from 'lucide-react';

const Settings = () => {

  const [
    notifications,
    setNotifications,
  ] = useState(true);

  const [
    darkMode,
    setDarkMode,
  ] = useState(true);

  const [
    language,
    setLanguage,
  ] = useState('English');

  return (

    <div className="space-y-8">

      {/* HEADER */}
      <div>

        <h1 className="text-3xl font-black text-gray-900 dark:text-white">
          Provider Settings
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage account preferences and security
        </p>

      </div>

      {/* SETTINGS GRID */}
      <div className="grid xl:grid-cols-2 gap-8">

        {/* LEFT COLUMN */}
        <div className="space-y-6">

          {/* NOTIFICATIONS */}
          <div
            className="
              bg-white
              dark:bg-gray-900
              border
              border-gray-200
              dark:border-gray-800
              rounded-3xl
              p-6
              shadow-sm
            "
          >

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-4">

                <div
                  className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-gradient-to-r
                    from-blue-500
                    to-cyan-500
                    text-white
                    flex
                    items-center
                    justify-center
                  "
                >

                  <Bell className="w-6 h-6" />

                </div>

                <div>

                  <h2 className="text-xl font-black dark:text-white">
                    Notifications
                  </h2>

                  <p className="text-gray-500 text-sm">
                    Receive booking and traveler alerts
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
                  w-14
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
                        ? 'left-7'
                        : 'left-1'
                    }
                  `}
                />

              </button>

            </div>

          </div>

          {/* DARK MODE */}
          <div
            className="
              bg-white
              dark:bg-gray-900
              border
              border-gray-200
              dark:border-gray-800
              rounded-3xl
              p-6
              shadow-sm
            "
          >

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-4">

                <div
                  className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-gradient-to-r
                    from-purple-500
                    to-pink-500
                    text-white
                    flex
                    items-center
                    justify-center
                  "
                >

                  <Moon className="w-6 h-6" />

                </div>

                <div>

                  <h2 className="text-xl font-black dark:text-white">
                    Dark Mode
                  </h2>

                  <p className="text-gray-500 text-sm">
                    Switch dashboard appearance
                  </p>

                </div>

              </div>

              <button
                onClick={() =>
                  setDarkMode(
                    !darkMode
                  )
                }
                className={`
                  w-14
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
                        ? 'left-7'
                        : 'left-1'
                    }
                  `}
                />

              </button>

            </div>

          </div>

          {/* LANGUAGE */}
          <div
            className="
              bg-white
              dark:bg-gray-900
              border
              border-gray-200
              dark:border-gray-800
              rounded-3xl
              p-6
              shadow-sm
            "
          >

            <div className="flex items-center gap-4 mb-5">

              <div
                className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-gradient-to-r
                  from-orange-500
                  to-red-500
                  text-white
                  flex
                  items-center
                  justify-center
                "
              >

                <Globe className="w-6 h-6" />

              </div>

              <div>

                <h2 className="text-xl font-black dark:text-white">
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
                w-full
                h-14
                rounded-2xl
                border
                border-gray-300
                dark:border-gray-700
                bg-gray-50
                dark:bg-gray-800
                px-4
                outline-none
                dark:text-white
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

        {/* RIGHT COLUMN */}
        <div className="space-y-6">

          {/* PASSWORD */}
          <div
            className="
              bg-white
              dark:bg-gray-900
              border
              border-gray-200
              dark:border-gray-800
              rounded-3xl
              p-6
              shadow-sm
            "
          >

            <div className="flex items-center gap-4 mb-6">

              <div
                className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-gradient-to-r
                  from-green-500
                  to-emerald-600
                  text-white
                  flex
                  items-center
                  justify-center
                "
              >

                <Lock className="w-6 h-6" />

              </div>

              <div>

                <h2 className="text-xl font-black dark:text-white">
                  Change Password
                </h2>

                <p className="text-gray-500 text-sm">
                  Update your security credentials
                </p>

              </div>

            </div>

            <div className="space-y-4">

              <input
                type="password"
                placeholder="Current Password"
                className="
                  w-full
                  h-14
                  rounded-2xl
                  border
                  border-gray-300
                  dark:border-gray-700
                  bg-gray-50
                  dark:bg-gray-800
                  px-4
                  outline-none
                  dark:text-white
                "
              />

              <input
                type="password"
                placeholder="New Password"
                className="
                  w-full
                  h-14
                  rounded-2xl
                  border
                  border-gray-300
                  dark:border-gray-700
                  bg-gray-50
                  dark:bg-gray-800
                  px-4
                  outline-none
                  dark:text-white
                "
              />

              <input
                type="password"
                placeholder="Confirm Password"
                className="
                  w-full
                  h-14
                  rounded-2xl
                  border
                  border-gray-300
                  dark:border-gray-700
                  bg-gray-50
                  dark:bg-gray-800
                  px-4
                  outline-none
                  dark:text-white
                "
              />

            </div>

          </div>

          {/* SECURITY */}
          <div
            className="
              bg-white
              dark:bg-gray-900
              border
              border-gray-200
              dark:border-gray-800
              rounded-3xl
              p-6
              shadow-sm
            "
          >

            <div className="flex items-center gap-4 mb-5">

              <div
                className="
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
                "
              >

                <ShieldCheck className="w-6 h-6" />

              </div>

              <div>

                <h2 className="text-xl font-black dark:text-white">
                  Security Status
                </h2>

                <p className="text-gray-500 text-sm">
                  Your account is protected
                </p>

              </div>

            </div>

            <div
              className="
                p-5
                rounded-2xl
                bg-green-100
                text-green-700
                font-semibold
              "
            >
              2-Step Verification Enabled
            </div>

          </div>

          {/* SAVE BUTTON */}
          <button
            className="
              w-full
              h-14
              rounded-2xl
              bg-gradient-to-r
              from-blue-600
              to-purple-600
              text-white
              font-bold
              shadow-xl
              hover:scale-[1.02]
              transition-all
              flex
              items-center
              justify-center
              gap-3
            "
          >

            <Save className="w-5 h-5" />

            Save Settings

          </button>

        </div>

      </div>

    </div>

  );
};

export default Settings;