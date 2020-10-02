const Joi = require("@hapi/joi");
const db = require("../_helpers/db");
const ContactUs = db.ContactUs;

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
    const contactParams = req.body;
    const { error, value } = schema.validate(contactParams);
    if (error) {
      throw error;
    }
    const { name, email, mobile, message } = contactParams;
    const contactus = new ContactUs();
    contactus.name = name;
    contactus.email = email;
    contactus.mobile = mobile;
    contactus.message = message;
    return contactus
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
      contactId: Joi.string().alphanum().min(24).max(24).required(),
    });
    const contactParams = req.body;
    const { error, value } = schema.validate(contactParams);
    if (error) {
      throw error;
    }
    const { contactId } = contactParams;

    await ContactUs.findByIdAndDelete(contactId)
      .then((res) => {
        return { success: true, message: "Contact deleted!" };
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
    return await ContactUs.find();
  } catch (err) {
    return { success: false, message: "Error in loading contacts" };
  }
}
