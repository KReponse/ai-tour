import axios from "axios";


const API =
"http://localhost:5000/api/provider";


// =========================
// AUTH HEADER
// =========================

const authHeader = () => {

  const token =
  localStorage.getItem("token");


  return {

    headers:{
      Authorization:
      `Bearer ${token}`
    }

  };

};



// =========================
// GET MY PROVIDER REQUEST
// =========================

export const getMyProviderRequest =
async()=>{

try{


const response =
await axios.get(

`${API}/request/me`,

authHeader()

);


return response.data;


}catch(error){


throw {

message:
error.response?.data?.message ||
"Failed to get provider request",

status:
error.response?.status

};


}

};




// =========================
// CREATE PROVIDER REQUEST
// =========================

export const createProviderRequest =
async(data)=>{


try{


const response =
await axios.post(

`${API}/request`,

data,

authHeader()

);


return response.data;


}catch(error){


throw {

message:
error.response?.data?.message ||
"Failed to submit provider request",

status:
error.response?.status

};


}


};




// =========================
// GET PROVIDER PROFILE
// =========================

export const getProviderProfile =
async()=>{


try{


const response =
await axios.get(

`${API}/profile`,

authHeader()

);


return response.data;


}catch(error){


throw {

message:
error.response?.data?.message ||
"Failed to get provider profile",

status:
error.response?.status

};


}


};




// =========================
// GET PROVIDER BOOKINGS
// =========================

export const getProviderBookings =
async()=>{


try{


const response =
await axios.get(

`${API}/bookings`,

authHeader()

);


return response.data;


}catch(error){


throw {

message:
error.response?.data?.message ||
"Failed to get bookings",

status:
error.response?.status

};


}


};




// =========================
// GET PROVIDER TRAVELERS
// =========================

export const getProviderTravelers =
async()=>{


try{


const response =
await axios.get(

`${API}/travelers`,

authHeader()

);


return response.data;


}catch(error){


throw {

message:
error.response?.data?.message ||
"Failed to get travelers",

status:
error.response?.status

};


}


};




// =========================
// GET PROVIDER ANALYTICS
// =========================

export const getProviderAnalytics =
async()=>{


try{


const response =
await axios.get(

`${API}/analytics`,

authHeader()

);


return response.data;


}catch(error){


throw {

message:
error.response?.data?.message ||
"Failed to get analytics",

status:
error.response?.status

};


}


};
// =========================
// GET PROVIDER STATS
// =========================

export const getProviderStats =
async()=>{

try{

const response =
await axios.get(

`${API}/analytics`,

authHeader()

);


return response.data;


}catch(error){

throw {

message:
error.response?.data?.message ||
"Failed to get provider stats",

status:
error.response?.status

};

}

};
// =========================
// GET RECENT REQUESTS
// =========================

export const getRecentRequests =
async()=>{

try{

const response =
await axios.get(

`${API}/bookings`,

authHeader()

);


return response.data;


}catch(error){

throw {

message:
error.response?.data?.message ||
"Failed to get recent requests",

status:
error.response?.status

};

}

};