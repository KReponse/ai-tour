import React, {
  useState,
} from 'react';

import {
  recentRequests,
} from '../../data/providerData';

const Requests = () => {

  const [requests, setRequests] =
    useState(recentRequests);

  const handleStatus = (
    id,
    status
  ) => {

    const updated =
      requests.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
            }
          : item
      );

    setRequests(updated);

  };

  const statusStyles = {
    pending:
      'bg-yellow-100 text-yellow-700',

    accepted:
      'bg-green-100 text-green-700',

    rejected:
      'bg-red-100 text-red-700',
  };

  return (

    <div className="space-y-8">

      {/* HEADER */}
      <div>

        <h1 className="text-3xl font-black text-gray-900 dark:text-white">
          Trip Requests
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage traveler booking requests
        </p>

      </div>

      {/* REQUESTS */}
      <div className="grid gap-6">

        {requests.map((item) => (

          <div
            key={item.id}
            className="
              bg-white
              dark:bg-gray-900
              border
              border-gray-200
              dark:border-gray-800
              rounded-3xl
              p-6
              shadow-sm
              hover:shadow-xl
              transition-all
            "
          >

            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

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
                    {item.traveler.charAt(0)}
                  </div>

                  <div>

                    <h2 className="font-black text-lg dark:text-white">
                      {item.traveler}
                    </h2>

                    <p className="text-sm text-gray-500">
                      {item.location}
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
                      {item.destination}
                    </h3>

                  </div>

                  <div>

                    <p className="text-sm text-gray-500">
                      Travelers
                    </p>

                    <h3 className="font-semibold dark:text-white">
                      {item.travelers} People
                    </h3>

                  </div>

                  <div>

                    <p className="text-sm text-gray-500">
                      Budget
                    </p>

                    <h3 className="font-semibold text-green-600">
                      {item.budget}
                    </h3>

                  </div>

                  <div>

                    <p className="text-sm text-gray-500">
                      Date
                    </p>

                    <h3 className="font-semibold dark:text-white">
                      {item.date}
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
                    h-10
                    rounded-full
                    flex
                    items-center
                    text-sm
                    font-bold
                    capitalize
                    ${statusStyles[item.status]}
                  `}
                >
                  {item.status}
                </div>

                {/* ACTIONS */}
                {item.status ===
                  'pending' && (

                  <div className="flex gap-3">

                    <button
                      onClick={() =>
                        handleStatus(
                          item.id,
                          'accepted'
                        )
                      }
                      className="
                        px-6
                        h-12
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
                      onClick={() =>
                        handleStatus(
                          item.id,
                          'rejected'
                        )
                      }
                      className="
                        px-6
                        h-12
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

                )}

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  );
};

export default Requests;