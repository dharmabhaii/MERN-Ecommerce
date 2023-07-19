const express=require("express");
const app=express.Router();
const { verifyToken, verifyandauthorize, verifyandAdmin }=require("../routes/verifyToken");
const ordermodel=require("../models/Ordermodel")
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const crypto=require("crypto-js");


//CREATE a order
app.post("/",verifyToken,async (req,res)=>{
   const neworder = new ordermodel(req.body)

   try{
    const savedorder=await neworder.save();
    res.status(200).json(savedorder);

   }catch(err){
    res.status(400).json(err)
   }
   
})

//UPDATing order
app.put("/:id",verifyandAdmin,async (req,res)=>{
    try{
        const orderproducts=req.body;
        const updatedorder=await cartmodel.findByIdAndUpdate(req.params.id,
                  orderproducts,{new:true});
        res.status(200).json(updatedorder);
    }catch(err){
        res.status(400).json(err);
    }
})


//DELETE a order
app.delete("/:id",verifyandAdmin,async (req,res) => {
    try{
        await ordermodel.findByIdAndDelete(req.params.id);
        res.status(200).json({msg:"order has been deleted"})
    }catch(err){
        res.status(200).json(err)
    }
})


//GET a user order
app.get("/find/:userid",verifyandauthorize,async (req,res)=>{
       try{
        const orderproduct= await ordermodel.find({userId:req.params.userid});
        res.status(200).json(orderproduct)
       }catch(err){
        res.status(400).json(err);
       }
})

//GET all orders
app.get("/find",verifyandAdmin,async (req,res)=>{
    
    try{
        const orders= await ordermodel.find();
        res.status(200).json(orders)
    }catch(err){
     res.status(400).json(err);
    }
})

//GET monthly sales
app.get("/sales",verifyandAdmin, async (req,res)=>{
const date=new Date();
const lastmonth=new Date(date.setMonth(date.getMonth()-1));
const previousmonth=new Date(new Date().setMonth(lastmonth.getMonth()-1));

try{
  const income=await ordermodel.aggregate([
    { 
        $match: { createdAt : {$gte:previousmonth} } 
    },
    {
        $project:{
            month:{ $month:"$createdAt" },
            sales:"$amount"
        }
    },
    {
        $group:{
           _id:"$month",
           total:{$sum:"$sales"}
        }
    }
  ])
  
res.status(200).json(income);


}catch(err){
    res.status(400).json(err);
}

})

module.exports=app;