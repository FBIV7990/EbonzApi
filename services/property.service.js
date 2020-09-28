const Joi = require('@hapi/joi');
const db = require("../_helpers/db");
var multer=require('multer');
const helper=require('../_helpers/helper')
var fs = require('fs');
var Jimp = require('jimp');
var constants=require('../_helpers/Constants')
const genThumbnail = require('simple-thumbnail')
const gmap=require('./gmap.service')
const ffmpeg = require('ffmpeg-static')
const chalk=require('chalk')
const log=console.log;


const Property = db.Property;
const Category=db.Category;


module.exports = { 
  getAll,
  getNearBy,
  getById,  
  getByCategory,
  getBySubCategory,
  create,
  update,
  updateData,
  updateFiles,
  uploadReport,
  delete: _delete,
  activate
};

//For getting all Property
async function getAll() {     
return await Property.find({},{isDeleted:false});
}

//For getting Property by Get Near By ID 
async function getNearBy({latitude,longitude}) { 
  const schema = Joi.object().keys({   
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required()
    }) 
    const propertyParam={latitude:latitude,longitude:longitude};           
    const {error,value}=schema.validate(propertyParam);
    if(error)throw error;    
    return await Property.find({location:{$near:{$geometry:{type:"Point",coordinates:[longitude , latitude]}}}});
}

//For getting Property by ID 
async function getById(id) {
  try {
    return await Property.findById(id);
  } catch {
    throw "Error in getting Property.";
  }
} 
//For getting Property by Category ID 
async function getByCategory(id) {
  try {
    return await Property.find({categoryId:id});
  } catch {
    throw "Error in getting Property.";
  }
}

//For getting Property by Subcategory ID
async function getBySubCategory(id) {
  try {
    return await Property.find({subcategoryId:id});
  } catch {
    throw "Error in getting Property.";
  }
}

// FOR CREATING NEW PROPERTY 
var storage=multer.diskStorage({
  destination:function(req,file,callback){
      callback(null,'./adPhotos/Properties');
  },
  filename:function(req,file,callback){callback(null,file.fieldname+"_"+Date.now()+"."+file.mimetype.substring(6))}
});

var upload = multer({ storage : storage,
  limits: {
      fileSize: 20000000
  },
  fileFilter: function (req, file, cb) {  
    let fileExts = ['png', 'jpg', 'jpeg','mp4'] 
    helper.sanitizeFile(file,cb,fileExts);
  } }).array('adPhoto',12);

async function create(req,res)
 {  
  return new Promise((resolve, reject) => {   
    upload(req,res, async function(err)
       {           
         if(err)
         {           
           reject(err);
           return;
         }   
        else{ 
      // Schema for validating the request properly
      const schema = Joi.object().keys({
      userId:Joi.string().required(),
      categoryId:Joi.string().required(),
      subcategoryId:Joi.string().required(),
      adTitle:Joi.string().required(),
      description:Joi.string().required(),
      price:Joi.number().min(1).required(),
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required(),          
      details:Joi.object().required()
      })  

      const propertyParam=req.body;   

      //Validating the schema        
      const {error,value}=schema.validate(propertyParam);

      //If the request is not in the expected format
      if(error){         
         reject(error);
         return;
      }     
      //Finding if the category exists in which we are adding the properties
      Category.findOne({_id:propertyParam.categoryId,"subCategories._id":propertyParam.subcategoryId}).then(async (category)=>
      {
      if(!category){ 

      //Reject the promise if the category ID and Subcategory ID is wrong
        reject("Category not found");
      }     
          
      const property = new Property(propertyParam);   

       // Creating Directories on server to store files
    
       var rootDir = constants.AdDataFolder+propertyParam.userId;   //User Directory
       var subDir=rootDir+"/"+property._id;      //Ad Directory
       var thumbDir=subDir+constants.ThumbFolder;    //Thumb Directory for storing the video thumbnails

       if (!fs.existsSync(rootDir))
       {
            fs.mkdirSync(rootDir);            
       }      
       if (!fs.existsSync(subDir))
       {         
            fs.mkdirSync(subDir); 
       } 
       if (!fs.existsSync(thumbDir))
       {         
            fs.mkdirSync(thumbDir); 
       } 

    //Parsing If the there is valid Latitude nd Longitude
    var lat=parseFloat(propertyParam.latitude);
    var lng=parseFloat(propertyParam.longitude);
     
    //Calling Google map service to convert latitude,longitude to user's address
     await gmap.getAddress(lat,lng).then((res)=>{
     const data=res[0];     
     const { latitude,longitude,administrativeLevels,extra, ...location } = data;
          property.location.data=location;          
          }).catch((err)=>
          {console.log(err)}
          );    
      property.location.coordinates=[ lng,lat]

      //Declaring array for the images and videos related to the ads
      imageArr=new Array();    
 
      let vidExts = ['mp4']  // Allowed video files extension 

      var imgId=0; //Used for creating ID for each Image or video data

      req.files.forEach( element => {
             //Move each uploaded file to user's specific directory
             helper.moveFile(element.destination+"/"+element.filename,subDir);     
             
             if(vidExts.includes(element.filename.split('.')[1].toLowerCase()))
             {               
               let videoPath="./"+subDir+"/"+element.filename;

               let thumbPath= thumbDir+"/"+element.filename.split('.')[0]+'.png';

                // Create thumbnail if there is any video uploaded 
                genThumbnail(videoPath, thumbPath, '250x?',{path: ffmpeg.path}).then((res) => 
                 {
                   console.log("Thumbnail generated.");
                 }).catch(err => console.error(err))

                 imageArr.push({
                   id:imgId,
                    type:'video',   
                    thumb:helper.getServerUrl(req)+thumbPath,
                    path: helper.getServerUrl(req)+subDir+"/"+element.filename
                    })                   
                  }
             else {          
              imageArr.push({   id:imgId,type:'image',
              path: helper.getServerUrl(req)+subDir+"/"+element.filename})
             }
             imgId++;             
            });            
            property.thumbnail=(imageArr[0].type=='video')?imageArr[0].thumb:imageArr[0].path;              
            property.images=imageArr;
            property.details=JSON.parse(propertyParam.details);
            await property.save().then(()=>resolve("Property added successfully.")).catch((error)=>{
            reject(error)
         });
      }).catch((error)=>{
        reject(error);
      })        
     }      
   })    
  })
  .catch((error) => {
    throw(error)
  });      
}

async function updateData(req,res)
{  
    const schema = Joi.object().keys({  
      id:Joi.string().required(),        
      adTitle:Joi.string(),
      description:Joi.string(),
      price:Joi.number().min(1),
      latitude: Joi.number().min(-90).max(90),
      longitude: Joi.number().min(-180).max(180),
      details:Joi.object()
      }) 
      const propertyParam=req.body;          
      const {error,value}=schema.validate(propertyParam);
      if(error)throw(error);
      else
      { 
      return await Property.findById(propertyParam.id).then(async property=>{
       if(!property)
       throw "Property not found";   
  
       propertyParam.adTitle&&(property.adTitle=propertyParam.adTitle);
       propertyParam.description&&(property.description=propertyParam.description);
       propertyParam.price&&(property.price=propertyParam.price);    
       propertyParam.details&&(property.details=propertyParam.details);
       if(propertyParam.latitude&&propertyParam.longitude)
       { 
       //Parsing If the there is valid Latitude nd Longitude
       var lat=parseFloat(propertyParam.latitude);
       var lng=parseFloat(propertyParam.longitude);
  
      //Calling Google map service to convert latitude,longitude to user's address
      await gmap.getAddress(lat,lng).then((res)=>{
      const data=res[0];     
      const { latitude,longitude,administrativeLevels,extra, ...location } = data;
       property.location.data=location;          
       }).catch((err)=>
       {console.log(err)}
       );    
      property.location.coordinates=[ lng,lat]
      }
       property.save();     
       return property;
     }).catch(err=>{  
       console.log(err);    
       throw err;   
     })     
  }  
}

async function updateFiles(req,res)
{  
  return new Promise((resolve, reject) => {   
    upload(req,res, async function(err)
       {           
         if(err)
         {           
           reject(err);
           return;
         }   
        else{ 
      // Schema for validating the request properly
      const schema = Joi.object().keys({
      id:Joi.string().required(),
      imageData:Joi.array().required()
      })  

      const propertyParam=req.body;   

      //Validating the schema        
      const {error,value}=schema.validate(propertyParam);

      //If the request is not in the expected format
      if(error){         
         reject(error);
         return;
      } 
    const arr=propertyParam.imageData;
    const property=await Property.findById(propertyParam.id);
    var rootDir = constants.AdDataFolder+property.userId;   //User Directory
    var subDir=rootDir+"/"+property._id;      //Ad Directory
    var thumbDir=subDir+constants.ThumbFolder;    //Thumb Directory for storing the video thumbnails

    if (!fs.existsSync(rootDir))
    {
         fs.mkdirSync(rootDir);            
    }      
    if (!fs.existsSync(subDir))
    {         
         fs.mkdirSync(subDir); 
    } 
    if (!fs.existsSync(thumbDir))
    {         
         fs.mkdirSync(thumbDir); 
    } 

    //Declaring array for the images and videos related to the ads
    imageArr=property.images;    
 
          let vidExts = ['mp4']  // Allowed video files extension 
    
          var imgId=0; //Used for creating ID for each Image or video data
    
          req.files.forEach( element => {
                 //Move each uploaded file to user's specific directory
                 helper.moveFile(element.destination+"/"+element.filename,subDir);     
                 
                 if(vidExts.includes(element.filename.split('.')[1].toLowerCase()))
                 {               
                   let videoPath="./"+subDir+"/"+element.filename;
    
                   let thumbPath= thumbDir+"/"+element.filename.split('.')[0]+'.png';
    
                    // Create thumbnail if there is any video uploaded 
                    genThumbnail(videoPath, thumbPath, '250x?',{path: ffmpeg.path}).then((res) => 
                     {
                       console.log("Thumbnail generated.");
                     }).catch(err => console.error(err))
    
                     imageArr.push({
                       id:imgId,
                        type:'video',   
                        thumb:helper.getServerUrl(req)+thumbPath,
                        path: helper.getServerUrl(req)+subDir+"/"+element.filename
                        })                   
                      }
                 else {          
                  imageArr.push({   id:imgId,type:'image',
                  path: helper.getServerUrl(req)+subDir+"/"+element.filename})
                 }
                 imgId++;             
                });            
                property.thumbnail=(imageArr[0].type=='video')?imageArr[0].thumb:imageArr[0].path;              
                property.images=imageArr;

                
    //property.images.map((img)=>{
  //   const ifExists=   arr.includes(img.id);
  //   if(ifExists)
  //   {
      
  //     switch(img.type)
  //     {
  //       case 'image':
          
  //     break;
  //   case 'video':
  //     break;
  // default:break;}
  //   }
  //   console.log(img)
      
   
     resolve(propertyParam); 
      // //Finding if the category exists in which we are adding the properties
      // Property.findById(propertyParam.id).then(async (property)=>
      // {
      // if(!property){ 
      // //Reject the promise if the property ID is wrong
      //   reject("Property not found");
      // }    

      //  // Creating Directories on server to store files
    
      //  var rootDir = constants.AdDataFolder+propertyParam.userId;   //User Directory
      //  var subDir=rootDir+"/"+property._id;      //Ad Directory
      //  var thumbDir=subDir+constants.ThumbFolder;    //Thumb Directory for storing the video thumbnails

      //  if (!fs.existsSync(rootDir))
      //  {
      //       fs.mkdirSync(rootDir);            
      //  }      
      //  if (!fs.existsSync(subDir))
      //  {         
      //       fs.mkdirSync(subDir); 
      //  } 
      //  if (!fs.existsSync(thumbDir))
      //  {         
      //       fs.mkdirSync(thumbDir); 
      //  } 

   
      // //Declaring array for the images and videos related to the ads
      // imageArr=new Array();    
 
      // let vidExts = ['mp4']  // Allowed video files extension 

      // var imgId=0; //Used for creating ID for each Image or video data

      // req.files.forEach( element => {
      //        //Move each uploaded file to user's specific directory
      //        helper.moveFile(element.destination+"/"+element.filename,subDir);     
             
      //        if(vidExts.includes(element.filename.split('.')[1].toLowerCase()))
      //        {               
      //          let videoPath="./"+subDir+"/"+element.filename;

      //          let thumbPath= thumbDir+"/"+element.filename.split('.')[0]+'.png';

      //           // Create thumbnail if there is any video uploaded 
      //           genThumbnail(videoPath, thumbPath, '250x?',{path: ffmpeg.path}).then((res) => 
      //            {
      //              console.log("Thumbnail generated.");
      //            }).catch(err => console.error(err))

      //            imageArr.push({
      //              id:imgId,
      //               type:'video',   
      //               thumb:helper.getServerUrl(req)+thumbPath,
      //               path: helper.getServerUrl(req)+subDir+"/"+element.filename
      //               })                   
      //             }
      //        else {          
      //         imageArr.push({   id:imgId,type:'image',
      //         path: helper.getServerUrl(req)+subDir+"/"+element.filename})
      //        }
      //        imgId++;             
      //       });            
      //       property.thumbnail=(imageArr[0].type=='video')?imageArr[0].thumb:imageArr[0].path;              
      //       property.images=imageArr;
      //       property.details=JSON.parse(propertyParam.details);
      //       await property.save().then(()=>resolve("Property added successfully.")).catch((error)=>{
      //       reject(error)
      //    });
      // }).catch((error)=>{
      //   reject(error);
      // })        
     }      
   })    
  })
  .catch((error) => {
    throw(error)
  });    
}

async function update(req,res)
 {  
  return new Promise((resolve, reject) => {
    upload(req,res, async function(err)
       {
         if(err)
         {reject(err);return;}          
          const schema = Joi.object().keys({          
            adTitle:Joi.string().required(),
            description:Joi.string().required(),
            price:Joi.number().min(1).required(),
            latitude: Joi.number().min(-90).max(90).required(),
            longitude: Joi.number().min(-180).max(180).required(),
            details:Joi.object().required()
            }) 
            const propertyParam=req.body;          
            const {error,value}=schema.validate(propertyParam);
            if(error){reject(error);return;}
            imageArr=new Array();        
            req.files.forEach(element => {
                   imageArr.push(helper.getServerUrl(req)+"adPhotos/Properties"+element.filename);
               });
          
           await Property.findById(req.params.id).then(property=>
            {
              if(!property){reject("Property not found");return;}
              property.adTitle=propertyParam.adTitle;
              property.description=propertyParam.description;
              property.price=propertyParam.price;                
              property.location.coordinates=[ parseFloat(propertyParam.longitude),parseFloat(propertyParam.latitude)]
               property.thumbnail=imageArr[0];              
               property.images=imageArr;
               property.details=JSON.parse(propertyParam.details);
               property.save().then( resolve("Property updated successfully.") ).catch(err=>{reject(err)});
               
              }).catch(err=>reject("Invalid Id"));     
       })    
  })
  .catch((error) => {
    throw(error)
  });      
}


// FOR CREATING NEW PROPERTY 
var reportStorage=multer.diskStorage({
  destination:function(req,file,callback){
      callback(null,'./adPhotos/Reports');
  },
  filename:function(req,file,callback){callback(null,file.fieldname+"_"+Date.now()+"."+file.mimetype.substring(12))}
});
var uploadreport = multer({ storage : reportStorage,
  limits: {
      fileSize: 1000000
  },
  fileFilter: function (req, file, cb) { 
    let fileExts = ['pdf']       
    helper.sanitizeFile(file,cb,fileExts);
  } }).single("report");

async function uploadReport(req,res)
 {  
  return new Promise((resolve, reject) => {
    uploadreport(req,res, async function(err)
       {
         if(err)
         {reject(err);return;}          
          const schema = Joi.object().keys({          
            propertyId:Joi.string().required()         
            }) 
            const propertyParam=req.body;            
            const {error,value}=schema.validate(propertyParam);
            if(error){reject(error);return;}
          
           await Property.findById(propertyParam.propertyId).then(property=>
            {
              if(!property){reject("Property not found");
              return;
            }
            const element=req.file;

            var rootDir = constants.AdDataFolder+property.userId;   //User Directory
            var subDir=rootDir+"/"+property._id+constants.ReportFolder;      //Ad Directory
            
            if (!fs.existsSync(subDir))
            {
            fs.mkdirSync(subDir);            
            }     

            helper.moveFile(element.destination+"/"+element.filename,subDir);    
            property.verificationReport=helper.getServerUrl(req)+subDir+"/"+req.file.filename;
               property.save().then((res)=>
                {resolve("Report uploaded successfully.");
              }
               ).catch(err=>{reject(err)}); 

              }).catch(err=>{console.log(err); reject("Invalid Id");});      
       })    
  })
  .catch((error) => {
    throw(error)
  });      
}

//--------------------------DELETE Property----------------------------------
async function _delete(id) {

   return Property.findById(id).then ( (property)=>{  
     if(!property.deleted)  
    {
      property.deleted=true; 
      property.save();  
    } 
    return "Property deleted";
 }).catch(err=>{throw "Property not found.."}) 
}

//--------------------------ACTIVATE/ DEACTIVATE Property----------------------------------
async function activate(id) { 
 return Property.findById(id).then ( (property)=>{    
     property.active=!property.active; 
      property.save(); 
      msg="Property "+(property.active?"activated":"deactivated");
     return msg;
  }).catch(err=>{throw "Property not found.."}) 
}



// await Jimp.read('F:/icon_1563600484404.png', (err, lenna) => {
//   if (err) throw err;
//   lenna
//     .resize(256, 256) // resize
//     .quality(60) // set JPEG quality    
//     .write('F:/icon.png'); // save
// });