import React, {
  useEffect,
  useState
} from "react";

import {
  Loader2
} from "lucide-react";

import {
  createProviderRequest,
  getMyProviderRequest
} from "../services/providerService";


const ProviderRequest = () => {


const [loading,setLoading] =
useState(true);


const [existing,setExisting] =
useState(null);


const [form,setForm] =
useState({

fullName:"",
phone:"",
businessName:"",
businessType:"",
description:"",
country:"",
city:"",
price:"",
currency:"",
availability:""

});



useEffect(()=>{

checkRequest();

},[]);



const checkRequest =
async()=>{

try{

const data =
await getMyProviderRequest();


setExisting(
data.request
);


}catch(error){

console.log(error);

}
finally{

setLoading(false);

}

};




const handleChange =
(e)=>{

setForm({

...form,

[e.target.name]:
e.target.value

});

};




const submit =
async(e)=>{

e.preventDefault();


try{


await createProviderRequest(
form
);


alert(
"Provider request submitted"
);


checkRequest();



}catch(error){

console.log(error);

}

};




if(loading){

return(

<div className="
flex
justify-center
py-20
">

<Loader2
className="
animate-spin
w-8
h-8
text-blue-600
"
/>

</div>

);

}




if(existing){

return(

<div className="
max-w-xl
mx-auto
p-6
">

<div className="
bg-white
dark:bg-gray-900
rounded-3xl
p-8
border
">

<h1 className="
text-3xl
font-black
dark:text-white
">

Provider Application

</h1>


<p className="
mt-5
text-gray-500
">

Your application status:

</p>


<div className="
mt-4
inline-block
px-5
py-3
rounded-full
bg-blue-100
text-blue-700
font-bold
">

{
existing.status
}

</div>


</div>

</div>

);

}





return(

<div className="
max-w-3xl
mx-auto
p-6
">

<h1 className="
text-3xl
font-black
dark:text-white
">

Become A Provider

</h1>


<p className="
text-gray-500
mt-2
">

Offer tours and travel services on AI Tour Rwanda

</p>



<form
onSubmit={submit}
className="
mt-8
space-y-5
bg-white
dark:bg-gray-900
p-8
rounded-3xl
border
"
>


{
[
["fullName","Full Name"],
["phone","Phone"],
["businessName","Business Name"],
["businessType","Business Type"],
["country","Country"],
["city","City"],
["price","Price"],
["currency","Currency"],
["availability","Availability"]

].map(
(item)=>(

<input

key={item[0]}

name={item[0]}

placeholder={item[1]}

value={
form[item[0]]
}

onChange={handleChange}

className="
w-full
px-4
py-3
rounded-xl
border
dark:bg-gray-800
dark:text-white
"

/>

)

)

}



<textarea

name="description"

placeholder="Describe your service"

value={
form.description
}

onChange={handleChange}

className="
w-full
px-4
py-3
rounded-xl
border
dark:bg-gray-800
dark:text-white
"

/>



<button

className="
w-full
bg-blue-600
text-white
py-3
rounded-xl
font-bold
"

>

Submit Application

</button>


</form>


</div>

);

};


export default ProviderRequest;