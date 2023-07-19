const express=require("express");
const path=require("path")
const app=express();
const mongoose=require("mongoose");
const dotenv=require("dotenv");
dotenv.config();
const user=require("./routes/user");
const auth=require("./routes/auth");
const productroute=require("./routes/product");
const orderroute=require("./routes/order");
const striperoute=require("./routes/stripe");
const cartroute=require("./routes/cart")
const cors=require("cors");

mongoose.connect(process.env.MONGO_CONNECTION)
  .then(() => {
    console.log("MongoDB connection successful");
    
  })
  .catch((err) => {
    console.log(err);
    
  });
app.use(express.static(path.resolve(__dirname,"build")))
app.use(cors({origin:"http://localhost:3000"}));
app.use("/api",auth)
app.use("/api",user)
app.use("/api/products",productroute)
app.use("/api/orders",orderroute);
app.use("/api",striperoute);
app.use("/api/cart",cartroute)
app.listen( process.env.PORT || 5000,()=>{
    console.log("server started succesfully");
})