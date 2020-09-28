const Joi = require("@hapi/joi");
const db = require("../_helpers/db");

const SubCategory = db.SubCategory;
const Suggestion = db.Suggestion;

module.exports = {
  getAll,
  getById,
  getByCategory,
  getBySubCategory,
  add,
  update,
  delete: _delete
};

//For getting suggestions by ID
async function getById(id) {
  try {
    return await Suggestion.findById(id);
  } catch {
    throw "Error in getting Suggestions.";
  }
}
//For getting suggestions by Category ID
async function getByCategory(id) {
  try {
    return await Suggestion.find({ categoryId: id });
  } catch {
    throw "Error in getting Suggestions.";
  }
}

//For getting suggestions by Subcategory ID
async function getBySubCategory(id) {
  try {
    return await Suggestion.find({ subcategoryId: id });
  } catch {
    throw "Error in getting Suggestions.";
  }
}


//For getting All Posts
async function getAll(params) {
    try {
      
      if(params.categoryId)
      {
        return await Suggestion.find({categoryId:params.categoryId});
      }
      else if(params.subcategoryId)
      {
        return await Suggestion.find({subcategoryId:params.subcategoryId});
      }
      else if(params.query)
      {
          return await Suggestion.find({keywords: {$regex: params.query, $options: 'i'}},{ score : { $meta: "textScore" } }).limit(10);
       // return await Suggestion.find({keywords:'/'+params.query+'/'});
      }
      else {  return await Suggestion.find({},{categoryId:1,subcategoryId:1,title:1,keywords:1});}
  
    } catch {
      throw "Error in getting Post.";
    }
  } 

async function add(req, res) {
  return new Promise( (resolve, reject) => {
    const schema = Joi.object().keys({
      categoryId: Joi.string().required(),
      subcategoryId: Joi.string().required(),
      title: Joi.string().required(),
      keywords: Joi.string().required()
    });
    const suggestionParam = req.body;

    //Validating the schema
    const { error, value } = schema.validate(suggestionParam);
    //If the request is not in the expected format
    if (error) {
      reject(error);
      return;
    }
    const { categoryId, subcategoryId, title, keywords } = suggestionParam;
    //Finding if the category exists in which we are adding the properties
    SubCategory.findOne({
      _id: subcategoryId,
      "category_id": categoryId
    }).then(async subcategory => {
        console.log(subcategory);
      if (!subcategory) {
        //Reject the promise if the category ID and Subcategory ID is wrong
        reject("Category not found");
        return;
      }

      const suggestion = new Suggestion();
      suggestion.categoryId = categoryId;
      suggestion.subcategoryId = subcategoryId;
      suggestion.title = title;
      suggestion.keywords = keywords;
      suggestion
        .save()
        .then(res => {
          resolve({ success: true, message: "Suggestion added successfully." });
        })
        .catch(err => {
          resolve({ success: false, message: err });
        });
    });
  });
}

async function update(req, res) {
  return new Promise(async (resolve, reject) => {
    const schema = Joi.object().keys({
      id: Joi.string().required(),
      title: Joi.string().required(),
      keywords: Joi.string().required()
    });
    const suggestionParam = req.body;

    //Validating the schema
    const { error, value } = schema.validate(suggestionParam);
    //If the request is not in the expected format
    if (error) {
      reject(error);
      return;
    }
    const { id, title, keywords } = suggestionParam;
    await Suggestion.updateOne(
      { _id: id },
      { title: title, keywords: keywords }
    )
      .then(res => {
        resolve({
          success: true,
          message: "Suggestion updated successfully."
        });
      })
      .catch(err => {
        reject(err);
      });
  });
}

//--------------------------DELETE Suggestion----------------------------------
async function _delete(req) {
  return new Promise(async (resolve, reject) => {
     const schema = Joi.object().keys({
      suggestionId: Joi.string().required()
    
    });
    const suggestionParam = req.body;

    //Validating the schema
    const { error, value } = schema.validate(suggestionParam);
    //If the request is not in the expected format
    if (error) {
      reject(error);
      return;
    }
    const { suggestionId } = suggestionParam;
   // return Suggestion.delete()
    return Suggestion.remove({_id: suggestionId })
      .then(sugg => {
        resolve({ success: true, message: "Suggestion removed." });
      })
      .catch(err => {
        console.log(err);
        reject("Error in removing suggestion.");
      });
  });
}
