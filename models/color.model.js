const mongoose=require("mongoose")
const Schema=mongoose.Schema;
const colorSchema=mongoose.Schema({ 
    colors:{type:Object},
    active:{type:Boolean,default:false},
    platform:String
});
module.exports=mongoose.model('Color',colorSchema);