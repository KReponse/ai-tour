import React from 'react';

import { providerBookings } from '../../data/providerData';

const Bookings = () => {

  const statusStyles = {
    Confirmed:
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',

    Pending:
      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',

    Completed:
      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  };

  const paymentStyles = {
    Paid:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',

    Pending:
      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  return (

    <div className="space-y-6">

      {/* HEADER */}
      <div>

        <h1 className="text-3xl font-black text-gray-900 dark:text-white">
          Bookings
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage all traveler bookings
        </p>

      </div>

      {/* BOOKINGS */}
      <div className="grid gap-5">

        {providerBookings.map((booking) => (

          <div
            key={booking.id}
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

                <div>

                  <h2 className="text-xl font-bold dark:text-white">
                    {booking.destination}
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Traveler: {booking.traveler}
                  </p>

                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

                  <div>

                    <p className="text-sm text-gray-500">
                      Booking Date
                    </p>

                    <h3 className="font-semibold dark:text-white">
                      {booking.date}
                    </h3>

                  </div>

                  <div>

                    <p className="text-sm text-gray-500">
                      Amount
                    </p>

                    <h3 className="font-semibold text-green-600">
                      {booking.amount}
                    </h3>

                  </div>

                  <div>

                    <p className="text-sm text-gray-500">
                      Payment
                    </p>

                    <div
                      className={`
                        inline-flex
                        px-3
                        py-1
                        rounded-full
                        text-sm
                        font-semibold
                        mt-1
                        ${paymentStyles[booking.payment]}
                      `}
                    >
                      {booking.payment}
                    </div>

                  </div>

                  <div>

                    <p className="text-sm text-gray-500">
                      Status
                    </p>

                    <div
                      className={`
                        inline-flex
                        px-3
                        py-1
                        rounded-full
                        text-sm
                        font-semibold
                        mt-1
                        ${statusStyles[booking.status]}
                      `}
                    >
                      {booking.status}
                    </div>

                  </div>

                </div>

              </div>

              {/* ACTIONS */}
              <div className="flex flex-wrap gap-3">

                <button
                  className="
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
                  View
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
                  Cancel
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  );
};

export default Bookings;