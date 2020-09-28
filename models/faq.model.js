const mongoose=require("mongoose")
const Schema=mongoose.Schema;
const faqSchema=mongoose.Schema({  
    question:{ type:Schema.Types.String},
    answer:{type:Schema.Types.String},   
    date :{type:Date,default:new Date()}
});
module.exports=mongoose.model('FAQ',faqSchema);