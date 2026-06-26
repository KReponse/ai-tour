import axios from "axios";

const API_URL =
import.meta.env.VITE_API_URL ||
"http://localhost:5000";


// GET REVIEWS
export const getTourReviews = async(tourId)=>{

const res =
await axios.get(
`${API_URL}/api/reviews/tour/${tourId}`
);

return res.data;

};



// CREATE REVIEW

export const createReview = async(data,token)=>{

const res =
await axios.post(

`${API_URL}/api/reviews`,

data,

{
headers:{
Authorization:`Bearer ${token}`
}
}

);


return res.data;

};