
//its a middle ware and used to verify token

const jwt=require("jsonwebtoken");
const dotenv=require("dotenv");
dotenv.config();


//used to verify the token
const verifyToken=(req,res,next)=>{
    const authheader=req.headers.token;

    if(authheader){
        //token verification
        const token=authheader.split(" ")[1];
       jwt.verify(token,process.env.SECRET_JWT,(err,user)=>{
                  if(err) res.status(401).json({mesg:"token is not valid"});
                  req.user=user;
                  next();
      });
    }else{
        return res.status(400).json({error:"you are not authenticated"})
    }
}

//after verifying the token it checks the id
const verifyandauthorize=(req,res,next)=>{
     verifyToken(req,res,()=>{
        if(req.user._id===req.params.id || req.user.isAdmin ){
            next();
        }else{
            res.status(400).json({message:"youu are not allowed to do this action"})
        }
     })
}

const verifyandAdmin=(req,res,next)=>{
    verifyToken(req,res,()=>{
       if( req.user.isAdmin ){
           next();
       }else{
           res.status(400).json({message:"youu are not allowed to do this action"})
       }
    })
}

module.exports={verifyToken,verifyandauthorize,verifyandAdmin};