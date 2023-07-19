const express=require("express");
const app=express.Router();
const { verifyToken, verifyandauthorize, verifyandAdmin }=require("../routes/verifyToken");
const usermodel = require("../models/usermodel");
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const crypto=require("crypto-js");


//UPDATE
app.put("/:id",verifyandauthorize,async (req,res)=>{
        if(req.body.password){
             req.body.password= crypto.AES.encrypt(
                req.body.password,
                process.env.CRYPTO_KEY).toString();
        }
   try{
       const updateduser=await usermodel.findByIdAndUpdate(req.params.id,
        {$set:req.body},{new:true});
        res.status(200).json(updateduser);
   }catch(err){
    res.status(500).json(err)
   }
  
})

//DELETE any user
app.delete("/:id",verifyandauthorize,async (req,res) => {
    try{
        await usermodel.findByIdAndDelete(req.params.id);
        res.status(200).json({msg:"user deleted"})
    }catch(err){
        res.status(200).json(err)
    }
})

//get user (only admin can have access to any user)
app.get("/find/:id",verifyandAdmin,async (req,res)=>{
    try{
        const userinfo=await usermodel.findById(req.params.id);
        res.status(200).json(userinfo);
    }catch(err){
        res.status(500).json(err);
    }
})

//GET all users
app.get("/find/",verifyandAdmin,async (req,res)=>{
    const query=req.query.new;
    try{
        const usersinfo= query ? await usermodel.find().sort().limit(2) : await usermodel.find();
        res.status(200).json(usersinfo);
    }catch(err){
        res.status(500).json(err);
    }
})

//user stats
app.get("/stats",async (req,res)=>{
   
    const date=new Date();
    const lastyear=new Date(date.setFullYear(date.getFullYear()-1));
   
    try{
    const stats=await usermodel.aggregate([
        {
            $match:{ createdAt : {$gte:lastyear } }
        },
        {
            $project:{
                month:{
                 $month:"$createdAt"
                }  }
        },
        {
            $group:{
                _id:"$month",
                total:{ $sum:1 }
            }
        }

    ])
    res.status(200).json(stats);
    
    }catch(err){
        res.status(400).json(err);
    }
})


module.exports=app;