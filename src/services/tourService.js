import axios from 'axios';

const API =
  'http://localhost:5000/api/tours';

/* ================= CREATE TOUR ================= */

export const createTour =
  async (tourData, token) => {

    const response =
      await axios.post(
        API,
        tourData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
            'Content-Type':
              'multipart/form-data',
          },
        }
      );

    return response.data;
};

/* ================= GET TOURS ================= */

export const getTours =
  async () => {

    const response =
      await axios.get(API);

    return response.data;
};

/* ================= DELETE TOUR ================= */

export const deleteTour =
  async (id, token) => {

    const response =
      await axios.delete(
        `${API}/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
};