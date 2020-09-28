const Joi = require("@hapi/joi");
const db = require("../_helpers/db");
const BlockedUser=db.BlockedUser;

const Conversation = db.Conversation;

const Message = db.Message;

module.exports = { 
  create,
  markAsRead,
  markAsSent,  
  delete: _delete
};

async function create(req, res) {
  return new Promise(async (resolve, reject) => {
    const schema = Joi.object().keys({ 
      conversationId: Joi.string().required(),     
      senderId: Joi.string().required(),
      recieverId: Joi.string().required(),
      messageType:Joi.string().valid(['text','image','video']),
      message:Joi.string().required()
    });
    const messageParam = req;

    //Validating the schema
    const { error, value } = schema.validate(messageParam);
    //If the request is not in the expected format
    if (error) {
      reject(error);
      return;
    }
    console.log(messageParam);
    const {  senderId,recieverId,messageType,message,conversationId } = messageParam;  
   
     return Conversation.findById(conversationId).then(conversation=>{
          if(!conversation)
          { 
             resolve({'success':false,message:'Conversation not found.'})
            }            
          else
          {            
            BlockedUser.findById(recieverId).then(block=>{
              console.log(block);
              if(block&&block.users.includes(senderId))
              {
                resolve({'success':false,message:'You cannot send message'})
                return;
              }
              else {
                if((conversation.seller==senderId&&conversation.buyer==recieverId)||(conversation.seller==recieverId&&conversation.buyer==senderId))
                {  const msg=new Message();
                  msg.conversationId=conversation._id;
                  msg.senderId=senderId;
                  msg.recieverId=recieverId;
                  msg.messageType=messageType;
                  msg.message=message;
                  msg.save().then((savedMessage) => {
                    conversation.messages.push(savedMessage);
                    conversation.save();
                    resolve({'success':true,message:'Message Sent!',result:savedMessage});
                  }).catch(err=>{ resolve({'success':false,message:err});});
                }else
                 resolve({success:false,message:'No Conversation found.'})
              }
            })        
          }         
      }).catch(err=>{
        resolve({'success':false,message:err})
      });  
  });
}

async function markAsRead(msgId){
 return new Promise((resolve,reject)=>{
 
    Message.findById(msgId).then(msg=>{
      if(!msg)
      reject("Message not found");
      message.read=true;
      message.save();
      resolve({success:true,message:"Message read"});
    });
  }) 
}

async function markAsSent(msgId){
  return new Promise((resolve,reject)=>{
  
     Message.findById(msgId).then(msg=>{
       if(!msg)
       reject("Message not found");
       message.sent=true;
       message.save();
       resolve({success:true,message:"Message sent"});
     });
   }) 
 }

 async function _delete(req){
  return new Promise((resolve,reject)=>{
    const schema = Joi.object().keys({ 
      messageId: Joi.string().required(),     
      userId: Joi.string().required()
    });
    const messageParam = req.body;

    //Validating the schema
    const { error, value } = schema.validate(messageParam);
    //If the request is not in the expected format
    if (error) {
      reject(error);
      return;
    }
    const {messageId,userId}=messageParam;
     Message.findById(messageId).then(msg=>{
       if(!msg)
       {reject("Message not found");
      return;
      }
      if(msg.senderId===userId)
      msg.deleted_by_sender=true;
      else if(msg.recieverId===userId)
      msg.deleted_by_reciever=true;
      message.save();
       resolve({success:true,message:"Message deleted"});
     });
   }) 
 }
