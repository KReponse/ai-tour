// src/components/provider/ProviderNavbar.jsx

import React, {
  useState,
  useEffect,
  useRef,
} from 'react';

import {
  Bell,
  Search,
  Moon,
  Sun,
  MessageCircle,
  Menu,
  ChevronDown,
  Settings,
  User,
  LogOut,
} from 'lucide-react';

const ProviderNavbar = ({
  onMenuClick,
}) => {

  const [darkMode, setDarkMode] =
    useState(false);

  const [
    profileOpen,
    setProfileOpen,
  ] = useState(false);

  const profileRef = useRef();

  /* ================= DARK MODE ================= */
  useEffect(() => {

    if (darkMode) {
      document.documentElement.classList.add(
        'dark'
      );
    } else {
      document.documentElement.classList.remove(
        'dark'
      );
    }

  }, [darkMode]);

  /* ================= CLOSE DROPDOWN ================= */
  useEffect(() => {

    const handleClickOutside = (e) => {

      if (
        profileRef.current &&
        !profileRef.current.contains(
          e.target
        )
      ) {
        setProfileOpen(false);
      }

    };

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );

  }, []);

  return (

    <header
      className="
        fixed
        top-0
        left-0
        right-0
        h-16
        z-50
        bg-white/70
        dark:bg-gray-950/70
        backdrop-blur-2xl
        border-b
        border-gray-200
        dark:border-gray-800
        shadow-sm
      "
    >

      <div
        className="
          h-full
          px-4
          lg:px-8
          flex
          items-center
          justify-between
        "
      >

        {/* ================= LEFT ================= */}
        <div className="flex items-center gap-4">

          {/* MOBILE MENU */}
          <button
            onClick={onMenuClick}
            className="
              lg:hidden
              w-11
              h-11
              rounded-2xl
              bg-gray-100
              dark:bg-gray-800
              flex
              items-center
              justify-center
              transition
            "
          >

            <Menu className="w-5 h-5 dark:text-white" />

          </button>

          {/* LOGO */}
          <div>

            <h1
              className="
                text-xl
                font-black
                bg-gradient-to-r
                from-blue-600
                to-purple-600
                bg-clip-text
                text-transparent
              "
            >
              AI Tour Rwanda
            </h1>

            <p
              className="
                hidden
                md:block
                text-xs
                text-gray-500
              "
            >
              Provider Dashboard
            </p>

          </div>

        </div>

        {/* ================= SEARCH ================= */}
        <div
          className="
            hidden
            lg:flex
            flex-1
            max-w-2xl
            mx-10
          "
        >

          <div className="relative w-full">

            <Search
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
              type="text"
              placeholder="Search tours, bookings, travelers..."
              className="
                w-full
                h-12
                pl-12
                pr-5
                rounded-2xl
                bg-gray-100
                dark:bg-gray-800
                border
                border-transparent
                focus:border-blue-500
                dark:focus:border-purple-500
                outline-none
                dark:text-white
                transition-all
              "
            />

          </div>

        </div>

        {/* ================= RIGHT ================= */}
        <div className="flex items-center gap-3">

          {/* DARK MODE */}
          <button
            onClick={() =>
              setDarkMode(!darkMode)
            }
            className="
              w-11
              h-11
              rounded-2xl
              bg-gray-100
              dark:bg-gray-800
              flex
              items-center
              justify-center
              transition
              hover:scale-105
            "
          >

            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 dark:text-white" />
            )}

          </button>

          {/* MESSAGES */}
          <button
            className="
              relative
              w-11
              h-11
              rounded-2xl
              bg-gray-100
              dark:bg-gray-800
              flex
              items-center
              justify-center
              hover:scale-105
              transition
            "
          >

            <MessageCircle className="w-5 h-5 dark:text-white" />

            <span
              className="
                absolute
                -top-1
                -right-1
                w-5
                h-5
                rounded-full
                bg-blue-600
                text-white
                text-xs
                flex
                items-center
                justify-center
              "
            >
              2
            </span>

          </button>

          {/* NOTIFICATIONS */}
          <button
            className="
              relative
              w-11
              h-11
              rounded-2xl
              bg-gray-100
              dark:bg-gray-800
              flex
              items-center
              justify-center
              hover:scale-105
              transition
            "
          >

            <Bell className="w-5 h-5 dark:text-white" />

            <span
              className="
                absolute
                -top-1
                -right-1
                w-5
                h-5
                rounded-full
                bg-red-500
                text-white
                text-xs
                flex
                items-center
                justify-center
              "
            >
              5
            </span>

          </button>

          {/* PROFILE */}
          <div
            className="relative"
            ref={profileRef}
          >

            <button
              onClick={() =>
                setProfileOpen(
                  !profileOpen
                )
              }
              className="
                flex
                items-center
                gap-3
                px-3
                h-12
                rounded-2xl
                bg-gray-100
                dark:bg-gray-800
                hover:bg-gray-200
                dark:hover:bg-gray-700
                transition
              "
            >

              <div className="relative">

                <img
                  src="https://i.pravatar.cc/150?img=12"
                  alt="profile"
                  className="
                    w-9
                    h-9
                    rounded-xl
                    object-cover
                  "
                />

                {/* ONLINE */}
                <span
                  className="
                    absolute
                    bottom-0
                    right-0
                    w-3
                    h-3
                    rounded-full
                    bg-green-500
                    border-2
                    border-white
                  "
                />

              </div>

              <div className="hidden md:block text-left">

                <h3 className="text-sm font-bold dark:text-white">
                  Reponse Dev
                </h3>

                <p className="text-xs text-gray-500">
                  Provider
                </p>

              </div>

              <ChevronDown className="w-4 h-4 text-gray-500" />

            </button>

            {/* DROPDOWN */}
            {profileOpen && (

              <div
                className="
                  absolute
                  right-0
                  mt-3
                  w-64
                  rounded-3xl
                  bg-white
                  dark:bg-gray-900
                  border
                  border-gray-200
                  dark:border-gray-800
                  shadow-2xl
                  overflow-hidden
                "
              >

                <div className="p-5 border-b border-gray-200 dark:border-gray-800">

                  <h3 className="font-black dark:text-white">
                    Reponse Dev
                  </h3>

                  <p className="text-sm text-gray-500">
                    reponsedev@gmail.com
                  </p>

                </div>

                <div className="p-2">

                  <button
                    className="
                      w-full
                      h-12
                      px-4
                      rounded-2xl
                      flex
                      items-center
                      gap-3
                      hover:bg-gray-100
                      dark:hover:bg-gray-800
                      transition
                    "
                  >

                    <User className="w-5 h-5" />

                    <span className="dark:text-white">
                      Profile
                    </span>

                  </button>

                  <button
                    className="
                      w-full
                      h-12
                      px-4
                      rounded-2xl
                      flex
                      items-center
                      gap-3
                      hover:bg-gray-100
                      dark:hover:bg-gray-800
                      transition
                    "
                  >

                    <Settings className="w-5 h-5" />

                    <span className="dark:text-white">
                      Settings
                    </span>

                  </button>

                  <button
                    className="
                      w-full
                      h-12
                      px-4
                      rounded-2xl
                      flex
                      items-center
                      gap-3
                      text-red-500
                      hover:bg-red-50
                      dark:hover:bg-red-900/20
                      transition
                    "
                  >

                    <LogOut className="w-5 h-5" />

                    Logout

                  </button>

                </div>

              </div>

            )}

          </div>

        </div>

      </div>

    </header>

  );

};

export default ProviderNavbar;