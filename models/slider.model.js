const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const sliderSchema = mongoose.Schema({
  slide: { type: String, required: true },
  link: { type: String },
  index: { type: Number },
});
module.exports = mongoose.model("Slider", sliderSchema);
