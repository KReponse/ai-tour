import React,
{
  useEffect,
  useState,
} from 'react';

import {
  Users,
  Briefcase,
  Map,
  Calendar,
  DollarSign,
  FileText,
} from 'lucide-react';

import {
  getDashboardStats,
}
from '../../services/adminService';

const AdminDashboard = () => {

  const [stats,
    setStats] =
    useState(null);

  const [loading,
    setLoading] =
    useState(true);

  useEffect(() => {

    fetchStats();

  }, []);

  const fetchStats =
    async () => {

      try {

        const token =
          localStorage.getItem(
            'token'
          );

        const data =
          await getDashboardStats(
            token
          );

        setStats(
          data.stats
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
        min-h-screen
        flex
        items-center
        justify-center
        bg-gray-100
        dark:bg-gray-950
      ">

        <h2 className="
          text-xl
          font-bold
          dark:text-white
        ">
          Loading Dashboard...
        </h2>

      </div>

    );

  }

  return (

    <div className="
      min-h-screen
      p-8
      bg-gray-100
      dark:bg-gray-950
    ">

      {/* HEADER */}

      <div className="mb-10">

        <h1 className="
          text-4xl
          font-black
          dark:text-white
        ">
          Admin Dashboard
        </h1>

        <p className="
          mt-2
          text-gray-600
          dark:text-gray-400
        ">
          AI Tour Rwanda Administration
        </p>

      </div>

      {/* STATS */}

      <div className="
        grid
        md:grid-cols-2
        lg:grid-cols-3
        gap-6
      ">

        {/* USERS */}

        <div className="
          bg-white
          dark:bg-gray-900
          rounded-3xl
          p-6
          shadow-lg
        ">

          <div className="
            flex
            justify-between
            items-center
          ">

            <div>

              <p className="
                text-gray-500
              ">
                Users
              </p>

              <h2 className="
                text-4xl
                font-black
                mt-2
                dark:text-white
              ">
                {stats?.totalUsers || 0}
              </h2>

            </div>

            <Users
              className="
                w-10
                h-10
                text-blue-600
              "
            />

          </div>

        </div>

        {/* PROVIDERS */}

        <div className="
          bg-white
          dark:bg-gray-900
          rounded-3xl
          p-6
          shadow-lg
        ">

          <div className="
            flex
            justify-between
            items-center
          ">

            <div>

              <p className="
                text-gray-500
              ">
                Providers
              </p>

              <h2 className="
                text-4xl
                font-black
                mt-2
                dark:text-white
              ">
                {stats?.totalProviders || 0}
              </h2>

            </div>

            <Briefcase
              className="
                w-10
                h-10
                text-green-600
              "
            />

          </div>

        </div>

        {/* TOURS */}

        <div className="
          bg-white
          dark:bg-gray-900
          rounded-3xl
          p-6
          shadow-lg
        ">

          <div className="
            flex
            justify-between
            items-center
          ">

            <div>

              <p className="
                text-gray-500
              ">
                Tours
              </p>

              <h2 className="
                text-4xl
                font-black
                mt-2
                dark:text-white
              ">
                {stats?.totalTours || 0}
              </h2>

            </div>

            <Map
              className="
                w-10
                h-10
                text-purple-600
              "
            />

          </div>

        </div>

        {/* BOOKINGS */}

        <div className="
          bg-white
          dark:bg-gray-900
          rounded-3xl
          p-6
          shadow-lg
        ">

          <div className="
            flex
            justify-between
            items-center
          ">

            <div>

              <p className="
                text-gray-500
              ">
                Bookings
              </p>

              <h2 className="
                text-4xl
                font-black
                mt-2
                dark:text-white
              ">
                {stats?.totalBookings || 0}
              </h2>

            </div>

            <Calendar
              className="
                w-10
                h-10
                text-orange-500
              "
            />

          </div>

        </div>

        {/* REVENUE */}

        <div className="
          bg-white
          dark:bg-gray-900
          rounded-3xl
          p-6
          shadow-lg
        ">

          <div className="
            flex
            justify-between
            items-center
          ">

            <div>

              <p className="
                text-gray-500
              ">
                Revenue
              </p>

              <h2 className="
                text-4xl
                font-black
                mt-2
                text-green-600
              ">
                $
                {stats?.totalRevenue || 0}
              </h2>

            </div>

            <DollarSign
              className="
                w-10
                h-10
                text-green-600
              "
            />

          </div>

        </div>

        {/* REQUESTS */}

        <div className="
          bg-white
          dark:bg-gray-900
          rounded-3xl
          p-6
          shadow-lg
        ">

          <div className="
            flex
            justify-between
            items-center
          ">

            <div>

              <p className="
                text-gray-500
              ">
                Pending Requests
              </p>

              <h2 className="
                text-4xl
                font-black
                mt-2
                text-red-500
              ">
                {stats?.pendingRequests || 0}
              </h2>

            </div>

            <FileText
              className="
                w-10
                h-10
                text-red-500
              "
            />

          </div>

        </div>

      </div>

    </div>

  );

};

export default AdminDashboard;