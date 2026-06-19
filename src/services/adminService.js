import axios from "axios";

const API = "http://localhost:5000/api/admin";

/**
 * Helper: get token safely
 */
const getToken = () => localStorage.getItem("token");

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const getDashboardStats = async () => {
  const response = await axios.get(`${API}/dashboard`, authHeader());
  return response.data;
};

export const getAllTours = async () => {
  const response = await axios.get(`${API}/tours`, authHeader());
  return response.data;
};

export const deleteTour = async (id) => {
  const response = await axios.delete(
    `${API}/tours/${id}`,
    authHeader()
  );
  return response.data;
};

export const getAllRequests = async () => {
  const response = await axios.get(
    `${API}/requests`,
    authHeader()
  );

  return response.data;
};
export const updateProviderRequest =
async(id,status)=>{

const response =
await API.put(

`/admin/provider-requests/${id}`,

{
status
}

);

return response.data;

};
export const getProviderRequests =
async()=>{

const response =
await axios.get(

`${API}/provider-requests`,

authHeader()

);

return response.data;

};