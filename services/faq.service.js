const Joi = require("@hapi/joi");
const db = require("../_helpers/db");


const FAQ=db.FAQ;

module.exports={
    add,   
    remove,
    update,
    get
}

 function add(req,res)
{
    return new Promise((resolve,reject)=>{
      try{
           const schema = Joi.object().keys({
                question:Joi.string(),
                  answer: Joi.string()
                });
                const qaParam = req.body;
                const { error, value } = schema.validate(qaParam);
                if (error) {
                    throw error;          
                }
            const {question,answer}=req.body;       
            const faq=new FAQ();            
           faq.question=question;
           faq.answer=answer;
            return faq.save().then(res=>{
                resolve({success:true,message:'Question saved',question:res})
            }).catch(err=>{
              console.log(err);
                resolve({success:false,message:'Error in saving...'})
            })
       
        }catch(err){
           console.log(err)
          }
       })
}

function update(req,res)
{
    return new Promise((resolve,reject)=>{
      try{
           const schema = Joi.object().keys({
                  id:Joi.string().min(24).max(24).required(),
                  question:Joi.string(),
                  answer: Joi.string()
                });
                const qaParam = req.body;
                const { error, value } = schema.validate(qaParam);
                if (error) {
                    throw error;          
                }
            const {id, question,answer}=req.body;     
           return FAQ.findById(id).then(faq=>{
              faq.question=question;
              faq.answer=answer;
               return faq.save().then(res=>{
                   resolve({success:true,message:'Question saved',question:res})
               }).catch(err=>{
                  console.log(err);
                   resolve({success:false,message:'Error in saving...'})
               })
            }).catch(err=>{})                
        }
        catch(err){
           console.log(err)
          }
       })
}

 function remove(req)
{
  return new Promise((resolve,reject)=>{
    try{
        const schema = Joi.object().keys({
            questionId:Joi.string().alphanum().min(24).max(24).required()
          });
          const qaParam = req.body;
          const { error, value } = schema.validate(qaParam);
          if (error) {
              throw error;          
          }
      const {questionId}=qaParam;
      return  FAQ.findByIdAndDelete(questionId).then(res=>{ 
              resolve({success:true,message: "Question deleted!"})
              }).catch(err=>
              {    resolve({success:false,message: "Error in deleting question."})
            })          
    }
    catch(err){
      console.log(err)
      reject(err)
    }})
}

function get() {  
return new Promise((resolve,reject)=>{
    return FAQ.find().then(faqs=>{
        resolve({success:true, faqs:faqs})
    })
})
}