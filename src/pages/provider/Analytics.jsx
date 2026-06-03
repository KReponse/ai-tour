import React,
{
  useEffect,
  useState,
} from 'react';

import {
  Map,
  CalendarCheck,
  DollarSign,
  Users,
  Loader2,
} from 'lucide-react';

import {
  getProviderAnalytics,
} from '../../services/bookingService';

const Analytics = () => {

  const [analytics,
    setAnalytics] =
    useState(null);

  const [loading,
    setLoading] =
    useState(true);

  useEffect(() => {

    fetchAnalytics();

  }, []);

  const fetchAnalytics =
    async () => {

      try {

        const token =
          localStorage.getItem(
            'token'
          );

        const data =
          await getProviderAnalytics(
            token
          );

        setAnalytics(
          data.analytics
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

  if (loading) {

    return (

      <div className="flex justify-center items-center h-[60vh]">

        <Loader2
          className="
            w-10
            h-10
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

      <div>

        <h1
          className="
            text-3xl
            font-black
            text-gray-900
            dark:text-white
          "
        >
          Analytics
        </h1>

        <p
          className="
            text-gray-500
            dark:text-gray-400
            mt-1
          "
        >
          Overview of your business performance
        </p>

      </div>

      {/* CARDS */}

      <div
        className="
          grid
          md:grid-cols-2
          xl:grid-cols-4
          gap-6
        "
      >

        {/* TOURS */}

        <div
          className="
            bg-white
            dark:bg-gray-900
            rounded-3xl
            p-6
            shadow-sm
            border
            border-gray-200
            dark:border-gray-800
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p
                className="
                  text-gray-500
                  text-sm
                "
              >
                Total Tours
              </p>

              <h2
                className="
                  text-4xl
                  font-black
                  mt-2
                  text-gray-900
                  dark:text-white
                "
              >
                {analytics?.totalTours || 0}
              </h2>

            </div>

            <Map
              size={40}
              className="
                text-blue-600
              "
            />

          </div>

        </div>

        {/* BOOKINGS */}

        <div
          className="
            bg-white
            dark:bg-gray-900
            rounded-3xl
            p-6
            shadow-sm
            border
            border-gray-200
            dark:border-gray-800
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p
                className="
                  text-gray-500
                  text-sm
                "
              >
                Total Bookings
              </p>

              <h2
                className="
                  text-4xl
                  font-black
                  mt-2
                  text-gray-900
                  dark:text-white
                "
              >
                {analytics?.totalBookings || 0}
              </h2>

            </div>

            <CalendarCheck
              size={40}
              className="
                text-green-600
              "
            />

          </div>

        </div>

        {/* REVENUE */}

        <div
          className="
            bg-white
            dark:bg-gray-900
            rounded-3xl
            p-6
            shadow-sm
            border
            border-gray-200
            dark:border-gray-800
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p
                className="
                  text-gray-500
                  text-sm
                "
              >
                Total Revenue
              </p>

              <h2
                className="
                  text-4xl
                  font-black
                  mt-2
                  text-green-600
                "
              >
                $
                {analytics?.totalRevenue || 0}
              </h2>

            </div>

            <DollarSign
              size={40}
              className="
                text-green-600
              "
            />

          </div>

        </div>

        {/* TRAVELERS */}

        <div
          className="
            bg-white
            dark:bg-gray-900
            rounded-3xl
            p-6
            shadow-sm
            border
            border-gray-200
            dark:border-gray-800
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p
                className="
                  text-gray-500
                  text-sm
                "
              >
                Total Travelers
              </p>

              <h2
                className="
                  text-4xl
                  font-black
                  mt-2
                  text-gray-900
                  dark:text-white
                "
              >
                {analytics?.totalTravelers || 0}
              </h2>

            </div>

            <Users
              size={40}
              className="
                text-purple-600
              "
            />

          </div>

        </div>

      </div>

      {/* SUMMARY */}

      <div
        className="
          bg-white
          dark:bg-gray-900
          rounded-3xl
          p-8
          border
          border-gray-200
          dark:border-gray-800
          shadow-sm
        "
      >

        <h2
          className="
            text-2xl
            font-bold
            mb-4
            dark:text-white
          "
        >
          Business Summary
        </h2>

        <p
          className="
            text-gray-600
            dark:text-gray-400
            leading-relaxed
          "
        >

          You currently have

          <span className="font-bold">
            {' '}
            {analytics?.totalTours || 0}
          </span>

          {' '}active tours,

          <span className="font-bold">
            {' '}
            {analytics?.totalBookings || 0}
          </span>

          {' '}bookings and

          <span className="font-bold">
            {' '}
            {analytics?.totalTravelers || 0}
          </span>

          {' '}travelers served.

          Total revenue generated is

          <span className="font-bold text-green-600">
            {' '}
            ${analytics?.totalRevenue || 0}
          </span>

          .

        </p>

      </div>

    </div>

  );

};

export default Analytics;