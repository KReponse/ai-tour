import axios from 'axios';

const API =
  'http://localhost:5000/api/requests';

export const createRequest =
  async (
    data,
    token
  ) => {

    const res =
      await axios.post(

        API,

        data,

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return res.data;

  };

export const getRequests =
  async (
    token
  ) => {

    const res =
      await axios.get(

        API,

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return res.data;

  };

export const updateRequestStatus =
  async (
    id,
    status,
    token
  ) => {

    const res =
      await axios.put(

        `${API}/${id}`,

        {
          status,
        },

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return res.data;

  };