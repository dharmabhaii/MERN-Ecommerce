const express=require("express")
const app=express.Router();
app.use(express.static("public"));
app.use(express.json());
const KEY=process.env.STRIPE_KEY
const stripe=require("stripe")(KEY);

// app.post("/payment", async (req, res) => {
//     try {
//       const paymentIntent = await stripe.paymentIntents.create({
//         amount: req.body.amount,
//         currency: "inr",
//         // payment_method_types: ["card"],
//         automatic_payment_methods:{
//           enabled:true
//         },
//         payment_method_data: {
//           type: "card",
//           card: {
//             token: req.body.card,
//           },
//         },
//       });
     
//       res.json(paymentIntent.client_secret);

//     } catch (err) {
//       res.json(err);
//     }
//   });


const calculateOrderAmount = (items) => {
     
  return 140;
};
  

app.post("/payment", async (req, res) => {
  const items=req.body;
console.log(req.body);
  // Create a PaymentIntent with the order amount and currency
  try{
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount*100,
      currency: "inr",
      automatic_payment_methods: {
        enabled: true,
      },
    });
  
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  }catch(err){
    console.log(err);
  }
 
});


module.exports=app;