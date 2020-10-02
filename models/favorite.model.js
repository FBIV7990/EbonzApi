const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const favoriteSchema = mongoose.Schema({
  _id: { type: Schema.Types.ObjectId, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  subcategories: [{ type: Schema.Types.ObjectId, ref: "SubCategory" }],
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
});
module.exports = mongoose.model("Favorite", favoriteSchema);
