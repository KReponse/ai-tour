import axios from 'axios';

const API =
  'http://localhost:5000/api/payments';

export const createCheckout =
  async (data) => {

    const res =
      await axios.post(
        `${API}/checkout`,
        data
      );

    return res.data;
  };