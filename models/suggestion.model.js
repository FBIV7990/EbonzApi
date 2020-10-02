const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SuggestionSchema = mongoose.Schema({
  categoryId: { type: Schema.Types.ObjectId, required: true },
  subcategoryId: { type: Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  keywords: { type: String, required: true, index: true },
  isDeleted: { type: Boolean },
});

module.exports = mongoose.model("Suggestion", SuggestionSchema);
