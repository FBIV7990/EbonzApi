const Joi = require("@hapi/joi");
const db = require("../_helpers/db");
var multer = require("multer");
const helper = require("../_helpers/helper");

const Slider=db.Slider;

module.exports={
    add,   
    remove,
    get
}

//-------------------------------------------------------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------//
var storage = multer.diskStorage({
    destination: function(req, file, callback) {
      callback(null, "./images/slides");
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
  }).single("slide");
  
  

 function add(req,res)
{
    return new Promise((resolve,reject)=>{
      try{
               upload(req, res, function(err) {       
                if(err)
                {console.log(err);}


                const schema = Joi.object().keys({
                  link:Joi.string(),
                  index: Joi.number().required()
                });
                const sliderParam = req.body;
                const { error, value } = schema.validate(sliderParam);
                if (error) {
                    throw error;          
                }
            const {link,index}=req.body;
            const { file } = req;         
         
            const slider=new Slider();   
            if(file)
            {
            const outputfile=  helper.getServerUrl(req) + "images/slides/" + file.filename;
            slider.slide=outputfile;
            }
            slider.link=link;
            slider.index=index;
            return slider.save().then(res=>{
                resolve({success:true,message:'Slide saved',slide:res})
            }).catch(err=>{
              console.log(err);
                resolve({success:false,message:'Error in saving...'})
            })
         })}catch(err){
           console.log(err)
          }
       })
}

async function remove(req)
{
    try{
        const schema = Joi.object().keys({
            slideId:Joi.string().alphanum().min(24).max(24).required()
          });
          const slideParam = req.body;
          const { error, value } = schema.validate(slideParam);
          if (error) {
              throw error;          
          }
          const {slideId}=slideParam;

      return await Slider.findByIdAndDelete(slideId).then(res=>{ 
              return ({success:true,message: "Slide deleted!"})
              }).catch(err=>
              {    return {success:false,message: "Error in deleting slide."}})
          
    }
    catch(err){
      console.log(err)
      throw err
    }
    }

function get() {  
return new Promise((resolve,reject)=>{
    return Slider.find().then(slides=>{
        resolve({success:true, slides:slides})
    })
})
}