const Joi = require("@hapi/joi");
const db = require("../_helpers/db");

const Color = db.Color;

module.exports = {
  getAll, 
  add,
  update,
  setActive,
  getPlatformWise,
  delete: _delete
};

//For getting All Posts
 function getAll() {
  return new Promise((resolve,reject)=>{ 
    Color.find().then(colors=>{
      resolve({success:true,colors})
    }).catch(err=>{
      reject(err);
    })
  })    
  } 

  function getPlatformWise(params) {
  return new Promise((resolve,reject)=>{
  console.log(params)
    Color.findOne({platform:params.platform,active:true}).then(colors=>{
      resolve({success:true,colors})
    }).catch(err=>{
      reject(err);
    })
  })    
  } 

 function add(req, res) {
  return new Promise( (resolve, reject) => {
    
    const schema = Joi.object().keys({
      colors: Joi.object().required(),  
      platform: Joi.string().required()
    });
    const colorParam = req.body;

    //Validating the schema
    const { error, value } = schema.validate(colorParam);
    //If the request is not in the expected format
    if (error) {
      reject(error);
      return;
    }
    const { colors, active, platform } = colorParam;

    const color=new Color();
    color.colors=colors;
    color.platform=platform;
    color.save().then(res=>{   
      resolve({success:true,color:res,message:'Colors added!'})
    }).catch(err=>{
      reject(err);
    })
    
  });
}

 function update(req, res) {
  return new Promise( (resolve, reject) => {
    const schema = Joi.object().keys({
      id: Joi.string().min(24).max(24).required(),
      colors: Joi.object().required(),  
      platform: Joi.string().required()
    });
    const colorParam = req.body;

    //Validating the schema
    const { error, value } = schema.validate(colorParam);
    //If the request is not in the expected format
    if (error) {
      reject(error);
      return;
    }

      const { colors, id, platform } = colorParam;


  return  Color.findByIdAndUpdate(id,{colors:colors,platform:platform}).then(res=>{
        resolve({success:true,message:'Colors updated'})
    }).catch(err=>{reject(err)})
 
  });
}

function setActive(req, res) {
  return new Promise( (resolve, reject) => {
    const schema = Joi.object().keys({
      id: Joi.string().min(24).max(24).required(),     
      platform: Joi.string().required()
    });
    const colorParam = req.body;

    //Validating the schema
    const { error, value } = schema.validate(colorParam);
    //If the request is not in the expected format
    if (error) {
      reject(error);
      return;
    }

      const {  id, platform } = colorParam;

      Color.find({platform:platform,active:true}).then(colors=>{
        if(colors)
        {
        
        colors.forEach(color=>{
       color.active=false;
      color.save();
        })}
      })

   
      
  return  Color.findByIdAndUpdate(id,{active:true}).then(res=>{
    console.log(res);
        resolve({success:true,message:'Colors updated'})
    }).catch(err=>{reject(err)})
 
  });
}

//--------------------------DELETE Color----------------------------------
 function _delete(req) {
  return new Promise( (resolve, reject) => {
     const schema = Joi.object().keys({
      id:Joi.string().min(24).max(24).required(),
    
    });
    const colorParam = req.body;

    //Validating the schema
    const { error, value } = schema.validate(colorParam);
    //If the request is not in the expected format
    if (error) {
      reject(error);
      return;
    }
    const { id } = colorParam;
   // return Suggestion.delete()
    return Color.remove({_id: id })
      .then(color => {      
        resolve({ success: true, message: "Color removed." });
      })
      .catch(err => {
        console.log(err);
        reject("Error in removing Color.");
      });
  });
}
