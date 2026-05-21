import React from 'react';

import { providerRequests } from '../../data/providerData';

const Requests = () => {

  const statusStyles = {
    Pending:
      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',

    Accepted:
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',

    Rejected:
      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (

    <div className="space-y-6">

      {/* HEADER */}
      <div>

        <h1 className="text-3xl font-black text-gray-900 dark:text-white">
          Trip Requests
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage incoming traveler requests
        </p>

      </div>

      {/* REQUESTS */}
      <div className="grid gap-5">

        {providerRequests.map((request) => (

          <div
            key={request.id}
            className="
              bg-white
              dark:bg-gray-900
              rounded-3xl
              p-6
              border
              border-gray-200
              dark:border-gray-800
              shadow-sm
              hover:shadow-xl
              transition-all
            "
          >

            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

              {/* LEFT */}
              <div className="space-y-5 flex-1">

                {/* USER */}
                <div className="flex items-center gap-4">

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
                      font-black
                      text-xl
                    "
                  >
                    {request.traveler.charAt(0)}
                  </div>

                  <div>

                    <h2 className="font-bold text-lg dark:text-white">
                      {request.traveler}
                    </h2>

                    <p className="text-gray-500 text-sm">
                      {request.location}
                    </p>

                  </div>

                </div>

                {/* DETAILS */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

                  <div>

                    <p className="text-sm text-gray-500">
                      Destination
                    </p>

                    <h3 className="font-semibold dark:text-white">
                      {request.destination}
                    </h3>

                  </div>

                  <div>

                    <p className="text-sm text-gray-500">
                      Travelers
                    </p>

                    <h3 className="font-semibold dark:text-white">
                      {request.travelers}
                    </h3>

                  </div>

                  <div>

                    <p className="text-sm text-gray-500">
                      Budget
                    </p>

                    <h3 className="font-semibold text-green-600">
                      {request.budget}
                    </h3>

                  </div>

                  <div>

                    <p className="text-sm text-gray-500">
                      Date
                    </p>

                    <h3 className="font-semibold dark:text-white">
                      {request.date}
                    </h3>

                  </div>

                </div>

              </div>

              {/* RIGHT */}
              <div className="flex flex-col items-start xl:items-end gap-4">

                {/* STATUS */}
                <div
                  className={`
                    px-4
                    py-2
                    rounded-full
                    text-sm
                    font-semibold
                    ${statusStyles[request.status]}
                  `}
                >
                  {request.status}
                </div>

                {/* ACTIONS */}
                <div className="flex gap-3">

                  <button
                    className="
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
                    Accept
                  </button>

                  <button
                    className="
                      px-5
                      h-11
                      rounded-2xl
                      bg-red-500
                      hover:bg-red-600
                      text-white
                      font-semibold
                      transition
                    "
                  >
                    Reject
                  </button>

                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  );
};

export default Requests;