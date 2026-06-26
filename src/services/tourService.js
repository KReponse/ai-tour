import axios from "axios";

const API = "http://localhost:5000/api/tours";

/* ================= PUBLIC TOURS ================= */
export const getTours = async () => {
const response = await axios.get(API);
return response.data;
};

/* ================= SINGLE TOUR ================= */
export const getTourById = async (id) => {
const response = await axios.get(`${API}/${id}`);
return response.data;
};

/* ================= GET PROVIDER TOURS ================= */

export const getProviderTours = async(token)=>{

const response = await axios.get(
`${API}/provider/my-tours`,
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

return response.data;

};

/* ================= CREATE TOUR ================= */
export const createTour = async (formData, token) => {
const response = await axios.post(API, formData, {
headers: {
Authorization: `Bearer ${token}`,
"Content-Type": "multipart/form-data",
},
});

return response.data;
};

/* ================= UPDATE TOUR ================= */
export const updateTour = async (id, formData, token) => {
const response = await axios.put(
`${API}/${id}`,
formData,
{
headers: {
Authorization: `Bearer ${token}`,
"Content-Type": "multipart/form-data",
},
}
);

return response.data;
};

/* ================= DELETE TOUR ================= */
export const deleteTour = async (id, token) => {
const response = await axios.delete(
`${API}/${id}`,
{
headers: {
Authorization: `Bearer ${token}`,
},
}
);

return response.data;
};

/* ================= TOGGLE STATUS ================= */
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
