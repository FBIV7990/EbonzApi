const Joi = require("@hapi/joi");
const db = require("../_helpers/db");
var multer = require("multer");
const helper = require("../_helpers/helper");
var fs = require("fs");
var Jimp = require("jimp");
var constants = require("../_helpers/Constants");
const genThumbnail = require("simple-thumbnail");
const gmap = require("./gmap.service");
const ffmpeg = require("ffmpeg-static");
const chalk = require("chalk");
const log = console.log;
const notificationService=require('./notification.service');
const awss3=require("./awss3.service");

const Post = db.Post;
const SubCategory = db.SubCategory;
const Favorite=db.Favorite;
const User=db.User;
const Filters=db.Filters;

module.exports = {
  create,
  getById,
  getByCategory,
  getBySubCategory,
  getAll,
  getAllVerified,
  getByUserId,
  getRelevant,
  getNearBy,
  verifyPost,
  markAsSold,
  unVerifyPost,
  _delete,forceDelete,
  getTotal
};

// FOR CREATING NEW POSTS
var storage = multer.diskStorage({
  destination: async function(req, file, callback) {
    callback(null, "./adPhotos/Properties");
  },
  filename: function(req, file, callback) {
    if(file.mimetype=="application/octet-stream")
    { callback(
      null,
      file.fieldname + "_" + Date.now() + "." + "mov"
    );}
    else
    callback(
      null,
      file.fieldname + "_" + Date.now() + "." + file.mimetype.substring(6)
    );
  }
});

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024*1024*1024
  },
  fileFilter: function(req, file, cb) {
    console.log("using multer");
    let fileExts = ["png", "jpg", "jpeg", "mp4","mov",'3gp'];
   helper.sanitizeFile(file, cb, fileExts);
  }
}).fields([{ name: "images", maxCount: 20 }, { name: "videos", maxCount: 1 }]);

async function create(req, res) {
  return new Promise((resolve, reject) => {
    //console.log(req);
    upload(req, res, async function(err) {
      if (err) {
        //reject(err);
        resolve({ success: false, message: "Upload Error",err:err });
        return;
      } else {
      //  console.log(req.files);
        const schema = Joi.object().keys({
          userId: Joi.string().required(),
          categoryId: Joi.string().required(),
          subcategoryId: Joi.string().required(),
          title: Joi.string().required(),
          description: Joi.string().required(),
          price: Joi.number()
            .min(1)
            .required(),
          location: Joi.object().keys({        
            latitude: Joi.number()
              .min(-90)
              .max(90)
              .required(),
            longitude: Joi.number()
              .min(-180)
              .max(180)
              .required()
          }),
          parameters: Joi.object()
          // parameters: Joi.object().keys({
          //   key: Joi.string(),
          //   value: Joi.string()
          // })
        });
        const { result, error } = schema.validate(req.body);
        if (error) resolve({ success: false, message: "Invalid payload",err:error });
        const { subcategoryId } = req.body;
        const postParam = req.body;
        //console.log(req.body);
        console.log(req.files);
        try {
          var subcategory = await SubCategory.findById(subcategoryId);
          if (subcategory) {
            const fields = subcategory.parameters;
            const post = new Post();
            post.userId = postParam.userId;
            post.user=postParam.userId;
            post.categoryId = postParam.categoryId;
            post.subcategoryId = postParam.subcategoryId;
            post.title = postParam.title;
            post.description = postParam.description;
            post.card_string = "card string";
            post.price = {
              value: postParam.price,
              display_price: "₹" + postParam.price
            };
            post.posted_on= new Date();

            const location = JSON.parse(postParam.location);

            if (location.latitude && location.longitude) {
              //Calling Google map service to convert latitude,longitude to user's address
              await gmap
                .getAddress(location.latitude, location.longitude)
                .then(res => {
                  const data = res[0];
                  const {
                    latitude,
                    longitude,
                    administrativeLevels,
                    extra,
                    ...location
                  } = data;
                  console.log("Location : ", data);
                  post.location = {
                    country: { name: data.country },
                    state: { name: administrativeLevels.level1long },
                    city: { name: data.city },
                    address: data.formattedAddress,
                    zipcode: data.zipcode,
                    coordinates: [data.latitude, data.longitude],
                   
                  };
                  post.location.geoData={coordinates: [data.latitude, data.longitude]}
                })
                .catch(err => {
                  console.log(err);
                });
            } 


            var rootDir = constants.AdDataFolder + postParam.userId; //User Directory
            var postDir = rootDir + "/" + post._id; //Ad Directory
            var thumbDir = postDir + constants.ThumbFolder; //Thumb Directory for storing the video thumbnails

            if (!fs.existsSync(rootDir)) {
              fs.mkdirSync(rootDir);
            }
            if (!fs.existsSync(postDir)) {
              fs.mkdirSync(postDir);
            }
            if (!fs.existsSync(thumbDir)) {
              fs.mkdirSync(thumbDir);
            }           

            try {
              const parameters = JSON.parse(postParam.parameters);

              console.log(fields);
              console.log(parameters);
              post.parameters = {};
              fields.forEach(element => {
               
                var result = parameters[element.key];
              
                if (element.is_required && !result) {                 
                  console.log("Parameter missing");
                  return;
                }

                if (result) {
                  const value = result.value;            

                  switch (element.control_type) {
                    case "TEXT":
                    case "TEXTAREA":
                      if (element.min && element.max) {
                        if (
                          value.length >= element.min &&
                          value.length <= element.max
                        ) {
                          post.parameters[result.key] = result.value;                        
                        } else 
                        reject({success:false,message:element.error_msg});
                      } else post.parameters[result.key] = result.value;
                      // post.parameters.push(result);
                      break;
                    case "NUMBER":
                      if (element.min && element.max) {
                        if (value >= element.min && value <= element.max) {
                          post.parameters[result.key] = result.value;
                          //post.parameters.push(result);
                          console.log("parameter is pushed");
                        }
                      } else
                        reject({success:false,message:"The value is not in the specified range" + value.length});
                      break;
                    case "SELECT":
                      post.parameters[result.key] = result.value;                    
                      break;
                    case "BUTTON_LIST":
                      post.parameters[result.key] = result.value;                   
                      break;
                    case "RANGE_SLIDER":
                      post.parameters[result.key] = result.value;                    
                      break;
                    default:
                      break;
                  }
                }
              });
             
            } 
            catch (err) {
              console.log(err);
              console.log("error in catch 1");
            }
           
             Promise.all([uploadImages(req.files.images,postDir),uploadVideos(req.files.videos,postDir)]).then(res=>{
            
                const imageArr=res[0];
                const videoArr=res[1];
                post.images=imageArr;
                post.videos=videoArr?videoArr:[];
                post.thumbnail = (imageArr.length>0)? imageArr[0].url:"";
                console.log(res);          
                     
                 post
              .save()
              .then((res) => {
                console.log('Post saved');                 
                 
                if (fs.existsSync(thumbDir)) {
                  fs.rmdirSync(thumbDir);                
                }
                if (fs.existsSync(postDir)) {
                  fs.rmdirSync(postDir);                
                }
               
                
                resolve({success :true,message:"Post created successfully",post:res});
              })
              .catch(err => {
                console.log("error in saving");
                console.log(err);
                resolve({success :true,message:"Post created successfully",post:res});
               
              });
              }).catch(err=>{
                console.log("error in resolving all promises");
                console.log(err);})         
          }
        } catch (err) {
          console.log(err);
          console.log("error in catch 2");
        }
      }
    });
  }).catch(error => {
    console.log(error);
    console.log("error in catch 3");
    throw error;
  });
}

function uploadVideos(videos,postDir)
{
  console.log(videos);
    let vidkey=0;
      var thumbDir = postDir + constants.ThumbFolder; 
      let videoArr=videos&&videos.map((video)=>{

        var filepath = video.destination + "/" + video.filename; 
        helper.moveFile(filepath, postDir); 
        let newPath = postDir + "/" + video.filename;

        let thumbPath =thumbDir + "/" + video.filename.split(".")[0] + ".png";

            return genThumbnail(newPath, thumbPath, "250x?", { path: ffmpeg.path })
          .then(res => {
          
            const thumbdata={name:thumbPath,path:thumbPath,mimetype:'image/png'}      
            return awss3.uploadFile(thumbdata).then(thumb=>{          
           fs.unlinkSync(thumbPath);
           const videodata={name:newPath,path:newPath,mimetype:video.mimetype}      
            return  awss3.uploadFile(videodata).then(vdo=>{ 
              fs.unlinkSync(newPath);
              const item=  {
                key: vidkey++,
                thumb: thumb.Location,
                url: vdo.Location
              };          
            return item;
          })   
         })
        })
          .catch(err => console.error(err));      
      })

     return Promise.all(videoArr)
      .then ( results=>{
      console.log('Logging video array : ');
      console.log(results);
      return results;  
      }).catch(err=>{
        console.log(err);
      })
   
}

function uploadImages(images,postDir)
{

    let imgkey=0;
    let imageArr= images.map(image => {

    var filepath = image.destination + "/" + image.filename;         
   
    var thumbPath=postDir + constants.ThumbFolder + "/" + image.filename;
    var imagePath=postDir +"/" +image.filename;
    var thumbDir = postDir + constants.ThumbFolder;

return Jimp.read(filepath).then(lenna=>{
     lenna
      .resize(120, 120)                      
      .write(thumbDir + "/" + image.filename); // save
       helper.moveFile(filepath, postDir);
      const thumbdata={name:thumbPath,path:thumbPath,mimetype:'image/jpg'}      
      return awss3.uploadFile(thumbdata).then(thumb=>{         
        fs.unlinkSync(thumbPath);
        const imagedata={name:imagePath,path:imagePath,mimetype:image.mimetype}      
        return awss3.uploadFile(imagedata).then(img=>{  
          fs.unlinkSync(imagePath);   
           const item=  {
             key: imgkey++,
             thumb: thumb.Location,
             url: img.Location
           };
            
         return item;
           })
         })          
         });  
})
return Promise.all(imageArr)
.then ( results=>{
  console.log('Logging image results');
  console.log(results);
return results;  
}).catch(err=>{
  console.log(err);
})  
}




//For getting All Posts
async function getAllVerified(params) {
  const schema = Joi.object().keys({
    categoryId:Joi.string().alphanum().min(24).max(24),
    subcategoryId: Joi.string().alphanum().min(24).max(24),
    userId:Joi.string().alphanum().min(24).max(24),
    pageNo:Joi.number().min(1),
    size:Joi.number().min(1)
  });

  const favParam = params;
  const { error, value } = schema.validate(favParam);
  if (error) {
      throw error;          
  }
   var pageNo = parseInt(params.pageNo)
  var size = parseInt(params.size)  
  var skip = size * (pageNo - 1)
  try {
    if(params.pageNo&&params.size)
{
  if(params.categoryId)
    {
      return await Post.find({categoryId:params.categoryId,verified:true,deleted:false}).sort({posted_on:-1}).skip(skip).limit(size).populate('user','profile');
    }
    else if(params.subcategoryId)
    {
      return await Post.find({subcategoryId:params.subcategoryId,verified:true,deleted:false}).sort({posted_on:-1}).skip(skip).limit(size).populate('user','profile');
    }
    else if(params.userId)
    {
      return await Post.find({userId:params.userId,verified:true,deleted:false}).sort({posted_on:-1}).skip(skip).limit(size).populate('user','profile');
    }
    else { 
       return await Post.find({deleted:false,verified:true}).sort({posted_on:-1}).skip(skip).limit(size).populate('user','profile');
      }
}
else {
    if(params.categoryId)
    {
      return await Post.find({categoryId:params.categoryId,deleted:false,verified:true}).sort({posted_on:-1}).populate('user','profile');
    }
    else if(params.subcategoryId)
    {
      return await Post.find({subcategoryId:params.subcategoryId,deleted:false,verified:true}).sort({posted_on:-1}).populate('user','profile');
    }
    else if(params.userId)
    {
      return await Post.find({userId:params.userId,deleted:false,verified:true}).sort({posted_on:-1}).populate('user','profile');
    }
    else { 
       return await Post.find({deleted:false,verified:true}).sort({posted_on:-1}).populate('user','profile');
      }
    }

  } catch {
    throw "Error in getting Post.";
  }
} 

//For getting All Posts
async function getAll(params) {
  const schema = Joi.object().keys({
    categoryId:Joi.string().alphanum().min(24).max(24),
    subcategoryId: Joi.string().alphanum().min(24).max(24),
    userId:Joi.string().alphanum().min(24).max(24),
    pageNo:Joi.number().min(1),
    size:Joi.number().min(1)
  });

  const favParam = params;
  const { error, value } = schema.validate(favParam);
  if (error) {
      throw error;          
  }
   var pageNo = parseInt(params.pageNo)
  var size = parseInt(params.size)  
  var skip = size * (pageNo - 1)
  try {
    if(params.pageNo&&params.size)
{
  if(params.categoryId)
    {
      return await Post.find({categoryId:params.categoryId,deleted:false}).sort({posted_on:-1}).skip(skip).limit(size).populate('user','profile');
    }
    else if(params.subcategoryId)
    {
      return await Post.find({subcategoryId:params.subcategoryId,deleted:false}).sort({posted_on:-1}).skip(skip).limit(size).populate('user','profile');
    }
    else if(params.userId)
    {
      return await Post.find({userId:params.userId,deleted:false}).sort({posted_on:-1}).skip(skip).limit(size).populate('user','profile');
    }
    else { 
       return await Post.find({deleted:false}).sort({posted_on:-1}).skip(skip).limit(size).populate('user','profile');
      }
}
else {
    if(params.categoryId)
    {
      return await Post.find({categoryId:params.categoryId,deleted:false}).sort({posted_on:-1}).populate('user','profile');
    }
    else if(params.subcategoryId)
    {
      return await Post.find({subcategoryId:params.subcategoryId,deleted:false}).sort({posted_on:-1}).populate('user','profile');
    }
    else if(params.userId)
    {
      return await Post.find({userId:params.userId,deleted:false}).sort({posted_on:-1}).populate('user','profile');
    }
    else { 
       return await Post.find({deleted:false}).sort({posted_on:-1}).populate('user','profile');
      }
    }

  } catch {
    throw "Error in getting Post.";
  }
} 

//For getting All Posts
async function getNearBy(params) {
  const schema = Joi.object().keys({
    latitude:Joi.string(),
    longitude:Joi.string(),
    pageNo:Joi.number().min(1),
    size:Joi.number().min(1)
  });

  const favParam = params;
  const { error, value } = schema.validate(favParam);
  if (error) {
      throw error;          
  }
   var pageNo = parseInt(params.pageNo)
  var size = parseInt(params.size)  
  var skip = size * (pageNo - 1)
  try {
    if(params.pageNo&&params.size)
{
   if(params.userId)
    {
      return await Post.find({"location.geoData": {$near: {$geometry: { type: "Point" , coordinates: [ params.latitude ,params.longitude]},deleted:false}}}).sort({posted_on:-1}).skip(skip).limit(size).populate('user','profile');
    }
    else { 
       return await Post.find({"location.geoData": {$near: {$geometry: { type: "Point" , coordinates: [ params.latitude ,params.longitude]},deleted:false}}}).sort({posted_on:-1}).skip(skip).limit(size).populate('user','profile');
      }
}
else {  
    
       return await Post.find({deleted:false}).sort({posted_on:-1}).populate('user','profile');      
    }

  } catch {
    throw "Error in getting Post.";
  }
} 


//For getting Posts by ID 
async function getById(id) {
  try {
  //console.log(id);
   return await Post.findById(id).populate('user','profile');
   
  } catch(err) {
    console.log(err);
    throw "Error in getting Post.";
  }
} 

//For getting Posts by User ID 
async function getByUserId(id) {
  try {  
   return await Post.find({userId:id,deleted:false}).sort({posted_on:-1}); 
   
  } catch(err) {
    console.log(err);
    throw "Error in getting Post.";
  }
} 

//For getting Posts by Category ID 
async function getByCategory(id) {
  try {
    return await Post.find({categoryId:id,deleted:false}).sort({posted_on:-1}).populate('user','profile');
  } catch {
    throw "Error in getting Post.";
  }
}

//For getting Posts by Subcategory ID
async function getBySubCategory(id) {
  try {
    return await Post.find({subcategoryId:id,deleted:false}).sort({posted_on:-1}).populate('user','profile');
  } catch {
    throw "Error in getting Post.";
  }
}

 function verifyPost(id) {
  return new Promise((resolve,reject)=>{
    Post.findById(id).then(post=>{
      if(!post)
     { reject("Post not found");
    return;}
      post.verified=true;
     return post.save().then(res=>{
        notificationService.onPostVerified(post);
        resolve({success:true,message:"Post verified"});
      });
    
    });
  }) 
}

function unVerifyPost(id) {
  return new Promise((resolve,reject)=>{
    Post.findById(id).then(post=>{
      if(!post)
      reject("Post not found");
      post.verified=false;
      post.save();
      resolve({success:true,message:"Post rejected"});
    });
  }) 
}

function markAsSold(req) {
  const schema = Joi.object().keys({   
    postId: Joi.string().alphanum().min(24).max(24),
    userId:Joi.string().alphanum().min(24).max(24)  
  });

  const postParam = req.body;
  const { error, value } = schema.validate(postParam);
  if (error) {
      throw error;          
  }
console.log(req.body);
  return new Promise((resolve,reject)=>{
    const {userId,postId}=postParam;
    Post.findById(postId).then(post=>{
      if(!post)
     { reject({success:false,message: "Post not found"});
    return;
  }
  else if(post.userId!=userId)
  {
    reject({success:false,message: "Post cannot be marked as sold."});
    return;
  }
else {
      post.sold=true;
     return post.save().then(res=>{
       // notificationService.onPostVerified(post);
        resolve({success:true,message:"Post marked as sold!"});
      });
    }    
    });
  }) 
}

 function _delete(id) {
  return new Promise((resolve,reject)=>{
    Post.findById(id).then(post=>{
      if(!post)
      reject("Post not found");
      post.deleted=true;
      post.save();
      resolve({success:true,message:"Post deleted"});
    });
  }) 
}


function forceDelete(id) {
  return new Promise((resolve,reject)=>{
    Post.remove({_id: id }).then(post=>{
      if(!post)
      reject("Post not found");   
      resolve({success:true,message:"Post deleted"});
    });
  }) 
}

async function getRelevant(params) {
  const schema = Joi.object().keys({   
    userId:Joi.string().alphanum().min(24).max(24),
    latitude: Joi.number().min(-90).max(90),
    longitude: Joi.number().min(-180).max(180),              
    pageNo:Joi.number().min(1),
    size:Joi.number().min(1)
  });
console.log(params);
//  const postParam = params;
  const { error, value } = schema.validate(params);
  if (error) {
      throw error;          
  }
   var pageNo = parseInt(params.pageNo)
  var size = parseInt(params.size)  
  var skip = size * (pageNo - 1)
  try {

  const filters=await Filters.findOne({userId:params.userId});
  if(!filters)
  return await Post.find({deleted:false}).sort({posted_on:-1}).skip(skip).limit(size).populate('user','profile');
  else {

var query={verified:true,deleted:false};
if(filters.categories)
{
 query["categoryId"]={$in:filters.categories}
}
if(filters.price.min)
{
  query["price.value"]={$gte:filters.price.min}
}
if(filters.price.max)
{
  query["price.value"]={$lte:filters.price.max}
}
if(filters.price.min&&filters.price.max)
{
  query["price.value"]={$gte:filters.price.min,$lte:filters.price.max}
}
if(filters.state)
{  
  query["location.state.name"]=filters.state;
}
if(filters.city)
{
  query["location.city.name"]=filters.city;
}
if(filters.range&& params.latitude&&params.longitude)
{
  query["location.geoData"]= {
     $near: {
       $geometry: {
          type: "Point" ,
          coordinates: [ params.latitude , params.longitude ]
       },
       
     }
   }
 }

console.log(query);

var sortOptions={posted_on:-1};
if(filters.sortBy==="highest_reviewed")
{
  sortOptions["reviews"]=-1;
}
else if(filters.sortBy=="priceLowest")
{
sortOptions["price.value"]=-1;
}
else if(filters.sortBy=="priceHighest")
{
sortOptions["price.value"]=1;
}

console.log(sortOptions);
 if(params.pageNo&&params.size)
return await Post.find(query).sort(sortOptions).skip(skip).limit(size).populate('user','profile');
else return await Post.find(query).sort(sortOptions).populate('user','profile');
} 


   //const favorite=await Favorite.findById(params.userId,{subcategories:1});   
  //  if(params.pageNo&&params.size)
  //  {
  //    if(favorite)
  //   {  return await Post.find({subcategoryId:{$in:favorite.subcategories},deleted:false}).sort({posted_on:-1}).skip(skip).limit(size).populate('user','profile');}
  //   else  {  return await Post.find({deleted:false}).sort({posted_on:-1}).skip(skip).limit(size).populate('user','profile');}
  //  } else {
  //   if(favorite)
  //     return await Post.find({subcategoryId:{$in:favorite.subcategories},deleted:false}).sort({posted_on:-1}).populate('user','profile');
  //     else   return await Post.find({deleted:false}).sort({posted_on:-1}).populate('user','profile');
  //   }
  } 
  catch(err) {
    console.log(err);
    throw "Error in getting Post.";
  }
}

function getTotal() {
  return new Promise( (resolve, reject) => { 
   Post.aggregate([{$count:"count"}]).then(res=>{
    resolve({success:true,count: res[0].count})
   }).catch(err=>{
      reject(err);  
  })  
  });
}