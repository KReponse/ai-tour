import React from 'react';

import {
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

import {
  providerTravelers,
} from '../../data/providerData';

const Travelers = () => {

  const statusStyles = {
    Active:
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',

    Pending:
      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',

    VIP:
      'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  };

  return (

    <div className="space-y-6">

      {/* HEADER */}
      <div>

        <h1 className="text-3xl font-black text-gray-900 dark:text-white">
          Travelers
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your travelers and customers
        </p>

      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {providerTravelers.map((traveler) => (

          <div
            key={traveler.id}
            className="
              bg-white
              dark:bg-gray-900
              rounded-3xl
              border
              border-gray-200
              dark:border-gray-800
              p-6
              shadow-sm
              hover:shadow-xl
              transition-all
            "
          >

            <div className="flex items-start justify-between">

              {/* LEFT */}
              <div className="flex items-center gap-4">

                <div
                  className="
                    w-16
                    h-16
                    rounded-2xl
                    bg-gradient-to-r
                    from-blue-600
                    to-purple-600
                    text-white
                    flex
                    items-center
                    justify-center
                    text-2xl
                    font-black
                  "
                >
                  {traveler.avatar}
                </div>

                <div>

                  <h2 className="text-xl font-bold dark:text-white">
                    {traveler.name}
                  </h2>

                  <div className="flex items-center gap-2 text-gray-500 mt-1">

                    <MapPin className="w-4 h-4" />

                    <span className="text-sm">
                      {traveler.country}
                    </span>

                  </div>

                </div>

              </div>

              {/* STATUS */}
              <div
                className={`
                  px-3
                  py-1
                  rounded-full
                  text-sm
                  font-semibold
                  ${statusStyles[traveler.status]}
                `}
              >
                {traveler.status}
              </div>

            </div>

            {/* STATS */}
            <div className="mt-6 grid grid-cols-2 gap-4">

              <div
                className="
                  rounded-2xl
                  bg-gray-50
                  dark:bg-gray-800
                  p-4
                "
              >

                <p className="text-sm text-gray-500">
                  Total Trips
                </p>

                <h3 className="text-2xl font-black dark:text-white mt-1">
                  {traveler.trips}
                </h3>

              </div>

              <div
                className="
                  rounded-2xl
                  bg-gray-50
                  dark:bg-gray-800
                  p-4
                "
              >

                <p className="text-sm text-gray-500">
                  Customer Type
                </p>

                <h3 className="text-lg font-bold dark:text-white mt-1">
                  Premium
                </h3>

              </div>

            </div>

            {/* ACTIONS */}
            <div className="mt-6 flex flex-wrap gap-3">

              <button
                className="
                  flex
                  items-center
                  gap-2
                  px-5
                  h-11
                  rounded-2xl
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  font-semibold
                  transition
                "
              >

                <Mail className="w-4 h-4" />

                Message

              </button>

              <button
                className="
                  flex
                  items-center
                  gap-2
                  px-5
                  h-11
                  rounded-2xl
                  bg-green-600
                  hover:bg-green-700
                  text-white
                  font-semibold
                  transition
                "
              >

                <Phone className="w-4 h-4" />

                Call

              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  );
};

export default Travelers;