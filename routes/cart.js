const express=require("express");
const app=express.Router();
const { verifyToken, verifyandauthorize, verifyandAdmin }=require("../routes/verifyToken");
const cartmodel=require("../models/cartmodel")
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const crypto=require("crypto-js");


//CREATE a cart
app.post("/",verifyToken,async (req,res)=>{
    
   const newcart = new cartmodel({
    userId:req.body.userid,
    products:[ {
        productId:req.body.productid,
        quantity:req.body.quantity,
        price:req.body.price,
        color:req.body.color,
        size:req.body.size,
        title:req.body.title,
        img:req.body.img
    } ]
   })
   console.log("backend",req.body);
   try{
    const userexist=await cartmodel.findOne({userId:req.body.userid});
    
        const updatecart=await cartmodel.findOneAndUpdate({
            userId: userexist ? userexist.userId :req.body.userid },
                { $push: {products:newcart.products} }
                 ,{new:true,upsert:true});
               
         res.status(200).json(updatecart);
   }catch(err){
       res.status(400).json(err)
   }
   
})

//UPDATing cart 
app.put("/:id",verifyandauthorize,async (req,res)=>{
    try{
        const cartproducts=req.body;
        const updatedcart=await cartmodel.findByIdAndUpdate(req.params.id,
                  cartproducts,{new:true});
        res.status(200).json(updatedcart);
    }catch(err){
        res.status(400).json(err);
    }
})


//DELETE a cart
app.delete("/delete/:id",async (req,res) => {
    console.log(req.body);
    try{
        await cartmodel.findByIdAndDelete(req.body.id);
        res.status(200).json({msg:"cart has been deleted"})
    }catch(err){
        res.status(200).json(err)
    }
})

//delete item in cart
app.post("/delete/item",async (req,res)=>{

    try{
        const userexist= await cartmodel.findOne({userId:req.body.userid});
    
        const deleteitem=await cartmodel.findOneAndUpdate({
            userId: userexist ? userexist.userId :req.body.userid },
            { $pull: {products:{_id:req.body.id}} }
             ,{new:true,upsert:true})
           res.status(200).json({meassge:"deleted item from cart"})

    }catch(err){
        res.status(400).json(err)
    }
    

})



//GET a user cart
app.get("/find/:userid",verifyandauthorize,async (req,res)=>{
       try{
        const cartproduct= await cartmodel.findOne({userId:req.params.userid});
        res.status(200).json(cartproduct)
       }catch(err){
        res.status(400).json(err);
       }
})

//GET all products
// app.get("/admin/all",verifyandAdmin,async (req,res)=>{
//     try{
//         const carts= await cartmodel.findOne();
//         res.status(200).json(carts)
//     }catch(err){
//      res.status(400).json(err);
//     }
// })

module.exports=app;