import React,
{
  useEffect,
  useState,
} from 'react';

import {
  Calendar,
  Heart,
  User,
  Map,
  Loader2,
} from 'lucide-react';

import {
  getMyBookings,
} from '../services/bookingService';

const Dashboard = () => {

  const [bookings,
    setBookings] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const user =
    JSON.parse(
      localStorage.getItem(
        'user'
      )
    );

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
          await getMyBookings(
            token
          );

        setBookings(
          data.bookings
        );

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="mb-10">

          <h1 className="text-4xl font-black dark:text-white">

            Welcome,
            {' '}
            {user?.name}

          </h1>

          <p className="text-gray-500 mt-2">

            Manage your travel experience

          </p>

        </div>

        {/* STATS */}

        <div className="grid md:grid-cols-4 gap-6 mb-10">

          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-lg">

            <Calendar className="w-10 h-10 text-blue-600 mb-4" />

            <h2 className="text-3xl font-bold dark:text-white">

              {bookings.length}

            </h2>

            <p className="text-gray-500">

              Total Bookings

            </p>

          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-lg">

            <Heart className="w-10 h-10 text-red-500 mb-4" />

            <h2 className="text-3xl font-bold dark:text-white">

              0

            </h2>

            <p className="text-gray-500">

              Favorites

            </p>

          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-lg">

            <Map className="w-10 h-10 text-green-500 mb-4" />

            <h2 className="text-3xl font-bold dark:text-white">

              {
                bookings.filter(
                  (b) =>
                    b.status ===
                    'confirmed'
                ).length
              }

            </h2>

            <p className="text-gray-500">

              Confirmed Trips

            </p>

          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-lg">

            <User className="w-10 h-10 text-purple-500 mb-4" />

            <h2 className="text-xl font-bold dark:text-white">

              Traveler

            </h2>

            <p className="text-gray-500">

              Account Type

            </p>

          </div>

        </div>

        {/* RECENT BOOKINGS */}

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg p-8">

          <h2 className="text-3xl font-bold mb-6 dark:text-white">

            Recent Bookings

          </h2>

          {
            bookings.length === 0 ? (

              <div className="text-center py-10">

                <h2 className="text-2xl font-bold dark:text-white">

                  No bookings yet

                </h2>

              </div>

            ) : (

              <div className="space-y-6">

                {
                  bookings.map(
                    (booking) => (

                      <div
                        key={booking._id}
                        className="flex flex-col md:flex-row gap-6 border-b border-gray-200 dark:border-gray-800 pb-6"
                      >

                        <img
                          src={`http://localhost:5000/uploads/${booking.tour.image}`}
                          alt={booking.tour.title}
                          className="w-full md:w-56 h-40 object-cover rounded-2xl"
                        />

                        <div className="flex-1">

                          <h3 className="text-2xl font-bold dark:text-white">

                            {booking.tour.title}

                          </h3>

                          <p className="text-gray-500 mt-2">

                            {booking.tour.location}

                          </p>

                          <div className="mt-4 flex items-center justify-between">

                            <span className="text-blue-600 font-bold text-xl">

                              ${booking.tour.price}

                            </span>

                            <span className="px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 font-semibold">

                              {booking.status}

                            </span>

                          </div>

                        </div>

                      </div>

                    )
                  )
                }

              </div>

            )
          }

        </div>

      </div>

    </div>

  );

};

export default Dashboard;