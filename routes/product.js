const express=require("express");
const app=express.Router();
const { verifyToken, verifyandauthorize, verifyandAdmin }=require("../routes/verifyToken");
const productmodel=require("../models/productmodel");
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const crypto=require("crypto-js");


//CREATE a product
app.post("/",verifyandAdmin,async (req,res)=>{
   const newproduct = new productmodel(req.body)

   try{
    const savedproduct=await newproduct.save();
    res.status(200).json(savedproduct);

   }catch(err){
    res.status(400).json(err)
   }
   
})

//UPDATE a product
app.put("/:id",verifyandAdmin,async (req,res)=>{
    try{
        const products=req.body;
        const updatedproducts=await productmodel.findByIdAndUpdate(req.params.id,
            products,{new:true});
        res.status(200).json(updatedproducts);
    }catch(err){
        res.status(400).json(err);
    }
})

//DELETE a product
app.delete("/:id",verifyandauthorize,async (req,res) => {
    try{
        await productmodel.findByIdAndDelete(req.params.id);
        res.status(200).json({msg:"product has been deleted"})
    }catch(err){
        res.status(200).json(err)
    }
})

//GET a product
app.get("/find/:id",async (req,res)=>{
   const id=req.params.id;
    try{
     
        const product= await productmodel.findById({_id:id});
        res.status(200).json(product)
       }catch(err){
        res.status(400).json(err);
       }
})

//GET all products
app.get("/find",async (req,res)=>{
    const qnew=req.query.new;
    const qcategory=req.query.category;
    try{
let products;
    if(qnew){
      products=await productmodel.find().sort({createdAt:-1}).limit(1);
      res.status(200).json(products)
    }else if(qcategory){
        products=await productmodel.find({
            categories:{
                $in:[qcategory]
            }
        })
        res.status(200).json(products)
    }else{
        products= await productmodel.find();
        res.status(200).json(products)
    }
    }catch(err){
     res.status(400).json(err);
    }
})

module.exports=app;