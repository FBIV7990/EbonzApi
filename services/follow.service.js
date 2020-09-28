const Joi = require("@hapi/joi");
const db = require("../_helpers/db");

const User=db.User;
const Follow=db.Follow;

module.exports={
    follow,    
    unfollow,
    get
}

async function follow(req,res)
{
  try{
    const schema = Joi.object().keys({
        userId:Joi.string().alphanum().min(24).max(24).required(),
        friendId: Joi.string().required().min(24).max(24).required()
      });
      const followParam = req.body;
      const { error, value } = schema.validate(followParam);
      if (error) {
          throw error;          
      }
   const {userId,friendId}=followParam;
   const user=await User.find({_id:{$in:[userId,friendId]}});
   if(user.length==2)
   {
     await Follow.updateOne({_id:userId},{$addToSet: {followings: friendId}}).then(async res=>{ 
      console.log(res);
        if(res.n==1&&res.nModified==1)
        {
            await User.updateOne({_id:userId}, { $inc: { 'profile.followings': 1 }});
        }
         if(res.n==0)
         {
            const followedBy=new Follow();
            followedBy._id=userId;
            followedBy.userId=userId;
            followedBy.followings=[friendId];
            followedBy.save();
            await User.updateOne({_id:userId}, { $inc: { 'profile.followings': 1 }});          
         }

         await Follow.updateOne({_id:friendId},{$addToSet: {followers: userId}}).then(async res=>{ 
            console.log(res);
              if(res.n==1&&res.nModified==1)
              {
                  await User.updateOne({_id:friendId}, { $inc: { 'profile.followers': 1 }});
              }
               if(res.n==0)
               {
                const followTo=new Follow();
                      followTo._id=friendId;
                      followTo.userId=friendId;
                      followTo.followers=[userId];
                      followTo.save();
                  await User.updateOne({_id:friendId}, { $inc: { 'profile.followers': 1 }});          
               }
              }).catch(err=>{
                 throw err;
               })
      
      
              }).catch(err=>{
           throw err;
         })
        return {success:true,message:'User followed sucessfully.'}
        }  
          else{
           return {success:false,message:'Users not found'}           
         }
}
catch(err){throw err}
}

async function unfollow(req,res)
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
    const follParam = req.body;
    const { error, value } = schema.validate(follParam);
    if (error) {
      throw error;
    }
    const { userId, friendId } = follParam;
    await Follow.updateOne({_id:userId},{ $pull: { followings:friendId }}).then(async res=>{
      if(res.n==1&&res.nModified==1)
      {
      await User.updateOne({_id:userId}, { $inc: { 'profile.followings': -1 }});
      }     
     
      await Follow.updateOne({_id:friendId},{ $pull: { followers:userId }}).then(async res=>{
        if(res.n==1&&res.nModified==1)
        {
        await User.updateOne({_id:friendId}, { $inc: { 'profile.followers': -1 }});
        }          
        return {success:true,message: "User unfollowed successfully"};

      }).catch(err=>{
        return {success:false,message: err};         
      });    
     
    }).catch(err=>{
      return {success:false,message: err};   
    });    
  } catch (err) {
    throw err;
  }
}

async function get(params) {  

  const schema = Joi.object().keys({
      userId:Joi.string().alphanum().min(24).max(24).required()     
    });
    const follParam = params;
    const { error, value } = schema.validate(follParam);
    if (error) {
        throw error;          
    }

try {  
    if (params.followers) {      
      const followers = await Follow.findById(params.userId).populate("followers",'profile');
      return {success:true,followers:followers}     
    } 
    else if (params.followings) {      
      const followings = await Follow.findById(params.userId).populate("followings",'profile');
      return {success:true,followings:followings}     
    }    
    else {
      const follows = await Follow.findById(params.userId).populate('followers','profile').populate('followings','profile');      
      return {success:true,follows }     
    }
 
} catch (err) {
  console.log(err);
  throw err;
}
}