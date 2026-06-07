import React,
{
  useEffect,
  useState,
} from 'react';

import {
  Wallet,
  CreditCard,
  Loader2,
  Users,
} from 'lucide-react';

import {
  getProviderEarnings,
} from '../../services/bookingService';

const Earnings = () => {

  const [earnings,
    setEarnings] =
    useState(null);

  const [loading,
    setLoading] =
    useState(true);

  useEffect(() => {

    fetchEarnings();

  }, []);

  const fetchEarnings =
    async () => {

      try {

        const token =
          localStorage.getItem(
            'token'
          );

        const data =
          await getProviderEarnings(
            token
          );

        setEarnings(
          data
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

  if (loading) {

    return (

      <div className="
        flex
        justify-center
        items-center
        py-20
      ">

        <Loader2
          className="
            w-8
            h-8
            animate-spin
            text-blue-600
          "
        />

      </div>

    );

  }

  return (

    <div className="space-y-8">

      {/* HEADER */}

      <div className="
        flex
        flex-col
        lg:flex-row
        lg:items-center
        lg:justify-between
        gap-4
      ">

        <div>

          <h1 className="
            text-3xl
            font-black
            text-gray-900
            dark:text-white
          ">
            Earnings
          </h1>

          <p className="
            text-gray-500
            dark:text-gray-400
            mt-1
          ">
            Track your revenue and payments
          </p>

        </div>

      </div>

      {/* STATS */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-3
        gap-6
      ">

        {/* TOTAL EARNINGS */}

        <div
          className="
            bg-white
            dark:bg-gray-900
            border
            border-gray-200
            dark:border-gray-800
            rounded-3xl
            p-6
            shadow-sm
          "
        >

          <div className="
            flex
            items-center
            justify-between
          ">

            <div>

              <p className="
                text-sm
                text-gray-500
              ">
                Total Earnings
              </p>

              <h2 className="
                text-4xl
                font-black
                text-green-600
                mt-2
              ">
                $
                {
                  earnings?.totalEarnings || 0
                }
              </h2>

            </div>

            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-gradient-to-r
                from-green-500
                to-emerald-600
                text-white
                flex
                items-center
                justify-center
              "
            >

              <Wallet
                className="
                  w-7
                  h-7
                "
              />

            </div>

          </div>

        </div>

        {/* BOOKINGS */}

        <div
          className="
            bg-white
            dark:bg-gray-900
            border
            border-gray-200
            dark:border-gray-800
            rounded-3xl
            p-6
            shadow-sm
          "
        >

          <div className="
            flex
            items-center
            justify-between
          ">

            <div>

              <p className="
                text-sm
                text-gray-500
              ">
                Paid Bookings
              </p>

              <h2 className="
                text-4xl
                font-black
                text-blue-600
                mt-2
              ">
                {
                  earnings?.paidBookings || 0
                }
              </h2>

            </div>

            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-gradient-to-r
                from-blue-500
                to-cyan-500
                text-white
                flex
                items-center
                justify-center
              "
            >

              <Users
                className="
                  w-7
                  h-7
                "
              />

            </div>

          </div>

        </div>

        {/* TRANSACTIONS */}

        <div
          className="
            bg-white
            dark:bg-gray-900
            border
            border-gray-200
            dark:border-gray-800
            rounded-3xl
            p-6
            shadow-sm
          "
        >

          <div className="
            flex
            items-center
            justify-between
          ">

            <div>

              <p className="
                text-sm
                text-gray-500
              ">
                Transactions
              </p>

              <h2 className="
                text-4xl
                font-black
                text-purple-600
                mt-2
              ">
                {
                  earnings?.bookings?.length || 0
                }
              </h2>

            </div>

            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-gradient-to-r
                from-purple-500
                to-pink-500
                text-white
                flex
                items-center
                justify-center
              "
            >

              <CreditCard
                className="
                  w-7
                  h-7
                "
              />

            </div>

          </div>

        </div>

      </div>

      {/* RECENT TRANSACTIONS */}

      <div
        className="
          bg-white
          dark:bg-gray-900
          border
          border-gray-200
          dark:border-gray-800
          rounded-3xl
          p-6
          shadow-sm
        "
      >

        <h2 className="
          text-2xl
          font-black
          mb-6
          dark:text-white
        ">
          Recent Transactions
        </h2>

        <div className="space-y-4">

          {
            earnings?.bookings?.map(
              (booking) => (

                <div
                  key={booking._id}
                  className="
                    flex
                    flex-col
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                    gap-4
                    p-5
                    rounded-2xl
                    bg-gray-50
                    dark:bg-gray-800
                  "
                >

                  <div className="
                    flex
                    items-center
                    gap-4
                  ">

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
                      "
                    >

                      <CreditCard
                        className="
                          w-6
                          h-6
                        "
                      />

                    </div>

                    <div>

                      <h3 className="
                        font-bold
                        dark:text-white
                      ">
                        {
                          booking.fullName
                        }
                      </h3>

                      <p className="
                        text-sm
                        text-gray-500
                      ">
                        {
                          new Date(
                            booking.createdAt
                          ).toLocaleDateString()
                        }
                      </p>

                    </div>

                  </div>

                  <div>

                    <span
                      className="
                        px-4
                        py-2
                        rounded-full
                        bg-green-100
                        text-green-700
                        dark:bg-green-900/30
                        dark:text-green-400
                        font-semibold
                      "
                    >

                      Paid

                    </span>

                  </div>

                </div>

              )
            )
          }

        </div>

      </div>

    </div>

  );

};

export default Earnings;