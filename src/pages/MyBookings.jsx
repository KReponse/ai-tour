
import React, { useEffect, useState } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  CreditCard,
  Loader2,
} from 'lucide-react';

import {

  getMyBookings,
  cancelBooking,

} from '../services/bookingService';

const MyBookings = () => {

  const [bookings, setBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

    const [selectedBooking,
  setSelectedBooking] =
  useState(null);

const handleCancel =
  async (bookingId) => {

    const confirmCancel =
      window.confirm(
        'Are you sure you want to cancel this booking?'
      );

    if (!confirmCancel)
      return;

    try {

      const token =
        localStorage.getItem(
          'token'
        );

      await cancelBooking(

        bookingId,
        token

      );

      setBookings(

        bookings.map(
          (booking) =>

            booking._id ===
            bookingId

              ? {

                  ...booking,

                  status:
                    'cancelled',

                }

              : booking
        )

      );

      alert(
        'Booking cancelled successfully'
      );

    } catch (error) {

      console.log(error);

      alert(
        'Failed to cancel booking'
      );

    }

  };

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
          data.bookings || []
        );

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };

  if (loading) {

    return (

      <div className="flex justify-center items-center py-20">

        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />

      </div>

    );

  }

  return (

    <div className="max-w-7xl mx-auto px-4 py-10 text-gray-900 dark:text-white">

      <h1 className="text-4xl font-bold mb-8">
        My Bookings
      </h1>

      {bookings.length === 0 ? (

        <div
          className="
            bg-white
            dark:bg-gray-900
            rounded-3xl
            shadow-lg
            border
            border-gray-100
            dark:border-gray-800
            p-10
            text-center
          "
        >

          <h2 className="text-2xl font-bold mb-2">
            No Bookings Yet
          </h2>

          <p className="text-gray-500 dark:text-gray-400">
            Explore tours and make your first booking.
          </p>

        </div>

      ) : (

        <div className="grid gap-6">

          {bookings.map((booking) => (

            <div
              key={booking._id}
              className="
                bg-white
                dark:bg-gray-900
                rounded-3xl
                shadow-lg
                hover:shadow-2xl
                hover:-translate-y-1
                duration-300
                border
                border-gray-100
                dark:border-gray-800
                overflow-hidden
              "
            >

              <div className="grid md:grid-cols-4">

                {/* IMAGE */}

                <div>

                  <img
                    src={
                      booking.tour?.image
                        ? `http://localhost:5000/uploads/${booking.tour.image}`
                        : 'https://via.placeholder.com/500'
                    }
                    alt={booking.tour?.title || 'Tour'}
                    className="
                      w-full
                      h-full
                      object-cover
                      min-h-[220px]
                    "
                  />

                </div>

                {/* CONTENT */}

                <div className="md:col-span-3 p-6">

                  <div className="flex flex-wrap justify-between gap-4">

                    <div>

                      <h2 className="text-2xl font-bold">

                        {booking.tour?.title}

                      </h2>

                      <div
                        className="
                          flex items-center gap-2
                          text-gray-500
                          dark:text-gray-400
                          mt-2
                        "
                      >

                        <MapPin size={16} />

                        {booking.tour?.location}

                      </div>

                    </div>

                    <div>

                      <span
                        className="
                          px-4 py-2 rounded-full
                          bg-green-100
                          dark:bg-green-900/30
                          text-green-700
                          dark:text-green-400
                          text-sm
                          font-semibold
                        "
                      >

                        {booking.status}

                      </span>

                    </div>

                  </div>

                  <div
                    className="
                      grid
                      md:grid-cols-3
                      gap-4
                      mt-6
                    "
                  >

                    {/* Travel Date */}

                    <div className="flex items-center gap-3">

                      <Calendar size={18} />

                      <div>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Travel Date
                        </p>

                        <p className="font-semibold">

                          {new Date(
                            booking.travelDate
                          ).toLocaleDateString()}

                        </p>

                      </div>

                    </div>

                    {/* Travelers */}

                    <div className="flex items-center gap-3">

                      <Users size={18} />

                      <div>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Travelers
                        </p>

                        <p className="font-semibold">
                          {booking.travelers}
                        </p>

                      </div>

                    </div>

                    {/* Payment */}

                    <div className="flex items-center gap-3">

                      <CreditCard size={18} />

                      <div>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Payment
                        </p>

                        <p className="font-semibold text-green-600 dark:text-green-400">
                          {booking.paymentStatus}
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* ACTION BUTTONS */}

<div
  className="
    mt-6
    flex
    flex-wrap
    gap-3
  "
>

  <button
    onClick={() =>
      setSelectedBooking(
        booking
      )
    }
    className="
      px-5
      py-3
      rounded-xl
      bg-blue-600
      hover:bg-blue-700
      text-white
      transition-colors
    "
  >

    View Details

  </button>

  {booking.status !==
    'cancelled' && (

    <button
      onClick={() =>
        handleCancel(
          booking._id
        )
      }
      className="
        px-5
        py-3
        rounded-xl
        border
        border-red-500
        text-red-600
        hover:bg-red-50
        dark:hover:bg-red-900/20
        transition-colors
      "
    >

      Cancel Booking

    </button>

  )}

</div>

                </div>

              </div>

            </div>

          ))}

        </div>
        

)}
      

    </div>
   
  );

};

export default MyBookings;

