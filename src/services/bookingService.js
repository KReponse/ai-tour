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

/* ================= MY BOOKINGS ================= */

export const getMyBookings =
  async (token) => {

    const response =
      await axios.get(

        `${API}/my-bookings`,

        {

          headers: {

            Authorization:
              `Bearer ${token}`,

          },

        }

      );

    return response.data;

  };
  
  export const cancelBooking =
  async (id, token) => {

    const res =
      await axios.put(

        `http://localhost:5000/api/bookings/${id}/cancel`,

        {},

        {

          headers: {

            Authorization:
              `Bearer ${token}`,

          },

        }

      );
      

    return res.data;

  };
export const getProviderBookings = async (token) => {
  const res = await axios.get(
    'http://localhost:5000/api/bookings/provider',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};  

export const getProviderAnalytics =
  async (token) => {

    const res =
      await axios.get(

        'http://localhost:5000/api/bookings/provider/analytics',

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }

      );

    return res.data;

  };



   