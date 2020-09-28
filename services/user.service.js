const config = require("config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Joi = require("@hapi/joi");
const randomstring = require("randomstring");
const db = require("_helpers/db");
const smsService = require("./sms.service");
const emailService=require("./email.service")
const helper = require("../_helpers/helper");
var multer = require("multer");
const shortid = require("shortid");
const mongoose = require("mongoose");

const User = db.User;
const LOGIN_METHOD = {
  MOBILE: "MOBILE",
  EMAIL: "EMAIL",
  FACEBOOK: "FACEBOOK",
  GOOGLE: "GOOGLE",
  APPLE:'APPLE'
};

module.exports = {
  authenticate,
  getAll,
  getById,
  create,
  setfirebaseToken,
  verifyOTP,
  resendOTP,
  forgetPassword,
  updateUserPhoto,
  setPassword,
  changePassword,
  update,
  activate,
  deactivate,
  saveSetting,
  getSetting,
  getTotal,
  delete: _delete
};

async function authenticate({ username, password }) {
  const schema = Joi.object().keys({
    username: Joi.string()
      .min(10)
      .max(40)
      .required(),
    password: Joi.string().required()
  });

  return new Promise(async (resolve, reject) => {
    const { error, value } = schema.validate({
      username,
      password
    });
    if (error) {
      reject(error);
      return;
    }

    return await User.findOne({
      "account.username": username
    })
      .then(user => {
        if (user &&user.account.salt&& user.validPassword(password)) {
          // if (!user.isRegistered)
          //   resolve("User is not registered");
          resolve({
            success: true,
            message: "Authentication successful!",
            id: user.id,
            token: user.account.token
          });
        } else resolve({ success: false, message: "Invalid Password!" });
      })
      .catch(err => {
        reject(err);
      });
  });
}

async function verifyOTP(userParam) {
  const schema = Joi.object().keys({  
    username: Joi.string()
      .min(10)
      .max(40)
      .required(),
    verificationCode: Joi.string()
      .min(6)
      .max(6)
      .required()
  });
  return new Promise(async (resolve, reject) => {
    const { error, value } = schema.validate(userParam);
    const {username, verificationCode } = userParam;
    if (error) {
      reject(error);
      return;
    }
    await User.findOne({"account.username":username})
      .then(user => {
        if (!user) {
          resolve({ success: false, message: "User not found" });
          return;
        }
        if (!user.account.securityCode) {
          resolve({ success: false, message: "Cannot verify the security code." });        
          return;
        }
        if (
          user.account.username == username &&
          user.account.securityCode == verificationCode
        ) {
          if (!user.account.isRegistered) {

            user.account.isRegistered = true;
            user.save();
          }
          resolve({ success: true,               
            id: user.id,
            token: user.account.token,
            message: "Security code verified." });
        
        } else reject({ success: false, message: "Invalid security code." });
      })
      .catch(err => reject(err));
  });
}

async function resendOTP(userParam) {
  const schema = Joi.object().keys({  
    username: Joi.string()
      .min(10)
      .max(40)
      .required()
  });
  return new Promise(async (resolve, reject) => {
    const { error, value } = schema.validate(userParam);
    const {username } = userParam;
    if (error) {
      reject(error);
      return;
    }
    await User.findOne({"account.username":username})
      .then(user => {
        if (!user) {
          resolve({ success: false, message: "User not found" });
          return;
        }
        const methods = user.login_types;
        const loginMethod = methods.find(
          type =>
            type.login_type == LOGIN_METHOD.EMAIL ||
            type.login_type == LOGIN_METHOD.MOBILE
        );
     
        if (!loginMethod)
          resolve({ success: false, message: "Cannot send OTP" });

        if (!user.account.securityCode) 
        {
          resolve({ success: false, message: "Cannot verify the security code." });        
          return;
        } 
        
        const  onlyNumbers = /^[0-9]+$/;      
        const res=  onlyNumbers.test(username);
      if(res)
      {
         smsService.sendSMS(username, user.account.securityCode);
          }
          else 
            emailService.sendMail(username, user.account.securityCode);
           resolve({ success: true,       
            message: "OTP sent" });
        
      })
      .catch(err => reject(err));
  });
}

async function forgetPassword(userParam) {
  const schema = Joi.object().keys({  
    username: Joi.string()
      .min(10)
      .max(40)
      .required()
  });
  return new Promise(async (resolve, reject) => {
    const { error, value } = schema.validate(userParam);
    const {username } = userParam;
    if (error) {
      reject(error);
      return;
    }
    console.log('forget password request');
    await User.findOne({"account.username":username})
      .then(user => {
        if (!user) {
          resolve({ success: false, message: "User not found" });
          return;
        }
        const methods = user.login_types;
        const loginMethod = methods.find(
          type =>
            type.login_type == LOGIN_METHOD.EMAIL ||
            type.login_type == LOGIN_METHOD.MOBILE
        );     
        if (!loginMethod)
          resolve({ success: false, message: "Cannot send OTP" });

        if (user.account.securityCode) 
        {
            user.account.securityCode= randomstring.generate({
            length: 6,
            charset: "numeric",
            readable: true
          });    
        user.save();
        const  onlyNumbers = /^[0-9]+$/;      
        const res=  onlyNumbers.test(username);
      if(res)
      {
        smsService.sendSMS(username, user.account.securityCode);
     }
     else 
       {emailService.sendMail(username, user.account.securityCode);}
        resolve({ success: true,  message: "verification code sent" });
        }  
        else {   resolve({ success: false,  message: "verification code sent" });}       
      })
      .catch(err => reject(err));
  });
}

async function setPassword(req) {
  userParam = req.body;
  const schema = Joi.object().keys({
    id: Joi.string()
      .alphanum()
      .min(24)
      .max(24)
      .required(),
    username: Joi.string()      
      .min(10)
      .max(30)
      .required(),
    password: Joi.string()
       .min(6)
      .max(30)
      .required()
  });

  return new Promise(async (resolve, reject) => {
    const { error, value } = schema.validate(userParam);
    if (error) {
      reject(error);
      return;
    }
    const { id, username, password } = userParam;

    await User.findById(id)
      .then(user => {
        if (!user) {
          resolve({ success: false, message: "User not found" });
        }
        const methods = user.login_types;
        const loginMethod = methods.find(
          type =>
            type.login_type == LOGIN_METHOD.EMAIL ||
            type.login_type == LOGIN_METHOD.MOBILE
        );
        if (!loginMethod)
          resolve({ success: false, message: "Cannot set password" });
        else {
          if (user.account.username == username) {
            if (!user.account.hash) {
              user.setPassword(password);
              user.save();
              resolve({ success: true,               
                       id: user.id,
                       token: user.account.token,
                message: "Password set successfully." });
            } else resolve({ success: false, message: "Cannot set password" });
          } else resolve({ success: false, message: "Invalid username" });
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}

async function changePassword(userParam) {
  const schema = Joi.object().keys({
    id: Joi.string()
      .alphanum().min(24).max(24)
      .required(),
    oldPassword: Joi.string()    
      .min(6)
      .max(30)
      .required(),
    password: Joi.string()     
      .min(6)
      .max(30)
      .required()
  });

  return new Promise(async (resolve, reject) => {
    const { error, value } = schema.validate(userParam);
    if (error) {
      reject(error);
      return;
    }
    const { id,  oldPassword, password } = userParam;

    if(oldPassword==password)
    resolve({success:false,message:'Old password and new password cannot be same.'});

    await User.findById(id)
      .then(user => {
        if (!user) {
          resolve({ success: false, message: "User not found!" });
        }
        const methods = user.login_types;
        const loginMethod = methods.find(
          type =>
            type.login_type == LOGIN_METHOD.EMAIL ||
            type.login_type == LOGIN_METHOD.MOBILE
        );

        if (!loginMethod) {
          resolve({ success: false, message: "Cannot change password." });
        }

        if (user.account.salt&&user.validPassword(oldPassword))
         {
           user.setPassword(password);
           user.save();
           resolve({success:true,message:'Password changed successfully!'});
        }
        else resolve({success:false,message:'Wrong password'});
      })
      .catch(err => {
        reject(err);
      });
  });
}

async function getAll() {
  return new Promise(async (resolve, reject) => {
    await User.find()
      .then(users => {
        if (!users) resolve({ success: false, message: "Users not found" });
        resolve({ success: true, users: users });
      })
      .catch(err => {
        reject(err);
      });
  });
}

async function getById(id) {
  return new Promise(async (resolve, reject) => {
    await User.findById(id)
      .then(user => {
        if (!user) resolve({ success: false, message: "User not found" });
        else resolve({ success: true, user: parseUser(user) });
      })
      .catch(err => {
        reject(err);
      });
  });
}

function parseUser(user) {
  try {
    if (!user) throw "User not found";
    const { profile, locations } = user;

    const User = {
      id: user.id,
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      aadhar:profile.aadhar,
      followers:profile.followers,
      followings:profile.followings,
      profilePhoto: profile.profilePhoto,
      thumbnail: profile.thumbnail,
      locations
    };
    return User;
  } catch (err) {
    console.log(err);
  }
}

function parseUsers(users) {
  try {
    if (!users) throw "Users not found";
    var Users = [];
    users.map(user => {
      const { profile, location } = user;

      const User = {
        id: user.id,
        name: profile.name,
        email: profile.email,
        phones: profile.phone,
        profilePhotos: profile.profilePhoto,
        thumbnail: profile.thumbnail,
        location
      };

      Users.push(User);
    });

    return Users;
  } catch (err) {
    console.log(err);
  }
}

async function create(req) {
  const userParam=req.body;
  if (!userParam) throw "Invalid Payload";
  const { loginMethod } = userParam;
  if (!loginMethod) throw "Provide Login Method";

  userParam.loginMethod = loginMethod.toUpperCase();
  switch (userParam.loginMethod) {
    case LOGIN_METHOD.MOBILE:
      return await registerWithMobile(req);

    case LOGIN_METHOD.EMAIL:
      return await registerWithEmail(req);

    case LOGIN_METHOD.FACEBOOK:
      return await registerWithFacebook(req);

    case LOGIN_METHOD.GOOGLE:
      return await registerWithGoogle(req);

      case LOGIN_METHOD.APPLE:
        return await registerWithApple(req);

    default:
      throw "Invalid Login Method";
  }
}

 function registerWithMobile(req) {
  const userParam=req.body;
  const schema = Joi.object().keys({
    mobile: Joi.number()
      .min(12)
      .required(),
    latitude: Joi.number()
      .min(-90)
      .max(90)
      .required(),
    longitude: Joi.number()
      .min(-180)
      .max(180)
      .required(),
    loginMethod: Joi.string().required()
  });
  return  new Promise( (resolve, reject) => {
    const { error, value } = schema.validate(userParam);
    if (error) {
      reject(error);
      return;
    }

    const { mobile, latitude, longitude } = userParam;
    // validate
     User.findOne({
      "account.username": mobile
    })
      .then(user => {
        if (!user) {
          const user = new User();
          user.external_id = shortid.generate();
          user.login_types.push({
            login_type: "MOBILE",
            status: true
          });
         
          const token = jwt.sign(
            {
              uid: user.id
            },
            config.secret
          ); 
          user.account = {
            username: mobile,
            securityCode: randomstring.generate({
              length: 6,
              charset: "numeric",
              readable: true
            }),      
            token: token,
            isRegistered: true,
            last_login_time: new Date()
          };
        const defaultPic=  helper.getServerUrl(req) + "./profilePhotos/default.png" ;
          user.profile = {
            profilePhoto: defaultPic,
            thumbnail: defaultPic,
            phone: mobile
          };
          user.location.coordinates= [longitude, latitude]  
      
          //Remove the below comments to send OTP
              smsService.sendSMS(mobile, user.account.securityCode);
      
          // save user
      
           user
            .save()
            .then(user => {
              resolve({
                success: true,
                message: "OTP sent successfully!"      
              });
            })
            .catch(err => {
              reject(err);
            });
        }
        else {
          resolve({
            success: false,
            message: "User already exists! Please login"
          });
        }
      })
      .catch(err => {
        reject(err);
      });  
  });
}

 function registerWithEmail(req) {
  const userParam=req.body;
  const schema = Joi.object().keys({
    email: Joi.string()
      .email({
        minDomainSegments: 2
      })
      .required(),
    password: Joi.string().required(),
    latitude: Joi.number()
      .min(-90)
      .max(90)
      .required(),
    longitude: Joi.number()
      .min(-180)
      .max(180)
      .required(),
    loginMethod: Joi.string().required()
  });
  return  new Promise(async (resolve, reject) => {
    const { error, value } = schema.validate(userParam);
    if (error) {
      reject(error);
      return;
    }

    const { email, password, latitude, longitude } = userParam;

    await User.findOne({
      "account.username": email
    })
      .then(async user => {
        if(!user)
        { 
          const user = new User();
          user.external_id = shortid.generate();
      
          user.login_types.push({
            login_type: "EMAIL",
            status: true
          });
          const token = jwt.sign(
            {
              uid: user.id
            },
            config.secret
          );
          user.account = {
            username: email,
            securityCode: randomstring.generate({
              length: 6,
              charset: "numeric",
              readable: true
            }),
            token: token,
            isRegistered: true,
            last_login_time: new Date()
          };
          if (password)
           user.setPassword(password); 
        
          const defaultPic= helper.getServerUrl(req) + "./profilePhotos/default.png" ;
          user.profile = {
            profilePhoto: defaultPic,
            thumbnail: defaultPic,
            email: email
          };
          user.location.coordinates= [longitude, latitude]
         
      
          //Remove the below comments to send OTP
             emailService.sendMail(email, user.account.securityCode);
      
           user
            .save()
            .then(user => {
              resolve({
                // id: user.id,
                // token: token,
                success: true,
                message: "User registered successfully!"
              });
            })
            .catch(err => {
              reject(err);
            });
          }
        else {
          const methods = user.login_types;
          const loginMethod = methods.find(
            type => type.login_type == LOGIN_METHOD.EMAIL
          );
          if (loginMethod) {
            resolve({
              success: false,
              message: "User already exists! Please login"
            });
          } else {
            user.login_types.push({
              login_type: LOGIN_METHOD.EMAIL,
              status: true
            });
            if (password) user.setPassword(password);
            user.locations.coordinates= [longitude, latitude];
        
            await user
              .save()
              .then(user => {
                resolve({
                  success: true,
                  message: "User registered successfully!",
                  // id: user.id,
                  // token: user.profile.token
                });
              })
              .catch(err => {
                reject(err);
              });
            return;
          }
        }
      })
      .catch(err => {
        reject(err);
      });   
  });
}

 function registerWithFacebook(req) {
  const userParam=req.body;
  const schema = Joi.object().keys({
    email: Joi.string()
      .email({
        minDomainSegments: 2
      })
      .required(),
    latitude: Joi.number()
      .min(-90)
      .max(90)
      .required(),
    longitude: Joi.number()
      .min(-180)
      .max(180)
      .required(),
    accessToken: [Joi.string(), Joi.number()],
    profilePhoto: Joi.string().required(),
    loginMethod: Joi.string().required()
  });
  return  new Promise( (resolve, reject) => {
    const { error, value } = schema.validate(userParam);
    if (error) {
      reject(error);
      return;
    }

    const {
      email,
      name,
      latitude,
      longitude,
      accessToken,
      profilePhoto
    } = userParam;
     User.findOne({
      "account.username": email
    })
      .then( user => {
        if(!user)
        {  const user = new User();
          user.external_id = shortid.generate();
          user.login_types.push({
            login_type: LOGIN_METHOD.FACEBOOK,
            status: true,
            access_token: accessToken
          });
      
          const token = jwt.sign(
            {
              uid: user.id
            },
            config.secret
          );
      
          user.account = {
            username: email,
            token: token,
            isRegistered: true,
            isVerified: true,
            isActive: true,
            last_login_time: new Date()
          };
      
          
          user.profile = {
            name: name,
            email: email,
            profilePhoto: profilePhoto,
            thumbnail: profilePhoto    
          };
          user.location.coordinates= [longitude, latitude]    
      
           user
            .save()
            .then(user => {
              resolve({
                id: user.id,
                token: token,
                message: "User registered successfully!"
              });
            })
            .catch(err => {
              reject(err);
            });}
        else {
          const methods = user.login_types;
          const loginMethod = methods.find(
            type => type.login_type == LOGIN_METHOD.FACEBOOK
          );
          if (loginMethod) {
            resolve({
              id: user.id,
              token: token,
              message: "User registered successfully!"
            });
          } else {
            user.login_types.push({
              login_type: LOGIN_METHOD.FACEBOOK,
              status: true,
              access_token: accessToken
            });
           
            user.profile = {
              name: name,
              email: email,
              profilePhoto: profilePhoto,
              thumbnail: profilePhoto          
            };

            user.location.coordinates= [longitude, latitude]
           
             user
              .save()
              .then(user => {
                resolve({
                  id: user.id,
                  token: user.account.token,
                  message: "User registered successfully!"
                });
              })
              .catch(err => {
                reject(err);
              });
            return;
          }
        }
      })
      .catch(err => {
        reject(err);
      });

  
  });
}

 function registerWithGoogle(req) {
  const userParam=req.body;
  const schema = Joi.object().keys({
    email: Joi.string()
      .email({
        minDomainSegments: 2
      })
      .required(),
      name: Joi.string().required(),
    latitude: Joi.number()
      .min(-90)
      .max(90)
      .required(),
    longitude: Joi.number()
      .min(-180)
      .max(180)
      .required(),
    accessToken: [Joi.string(), Joi.number()],
    profilePhoto: Joi.string().required(),
    loginMethod: Joi.string().required()
  });

  return  new Promise(async (resolve, reject) => {
    const { error, value } = schema.validate(userParam);
    if (error) {
      reject(error);
      return;
    }

    const {
      email,
      name,
      latitude,
      longitude,
      accessToken,
      profilePhoto
    } = userParam;

    await User.findOne({
      "account.username": email
    })
      .then( user => {
        if(!user)
        {}
        if (user) {
          const methods = user.login_types;
          const loginMethod = methods.find(
            type => type.login_type == LOGIN_METHOD.GOOGLE
          );
          if (loginMethod) {
            resolve({
              id: user.id,
              token: user.account.token,
              message: "User registered successfully!"
            });
          } else {
            user.login_types.push({
              login_type: LOGIN_METHOD.GOOGLE,
              status: true,
              access_token: accessToken
            });

            user.profile = {
              name:name,
              email: email,
              profilePhoto: profilePhoto,
              thumbnail: profilePhoto
            };

            user.location.coordinates= [longitude, latitude];           
             user
              .save()
              .then(user => {
                resolve({
                  id: user.id,
                  token: user.account.token,
                  message: "User registered successfully!"
                });
              })
              .catch(err => {
                reject(err);
              });
            return;
          }
        }
      })
      .catch(err => {
        reject(err);
      });

    const user = new User();
    user.external_id = shortid.generate();
    user.login_types.push({
      login_type: LOGIN_METHOD.GOOGLE,
      status: true,
      access_token: accessToken
    });

    const token = jwt.sign(
      {
        uid: user.id
      },
      config.secret
    );
    user.account = {
      username: email,
      isRegistered: true,
      isVerified: true,
      isActive: true,
      token: token,
      last_login_time: new Date()
    };

    
    user.profile = {
      name: name,
      email: email,
      profilePhoto: profilePhoto,
      thumbnail: profilePhoto
    };
    user.location.coordinates= [longitude, latitude];
  

     user
      .save()
      .then(user => {
        resolve({
          id: user.id,
          token: token,
          message: "User registered successfully!"
        });
      })
      .catch(err => {
        reject(err);
      });
  });
}

function registerWithApple(req) {
  const userParam=req.body;
  const schema = Joi.object().keys({
    email: Joi.string()
      .email({
        minDomainSegments: 2
      })
      .required(),
    latitude: Joi.number()
      .min(-90)
      .max(90)
      .required(),
    longitude: Joi.number()
      .min(-180)
      .max(180)
      .required(),
    accessToken: [Joi.string(), Joi.number()],
    profilePhoto: Joi.string().required(),
    loginMethod: Joi.string().required()
  });
  return  new Promise( (resolve, reject) => {
    const { error, value } = schema.validate(userParam);
   
    if (error) {
      reject(error);
      return;
    }
    const {
      email,
      name,
      latitude,
      longitude,
      accessToken,
      profilePhoto
    } = userParam;

     User.findOne({
      "account.username": email
    })
      .then( user => {
        if(!user)
        {  const user = new User();
          user.external_id = shortid.generate();
          user.login_types.push({
            login_type: LOGIN_METHOD.FACEBOOK,
            status: true,
            access_token: accessToken
          });
      
          const token = jwt.sign(
            {
              uid: user.id
            },
            config.secret
          );
      
          user.account = {
            username: email,
            token: token,
            isRegistered: true,
            isVerified: true,
            isActive: true,
            last_login_time: new Date()
          };
      
          
          user.profile = {
            name: name,
            email: email,
            profilePhoto: profilePhoto,
            thumbnail: profilePhoto    
          };
          user.location.coordinates= [longitude, latitude]    
      
           user
            .save()
            .then(user => {
              resolve({
                id: user.id,
                token: token,
                message: "User registered successfully!"
              });
            })
            .catch(err => {
              reject(err);
            });}
        else {
          const methods = user.login_types;
          const loginMethod = methods.find(
            type => type.login_type == LOGIN_METHOD.APPLE
          );
          if (loginMethod) {
            resolve({
              id: user.id,
              token: user.account.token,
              message: "User registered successfully!"
            });
          } else {
            user.login_types.push({
              login_type: LOGIN_METHOD.APPLE,
              status: true,
              access_token: accessToken
            });
           
            user.profile = {
              name: name,
              email: email,
              profilePhoto: profilePhoto,
              thumbnail: profilePhoto          
            };

            user.location.coordinates= [longitude, latitude]
           
             user
              .save()
              .then(user => {
                resolve({
                  id: user.id,
                  token: user.account.token,
                  message: "User registered successfully!"
                });
              })
              .catch(err => {
                reject(err);
              });
            return;
          }
        }
      })
      .catch(err => {
        reject(err);
      }); 
  });
}


function activate(userId) {
  const schema = Joi.object().keys({
    userId:Joi.string().min(24).max(24).required()  
  });
  
  return  new Promise(async (resolve, reject) => {
    const { error, value } = schema.validate({userId});
    if (error) {
      reject(error);
      return;
    }

     User.findById(userId)
      .then(user => {
       if(!user)
      { 
        resolve({success:false,message:'User not found'});
       return;
      }
    
    user.isActive = true;
      user.save().then(res=>{
        console.log('Account activation',res);
          resolve({success:true,message:'User account activated'});
        }).catch(err=>{
        resolve({success:false,message:err});
      });
    
      })      

      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
}
function deactivate(userId) {
  const schema = Joi.object().keys({
    userId:Joi.string().min(24).max(24).required()  
  });
  
  return  new Promise(async (resolve, reject) => {
    const { error, value } = schema.validate({userId});
    if (error) {
      reject(error);
      return;
    }

     User.findById(userId)
      .then(user => {
       if(!user)
      { 
        resolve({success:false,message:'User not found'});
       return;
      }
    
    user.isActive = false;
      user.save().then(res=>{
          resolve({success:true,message:'User account deactivated'});
        }).catch(err=>{
        resolve({success:false,message:err});
      });
    
      })      

      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
}

async function setfirebaseToken(userParam) {
  const schema = Joi.object().keys({  
    userId:Joi.string().min(24).max(24).required(),
    token: Joi.string().required()
  });
  return new Promise(async (resolve, reject) => {
    const { error, value } = schema.validate(userParam);
    const {userId, token } = userParam;
    if (error) {
      reject(error);
      return;
    }
    await User.findById(userId)
      .then(user => {
        if (!user) {
          resolve({ success: false, message: "User not found" });
          return;
        }   
      
        user.account.firebaseToken = token;
        user.save();         
          resolve({ success: true,               
            id: user.id,        
            message: "token saved."
           });       
       
      })
      .catch(err => reject(err));
  });
}

 function update(userParam) {
  const schema = Joi.object().keys({
    userId:Joi.string().min(24).max(24).required(),
    name: Joi.string(),
    aadhar:Joi.string().min(12).max(12),
    email: Joi.string().email({
      minDomainSegments: 2
    }),
    mobile:Joi.number().min(12)
  });
  
  return  new Promise(async (resolve, reject) => {
    const { error, value } = schema.validate(userParam);
    if (error) {
      reject(error);
      return;
    }
const {userId,name,email,mobile,aadhar}=userParam;
     User.findById(userId)
      .then(user => {
       if(!user)
      { 
        resolve({success:false,message:'User not found'});
       return;
      }
      name&& (user.profile.name = name);
      aadhar&& (user.profile.aadhar = aadhar);
      email&& (user.profile.email = email);
      mobile&& (user.profile.mobile = mobile);
      user.save().then(res=>{
          resolve({success:true,message:'User profile updated'});
        }).catch(err=>{
        resolve({success:false,message:err});
      });
    
      })      

      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
}

function saveSetting(userParam) {
  const schema = Joi.object().keys({
    userId:Joi.string().min(24).max(24).required(),
    allow_notifications:Joi.boolean().required(),
    show_phone_number:Joi.boolean().required(),
    allow_offer_notifications:Joi.boolean().required()
  });
  
  return  new Promise(async (resolve, reject) => {
    const { error, value } = schema.validate(userParam);
    if (error) {
      reject(error);
      return;
    }
     const {userId,allow_notifications,show_phone_number,allow_offer_notifications}=userParam;
     User.findById(userId)
      .then(user => {
       if(!user)
      { 
        resolve({success:false,message:'User not found'});
       return;
      }
      allow_notifications&& (user.setting.allow_notifications = allow_notifications);
      show_phone_number&& (user.setting.show_phone_number = show_phone_number);
      allow_offer_notifications&& (user.setting.allow_offer_notifications = allow_offer_notifications);
    
      user.save().then(res=>{
          resolve({success:true,message:'User setting updated'});
        }).catch(err=>{
        resolve({success:false,message:err});
      });    
      }).catch(err => {
        console.log(err);
        reject(err);
      });
  });
}

async function getSetting(id) {
  return new Promise(async (resolve, reject) => {
    await User.findById(id)
      .then(user => {
        if (!user) resolve({ success: false, message: "User not found" });
        else resolve({ success: true, settings:user.setting });
      })
      .catch(err => {
        reject(err);
      });
  });
}

 function getTotal() {
  return new Promise( (resolve, reject) => { 
   User.aggregate([{$count:"count"}]).then(res=>{
    resolve({success:true,count: res[0].count})
   }).catch(err=>{
      reject(err);  
  })  
  });
}


//-------------------------------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------//
var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, "./profilePhotos");
  },
  filename: function(req, file, callback) {
    callback(
      null,
      file.fieldname + "_" + Date.now() + "." + file.mimetype.substring(6)
    );
  }
});

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000
  },
  fileFilter: function(req, file, cb) {
    let fileExts = ['png', 'jpg', 'jpeg'] 
    helper.sanitizeFile(file,cb,fileExts);
  }
}).single("userPhoto");

 function updateUserPhoto(req, res) {
  return new Promise((resolve,reject)=>{
   upload(req, res, function(err) {
   User.findById(req.params.id).then(user=>{   
    if(!user)
    {
      resolve({success:false,message:'User not found'})
    } 
        const { file } = req;
        const outputfile=  helper.getServerUrl(req) + "profilePhotos/" + file.filename;
        user.profile.profilePhoto= outputfile;    
        user.profile.thumbnail=outputfile;
        user.save();
        resolve({success:true,message:'Profile photo updated.'})
        if (err) {
          reject(err);
        }
      }).catch(err=>{reject(err)});
    })
  })
  
}

//-------------------------------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------//

//--------------------------DELETE USER----------------------------------
async function _delete(id) {  
  await User.findByIdAndRemove(id);
}
