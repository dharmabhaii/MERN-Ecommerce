const mongoose=require('mongoose');

const Cartschema=new mongoose.Schema(
    {
        userId:{ type:String,required:true,unique:true},
        products:[
            { productId:{type:String}  ,
            quantity:{type:Number,default:1},
            price:{type:Number} ,
            color:{type:String},
            size:{type:String},
            title:{type:String},
            img:{type:String},

        }
        ],
       
    },{timestamps:true}
)

module.exports=mongoose.model("Cart",Cartschema);