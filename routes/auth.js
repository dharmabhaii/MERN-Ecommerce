const express=require("express");
const app=express.Router();
const crypto=require("crypto-js");
const dotenv=require("dotenv");
dotenv.config();
app.use(express.urlencoded({ extended: true }))
const usermodel = require("../models/usermodel");
const { default: mongoose } = require("mongoose");
const jwt=require("jsonwebtoken");


//REGISTER
app.post("/auth/register", async (req,res)=>{
    
    const {username,email,password}=req.body;
//checks none of the fields are empty
    if( !username || !email || !password){
        res.status(400).json({error:"all fields are mandatory"})
    }
    //checks if user is already registered
    else{
        const useravaiable=await usermodel.findOne({username:username,email:email})
       
        if(useravaiable){
            res.status(400).json({error:"user already existed"});
        }else{
    
        const hashedpassword= crypto.AES.encrypt(password,process.env.CRYPTO_KEY);
        const newuser=new usermodel({
        username:username,
        email:email,
        password:hashedpassword
       })
       
       try{
        
            await newuser.save();
        
           res.status(200).json(newuser);
           console.log('savedd');
       }catch(err){
        res.status(500).send(err);
       }
    }
    }
})

//login
app.post("/auth/login",async(req,res)=>{
   
    const {username,email,password}=req.body;
    if( !username || !email || !password){
        
        res.status(400).json({error:"all fields are mandatory",k:req.body})
    }else{
        
        try{
            //finds by username
            const userfound=await usermodel.findOne({username:req.body.username,
                                                     email:req.body.email})
            //password decryption
            const decryptpassword=crypto.AES.decrypt(userfound.password,process.env.CRYPTO_KEY);
            const passkey=decryptpassword.toString(crypto.enc.Utf8)
            console.log(userfound);
                if(userfound){
            //checks if the password matches
                    if((req.body.password===passkey)){
            //generating token
                        const accessToken=jwt.sign({
                            id:userfound._id,
                            isAdmin:userfound.isAdmin 
                        },
                        process.env.SECRET_JWT,
                        {expiresIn:"3d"})
                        const {password,...others}=userfound._doc
                        res.status(200).json({...others,accessToken});
                    }
                    else{
                       
                        res.status(400).json({error:"incorrect details"})

                    }
                }else{
                    
                    res.status(400).json({error:"user not found"})
                }
        }catch(err){
            console.log(err);
            res.status(400).json(err);
        }
    
        
    }
})

//logout
app.post('/logout', async (req, res) => {
    // Clear the user session or token
    res.cookie('jwt',null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })
    .status(200).json({ message: 'Logged out successfully' });
  });


module.exports=app;