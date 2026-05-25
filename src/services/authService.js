import axios from 'axios';

const API = axios.create({
  baseURL:
    'http://localhost:5000/api/auth',
});

/* ================= REGISTER ================= */

export const registerUser =
  async (userData) => {

    const response =
      await API.post(
        '/register',
        userData
      );

    /* SAVE TOKEN */
    localStorage.setItem(
      'token',
      response.data.token
    );

    localStorage.setItem(
      'user',
      JSON.stringify(
        response.data.user
      )
    );

    return response.data;

  };

/* ================= LOGIN ================= */

export const loginUser =
  async (userData) => {

    const response =
      await API.post(
        '/login',
        userData
      );

    /* SAVE TOKEN */
    localStorage.setItem(
      'token',
      response.data.token
    );

    localStorage.setItem(
      'user',
      JSON.stringify(
        response.data.user
      )
    );

    return response.data;

  };

/* ================= LOGOUT ================= */

export const logoutUser =
  () => {

    localStorage.removeItem(
      'token'
    );

    localStorage.removeItem(
      'user'
    );

  };

/* ================= GET USER ================= */

export const getCurrentUser =
  () => {

    const user =
      localStorage.getItem(
        'user'
      );

    return user
      ? JSON.parse(user)
      : null;

  };

/* ================= GET TOKEN ================= */

export const getToken =
  () => {

    return localStorage.getItem(
      'token'
    );

  };