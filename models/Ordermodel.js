const mongoose=require('mongoose');

const Orderschema=new mongoose.Schema(
    {
        userId:{ type:String,required:true,unique:true},
        products:[
            { productId:{type:String}  },
            {Quantity:{type:Number,default:1}}
        ],
        amount:{type:Number,required:true},
        address:{type:Object,},
        status:{type:String,default:"pending..."}

    },{timestamps:true}
)

module.exports=mongoose.model("Order",Orderschema);