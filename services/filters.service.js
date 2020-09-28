const Joi = require("@hapi/joi");
const db = require("../_helpers/db");

const User = db.User;
const Filters = db.Filters;

module.exports = {
  add,
  get
};

async function add(req, res) {
 
    return new Promise((resolve,reject)=>{  
    const schema = Joi.object().keys({
      userId: Joi.string()     
        .min(24)
        .max(24)
        .required(),
      categories:Joi.array(),
      sortby: Joi.string()       
        .min(1)
        .max(100),
      minPrice:Joi.number().min(0),
        maxPrice:Joi.number().min(1),
      range:Joi.number().min(0),
      state:Joi.string(),
      city:Joi.string()
    });
    const filterParam = req.body;
    const { error, value } = schema.validate(filterParam);
    if (error) {
      throw error;
    }
    const { userId } = filterParam;
    User.findById(userId).then(user=>{
    if (!user) { 
      reject("User not found");
      return ;    
    }
    
    Filters.findOne({userId:userId}).then(filters=>{
      if(filters)
      {
      filterParam.categories&&(filters.categories=filterParam.categories);
      filterParam.sortby&&(filters.sortBy=filterParam.sortby);
      filterParam.minPrice&&(filters.price.min=filterParam.minPrice);
      filterParam.maxPrice&&(filters.price.max=filterParam.maxPrice);
      filterParam.range&&(filters.range=filterParam.range);
      filterParam.state&&(filters.state=filterParam.state);
      filterParam.city&&(filters.city=filterParam.city);
      filters.save().then(res=>{
        resolve({success:true,filters:res,message:"Filters saved successfully!"})}
        )
         .catch(err=>{
           console.log(err);
           reject(err);
         })
      }
      else {
        const filter=new Filters();
        filter.userId=filterParam.userId;
       filterParam.categories&&(filter.categories=filterParam.categories);
       filterParam.sortby&&(filter.sortBy=filterParam.sortby);
       filterParam.price&&(filter.price=filterParam.price);
       filterParam.range&&(filter.range=filterParam.range);
       filterParam.state&&(filter.state=filterParam.state);
       filterParam.city&&(filter.city=filterParam.city);
         filter.save().then(res=>{resolve({success:true,filters:res, message:"Filters saved successfully!"})})
         .catch(err=>{
           console.log(err);
           reject(err);
         })
      }
    }).catch(err=>{
      reject(err)
      })
    });  
  }) 
 
}

async function get(params)
{
   const schema = Joi.object().keys({
      userId:Joi.string().alphanum().min(24).max(24).required()     
    });
    const follParam = params;
    const { error, value } = schema.validate(follParam);
    if (error) {
        throw error;          
    }

try {     
      const filters = await Filters.findOne({userId:params.userId});
      return {success:true,filters:filters}       
} 
catch (err) {
  console.log(err);
  throw err;
}
}