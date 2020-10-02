const mongoose = require("mongoose");
var crypto = require("crypto");

const AdminSchema = mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      unique: true,
      trim: true,
      required: [true, "can't be blank"],
    },
    name: String,
    email: String,
    phone: String,
    securityCode: { type: String },
    salt: { type: String },
    hash: { type: String }, //Password Hash
    isRegistered: { type: Boolean },
    isActive: { type: Boolean },
    last_login_time: { type: Date },
    token: String,
    role: { type: String },
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

//User Schema methods
AdminSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
};

AdminSchema.methods.validPassword = function (password) {
  var hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
  return this.hash === hash;
};

module.exports = mongoose.model("Admin", AdminSchema);
