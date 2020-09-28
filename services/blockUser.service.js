const Joi = require("@hapi/joi");
const db = require("../_helpers/db");

const User=db.User;
const BlockedUser=db.BlockedUser;

module.exports={
    block,    
    unblock,
    get
}

async function block(req,res)
{
  try{
    const schema = Joi.object().keys({
        userId:Joi.string().alphanum().min(24).max(24).required(),
        friendId: Joi.string().required().min(24).max(24).required()
      });
      const blockParam = req.body;
      const { error, value } = schema.validate(blockParam);
      if (error) {
          throw error;          
      }
   const {userId,friendId}=blockParam;
   const user=await User.find({_id:{$in:[userId,friendId]}});
   if(user.length==2)
   {


return  BlockedUser.findById(userId).then(user=>{
  if(!user)
  {
    const blockedUser=new BlockedUser();
    blockedUser._id=userId;            
    blockedUser.users=[friendId];
    blockedUser.save();
  }
  else {
   if(!user.users.includes(friendId))
    {
      user.users.push(friendId);
    user.save();
  }
  }
  return {success:true,message:'User blocked sucessfully.'}
})   
}  
else{
     return {success:false,message:'Users not found'}           
    }
}
catch(err){throw err}
}

async function unblock(req,res)
{
  try {
    const schema = Joi.object().keys({
      userId: Joi.string()
        .alphanum()
        .min(24)
        .max(24)
        .required(),
      friendId: Joi.string()
        .required()
        .min(24)
        .max(24)
        .required()
    });
    const blockParam = req.body;
    const { error, value } = schema.validate(blockParam);
    if (error) {
      throw error;
    }
    const { userId, friendId } = blockParam;
    if(userId==friendId)
    {
      return {success:false,message:'Invalid Data'}
    }
   return  BlockedUser.updateOne({_id:userId},{ $pull: { users:friendId }}).then(res=>{
console.log(res);
     return {success:true,message:'User unblocked'}
    }).catch(err=>{
      return {success:false,message: err};   
    });    
  } catch (err) {
    throw err;
  }
}

async function get(data) {   
try {    
  const schema = Joi.object().keys({
    id: Joi.string()
      .alphanum()
      .min(24)
      .max(24)
      .required()  
  });
  const blockParam = data;
  const { error, value } = schema.validate(blockParam);
  if (error) {
    throw error;
  } 
      const blocked = await BlockedUser.findById(data.id).populate('users','profile');  
      if(blocked)   
      return {success:true,users:blocked.users } 
      else   return {success:true,users:[] } 
} 
catch (err) {
  throw err;
}
}