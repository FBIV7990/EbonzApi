const mongoose = require("mongoose");
var crypto = require("crypto");
var uniqueValidator = require("mongoose-unique-validator");

const UserSchema = mongoose.Schema(
  {
    external_id: { type: String, unique: true, required: true, index: true },
    login_types: [
      {
        _id: false,
        login_type: {
          type: String,
          uppercase: true,
          enum: ["FACEBOOK", "GOOGLE", "APPLE", "EMAIL", "MOBILE"],
        },
        status: Boolean,
        access_token: String,
      },
    ],
    account: {
      username: {
        type: String,
        lowercase: true,
        unique: true,
        trim: true,
        required: [true, "can't be blank"],
      },
      securityCode: { type: String },
      salt: { type: String },
      hash: { type: String }, //Password Hash
      isRegistered: { type: Boolean },
      isVerified: { type: Boolean },
      isActive: { type: Boolean },
      last_login_time: { type: Date },
      token: String,
      firebaseToken: String,
    },
    profile: {
      name: String,
      email: String,
      phone: String,
      aadhar: String,
      profilePhoto: { type: String },
      thumbnail: { type: String },
      followers: Number,
      followings: Number,
    },
    setting: {
      allow_notifications: Boolean,
      show_phone_number: Boolean,
      allow_offer_notifications: Boolean,
    },
    location: {
      _id: false,
      country_id: { type: String },
      state_id: { type: String },
      city_id: { type: String },
      area_id: { type: String },
      type: {
        type: String,
        default: "Point",
      },
      coordinates: { type: Array },
    },
  },
  {
    timestamps: true,
  }
);

//User Schema methods
UserSchema.methods.setPassword = function (password) {
  this.account.salt = crypto.randomBytes(16).toString("hex");
  this.account.hash = crypto
    .pbkdf2Sync(password, this.account.salt, 10000, 512, "sha512")
    .toString("hex");
};

UserSchema.methods.validPassword = function (password) {
  var hash = crypto
    .pbkdf2Sync(password, this.account.salt, 10000, 512, "sha512")
    .toString("hex");
  return this.account.hash === hash;
};
UserSchema.plugin(uniqueValidator, { message: "is already taken." });
module.exports = mongoose.model("User", UserSchema);
