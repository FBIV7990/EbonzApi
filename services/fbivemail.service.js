var nodemailer=require("nodemailer");
const Joi = require("@hapi/joi");


var transporter=nodemailer.createTransport({
  service:'gmail',
  auth:{
    user:'support@ebonz.in',
    pass:'Vincy1980$'
  }
});



module.exports={
  sendEnquiry 
}

 function sendEnquiry(req,res)
{
  return new Promise((resolve,reject)=>{
try{
  const schema = Joi.object().keys({
      apiKey:Joi.string().alphanum().required(),
      name: Joi.string().min(1).max(100).required(),     
      mobile:Joi.string().required().min(10).max(12),
      email: Joi.string().min(1).max(100).required(),
      company: Joi.string().min(1).max(100),
      message:Joi.string().min(1).max(250).required()
    });
    const emailParam = req.body;
    const { error, value } = schema.validate(emailParam);
    if (error) {
        throw error;          
    }
    const {apiKey,name,mobile,email,company,message}=emailParam;
if(apiKey=="rt664456438579shjdfkmklnvlxm")
{
  const finalMessage="Name :"+name+"\n Mobile number :"+mobile+"\n Email :"+email+"\n Company : "+company+"\n Message : "+message;
  return sendMail(finalMessage).then(res=>{
     resolve({success:true,message:'Mail Sent'})
   }).catch(err=>{resolve({success:false,message:'Error in sending email.'})});
}
else{resolve({success:false,message:'Invalid api key'})}

  }catch(err){
reject(err);
  }
  })}

sendMail = (message) => {
 return new Promise((resolve, reject) => {
    var mailOptions = {
      from: 'support@ebonz.in',
      to: 'pradeep@mac9.in',
      subject: 'Message from fbiv.in',
      text:   message

    };
    
   return transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        reject(error);
      } else {
        resolve({success:true,message:'mail sent'})
        console.log('Email sent: ' + info.response);
      }
    });
  });
};
