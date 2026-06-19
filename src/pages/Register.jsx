// src/pages/Register.jsx

import React, {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  motion,
} from "framer-motion";

import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  MapPin,
  Globe,
  Sparkles,
  ShieldCheck,
  Loader2,
  Building2,
  CheckCircle,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  registerUser,
} from "../services/authService";

import {
  useAuth,
} from "../contexts/AuthContext";

import logo from "../assets/images/logo.png";


const Register = () => {

  const navigate =
    useNavigate();

  const {
    login,
  } = useAuth();


  const [loading,setLoading] =
    useState(false);


  const [
    showPassword,
    setShowPassword,
  ] = useState(false);


  const [
    formData,
    setFormData,
  ] = useState({

    name:"",
    email:"",
    phone:"",
    country:"Rwanda",
    password:"",
    role:"traveler",

  });



  const handleChange = (e)=>{

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,

    });

  };



  const handleSubmit =
    async(e)=>{

      e.preventDefault();


      try {


        setLoading(true);



        const response =
          await registerUser(
            formData
          );



        login(
          response.user,
          response.token
        );



        toast.success(
          "Account created successfully 🎉"
        );



        if(
          response.user.role ===
          "admin"
        ){

          navigate("/admin");


        }
        else if(
          response.user.role ===
          "provider"
        ){

          toast(
            "Provider account waiting for admin approval",
            {
              icon:"⏳",
            }
          );


          navigate(
            "/provider/dashboard"
          );



        }
        else{

          navigate("/");

        }



      }
      catch(error){


        toast.error(

          error.response
          ?.data
          ?.message ||

          "Registration failed"

        );


      }
      finally{

        setLoading(false);

      }

    };





return (

<div
className="
min-h-screen
flex
items-center
justify-center
px-4
py-10

bg-gradient-to-br
from-teal-50
via-white
to-yellow-50

dark:from-gray-950
dark:via-gray-900
dark:to-black
"
>


<motion.div

initial={{
opacity:0,
y:30
}}

animate={{
opacity:1,
y:0
}}

transition={{
duration:.6
}}

className="
w-full
max-w-6xl

grid
lg:grid-cols-2

overflow-hidden

rounded-[32px]

bg-white/80
dark:bg-gray-900/80

backdrop-blur-xl

shadow-2xl

border
border-white/30
dark:border-gray-800

"

>



{/* LEFT BRAND */}

<div

className="
hidden
lg:flex

relative

p-10

flex-col
justify-between

overflow-hidden

bg-gradient-to-br

from-[#0D9488]

to-[#F59E0B]

text-white

"

>


<div
className="
absolute
w-80
h-80
rounded-full
bg-white/10
top-[-80px]
right-[-80px]
"
/>


<div
className="
absolute
w-64
h-64

rounded-full

bg-white/10

bottom-0
-left-20
"
/>



<div>


<div
className="
flex
items-center
gap-3
mb-10
"
>

<div
className="
w-16
h-16

rounded-3xl

bg-white/20

flex
items-center
justify-center

"

>

<img
src={logo}
alt="AI Tour Logo"
className="
w-14
h-14
object-contain
drop-shadow-lg
"
/>
</div>


<div>

<h1
className="
text-3xl
font-black
"
>

AI Tour

</h1>

<p
className="
text-white/80
"
>
Rwanda Smart Tourism
</p>

</div>


</div>




<h2
className="
text-5xl
font-black
leading-tight
"
>
Discover.
<br/>
Plan.
<br/>
Travel Smarter.
</h2>


<p
className="
mt-6
text-lg
text-white/90
leading-relaxed
"
>
AI-powered tourism platform connecting travelers,
tours and experiences across Africa.
</p>

</div>




<div
className="
space-y-5
"
>


<div
className="
flex
items-center
gap-3
"
>

<ShieldCheck/>

<span>
Secure JWT Authentication
</span>

</div>



<div
className="
flex
items-center
gap-3
"
>

<Sparkles/>

<span>
AI Powered Travel
</span>

</div>



<div
className="
flex
items-center
gap-3
"
>

<Globe/>

<span>
Discover Rwanda
</span>

</div>


</div>


</div>





{/* FORM SIDE */}

<div
className="
p-6
md:p-10
"
>


<h2
className="
text-4xl
font-black

text-gray-900

dark:text-white

"
>

Create Account

</h2>


<p
className="
mt-2
text-gray-500
dark:text-gray-400
"
>

Join AI Tour ecosystem

</p>



<form

onSubmit={handleSubmit}

className="
mt-8
space-y-5
"

>
 {/* NAME */}

<div>

<label
className="
block
text-sm
font-semibold
mb-2

text-gray-700
dark:text-gray-200
"
>
Full Name
</label>


<div
className="
relative
"
>

<User
className="
absolute
left-4
top-1/2
-translate-y-1/2

text-gray-400
"
/>


<input

type="text"

name="name"

value={
formData.name
}

onChange={
handleChange
}

placeholder="Your full name"

required

className="
w-full
h-14

pl-12
pr-4

rounded-2xl

border

border-gray-200
dark:border-gray-700

bg-gray-50
dark:bg-gray-950

dark:text-white

outline-none

focus:ring-2

focus:ring-[#0D9488]

transition
"

/>


</div>

</div>





{/* EMAIL */}

<div>

<label
className="
block
text-sm
font-semibold
mb-2

text-gray-700
dark:text-gray-200
"
>
Email Address
</label>


<div
className="
relative
"
>


<Mail

className="
absolute
left-4
top-1/2
-translate-y-1/2

text-gray-400
"

/>


<input

type="email"

name="email"

value={
formData.email
}

onChange={
handleChange
}

placeholder="example@gmail.com"

required


className="
w-full
h-14

pl-12

rounded-2xl

border

border-gray-200
dark:border-gray-700

bg-gray-50
dark:bg-gray-950

dark:text-white

outline-none

focus:ring-2

focus:ring-[#0D9488]

transition

"

/>


</div>

</div>





{/* PHONE COUNTRY */}

<div
className="
grid
md:grid-cols-2
gap-5
"
>


<div>

<label
className="
block
text-sm
font-semibold
mb-2

dark:text-white
"
>
Phone
</label>


<div
className="
relative
"
>

<Phone

className="
absolute
left-4
top-1/2
-translate-y-1/2

text-gray-400
"

/>


<input

type="text"

name="phone"

value={
formData.phone
}

onChange={
handleChange
}

placeholder="+250..."

required


className="
w-full
h-14

pl-12

rounded-2xl

border

bg-gray-50

dark:bg-gray-950

dark:text-white

border-gray-200

dark:border-gray-700

outline-none

focus:ring-2

focus:ring-[#0D9488]

"

/>

</div>


</div>





<div>


<label
className="
block
text-sm
font-semibold
mb-2

dark:text-white
"
>

Country

</label>


<div
className="
relative
"
>


<MapPin

className="
absolute
left-4
top-1/2
-translate-y-1/2

text-gray-400
"

/>


<input

type="text"

name="country"

value={
formData.country
}

onChange={
handleChange
}

placeholder="Rwanda"


className="
w-full
h-14

pl-12

rounded-2xl

border

bg-gray-50

dark:bg-gray-950

dark:text-white

border-gray-200

dark:border-gray-700

outline-none

focus:ring-2

focus:ring-[#0D9488]

"

/>


</div>


</div>


</div>







{/* ROLE */}

<div>


<label
className="
block
text-sm
font-semibold
mb-3

dark:text-white
"
>
Account Type
</label>


<div
className="
grid
grid-cols-2
gap-4
"
>


<button

type="button"

onClick={()=>setFormData({
...formData,
role:"user"
})}


className={`
p-5

rounded-2xl

border

transition

${
formData.role==="traveler"

?

"border-[#0D9488] bg-teal-50 dark:bg-teal-900/20"

:

"border-gray-200 dark:border-gray-700"
}

`}

>


<User

className="
mx-auto
mb-2
text-[#0D9488]
"

/>

<p
className="
font-bold
dark:text-white
"
>
Traveler
</p>


</button>






<button

type="button"

onClick={()=>setFormData({
...formData,
role:"provider"
})}


className={`
p-5

rounded-2xl

border

transition


${
formData.role==="provider"

?

"border-[#F59E0B] bg-yellow-50 dark:bg-yellow-900/20"

:

"border-gray-200 dark:border-gray-700"
}

`}

>


<Building2

className="
mx-auto
mb-2
text-[#F59E0B]
"

/>


<p
className="
font-bold
dark:text-white
"
>
Provider
</p>


</button>



</div>



{
formData.role==="provider" &&

<motion.div

initial={{
opacity:0,
height:0
}}

animate={{
opacity:1,
height:"auto"
}}

className="
mt-4

p-4

rounded-2xl

bg-yellow-50

dark:bg-yellow-900/20

text-sm

text-yellow-800

dark:text-yellow-300

flex
gap-2

"

>

<CheckCircle
size={18}
/>

<span>

Provider accounts require admin approval before publishing tours.

</span>


</motion.div>

}


</div>







{/* PASSWORD */}

<div>


<label
className="
block
text-sm
font-semibold
mb-2

dark:text-white
"
>

Password

</label>



<div
className="
relative
"
>


<Lock

className="
absolute
left-4

top-1/2

-translate-y-1/2

text-gray-400

"

/>



<input


type={
showPassword
?
"text"
:
"password"
}


name="password"


value={
formData.password
}


onChange={
handleChange
}


placeholder="Create strong password"


required



className="
w-full

h-14

pl-12

pr-14

rounded-2xl

border

bg-gray-50

dark:bg-gray-950

dark:text-white

border-gray-200

dark:border-gray-700

outline-none

focus:ring-2

focus:ring-[#0D9488]

"

/>




<button

type="button"

onClick={()=>
setShowPassword(!showPassword)
}

className="
absolute
right-4

top-1/2

-translate-y-1/2

text-gray-400

"

>

{

showPassword

?

<EyeOff size={20}/>

:

<Eye size={20}/>

}


</button>


</div>


</div>







{/* SUBMIT */}


<button

disabled={loading}

type="submit"


className="
w-full

h-14

rounded-2xl

font-bold

text-lg

text-white


bg-gradient-to-r

from-[#0D9488]

to-[#F59E0B]


shadow-xl

hover:scale-[1.02]

transition


disabled:opacity-60

flex
items-center
justify-center
gap-3

"

>


{

loading

?

<>

<Loader2
className="
animate-spin
"
/>

Creating account...

</>

:

"Create Account"

}


</button>



</form>






{/* LOGIN */}

<div
className="
mt-8

text-center

text-gray-600

dark:text-gray-400

"
>

Already have account?


<Link

to="/login"

className="
ml-2

font-bold

text-[#0D9488]

hover:underline

"
>

Login

</Link>


</div>



</div>


</motion.div>


</div>

);

};


export default Register;