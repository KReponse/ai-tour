import React, {
  useEffect,
  useState,
} from 'react';

import {
  getProviderBookings,
} from '../../services/bookingService';

const Bookings = () => {

  const [bookings,
    setBookings] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  useEffect(() => {

    fetchBookings();

  }, []);

  const fetchBookings =
    async () => {

      try {

        const token =
          localStorage.getItem(
            'token'
          );

        const data =
          await getProviderBookings(
            token
          );

        setBookings(
          data.bookings || []
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

  const statusStyles = {

    confirmed:
      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',

    pending:
      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',

    cancelled:
      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',

  };

  const paymentStyles = {

    paid:
      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',

    pending:
      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',

  };

  if (loading) {

    return (

      <div className="flex justify-center items-center h-96">

        <h2 className="text-lg font-semibold">
          Loading bookings...
        </h2>

      </div>

    );

  }

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

      {/* EMPTY */}

      {bookings.length === 0 ? (

        <div className="
          bg-white
          dark:bg-gray-900
          rounded-3xl
          p-10
          text-center
          border
          border-gray-200
          dark:border-gray-800
        ">

          <h2 className="text-xl font-bold">

            No Bookings Found

          </h2>

        </div>

      ) : (

        <div className="grid gap-5">

          {bookings.map((booking) => (

            <div
              key={booking._id}
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

                      {booking.tour?.title}

                    </h2>

                    <p className="text-gray-500 mt-1">

                      Traveler:

                      {' '}

                      {booking.fullName}

                    </p>

                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

                    {/* DATE */}

                    <div>

                      <p className="text-sm text-gray-500">

                        Travel Date

                      </p>

                      <h3 className="font-semibold dark:text-white">

                        {new Date(
                          booking.travelDate
                        ).toLocaleDateString()}

                      </h3>

                    </div>

                    {/* PRICE */}

                    <div>

                      <p className="text-sm text-gray-500">

                        Amount

                      </p>

                      <h3 className="font-semibold text-green-600">

                        $

                        {booking.tour?.price || 0}

                      </h3>

                    </div>

                    {/* PAYMENT */}

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
                          ${
                            paymentStyles[
                              booking.paymentStatus
                            ] ||
                            ''
                          }
                        `}
                      >

                        {booking.paymentStatus}

                      </div>

                    </div>

                    {/* STATUS */}

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
                          ${
                            statusStyles[
                              booking.status
                            ] ||
                            ''
                          }
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

      )}

    </div>

  );

};

export default Bookings;