import axios from 'axios';

const API = 'http://localhost:5000/api/bookings';

/* ================= CREATE BOOKING ================= */

export const createBooking = async (bookingData, token) => {
  const response = await axios.post(
    API,
    bookingData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

/* ================= MY BOOKINGS ================= */
export const getMyBookings = async (token) => {
  const response = await axios.get(
    'http://localhost:5000/api/bookings/my-bookings',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

/* ================= CANCEL BOOKING ================= */
export const cancelBooking = async (id, token) => {
  const res = await axios.put(
    `http://localhost:5000/api/bookings/${id}/cancel`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

/* ================= GET PROVIDER BOOKINGS ================= */
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

/* ================= GET PROVIDER ANALYTICS ================= */
export const getProviderAnalytics = async (token) => {
  const res = await axios.get(
    'http://localhost:5000/api/bookings/provider/analytics',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

/* ================= GET PROVIDER EARNINGS ================= */
export const getProviderEarnings = async (token) => {
  const res = await axios.get(
    'http://localhost:5000/api/bookings/provider/earnings',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

/* ================= GET PROVIDER TRAVELERS ================= */
export const getProviderTravelers = async (token) => {
  try {
    // ✅ Since there's no dedicated travelers endpoint,
    // fetch provider bookings and extract traveler data
    const res = await axios.get(
      'http://localhost:5000/api/bookings/provider',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    // Extract travelers from bookings
    const bookings = res.data.bookings || [];
    const travelers = bookings.map(booking => ({
      _id: booking._id,
      fullName: booking.user?.name || 'Unknown Traveler',
      email: booking.user?.email || 'N/A',
      phone: booking.user?.phone || 'N/A',
      tour: booking.tour || { title: 'Unknown Tour' },
      travelDate: booking.travelDate || booking.startDate || booking.createdAt,
      travelers: booking.numberOfPeople || booking.travelers || 1,
      paymentStatus: booking.paymentStatus || 'pending',
      status: booking.status || 'pending',
      user: booking.user,
    }));

    return {
      success: true,
      travelers,
      total: travelers.length,
    };
  } catch (error) {
    console.error('❌ Get provider travelers error:', error);
    // ✅ Return empty array instead of throwing to prevent page crash
    return { travelers: [], total: 0 };
  }
};

// ===============================
// GET BOOKING BY ID
// ===============================
export const getBookingById = async (id, token) => {
  try {
    const response = await axios.get(
      `${API_URL}/bookings/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Get booking by id error:', error);
    throw error;
  }
};