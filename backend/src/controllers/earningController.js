import Stripe from "stripe";
import Booking from "../models/Booking.js";
import Earning from "../models/Earning.js";
import createNotification from "../utils/createNotification.js";




export const getMyEarnings =
async(req,res)=>{


try{


const earnings =
await Earning.find({

provider:req.user._id

})
.populate(
"booking"
);



const total =
earnings.reduce(

(sum,item)=>
sum + item.amount,

0

);



res.json({

success:true,

total,

earnings

});


}catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};

/* =========================
GET PROVIDER WALLET
========================= */


export const getProviderWallet =
async(req,res)=>{


try{


const earnings =
await Earning.find({

provider:req.user._id

});



const availableBalance =
earnings
.filter(
item=>item.status==="available"
)
.reduce(

(sum,item)=>
sum + item.amount,

0

);



const withdrawn =
earnings
.filter(
item=>item.status==="withdrawn"
)
.reduce(

(sum,item)=>
sum + item.amount,

0

);



const totalEarned =
earnings.reduce(

(sum,item)=>
sum + item.amount,

0

);



res.json({

success:true,

wallet:{

availableBalance,

withdrawn,

totalEarned

}

});


}catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};





/* =========================
REQUEST WITHDRAWAL
========================= */


export const requestWithdrawal =
async(req,res)=>{


try{


const {
amount,
method,
accountDetails
}=req.body;



const earnings =
await Earning.find({

provider:req.user._id,

status:"available"

});



const balance =
earnings.reduce(

(sum,item)=>
sum + item.amount,

0

);



if(amount > balance){

return res.status(400).json({

success:false,

message:
"Insufficient balance"

});

}



const withdrawal =
await Withdrawal.create({

provider:req.user._id,

amount,

method,

accountDetails

});



res.status(201).json({

success:true,

message:
"Withdrawal request submitted",

withdrawal

});



}catch(error){


res.status(500).json({

success:false,

message:error.message

});


}

};
export const stripeWebhook =
async(req,res)=>{


const sig =
req.headers["stripe-signature"];


let event;


try{


event =
stripe.webhooks.constructEvent(

req.body,

sig,

process.env.STRIPE_WEBHOOK_SECRET

);


}catch(error){


return res.status(400).json({

success:false,

message:error.message

});


}




if(
event.type ===
"checkout.session.completed"
){


const session =
event.data.object;



const booking =
await Booking.findById(
session.metadata.bookingId
);



if(!booking){

return res.json({
received:true
});

}




// UPDATE BOOKING

booking.paymentStatus =
"paid";


booking.status =
"confirmed";


booking.paymentId =
session.payment_intent;


booking.paidAt =
new Date();


await booking.save();





// =======================
// CREATE PROVIDER EARNING
// =======================


await Earning.create({

provider:
booking.provider,


booking:
booking._id,


amount:
booking.totalPrice,


status:
"available"

});





// NOTIFY PROVIDER

await createNotification(

booking.provider,

"Payment Received",

`You received $${booking.totalPrice} from booking payment`,

"payment"

);



console.log(
"Payment completed and earning created"
);



}



res.json({

received:true

});


};export {
createCheckoutSession,
stripeWebhook
};