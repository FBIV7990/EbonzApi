const mongoose=require("mongoose")
const Schema=mongoose.Schema;
const careerSchema=mongoose.Schema({  
    name:{ type:Schema.Types.String},
    email:{type:Schema.Types.String},
    mobile:{type:Schema.Types.String},
    position:{type:Schema.Types.String},
    message:{type:Schema.Types.String},
    date :{type:Date,default:new Date()}
});
module.exports=mongoose.model('Career',careerSchema);