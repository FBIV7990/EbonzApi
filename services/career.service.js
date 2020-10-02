const Joi = require("@hapi/joi");
const db = require("../_helpers/db");
const Career = db.Career;

module.exports = {
  add,
  remove,
  get,
};

async function add(req, res) {
  try {
    const schema = Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required(),
      mobile: Joi.string().required(),
      position: Joi.string().required(),
      message: Joi.string().required(),
    });
    const careerParams = req.body;
    const { error, value } = schema.validate(careerParams);
    if (error) {
      throw error;
    }
    const { name, email, mobile, position, message } = careerParams;
    const career = new Career();
    career.name = name;
    career.email = email;
    career.mobile = mobile;
    career.position = position;
    career.message = message;
    return career
      .save()
      .then((res) => {
        return { success: true, message: "Thank you for Contacting us." };
      })
      .catch((err) => {
        return { success: false, message: "Something went wrong." };
      });
  } catch (err) {
    throw err;
  }
}

async function remove(req) {
  try {
    const schema = Joi.object().keys({
      careerId: Joi.string().min(24).max(24).required(),
    });
    const careerParams = req.body;
    const { error, value } = schema.validate(careerParams);
    if (error) {
      throw error;
    }
    const { careerId } = careerParams;

    await Career.findByIdAndDelete(careerId)
      .then((res) => {
        return { success: true, message: "Career request deleted!" };
      })
      .catch((err) => {
        return { success: false, message: "Something went wrong." };
      });
  } catch (err) {
    throw err;
  }
}

async function get(req) {
  try {
    return await Career.find();
  } catch (err) {
    return { success: false, message: "Error in loading career requests" };
  }
}
