import axios from 'axios';

const API =
  'http://localhost:5000/api/tours';

/* ================= GET TOKEN ================= */

const getToken =
  () => {

    return localStorage.getItem(
      'token'
    );

  };

/* ================= CREATE TOUR ================= */

export const createTour =
  async (tourData) => {

    const response =
      await axios.post(
        API,
        tourData,
        {
          headers: {
            Authorization:
              `Bearer ${getToken()}`,
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
  async (id) => {

    const response =
      await axios.delete(
        `${API}/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${getToken()}`,
          },
        }
      );

    return response.data;

  };