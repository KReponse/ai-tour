import axios from 'axios';

const API =
  'http://localhost:5000/api/bookings';

/* ================= CREATE BOOKING ================= */

export const createBooking =
  async (
    bookingData,
    token
  ) => {

    const response =
      await axios.post(

        API,

        bookingData,

        {

          headers: {

            Authorization:
              `Bearer ${token}`,

          },

        }

      );

    return response.data;

  };