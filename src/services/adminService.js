import axios from 'axios';

const API =
  'http://localhost:5000/api/admin';

export const getDashboardStats =
  async (
    token
  ) => {

    const res =
      await axios.get(

        `${API}/dashboard`,

        {
          headers: {

            Authorization:
              `Bearer ${token}`,

          },
        }
      );

    return res.data;

  };

  export const getAllUsers =
  async (
    token
  ) => {

    const res =
      await axios.get(

        `${API}/users`,

        {
          headers: {

            Authorization:
              `Bearer ${token}`,

          },
        }
      );

    return res.data;

  };

export const updateUserRole =
  async (
    id,
    role,
    token
  ) => {

    const res =
      await axios.put(

        `${API}/users/${id}`,

        { role },

        {
          headers: {

            Authorization:
              `Bearer ${token}`,

          },
        }
      );

    return res.data;

  };

  export const getAllTours =
  async (
    token
  ) => {

    const res =
      await axios.get(

        `${API}/tours`,

        {

          headers: {

            Authorization:
              `Bearer ${token}`,

          },

        }

      );

    return res.data;

  };

export const deleteTour =
  async (
    id,
    token
  ) => {

    const res =
      await axios.delete(

        `${API}/tours/${id}`,

        {

          headers: {

            Authorization:
              `Bearer ${token}`,

          },

        }

      );

    return res.data;

  };

