// src/components/provider/ProviderMobileNavbar.jsx

import React from "react";

import {
  Menu,
  Bell,
  UserCircle,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";


const ProviderMobileNavbar = ({
  onMenuClick,
  unreadCount = 0,
  onNotificationClick,
  user,
}) => {


const navigate =
useNavigate();



return (

<header

className="
lg:hidden
fixed
top-0
left-0
right-0

h-16

z-50


bg-white/80

dark:bg-gray-950/80


backdrop-blur-xl


border-b

border-gray-200

dark:border-gray-800

"

>


<div

className="
h-full

px-4

flex

items-center

justify-between

"

>



{/* LEFT */}

<div

className="
flex

items-center

gap-3

"

>


<button

onClick={onMenuClick}

className="
w-11

h-11


rounded-2xl


bg-gray-100


dark:bg-gray-800


flex

items-center

justify-center


hover:scale-105


transition

"

>


<Menu

className="
w-5

h-5

text-gray-700

dark:text-white

"

/>


</button>





{/* LOGO */}


<div>


<h1

className="
text-lg

font-black


bg-gradient-to-r

from-blue-600

to-purple-600


bg-clip-text

text-transparent


leading-none

"

>

AI Tour

</h1>


<p

className="
text-[10px]

text-gray-500

dark:text-gray-400

"

>

Provider Center

</p>


</div>



</div>







{/* RIGHT */}


<div

className="
flex

items-center

gap-3

"

>




{/* NOTIFICATION */}



<button


onClick={onNotificationClick}


className="
relative


w-11

h-11


rounded-2xl


bg-gray-100


dark:bg-gray-800


flex

items-center

justify-center


hover:scale-105


transition

"

>


<Bell

className="
w-5

h-5


text-gray-700


dark:text-white

"

/>



{
unreadCount > 0 &&


<span

className="
absolute

-top-1

-right-1


w-5

h-5


rounded-full


bg-red-500


text-white


text-xs


font-bold


flex

items-center

justify-center


border-2


border-white


dark:border-gray-950

"

>


{unreadCount}


</span>


}



</button>







{/* PROFILE */}



{
user ?


(

<button

onClick={()=>navigate(
"/provider/profile"
)}

className="
relative

"

>


<img


src={
user.avatar ||
"/default-avatar.png"
}


alt="profile"


className="
w-11

h-11


rounded-2xl


object-cover


border-2


border-blue-500


"

 />



{/* ONLINE STATUS */}

<span

className="
absolute

bottom-0

right-0


w-3

h-3


rounded-full


bg-green-500


border-2


border-white


dark:border-gray-950

"

/>



</button>


)



:


(


<button

onClick={()=>navigate(
"/login"
)}

className="
w-11

h-11


rounded-2xl


bg-gradient-to-r


from-blue-600


to-purple-600


flex

items-center

justify-center


text-white

"

>


<UserCircle

size={25}

/>


</button>


)



}



</div>



</div>


</header>


);


};


export default ProviderMobileNavbar;