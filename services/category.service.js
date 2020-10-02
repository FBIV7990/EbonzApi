const Joi = require("@hapi/joi");
const db = require("_helpers/db");
var fs = require("fs");
var multer = require("multer");
const helper = require("../_helpers/helper");
const Category = db.Category;
const SubCategory = db.SubCategory;

module.exports = {
  getAll,
  getById,
  create,
  update,
  updateImages,
  delete: _delete,
};

async function getAll() {
  return await Category.find({}, { isDeleted: false }).populate(
    "subcategories"
  );
}

async function getById(id) {
  try {
    return await Category.findById(id).populate("subcategories");
  } catch (err) {
    throw err;
  }
}

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./images/Categories");
  },
  filename: function (req, file, callback) {
    callback(
      null,
      file.fieldname + "_" + Date.now() + "." + file.mimetype.substring(6)
    );
  },
});

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000,
  },
  fileFilter: function (req, file, cb) {
    let fileExts = ["png", "jpg", "jpeg"];
    helper.sanitizeFile(file, cb, fileExts);
  },
}).fields([
  { name: "icon", maxCount: 1 },
  { name: "banner", maxCount: 1 },
]);

async function create(req, res) {
  return new Promise(async (resolve, reject) => {
    await upload(req, res, async function (err) {
      if (err) {
        reject(err);
        return;
      }
      console.log(req.body);
      const schema = Joi.object().keys({
        name: Joi.string().required(),
        display_index: Joi.number().required(),
        description: Joi.string(),
        sorting_options: Joi.array().items(
          Joi.object().keys({ key: Joi.number(), name: Joi.string() })
        ),
        parameters: Joi.array().items(
          Joi.object().keys({
            key: Joi.string(),
            name: Joi.string(),
            label: Joi.string(),
            display_index: Joi.number(),
            control_type: Joi.valid(
              "TEXT",
              "NUMBER",
              "SELECT",
              "TEXTAREA",
              "BUTTON_LIST",
              "RANGE_SLIDER"
            ),
            values: Joi.array().items(
              Joi.object().keys({ key: Joi.number(), name: Joi.string() })
            ),
            is_required: Joi.boolean(),
            error_msg: Joi.string(),
            min: Joi.number(),
            max: Joi.number(),
          })
        ),
        icon: Joi.object(),
        banner: Joi.object(),
      });
      const catParam = req.body;
      const { error, value } = schema.validate(catParam);
      if (error) {
        reject(error);
        return;
      }
      await Category.findOne({ name: catParam.name })
        .then(async (category) => {
          if (category) {
            reject({
              success: false,
              message: "Category already exists! Please use a different name",
            });
            return;
          } else {
            const {
              name,
              display_index,
              description,

              sorting_options,
              parameters,
            } = catParam;

            const category = new Category();
            category.name = name;
            category.key = helper.createKeyfromName(name);
            category.display_index = display_index;
            category.description = description;

            category.sorting_options = JSON.parse(sorting_options);
            category.parameters = JSON.parse(parameters);
            const baseurl = helper.getServerUrl(req) + "images/Categories/";
            req.files.icon &&
              (category.icon = baseurl + req.files.icon[0].filename);
            req.files.banner &&
              (category.banner = baseurl + req.files.banner[0].filename);
            await category
              .save()
              .then((category) => {
                resolve({
                  success: true,
                  message: "Category saved successfully!",
                });
              })
              .catch((err) => {
                console.log(err);
                reject(err);
              });
          }
        })
        .catch((err) => {
          reject(err);
          return;
        });
    });
  });
}

async function update(req, res) {
  const schema = Joi.object().keys({
    id: Joi.string().alphanum().min(24).max(24).required(),
    name: Joi.string(),
    display_index: Joi.number(),
    description: Joi.string(),
    sorting_options: Joi.array().items(
      Joi.object().keys({ key: Joi.number(), name: Joi.string() })
    ),
    parameters: Joi.array().items(
      Joi.object().keys({
        key: Joi.string(),
        name: Joi.string(),
        label: Joi.string(),
        display_index: Joi.number(),
        control_type: Joi.valid(
          "TEXT",
          "NUMBER",
          "SELECT",
          "TEXTAREA",
          "BUTTON_LIST",
          "RANGE_SLIDER"
        ),
        values: Joi.array().items(
          Joi.object().keys({ key: Joi.number(), name: Joi.string() })
        ),
        is_required: Joi.boolean(),
        error_msg: Joi.string(),
        min: Joi.number(),
        max: Joi.number(),
      })
    ),
  });
  return new Promise(async (resolve, reject) => {
    const catParam = req.body;
    const { error, value } = schema.validate(catParam);
    if (error) {
      reject(error);
      return;
    }
    await Category.findById(catParam.id)
      .then(async (category) => {
        if (!category) {
          resolve({ success: false, message: "Category not found!" });
        }

        const {
          name,
          display_index,
          description,
          sorting_options,
          parameters,
        } = catParam;
        if (name) {
          Category.findOne({ name: name })
            .then((cat) => {
              if (cat) {
                resolve({
                  success: false,
                  message:
                    "An category with this name already exists. Please choose a different name...",
                });
              }
            })
            .catch((err) => {
              reject(err);
            });
        }

        name && (category.name = name);
        name && (category.key = helper.createKeyfromName(name));
        display_index && (category.display_index = display_index);
        description && (category.description = description);
        sorting_options &&
          (category.sorting_options = JSON.parse(sorting_options));
        parameters && (category.parameters = JSON.parse(parameters));
        await category
          .save()
          .then((category) => {
            resolve({
              success: true,
              message: "Category updated successfully!",
            });
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
        return;
      });
  });
}

async function updateImages(req, res) {
  return new Promise(async (resolve, reject) => {
    await upload(req, res, async function (err) {
      if (err) {
        reject(err);
        return;
      }
      const schema = Joi.object().keys({
        id: Joi.string().alphanum().min(24).max(24).required(),
        icon: Joi.object(),
        banner: Joi.object(),
      });
      const catParam = req.body;
      const { error, value } = schema.validate(catParam);
      if (error) {
        reject(error);
        return;
      }
      await Category.findById(catParam.id)
        .then(async (category) => {
          if (!category) {
            resolve({ success: false, message: "Category not found!" });
          }

          const baseurl = helper.getServerUrl(req) + "images/Categories/";
          console.log(req.files);
          if (req.files.icon)
            category.icon = baseurl + req.files.icon[0].filename;
          if (req.files.banner)
            category.banner = baseurl + req.files.banner[0].filename;
          await category
            .save()
            .then((category) => {
              resolve({
                success: true,
                message: "Category updated successfully!",
              });
            })
            .catch((err) => {
              reject(err);
            });
        })
        .catch((err) => {
          reject(err);
          return;
        });
    });
  });
}

async function _delete(id) {
  return new Promise(async (resolve, reject) => {
    if (id.length != 24) reject("Invalid Id");
    await Category.findById(id)
      .then((category) => {
        console.log("Logging category", category);
        if (!category)
          resolve({ success: false, message: "Category not found" });

        category.isDeleted = true;
        category.save();
        resolve({ success: true, message: "Category Deleted!" });
      })
      .catch((err) => {
        reject(err);
      });
  });
}
