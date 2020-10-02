const config = require("config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Joi = require("@hapi/joi");
const randomstring = require("randomstring");
const db = require("../../_helpers/db");
const smsService = require("../../services/sms.service");
const emailService = require("../../services/email.service");
const helper = require("../../_helpers/helper");
const mongoose = require("mongoose");

const Admin = db.Admin;

module.exports = {
  authenticate,
  getAll,
  getById,
  create,
  forgetPassword,
  setPassword,
  changePassword,
  verifyOTP,
  remove,
};

async function authenticate(data) {
  const schema = Joi.object().keys({
    username: Joi.string().min(10).max(40).required(),
    password: Joi.string()
      .regex(/^[a-zA-Z0-9]{3,30}$/)
      .required(),
  });

  return new Promise(async (resolve, reject) => {
    const { error, value } = schema.validate(data);

    if (error) {
      reject(error);
      return;
    }

    console.log(data);
    const { username, password } = data;

    return await Admin.findOne({
      username: username,
    })
      .then((user) => {
        if (user.deleted) {
          resolve({
            success: false,
            message: "Account blocked!. Contact to your administrator",
          });
        }
        if (user && user.salt && user.validPassword(password)) {
          resolve({
            success: true,
            message: "Authentication successful!",
            id: user.id,
            token: user.token,
          });
        } else resolve({ success: false, message: "Invalid Password!" });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

async function forgetPassword(userParam) {
  const schema = Joi.object().keys({
    username: Joi.string().min(10).max(40).required(),
  });
  return new Promise(async (resolve, reject) => {
    const { error, value } = schema.validate(userParam);
    const { username } = userParam;
    if (error) {
      reject(error);
      return;
    }
    await Admin.findOne({ username: username })
      .then((user) => {
        if (!user) {
          resolve({ success: false, message: "User not found" });
          return;
        }
        if (user.securityCode) {
          user.securityCode = randomstring.generate({
            length: 6,
            charset: "numeric",
            readable: true,
          });
          user.save();
          const onlyNumbers = /^[0-9]+$/;
          const res = onlyNumbers.test(username);
          if (res) {
            smsService.sendSMS(username, user.securityCode);
          } else emailService.sendMail(username, user.securityCode);
          resolve({ success: true, message: "verification code sent" });
        }
      })
      .catch((err) => reject(err));
  });
}

async function setPassword(req) {
  userParam = req.body;
  const schema = Joi.object().keys({
    id: Joi.string().alphanum().min(24).max(24).required(),
    username: Joi.string().min(10).max(40).required(),
    password: Joi.string().alphanum().min(6).max(30).required(),
  });

  return new Promise(async (resolve, reject) => {
    const { error, value } = schema.validate(userParam);
    if (error) {
      reject(error);
      return;
    }
    const { id, username, password } = userParam;

    await Admin.findById(id)
      .then((user) => {
        if (!user) {
          resolve({ success: false, message: "User not found" });
        }
        if (user.username == username) {
          if (!user.hash) {
            user.setPassword(password);
            user.save();
            resolve({
              success: true,
              id: user.id,
              token: user.token,
              message: "Password set successfully.",
            });
          } else resolve({ success: false, message: "Cannot set password" });
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

async function changePassword(userParam) {
  const schema = Joi.object().keys({
    id: Joi.string().alphanum().min(24).max(24).required(),
    username: Joi.string().min(10).max(40).required(),
    oldPassword: Joi.string().alphanum().min(6).max(30).required(),
    password: Joi.string().alphanum().min(6).max(30).required(),
  });

  return new Promise(async (resolve, reject) => {
    const { error, value } = schema.validate(userParam);
    if (error) {
      reject(error);
      return;
    }
    const { id, username, oldPassword, password } = userParam;

    if (oldPassword == password)
      resolve({
        success: false,
        message: "Old password and new password cannot be same.",
      });

    await Admin.findById(id)
      .then((user) => {
        if (!user) {
          resolve({ success: false, message: "User not found!" });
        }

        if (
          user.username == username &&
          user.salt &&
          user.validPassword(oldPassword)
        ) {
          user.setPassword(password);
          user.save();
          resolve({ success: true, message: "Password changed successfully!" });
        } else resolve({ success: false, message: "Wrong password" });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

async function getAll() {
  return new Promise(async (resolve, reject) => {
    await Admin.find({ deleted: false })
      .select("-salt -hash -securityCode -token")
      .then((users) => {
        if (!users) resolve({ success: false, message: "Users not found" });
        else resolve({ success: true, users: users });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function getById(id) {
  return new Promise(async (resolve, reject) => {
    Admin.findById(id)
      .then((user) => {
        if (!user) resolve({ success: false, message: "User not found" });
        else resolve({ success: true, user: user });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

async function create(req) {
  const userParam = req.body;
  const schema = Joi.object().keys({
    username: Joi.string().min(12).required(),
    name: Joi.string().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string(),
  });
  return new Promise(async (resolve, reject) => {
    const { error, value } = schema.validate(userParam);
    if (error) {
      reject(error);
      return;
    }

    const { name, username, password, role } = userParam;
    // validate
    Admin.findOne({
      username: username,
    })
      .then((user) => {
        if (!user) {
          const user = new Admin();
          const token = jwt.sign(
            {
              uid: user.id,
            },
            config.secret
          );

          user.username = username;
          user.name = name;
          user.securityCode = randomstring.generate({
            length: 6,
            charset: "numeric",
            readable: true,
          });
          user.token = token;
          user.isRegistered = true;
          user.role = role;
          user.last_login_time = new Date();
          user.setPassword(password);
          const onlyNumbers = /^[0-9]+$/;
          const res = onlyNumbers.test(username);
          if (res) {
            user.phone = username;
            smsService.sendSMS(username, user.securityCode);
          } else {
            user.email = username;
            emailService.sendMail(username, user.securityCode);
          }

          user
            .save()
            .then((user) => {
              resolve({
                success: true,
                message: "User registered successfully!",
              });
            })
            .catch((err) => {
              reject(err);
            });
        } else {
          resolve({
            success: false,
            message: "User already exists! Please login",
          });
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

async function verifyOTP(userParam) {
  const schema = Joi.object().keys({
    username: Joi.string().min(10).max(40).required(),
    verificationCode: Joi.string().min(6).max(6).required(),
  });
  return new Promise(async (resolve, reject) => {
    const { error, value } = schema.validate(userParam);
    const { username, verificationCode } = userParam;
    if (error) {
      reject(error);
      return;
    }
    await Admin.findOne({ username: username })
      .then((user) => {
        if (!user) {
          resolve({ success: false, message: "User not found" });
          return;
        }
        if (!user.securityCode) {
          resolve({
            success: false,
            message: "Cannot verify the security code.",
          });
          return;
        }
        if (
          user.username == username &&
          user.securityCode == verificationCode
        ) {
          if (!user.isRegistered) {
            user.isRegistered = true;
            user.save();
          }
          resolve({
            success: true,
            id: user.id,
            token: user.token,
            message: "Security code verified.",
          });
        } else reject({ success: false, message: "Invalid security code." });
      })
      .catch((err) => reject(err));
  });
}

function remove(userParam) {
  const schema = Joi.object().keys({
    userId: Joi.string().alphanum().min(24).max(24).required(),
  });

  return new Promise((resolve, reject) => {
    const { error, value } = schema.validate(userParam);
    if (error) {
      reject(error);
      return;
    }
    const { userId } = userParam;

    return Admin.findById(userId)
      .then((user) => {
        if (!user) {
          resolve({ success: false, message: "User not found!" });
        }

        if (user.role === "SUPER_ADMIN") {
          resolve({ success: false, message: "Not sufficient privileges" });
        } else {
          user.deleted = true;
          user.save();
          resolve({ success: true, message: "User deleted successfully!" });
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}
