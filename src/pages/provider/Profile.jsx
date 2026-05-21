import React from 'react';

import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Camera,
} from 'lucide-react';

const Profile = () => {

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>

        <h1 className="text-3xl font-black text-gray-900 dark:text-white">
          Provider Profile
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your business profile information
        </p>

      </div>

      {/* PROFILE CARD */}
      <div
        className="
          bg-white
          dark:bg-gray-900
          border
          border-gray-200
          dark:border-gray-800
          rounded-3xl
          shadow-sm
          overflow-hidden
        "
      >

        {/* COVER */}
        <div className="
          h-48
          bg-gradient-to-r
          from-blue-600
          via-purple-600
          to-indigo-600
          relative
        ">

          <button
            className="
              absolute
              top-5
              right-5
              w-12
              h-12
              rounded-2xl
              bg-white/20
              backdrop-blur-md
              text-white
              flex
              items-center
              justify-center
            "
          >

            <Camera className="w-5 h-5" />

          </button>

        </div>

        {/* PROFILE CONTENT */}
        <div className="p-8">

          {/* AVATAR */}
          <div className="-mt-24 mb-6">

            <div className="
              w-32
              h-32
              rounded-3xl
              bg-gradient-to-r
              from-blue-600
              to-purple-600
              border-4
              border-white
              dark:border-gray-900
              text-white
              flex
              items-center
              justify-center
              text-5xl
              font-black
              shadow-xl
            ">
              A
            </div>

          </div>

          {/* INFO */}
          <div className="grid lg:grid-cols-2 gap-8">

            {/* LEFT */}
            <div className="space-y-6">

              <div>

                <label className="text-sm text-gray-500">
                  Company Name
                </label>

                <input
                  type="text"
                  defaultValue="AI Tour Rwanda"
                  className="
                    mt-2
                    w-full
                    h-14
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
                />

              </div>

              <div>

                <label className="text-sm text-gray-500">
                  Email Address
                </label>

                <div className="relative mt-2">

                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                  <input
                    type="email"
                    defaultValue="provider@aitourrwanda.com"
                    className="
                      w-full
                      h-14
                      pl-12
                      pr-4
                      rounded-2xl
                      border
                      border-gray-200
                      dark:border-gray-700
                      bg-gray-50
                      dark:bg-gray-800
                      dark:text-white
                      outline-none
                    "
                  />

                </div>

              </div>

              <div>

                <label className="text-sm text-gray-500">
                  Phone Number
                </label>

                <div className="relative mt-2">

                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                  <input
                    type="text"
                    defaultValue="+250 788 000 000"
                    className="
                      w-full
                      h-14
                      pl-12
                      pr-4
                      rounded-2xl
                      border
                      border-gray-200
                      dark:border-gray-700
                      bg-gray-50
                      dark:bg-gray-800
                      dark:text-white
                      outline-none
                    "
                  />

                </div>

              </div>

            </div>

            {/* RIGHT */}
            <div className="space-y-6">

              <div>

                <label className="text-sm text-gray-500">
                  Location
                </label>

                <div className="relative mt-2">

                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                  <input
                    type="text"
                    defaultValue="Kigali, Rwanda"
                    className="
                      w-full
                      h-14
                      pl-12
                      pr-4
                      rounded-2xl
                      border
                      border-gray-200
                      dark:border-gray-700
                      bg-gray-50
                      dark:bg-gray-800
                      dark:text-white
                      outline-none
                    "
                  />

                </div>

              </div>

              <div>

                <label className="text-sm text-gray-500">
                  Website
                </label>

                <div className="relative mt-2">

                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                  <input
                    type="text"
                    defaultValue="www.aitourrwanda.com"
                    className="
                      w-full
                      h-14
                      pl-12
                      pr-4
                      rounded-2xl
                      border
                      border-gray-200
                      dark:border-gray-700
                      bg-gray-50
                      dark:bg-gray-800
                      dark:text-white
                      outline-none
                    "
                  />

                </div>

              </div>

              <div>

                <label className="text-sm text-gray-500">
                  Business Description
                </label>

                <textarea
                  rows="5"
                  defaultValue="AI Tour Rwanda is a smart tourism platform offering AI-powered travel experiences across Rwanda."
                  className="
                    mt-2
                    w-full
                    p-5
                    rounded-2xl
                    border
                    border-gray-200
                    dark:border-gray-700
                    bg-gray-50
                    dark:bg-gray-800
                    dark:text-white
                    outline-none
                    resize-none
                  "
                />

              </div>

            </div>

          </div>

          {/* SAVE BUTTON */}
          <div className="mt-8 flex justify-end">

            <button
              className="
                px-8
                h-14
                rounded-2xl
                bg-gradient-to-r
                from-blue-600
                to-purple-600
                text-white
                font-bold
                shadow-lg
                hover:scale-105
                transition-all
              "
            >
              Save Changes
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Profile;