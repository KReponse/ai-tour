import axios from "axios";

const API = "http://localhost:5000/api/admin";


/**
 * Helper: get token safely
 */
const getToken = () =>
localStorage.getItem("token");



const authHeader = () => ({

headers:{
Authorization:
`Bearer ${getToken()}`
}

});



// =========================
// DASHBOARD
// =========================

export const getDashboardStats =
async()=>{

const response =
await axios.get(

`${API}/dashboard`,

authHeader()

);

return response.data;

};



// =========================
// TOURS
// =========================

export const getAllTours =
async()=>{

const response =
await axios.get(

`${API}/tours`,

authHeader()

);

return response.data;

};



export const deleteTour =
async(id)=>{


const response =
await axios.delete(

`${API}/tours/${id}`,

authHeader()

);


return response.data;

};



// =========================
// REQUESTS
// =========================

export const getAllRequests =
async()=>{


const response =
await axios.get(

`${API}/requests`,

authHeader()

);


return response.data;

};



// =========================
// PROVIDER REQUESTS
// =========================


export const getProviderRequests =
async()=>{


const response =
await axios.get(

`${API}/provider-requests`,

authHeader()

);


return response.data;

};



// =========================
// APPROVE / REJECT PROVIDER
// =========================


export const updateProviderRequest = async (
  id,
  status,
  adminNotes = ""
) => {

  const response = await axios.put(
    `${API}/provider-request/${id}/status`,
    {
      status,
      adminNotes,
    },
    authHeader()
  );

  return response.data;
};