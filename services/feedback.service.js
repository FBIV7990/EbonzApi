const Joi = require("@hapi/joi");
const db = require("../_helpers/db");
const Feedback = db.Feedback;

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
      message: Joi.string().required(),
    });
    const feedParams = req.body;
    const { error, value } = schema.validate(feedParams);
    if (error) {
      throw error;
    }
    const { name, email, mobile, message } = feedParams;
    const feedback = new Feedback();
    feedback.name = name;
    feedback.email = email;
    feedback.mobile = mobile;
    feedback.message = message;
    return feedback
      .save()
      .then((res) => {
        return { success: true, message: "Thanks for your feedback." };
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
      feedbackId: Joi.string().alphanum().min(24).max(24).required(),
    });
    const feedParam = req.body;
    const { error, value } = schema.validate(feedParam);
    if (error) {
      throw error;
    }
    const { feedbackId } = feedParam;

    await Feedback.findByIdAndDelete(feedbackId)
      .then((res) => {
        return { success: true, message: "Feedback deleted!" };
      })
      .catch((err) => {
        return { success: false, message: "Something went wrong." };
      });
  } catch (err) {
    throw err;
  }
}

async function get() {
  try {
    return await Feedback.find();
  } catch (err) {
    return { success: false, message: "Error in loading feedbacks" };
  }
}
