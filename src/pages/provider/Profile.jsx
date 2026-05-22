import React from 'react';

import {
  MapPin,
  Phone,
  Mail,
  Globe,
  BadgeCheck,
  Star,
  Briefcase,
} from 'lucide-react';

import {
  providerProfile,
} from '../../data/providerData';

const Profile = () => {

  return (

    <div className="space-y-8">

      {/* HEADER */}
      <div>

        <h1 className="text-3xl font-black text-gray-900 dark:text-white">
          Provider Profile
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your business profile and public information
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
          p-8
          shadow-sm
        "
      >

        <div className="flex flex-col xl:flex-row gap-8">

          {/* LEFT */}
          <div className="flex flex-col items-center xl:items-start">

            <div
              className="
                w-32
                h-32
                rounded-3xl
                bg-gradient-to-r
                from-blue-600
                to-purple-600
                text-white
                flex
                items-center
                justify-center
                text-5xl
                font-black
                shadow-xl
              "
            >
              A
            </div>

            <button
              className="
                mt-5
                px-5
                h-11
                rounded-2xl
                bg-gray-100
                dark:bg-gray-800
                hover:bg-gray-200
                dark:hover:bg-gray-700
                transition-all
                font-semibold
              "
            >
              Change Photo
            </button>

          </div>

          {/* RIGHT */}
          <div className="flex-1 space-y-6">

            {/* TOP */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

              <div>

                <div className="flex items-center gap-3">

                  <h2 className="text-3xl font-black text-gray-900 dark:text-white">
                    {providerProfile.name}
                  </h2>

                  {providerProfile.verified && (

                    <BadgeCheck
                      className="
                        w-7
                        h-7
                        text-blue-600
                      "
                    />

                  )}

                </div>

                <p className="text-gray-500 mt-2">
                  Premium Rwanda Tourism Provider
                </p>

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
                  shadow-lg
                  hover:scale-105
                  transition-all
                "
              >
                Edit Profile
              </button>

            </div>

            {/* INFO GRID */}
            <div className="grid md:grid-cols-2 gap-5">

              <div
                className="
                  p-5
                  rounded-2xl
                  bg-gray-50
                  dark:bg-gray-800
                "
              >

                <div className="flex items-center gap-3">

                  <Mail className="w-5 h-5 text-blue-600" />

                  <div>

                    <p className="text-sm text-gray-500">
                      Email
                    </p>

                    <h3 className="font-semibold dark:text-white">
                      {providerProfile.email}
                    </h3>

                  </div>

                </div>

              </div>

              <div
                className="
                  p-5
                  rounded-2xl
                  bg-gray-50
                  dark:bg-gray-800
                "
              >

                <div className="flex items-center gap-3">

                  <Phone className="w-5 h-5 text-green-600" />

                  <div>

                    <p className="text-sm text-gray-500">
                      Phone
                    </p>

                    <h3 className="font-semibold dark:text-white">
                      {providerProfile.phone}
                    </h3>

                  </div>

                </div>

              </div>

              <div
                className="
                  p-5
                  rounded-2xl
                  bg-gray-50
                  dark:bg-gray-800
                "
              >

                <div className="flex items-center gap-3">

                  <MapPin className="w-5 h-5 text-red-500" />

                  <div>

                    <p className="text-sm text-gray-500">
                      Location
                    </p>

                    <h3 className="font-semibold dark:text-white">
                      {providerProfile.location}
                    </h3>

                  </div>

                </div>

              </div>

              <div
                className="
                  p-5
                  rounded-2xl
                  bg-gray-50
                  dark:bg-gray-800
                "
              >

                <div className="flex items-center gap-3">

                  <Globe className="w-5 h-5 text-purple-600" />

                  <div>

                    <p className="text-sm text-gray-500">
                      Website
                    </p>

                    <h3 className="font-semibold dark:text-white">
                      {providerProfile.website}
                    </h3>

                  </div>

                </div>

              </div>

            </div>

            {/* BIO */}
            <div
              className="
                p-6
                rounded-3xl
                bg-gray-50
                dark:bg-gray-800
              "
            >

              <h3 className="font-black text-lg dark:text-white mb-3">
                About Provider
              </h3>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {providerProfile.bio}
              </p>

            </div>

            {/* STATS */}
            <div className="grid sm:grid-cols-3 gap-5">

              <div
                className="
                  p-5
                  rounded-2xl
                  bg-gradient-to-r
                  from-blue-500
                  to-cyan-500
                  text-white
                "
              >

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm opacity-80">
                      Trips
                    </p>

                    <h2 className="text-3xl font-black mt-2">
                      {providerProfile.totalTrips}
                    </h2>

                  </div>

                  <Briefcase className="w-7 h-7" />

                </div>

              </div>

              <div
                className="
                  p-5
                  rounded-2xl
                  bg-gradient-to-r
                  from-yellow-400
                  to-orange-500
                  text-white
                "
              >

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm opacity-80">
                      Rating
                    </p>

                    <h2 className="text-3xl font-black mt-2">
                      {providerProfile.rating}
                    </h2>

                  </div>

                  <Star className="w-7 h-7" />

                </div>

              </div>

              <div
                className="
                  p-5
                  rounded-2xl
                  bg-gradient-to-r
                  from-green-500
                  to-emerald-600
                  text-white
                "
              >

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm opacity-80">
                      Verified
                    </p>

                    <h2 className="text-2xl font-black mt-2">
                      Yes
                    </h2>

                  </div>

                  <BadgeCheck className="w-7 h-7" />

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
};

export default Profile;