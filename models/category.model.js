const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = mongoose.Schema({
  key: { type: String, unique: true, required: true },
  name: { type: String, unique: true, required: true },
  display_index: { type: Number, required: true },
  description: { type: String },
  icon: { type: String },
  banner: { type: String },
  sorting_options: [{ _id: false, key: Number, name: String }],
  // parameters: [
  //   {  _id:false,
  //      key: String,
  //      name: String,
  //      control:String,
  //      min: Number,
  //      max: Number
  //   }
  // ],
  parameters: [
    {
      _id: false,
      key: { type: String },
      name: { type: String },
      label: { type: String },
      display_index: { type: Number },
      control_type: {
        type: String,
        uppercase: true,
        enum: [
          "TEXT",
          "NUMBER",
          "SELECT",
          "TEXTAREA",
          "BUTTON_LIST",
          "RANGE_SLIDER",
        ],
      },
      values: [{ _id: false, key: Number, name: String }],
      is_required: { type: Boolean },
      error_msg: { type: String },
      min: { type: Number },
      max: { type: Number },
    },
  ],
  subcategories: [{ type: Schema.Types.ObjectId, ref: "SubCategory" }],
  isDeleted: { type: Boolean, default: false },
});
module.exports = mongoose.model("Category", CategorySchema);
