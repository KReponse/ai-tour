import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import crypto from "crypto";
import sendEmail from "../config/services/emailService.js";


// =========================
// GENERATE JWT TOKEN
// =========================

const generateToken = (user) => {

  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      verificationStatus:
        user.verificationStatus,
    },

    process.env.JWT_SECRET,

    {
      expiresIn: "7d",
    }
  );

};



// =========================
// REGISTER USER
// =========================

export const registerUser = async (req,res)=>{

try {


const {
name,
email,
password,
} = req.body;



if(!name || !email || !password){

return res.status(400).json({

success:false,

message:
"All fields are required",

});

}



// CHECK USER

const existingUser =
await User.findOne({email});


if(existingUser){

return res.status(400).json({

success:false,

message:
"User already exists",

});

}



// HASH PASSWORD

const hashedPassword =
await bcrypt.hash(password,10);



// CREATE USER

const user =
await User.create({

name,

email,

password:
hashedPassword,


// EVERY NEW ACCOUNT STARTS AS TRAVELER

role:"traveler",


verificationStatus:
"approved",

});




// TOKEN

const token =
generateToken(user);



res.status(201).json({

success:true,

message:
"Registration successful",


token,


user:{

id:user._id,

name:user.name,

email:user.email,

role:user.role,

verificationStatus:
user.verificationStatus,

}

});


}

catch(error){

res.status(500).json({

success:false,

message:error.message,

});

}


};




// =========================
// LOGIN USER
// =========================

export const loginUser =
async(req,res)=>{


try{


const {
email,
password
}=req.body;



const user =
await User.findOne({email});


if(!user){

return res.status(400).json({

success:false,

message:
"Invalid credentials",

});

}



const isMatch =
await bcrypt.compare(
password,
user.password
);



if(!isMatch){

return res.status(400).json({

success:false,

message:
"Invalid credentials",

});

}




// UPDATE LAST LOGIN

user.lastLogin =
new Date();

await user.save();




// TOKEN

const token =
generateToken(user);



res.status(200).json({

success:true,

message:
"Login successful",


token,


user:{

id:user._id,

name:user.name,

email:user.email,

role:user.role,

verificationStatus:
user.verificationStatus,

}

});


}


catch(error){

res.status(500).json({

success:false,

message:error.message,

});

}


};

export const forgotPassword = async(req,res)=>{

try{

const { email } = req.body;

const user =
await User.findOne({ email });

if(!user){

return res.status(404).json({

success:false,

message:"User not found"

});

}

const resetToken =
crypto.randomBytes(32)
.toString("hex");

user.resetPasswordToken =
crypto
.createHash("sha256")
.update(resetToken)
.digest("hex");

user.resetPasswordExpire =
Date.now() + 15 * 60 * 1000;

await user.save();

const resetUrl =
`${process.env.CLIENT_URL}/reset-password/${resetToken}`;
console.log(
  "RESET TOKEN:",
  resetToken
);

await sendEmail(

user.email,

"AI Tour Password Reset",

`
<h2>Password Reset</h2>

<p>
Click the button below
to reset your password
</p>

<a href="${resetUrl}">
Reset Password
</a>

<p>
This link expires in
15 minutes.
</p>
`

);

res.json({

success:true,

message:
"Password reset email sent"

});

}catch(error){

res.status(500).json({

success:false,

message:error.message

});

}

};
export const resetPassword = async(req,res)=>{

try{

const hashedToken =
crypto
.createHash("sha256")
.update(req.params.token)
.digest("hex");

const user =
await User.findOne({

resetPasswordToken:
hashedToken,

resetPasswordExpire:{
$gt: Date.now()
}

});

if(!user){

return res.status(400).json({

success:false,

message:
"Invalid or expired token"

});

}

const hashedPassword =
await bcrypt.hash(
req.body.password,
10
);

user.password =
hashedPassword;

user.resetPasswordToken =
undefined;

user.resetPasswordExpire =
undefined;

await user.save();

res.json({

success:true,

message:
"Password reset successful"

});

}catch(error){

res.status(500).json({

success:false,

message:error.message

});

}

};
// =========================
// GET CURRENT USER
// =========================

export const getCurrentUser =
async(req,res)=>{

try{


const user =
await User.findById(
req.user._id
)
.select("-password");



if(!user){

return res.status(404).json({

success:false,

message:
"User not found"

});

}



res.status(200).json({

success:true,

user

});


}catch(error){


res.status(500).json({

success:false,

message:error.message

});


}

};