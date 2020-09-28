const mongoose=require("mongoose")
const Schema=mongoose.Schema;
const messageSchema=mongoose.Schema({   
    conversationId:{ type:Schema.Types.ObjectId},
    senderId:String,
    recieverId:String,  
    messageType:{type:String,default:'TEXT'},
    message:String,
    deleted_by_sender:{type:Boolean,default:false},
    deleted_by_reciever:{type:Boolean,default:false},
    read:{type:Boolean,default:false},
    sent:{type:Boolean,default:false},
    createdAt: {
        type: Date,
        default: Date.now,
      }
});
module.exports=mongoose.model('Message',messageSchema);


// const mongoose=require("mongoose")
// const Schema=mongoose.Schema;
// const messageSchema=mongoose.Schema({   
//     senderId:String,
//     recieverId:String,  
//     messageType:{type:String,default:'TEXT'},
//     message:String,
//     deleted:Boolean,
//     createdAt: {
//         type: Date,
//         default: Date.now,
//       }
// });
// module.exports=mongoose.model('Message',messageSchema);