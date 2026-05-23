import React from 'react';

import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
} from 'lucide-react';

const ProviderFooter = () => {

  return (

    <footer
      className="
        mt-10
        border-t
        border-gray-200
        dark:border-gray-800
        bg-white/70
        dark:bg-gray-950/70
        backdrop-blur-xl
      "
    >

      <div
        className="
          px-6
          py-6
          flex
          flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-6
        "
      >

        {/* LEFT */}
        <div>

          <h2
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
          </h2>

          <p
            className="
              text-sm
              text-gray-500
              dark:text-gray-400
              mt-1
            "
          >
            Provider Dashboard Management System
          </p>

        </div>

        {/* CENTER */}
        <div
          className="
            flex
            flex-wrap
            items-center
            gap-5
            text-sm
            font-medium
            text-gray-600
            dark:text-gray-300
          "
        >

          <button className="hover:text-blue-600 transition">
            Privacy Policy
          </button>

          <button className="hover:text-blue-600 transition">
            Terms
          </button>

          <button className="hover:text-blue-600 transition">
            Support
          </button>

          <button className="hover:text-blue-600 transition">
            Contact
          </button>

        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          <button
            className="
              w-10
              h-10
              rounded-2xl
              bg-gray-100
              dark:bg-gray-800
              hover:bg-blue-600
              hover:text-white
              transition-all
              flex
              items-center
              justify-center
            "
          >

            <Facebook className="w-5 h-5" />

          </button>

          <button
            className="
              w-10
              h-10
              rounded-2xl
              bg-gray-100
              dark:bg-gray-800
              hover:bg-pink-600
              hover:text-white
              transition-all
              flex
              items-center
              justify-center
            "
          >

            <Instagram className="w-5 h-5" />

          </button>

          <button
            className="
              w-10
              h-10
              rounded-2xl
              bg-gray-100
              dark:bg-gray-800
              hover:bg-sky-500
              hover:text-white
              transition-all
              flex
              items-center
              justify-center
            "
          >

            <Twitter className="w-5 h-5" />

          </button>

          <button
            className="
              w-10
              h-10
              rounded-2xl
              bg-gray-100
              dark:bg-gray-800
              hover:bg-blue-700
              hover:text-white
              transition-all
              flex
              items-center
              justify-center
            "
          >

            <Linkedin className="w-5 h-5" />

          </button>

        </div>

      </div>

      {/* BOTTOM */}
      <div
        className="
          border-t
          border-gray-200
          dark:border-gray-800
          py-4
          text-center
          text-sm
          text-gray-500
        "
      >

        © 2026 AI Tour Rwanda — All rights reserved.

      </div>

    </footer>

  );

};

export default ProviderFooter;