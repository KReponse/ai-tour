// src/components/provider/ProviderMobileNavbar.jsx

import React from 'react';

import {
  Menu,
  Bell,
} from 'lucide-react';

const ProviderMobileNavbar = ({
  onMenuClick,
}) => {

  return (
    <header
      className="
        lg:hidden
        fixed
        top-0
        left-0
        right-0
        h-16
        z-50
        bg-white/90
        dark:bg-gray-950/90
        backdrop-blur-xl
        border-b
        border-gray-200
        dark:border-gray-800
      "
    >

      <div className="h-full px-4 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-3">

          {/* MENU BUTTON */}
          <button
            onClick={onMenuClick}
            className="
              w-11
              h-11
              rounded-2xl
              bg-gray-100
              dark:bg-gray-800
              flex
              items-center
              justify-center
            "
          >

            <Menu className="w-5 h-5 dark:text-white" />

          </button>

          {/* LOGO */}
          <div>

            <h1
              className="
                text-lg
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

          </div>

        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {/* NOTIFICATION */}
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
              3
            </span>

          </button>

          {/* PROFILE */}
          <img
            src="https://i.pravatar.cc/150?img=12"
            alt="profile"
            className="
              w-11
              h-11
              rounded-2xl
              object-cover
              border-2
              border-blue-500
            "
          />

        </div>

      </div>

    </header>
  );
};

export default ProviderMobileNavbar;