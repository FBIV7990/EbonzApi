const Joi = require("@hapi/joi");
const db = require("../_helpers/db");
var admin = require("firebase-admin");
var serviceAccount = require("../config/ebonz-4310d-firebase-adminsdk-lfhgw-e2d92da643.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ebon-project.firebaseio.com"
});


const NotificationTypes={
  POST_VERIFIED:'POST_VERIFIED',
  FOLLOW_SUCCESS:'FOLLOW_SUCCESS',
  POST_GETTING_EXPIRED:'POST_GETTING_EXPIRED',
  POST_REVIEWED:'POST_REVIEWED',
  POST_LIKED:'POST_LIKED',
  MESSAGE_MISSED:'MESSAGE_MISSED',
  NEW_ITEM_ARRIVED:'NEW_ITEM_ARRIVED'
  }
//Actions when the notifications should be sent
// 1. Post is verified 
// 2. Someone followed you
// 3. Post is about to expire
// 4. Someone reviewed your post
// 5. Someone liked your post
// 6. Missed messages
// 7. New item arrived in your favorite category.
// 8. Send special offer notification to all users


const Notification = db.Notification;
const User=db.User;
const Post=db.Post;
const Review=db.Review;

module.exports = { 
  add,
  onPostVerified,
  onFollowSuccess,
  onPostGettingExpired,
  onPostReviewed,
  onPostLiked,
  onMessageMissed,
  onNewItemArrived,
  markasRead,
  get,
  _delete

};

function sendPushNotification(token,payload)
{ 
var options = {
  priority: "normal",
  timeToLive: 60 * 60
};
admin.messaging().sendToDevice(token, payload, options)
  .then(function(response) {
    console.log("Successfully sent message:",JSON.stringify(response));
  })
  .catch(function(error) {
    console.log("Error sending message:", error);
  });
}

function onPostVerified(postId)
{
  return new Promise((resolve,reject)=>{
    return  Post.findById(postId).then(post=>{   
     if(!post)
     {
       reject('Post not found');
       return;
    }    
     return Notification.findOne({userId:post.userId}).then(notification=>{       
        const item={
            icon:post.thumbnail,
            title:post.title,
            description:post.description,
            type:NotificationTypes.POST_VERIFIED,
            data:{postId:postId}
        }

          if(!notification)
          { 
            notification=new Notification();
            notification.userId=post.userId;
          }
          notification.notifications.push(item); 

          notification.save().then((notification) => {              
          
     User.findById(post.userId).then(user=>{   
     var payload = {
            notification:{
            title: "Congrats!, Your ad has been verified.",
            body: post.title
            },
            data:{
              type:NotificationTypes.POST_VERIFIED,
              postId: postId+""
              }
           };
       sendPushNotification(user.account.firebaseToken,payload);
      });

   
              resolve({'success':true,message:'Notification Sent!'});
            }).catch(err=>{ resolve({'success':false,message:err});});
                      
      }).catch(err=>{
        resolve({'success':false,message:err})
      });  
    })
  })
}

function onFollowSuccess(userId)
{
  return new Promise((resolve,reject)=>{
      return User.findById(userId).then(user=>{    
     if(!user)
     {
       reject('User not found');
       return;
    }    
     return Notification.findOne({userId:userId}).then(notification=>{     
        const item={
            icon:user.profile.thumbnail,
            title:user.profile.name+" started following you.",
            description:"You have "+user.profile.followers+" followers",
            type:NotificationTypes.FOLLOW_SUCCESS,
            data:{
              userId:userId
            }
        }

          if(!notification)
          { 
            notification=new Notification();
            notification.userId=userId;
          }
          notification.notifications.push(item); 
          notification.save().then((notification) => {       
          var payload = {
            notification: {
            title: user.profile.name+" started following you.",
            body: "You have "+user.profile.followers+" followers",
            },
            data:{
              type:NotificationTypes.FOLLOW_SUCCESS,
              userId: userId+""
              }
           };
       sendPushNotification(user.account.firebaseToken,payload);
   
              resolve({'success':true,message:'Notification Sent!'});
            }).catch(err=>{ resolve({'success':false,message:err});});
                      
      }).catch(err=>{
        resolve({'success':false,message:err})
      });  
    })
  })
}

function onPostGettingExpired(postId)
{
  return new Promise((resolve,reject)=>{
    return  Post.findById(postId).then(post=>{   
     if(!post)
     {
       reject('Post not found');
       return;
    }    
     return Notification.findOne({userId:post.userId}).then(notification=>{       
        const item={
            icon:post.thumbnail,
            title:post.title,
            description:post.description,
            type:NotificationTypes.POST_GETTING_EXPIRED,
            data:{postId:postId}
        }

          if(!notification)
          { 
            notification=new Notification();
            notification.userId=post.userId;
          }
          notification.notifications.push(item); 

          notification.save().then((notification) => {              
          
     User.findById(post.userId).then(user=>{   
     var payload = {
            notification:{
            title: "Hey!, Your ad is going to be expired.",
            body: post.title
            },
            data:{
              type:NotificationTypes.POST_GETTING_EXPIRED,
              postId: postId+""
              }
           };
       sendPushNotification(user.account.firebaseToken,payload);
      });

   
              resolve({'success':true,message:'Notification Sent!'});
            }).catch(err=>{ resolve({'success':false,message:err});});
                      
      }).catch(err=>{
        resolve({'success':false,message:err})
      });  
    })
  })
}

function onPostReviewed(postId,reviewId)
{
  return new Promise((resolve,reject)=>{
    return  Post.findById(postId).then(post=>{   
     if(!post)
     {
       reject('Post not found');
       return;
    }   
    Review.find({_id:postId}).populate('userId').then(review=>{
      const rev=review.reviews.find(rev=>{
        if(rev._id==reviewId)return rev;
      })
      return Notification.findOne({userId:post.userId}).then(notification=>{       
        const item={
            icon:rev.userId.profile.thumbnail,
            title:rev.userId.profile.name +" reviewed your ad.",
            description:rev.text,
            type:NotificationTypes.POST_REVIEWED,
            data:{postId:postId,reviewId:reviewId}
        }

          if(!notification)
          { 
            notification=new Notification();
            notification.userId=post.userId;
          }
          notification.notifications.push(item); 
          notification.save().then((notification) => {              
          
     User.findById(post.userId).then(user=>{   
     var payload = {
            notification:{
            title: rev.userId.profile.name +" reviewed your ad.",
            body:rev.text
            },
            data:{
              type:NotificationTypes.POST_REVIEWED,
              postId: postId+"",
              reviewId:reviewId+""
              }
           };
       sendPushNotification(user.account.firebaseToken,payload);
      });

   
              resolve({'success':true,message:'Notification Sent!'});
            }).catch(err=>{ resolve({'success':false,message:err});});
                      
      }).catch(err=>{
        resolve({'success':false,message:err})
      });  
    }).catch(err=>{});
     
    
    })
  })
}

function onPostLiked(postId,likedby)
{
  return new Promise((resolve,reject)=>{
    return  Post.findById(postId).then(post=>{   
     if(!post)
     {
       reject('Post not found');
       return;
     }    
     User.findById(likedby).then(user=>{
       if(!user)
       { 
         reject('User not found');
         return;
      }
  
     return Notification.findOne({userId:post.userId}).then(notification=>{       
        const item={
            icon:user.profile.thumbnail,
            title:user.profile.name +" has liked your ad",
            description:post.title,
            type:NotificationTypes.POST_LIKED,
            data:{postId:postId}
        }

          if(!notification)
          { 
            notification=new Notification();
            notification.userId=post.userId;
          }
          notification.notifications.push(item); 

          notification.save().then((notification) => {              
          
     User.findById(post.userId).then(user=>{   
     var payload = {
            notification:{
            title: user.profile.name +" has liked your ad",
            body: post.title,
            },
            data:{
              type:NotificationTypes.POST_LIKED,
              postId: postId+""
              }
           };
       sendPushNotification(user.account.firebaseToken,payload);
      });

   
              resolve({'success':true,message:'Notification Sent!'});
            }).catch(err=>{ resolve({'success':false,message:err});});
                      
      }).catch(err=>{
        resolve({'success':false,message:err})
      });  
       })
    })
  })
}

function onMessageMissed(payload)
{
  return new Promise((resolve,reject)=>{
const {messageType,senderId,recieverId,message,_id}=payload;
    return  User.findById(senderId).then(sender=>{
       if(!sender)
       { 
         reject('sender not found');
         return;
      }         
     User.findById(recieverId).then(user=>{   
     var payload = {
            notification:{
            title: user.profile.name +" has sent you a message",
            body: message,
            },
            data:{
              type:NotificationTypes.MESSAGE_MISSED,
              recieverId: recieverId,
              messageId:_id+""              
              }
           };
       sendPushNotification(user.account.firebaseToken,payload);
      });
                      
      }).catch(err=>{
        resolve({'success':false,message:err})
      });  
       })    
}

function onNewItemArrived(postId,likedby)
{
  return new Promise((resolve,reject)=>{
    return  Post.findById(postId).then(post=>{   
     if(!post)
     {
       reject('Post not found');
       return;
     }    
     User.findById(likedby).then(user=>{
       if(!user)
       { 
         reject('User not found');
         return;
      }
  
     return Notification.findOne({userId:post.userId}).then(notification=>{       
        const item={
            icon:user.profile.thumbnail,
            title:user.profile.name +" has liked your ad",
            description:post.title,
            type:NotificationTypes.POST_LIKED,
            data:{postId:postId}
        }

          if(!notification)
          { 
            notification=new Notification();
            notification.userId=post.userId;
          }
          notification.notifications.push(item); 

          notification.save().then((notification) => {              
          
     User.findById(post.userId).then(user=>{   
     var payload = {
            notification:{
            title: user.profile.name +" has liked your ad",
            body: post.title,
            },
            data:{
              type:NotificationTypes.POST_LIKED,
              postId: postId+""
              }
           };
       sendPushNotification(user.account.firebaseToken,payload);
      });

   
              resolve({'success':true,message:'Notification Sent!'});
            }).catch(err=>{ resolve({'success':false,message:err});});
                      
      }).catch(err=>{
        resolve({'success':false,message:err})
      });  
       })
    })
  })
}

async function add(req,res) {
  return new Promise(async (resolve, reject) => {
    const schema = Joi.object().keys({      
      userId: Joi.string().required(),
      icon: Joi.string().required(),
      title: Joi.string().required(),
      description: Joi.string().required(),
      type:Joi.string().valid(['BASIC','SUCCESS','PRIMARY','INFO','WARNING','DANGER']).required(),
      data:Joi.string()   
    });
    const notiParam = req.body;

    //Validating the schema
    const { error, value } = schema.validate(notiParam);
    //If the request is not in the expected format
    if (error) {
      reject(error);
      return;
    }
    const {  userId,icon,title,description,type,data } = notiParam;
  return  User.findById(userId).then(user=>{
    
     return Notification.findOne({userId:userId}).then(notification=>{
        console.log(notification)
        const item={
            icon:icon,
            title:title,
            description:description,
            type:type,
            data:data
        }

          if(!notification)
          { 
            notification=new Notification();
            notification.userId=userId;
          }
          notification.notifications.push(item); 

          notification.save().then((notification) => {   
            
            var payload = {
            notification: {
            title: "Account Deposit",
            body: "A deposit to your savings account has just cleared."
            },
            data: {
            account: "Savings",
            balance: "$3020.25"
            }
           };
            sendPushNotification(user.account.firebaseToken,payload);
              resolve({'success':true,message:'Notification Sent!'});
            }).catch(err=>{ resolve({'success':false,message:err});});
                      
      }).catch(err=>{
        resolve({'success':false,message:err})
      });  
    }).catch(error=>{ resolve({'success':false,message:err})})
  });
}

async function get(params) {

    const schema = Joi.object().keys({
      userId: Joi.string()
        .min(24)
        .max(24)
        .required()
    });    

    //Validating the schema
    const { error, value } = schema.validate(params);
    //If the request is not in the expected format
    if (error) {
      return({success:false,message:'Invalid userID'});      
    }
    const { userId } = params;
   return User.findById(userId)
      .then(user => {
        if (!user) {  
          return({ success: false, message: "User not found" });   
        }
        return Notification.findOne({ userId: userId})
          .then(notifications => {
            if (!notifications)
              return { success: false, message: "Notifications not found" };   
               newNotifs=0;         
              const notifs=notifications.notifications.filter( (notifi)=>{
                if(notifi.read==false&&notifi.delete==false)
               { console.log(notifi);
                 newNotifs++;}
                return(notifi.delete==false)
              })
            return { success: true,new:newNotifs, notifications: notifs };
          })
          .catch(err => {
            return { success: false, message: "Notifications not found" };
          });
      })
      .catch(err => {
        return { success: false, message: "User not found" };
      });  
}

async function _delete(params) {
  const schema = Joi.object().keys({
    userId: Joi.string()
      .min(24)
      .max(24)
      .required(),
    notificationId: Joi.string()
      .min(24)
      .max(24)
      .required()
  });    

  //Validating the schema
  const { error, value } = schema.validate(params);
  //If the request is not in the expected format
  if (error) {
    return({success:false,message:'Invalid userID'});      
  }
  const { userId,notificationId } = params;
 return User.findById(userId)
    .then(user => {
      if (!user) {  
        return({ success: false, message: "User not found" });   
      }
      return Notification.findOne({ userId: userId })
        .then(notification => {
          if (!notification)
            return { success: false, message: "Notifications not found" };
        const newNotifs=notification.notifications.map(noti=>{
          if(noti._id==notificationId)
             noti.delete=true;
             return noti;
        });
        notification.notifications=newNotifs;
        notification.save();
       
       return { success: true, message:'Notification deleted.'};
        })
        .catch(err => {
          return { success: false, message: "Notifications not found" };
        });
    })
    .catch(err => {
      return { success: false, message: "User not found" };
    });  
}

async function markasRead(params) {

  const schema = Joi.object().keys({
    userId: Joi.string()
      .min(24)
      .max(24)
      .required(),
      notifications:Joi.array().items(Joi.string().min(24).max(24)).required()
  });    

  //Validating the schema
  const { error, value } = schema.validate(params);
  //If the request is not in the expected format
  if (error) {
    return({success:false,message:'Invalid userID'});      
  }
  const { userId,notifications } = params;

 return User.findById(userId)
    .then(user => {
      if (!user) {  
        return({ success: false, message: "User not found" });   
      }
     
      return Notification.findOne({ userId: userId})
        .then(notifs => {         
          if (!notifs)
            return { success: false, message: "Notifications not found" }; 

            const newNotifs=notifs.notifications.map(noti=>{        
            const isExist=  notifications.includes(noti._id+'');          
            if(isExist)
                noti.read=true;               
                return noti;
            });
            notifs.notifications=newNotifs;
            notifs.save();

         return { success: true, message:notifs };
     
        })
        .catch(err => {
          return { success: false, message: err };
        });
    })
    .catch(err => {
      return { success: false, message: "User not found" };
    });  
}