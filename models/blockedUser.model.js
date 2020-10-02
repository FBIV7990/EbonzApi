const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const blockedUserSchema = mongoose.Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
});
module.exports = mongoose.model("BlockedUser", blockedUserSchema);
