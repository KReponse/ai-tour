import axios from 'axios';


const API = 'http://localhost:5000/api/tours';

/* ================= GET ALL TOURS ================= */
export const getTours = async () => {
  const response = await axios.get(API);
  return response.data;
};

/* ================= GET SINGLE TOUR ================= */
export const getTourById = async (id) => {
  const response = await axios.get(`${API}/${id}`);
  return response.data;
};

/* ================= GET USER'S TOURS ================= */
export const getUserTours = async (token) => {
  const response = await axios.get(`${API}/user/my-tours`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/* ================= CREATE TOUR ================= */
export const createTour = async (formData, token) => {
  const response = await axios.post(API, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/* ================= UPDATE TOUR ================= */
export const updateTour = async (id, formData, token) => {
  const response = await axios.put(`${API}/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/* ================= DELETE TOUR ================= */
export const deleteTour = async (id, token) => {
  const response = await axios.delete(`${API}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/* ================= TOGGLE TOUR STATUS (ACTIVE/INACTIVE) ================= */
export const toggleTourStatus = async (id, token) => {
  const response = await axios.patch(
    `${API}/${id}/toggle-status`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

/* ================= GET TOURS BY LOCATION ================= */
export const getToursByLocation = async (location) => {
  const response = await axios.get(`${API}/location/${location}`);
  return response.data;
};

/* ================= GET TOURS BY PRICE RANGE ================= */
export const getToursByPriceRange = async (min, max) => {
  const response = await axios.get(`${API}/price-range?min=${min}&max=${max}`);
  return response.data;
};

/* ================= SEARCH TOURS ================= */
export const searchTours = async (query) => {
  const response = await axios.get(`${API}/search?q=${query}`);
  return response.data;
};
export const getSingleTour =
  async (id) => {

    const response =
      await axios.get(
        `${API}/${id}`
      );

    return response.data;

  };