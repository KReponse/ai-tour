import axios from "axios";


/* =========================
BASE API INSTANCE
========================= */

const API = axios.create({

  baseURL:
    "http://localhost:5000/api/auth",

});



/* =========================
AUTO ATTACH TOKEN
========================= */

API.interceptors.request.use(
(config)=>{

const token =
localStorage.getItem("token");


if(token){

config.headers.Authorization =
`Bearer ${token}`;

}


return config;


},
(error)=>{

return Promise.reject(error);

});




/* =========================
ERROR HANDLER
========================= */

const handleError = (error)=>{

throw {

message:
error.response?.data?.message ||
"Something went wrong",


status:
error.response?.status,

};

};




/* =========================
REGISTER
========================= */

export const registerUser =
async(userData)=>{

try{

const {data} =
await API.post(
"/register",
userData
);


return data;


}catch(error){

handleError(error);

}

};





/* =========================
LOGIN
========================= */

export const loginUser =
async(userData)=>{


try{


const {data} =
await API.post(
"/login",
userData
);



/*
 SAVE AUTH DATA
*/

if(data.token){

localStorage.setItem(
"token",
data.token
);


localStorage.setItem(
"user",
JSON.stringify(data.user)
);

}


return data;



}catch(error){

handleError(error);

}


};






/* =========================
FORGOT PASSWORD
========================= */

export const forgotPassword =
async(email)=>{


try{


const {data} =
await API.post(
"/forgot-password",
{
email
}
);


return data;



}catch(error){

handleError(error);

}


};






/* =========================
RESET PASSWORD
========================= */

export const resetPassword =
async(token,password)=>{


try{


const {data} =
await API.post(

`/reset-password/${token}`,

{
password
}

);


return data;



}catch(error){

handleError(error);

}


};







// =========================
// GET CURRENT USER FROM API
// =========================

export const getCurrentUser =
async()=>{

try{


const {data} =
await API.get("/me");


localStorage.setItem(
"user",
JSON.stringify(data.user)
);



return data.user;



}catch(error){


throw {

message:
error.response?.data?.message ||
"Failed to get current user",

status:
error.response?.status

};


}

};
/* =========================
GET LOCAL USER
========================= */

export const getStoredUser =
()=>{


const user =
localStorage.getItem("user");



return user
?
JSON.parse(user)
:
null;


};







/* =========================
GET TOKEN
========================= */

export const getToken =
()=>{

return localStorage.getItem(
"token"
);

};







/* =========================
LOGOUT
========================= */

export const logoutUser =
()=>{


localStorage.removeItem(
"token"
);


localStorage.removeItem(
"user"
);


};





export default API;