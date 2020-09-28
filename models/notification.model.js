const mongoose = require("mongoose");
const Schema=mongoose.Schema;

const NotificationSchema = mongoose.Schema({  
  userId:{type:Schema.Types.ObjectId,required:true},//For userId
  notifications:[
{
    icon:{type:String},
    title:{type:String},
    description:{type:String},
    date: {type:Date},
    type:{type:String},   
    data:{type:Object},
    read:{type:Boolean,default:false},
    delete:{type:Boolean,default:false}
}
  ] 


});

module.exports = mongoose.model("Notification", NotificationSchema);
