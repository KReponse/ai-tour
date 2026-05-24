import axios from 'axios';

const API =
  'http://localhost:5000/api/tours';

/* ================= GET TOURS ================= */

export const getTours =
  async () => {

    const response =
      await axios.get(API);

    return response.data;

  };

/* ================= CREATE TOUR ================= */

export const createTour =
  async (tourData) => {

    const response =
      await axios.post(
        API,
        tourData
      );

    return response.data;

  };

/* ================= GET SINGLE TOUR ================= */

export const getTourById =
  async (id) => {

    const response =
      await axios.get(
        `${API}/${id}`
      );

    return response.data;

  };

/* ================= UPDATE TOUR ================= */

export const updateTour =
  async (id, tourData) => {

    const response =
      await axios.put(
        `${API}/${id}`,
        tourData
      );

    return response.data;

  };

/* ================= DELETE TOUR ================= */

export const deleteTour =
  async (id) => {

    const response =
      await axios.delete(
        `${API}/${id}`
      );

    return response.data;

  };