const Joi = require("@hapi/joi");
const db = require("_helpers/db");
var fs = require("fs");
var multer = require("multer");
const helper = require("../_helpers/helper");
const SubCategory = db.SubCategory;
const Category=db.Category;


module.exports = {
  getAll,
  getById, 
  getByCategory,
  create,
  update,
  updateImages,
  delete: _delete
};

async function getAll() { 
 return await SubCategory.find({}, { isDeleted: false });
}

async function getById(id) {
  try {
    return await SubCategory.findById(id);
  } catch {
    throw "Error in getting SubCategory.";
  }
}
async function getByCategory(id) {
    try {
      return await SubCategory.find({category_id :id});
    } catch(err) {
      console.log(err);
      throw "Error in getting SubCategory.";
    }
  }

var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, "./images/Categories");
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
    let fileExts = ["png", "jpg", "jpeg"];
    helper.sanitizeFile(file, cb, fileExts);
  }
}).fields([{ name: "icon", maxCount: 1 }, { name: "banner", maxCount: 1 }]);

async function create(req, res) {  
  return new Promise(async (resolve, reject) => {
    await upload(req, res, async function(err) {
      if (err) {
        reject(err);
        return;
      }
      const schema = Joi.object().keys({
        category_id:Joi.string().alphanum().min(24).max(24).required(),
        name: Joi.string().required(),
        display_index: Joi.number().required(),
        photo_limit:Joi.object().keys({min:Joi.number(),max:Joi.number()}),
        card_display_string:Joi.string(),
        description: Joi.string(),
        sorting_options: Joi.array().items(
          Joi.object().keys({ key: Joi.number(), name: Joi.string() })
        ),
        parameters: Joi.array().items(
          Joi.object().keys({  
            key:Joi.string(),         
            name: Joi.string(),
            label:Joi.string(),
            display_index:Joi.number(),
            control_type: Joi.valid('TEXT', 'NUMBER', 'SELECT','TEXTAREA','BUTTON_LIST','RANGE_SLIDER'),
            values: Joi.array().items(
            Joi.object().keys({ key: Joi.number(),
                 name: Joi.string() })
          ),
            is_required:Joi.boolean(),
            error_msg:Joi.string(),
            min: Joi.number(),
            max: Joi.number()
          })
        ),
        icon: Joi.object(),
        banner: Joi.object()
      });
      const subcatParam = req.body;
      const { error, value } = schema.validate(subcatParam);
      if (error) {
        reject(error);
        return;
      }
      const {category_id,
              name,
              display_index,
              photo_limit,
              card_display_string,
              description,             
              sorting_options,
              parameters
            } = subcatParam;
      await Category.findById(category_id).then(async(category)=>{
          if(!category)
          {
              resolve({success:false,message:"Invalid category Id."})
          }
        await SubCategory.findOne({ name: name })
        .then(async subcategory => {
          if (subcategory) {
            resolve({
              success: false,
              message: "SubCategory already exists! Please use a different name"
            });            
          }
           else {     
             
            const subcategory = new SubCategory();  
            category.subcategories.push(subcategory._id);
            subcategory.category_id=category_id;
            subcategory.name = name;
            subcategory.key =helper.createKeyfromName(name);           
            subcategory.display_index = display_index;
            subcategory.photo_limit=JSON.parse(photo_limit);
            subcategory.card_display_string=card_display_string;
            subcategory.description = description;
            subcategory.sorting_options = JSON.parse(sorting_options);         
            subcategory.parameters = JSON.parse(parameters);            
            const baseurl = helper.getServerUrl(req) + "images/Categories/";
            req.files.icon&&(  subcategory.icon = baseurl + req.files.icon[0].filename);
            req.files.banner&&( subcategory.banner = baseurl + req.files.banner[0].filename);
            await subcategory
              .save()
              .then(subcat => {
                category.save();
                resolve({
                  success: true,
                  message: "SubCategory added successfully!"
                });
              })
              .catch(err => {
                console.log(err);
                reject(err);
              });
          }
        })
        .catch(err => {
          reject(err);
          return;
        });
      }).catch((err)=>{reject(err)});    
    });
  });
}

async function update(req, res) {  
  return new Promise(async (resolve, reject) => {
    const schema = Joi.object().keys({
       id: Joi.string()
          .alphanum().min(24).max(24)
          .required(),
     
        name: Joi.string().required(),
        display_index: Joi.number().required(),
        photo_limit:Joi.object().keys({min:Joi.number(),max:Joi.number()}),
        card_display_string:Joi.string(),
        description: Joi.string(),
        sorting_options: Joi.array().items(
          Joi.object().keys({ key: Joi.number(), name: Joi.string() })
        ),
        parameters: Joi.array().items(
          Joi.object().keys({  
            key:Joi.string(),         
            name: Joi.string(),
            label:Joi.string(),
            display_index:Joi.number(),
            control_type: Joi.valid('TEXT', 'NUMBER', 'SELECT','TEXTAREA','BUTTON_LIST','RANGE_SLIDER'),
            values: Joi.array().items(
            Joi.object().keys({ key: Joi.number(),
                 name: Joi.string() })
          ),
            is_required:Joi.boolean(),
            error_msg:Joi.string(),
            min: Joi.number(),
            max: Joi.number()
          })
        ),
        icon: Joi.object(),
        banner: Joi.object()
      });
      const subcatParam = req.body;
      const { error, value } = schema.validate(subcatParam);
      if (error) {
        reject(error);
        return;
      }
      const {id,
            name,
            display_index,
            photo_limit,
            card_display_string,
            description,             
            sorting_options,
            parameters
          } = subcatParam;

      await SubCategory.findById(id)
        .then(async subcategory => {      
          if (!subcategory) 
          {
            resolve({ success: false, message: "SubCategory not found!"});          
          }               
          
            if(name){
            SubCategory.findOne({name:name}).then(subcat=>{
              if(subcat)
              {
                resolve({success:false,
                  message :'A subcategory with this name already exists. Please choose a different name...'});
              }
            }).catch(err=>{reject(err)});
          }
       
        name&& (subcategory.name = name);
        name&&(subcategory.key =helper.createKeyfromName(name));
        display_index&&( subcategory.display_index = display_index);
        photo_limit&&( subcategory.photo_limit=JSON.parse(photo_limit));
        card_display_string&&( subcategory.card_display_string=card_display_string);
        description&&( subcategory.description = description);
        sorting_options&&(subcategory.sorting_options = JSON.parse(sorting_options));         
        parameters&&(   subcategory.parameters = JSON.parse(parameters));   
        await subcategory
            .save()
            .then(subcat => {
              resolve({
                success: true,
                message: "SubCategory updated successfully!"
              });
            })
            .catch(err => {
              console.log(err);
              reject(err);
            });                   
        })
        .catch(err => {
          reject(err);
          return;
        });
    });
}

async function updateImages(req, res) {
  return new Promise(async (resolve, reject) => {
    await upload(req, res, async function(err) {
      if (err) {
        reject(err);
        return;
      }
      const schema = Joi.object().keys({
        id: Joi.string()
          .alphanum().min(24).max(24)
          .required(),
        icon: Joi.object(),
        banner: Joi.object()
      });
      const subCatParam = req.body;
      const { error, value } = schema.validate(subCatParam);
      if (error) {
        reject(error);
        return;
      }
      await SubCategory.findById(subCatParam.id)
        .then(async subCategory => {
          if (!subCategory) {
            resolve({ success: false, message: "Sub Category not found!" });
          }
          const baseurl = helper.getServerUrl(req) + "images/Categories/";      
          if(req.files.icon)
          subCategory.icon = baseurl + req.files.icon[0].filename;
          if(req.files.banner)
          subCategory.banner = baseurl + req.files.banner[0].filename;
          await subCategory
            .save()
            .then(() => {
              resolve({
                success: true,
                message: "Category updated successfully!"
              });
            })
            .catch(err => {             
              reject(err);
            });
        })
        .catch(err => {
          reject(err);
          return;
        });
    });
  });
}

async function _delete(id) {
  return new Promise(async (resolve, reject) => {
    if(id.length!=24)reject("Invalid Id")

    await SubCategory.findById(id)
      .then( subCategory => {       
        if (!subCategory)
          resolve({ success: false, message: "SubCategory not found" });
          subCategory.isDeleted = true;
          subCategory.save();       
          resolve({ success: true, message: "SubCategory Deleted!" });        
      })
      .catch(err => {
        reject(err);
      });
  });
}
