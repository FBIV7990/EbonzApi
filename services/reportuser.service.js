const Joi = require("@hapi/joi");
const db = require("../_helpers/db");
const ReportUser=db.ReportUser;

module.exports={
    add,
    remove,
    takeAction,
    get
}


async function add(req,res)
{
  try{
    const schema = Joi.object().keys({    
        userId: Joi.string().min(24).max(24).required(),
        reportedBy:Joi.string().min(24).max(24).required(),
        issue:Joi.string().required(),
        comment:Joi.string()
      });
      const reportParams = req.body;
      const { error, value } = schema.validate(reportParams);
      if (error) {
          throw error;          
      }
      const {userId,reportedBy,issue,comment}=reportParams;

      if(userId===reportedBy)
      return { success:false,message: "You can't report yourself"};
      const report=new ReportUser();
     
      report.user=userId;
      report.reported_by=reportedBy;
      report.issue=issue;
      report.comment=comment;
      return report.save().then(res=>{
        return {success:true,message:"User reported. We will review your issue and take action accordingly."};
      }).catch(err=>{
        return {success:false,message:"Something went wrong."};
      })
}
catch(err){throw err}
}

async function remove(req)
{
    try{
        const schema = Joi.object().keys({
            reportId:Joi.string().min(24).max(24).required()
          });
          const reportParams = req.body;
          const { error, value } = schema.validate(reportParams);
          if (error) {
              throw error;          
          }
          const {reportId}=reportParams;
          ReportUser.findById(reportId).then(report=>{
          report.deleted=true;
         return report.save().then(res=>{
                return  {success:true,message:"Report Deleted"};
          }).catch(err=>{
            return {success:false,message:"Something went wrong."};
          });
          }).catch(err=>{
            return {success:false,message:"Something went wrong."};
          })

     
          
    }
    catch(err){throw err}
    }

async function takeAction(req)
{
    try{
        const schema = Joi.object().keys({
            reportId:Joi.string().min(24).max(24).required()
          });
          const reportParams = req.body;
          const { error, value } = schema.validate(reportParams);
          if (error) {
              throw error;          
          }
          const {reportId}=reportParams;
         return ReportUser.findById(reportId).then(report=>{
          report.action_taken=true;
         return report.save().then(res=>{
                return  {success:true,message:"Action taken on the report."};
          }).catch(err=>{
            return {success:false,message:"Something went wrong."};
          });
          }).catch(err=>{
            return {success:false,message:"Something went wrong."};
          })          
    }
    catch(err){throw err}
    }

async function get(req) {  

    try{
      return await ReportUser.find();
    }catch(err){
return({success:false,message:'Error in loading reports'})
    }
}