const mongoose = require("mongoose");

//Schema For Properties :
//For Sale : Houses & Apartments
//For Rent : Houses & Apartments
//Lands & Plots
//For Rent : Shops & Offices
//For Sale : Shops & Offices
//PG & Guest Houses

const PropertySchema = mongoose.Schema(
  {
    userId: { type: String, required: true },
    categoryId: { type: String, required: true },
    subcategoryId: { type: String, required: true },
    adTitle: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    location: {
      data: { type: Object },
      type: { type: String, default: "Point" },
      coordinates: { type: Array },
    },
    thumbnail: { type: String, required: true },
    images: { type: Object, required: true },
    details: { type: Object },
    verified: { type: Boolean, default: false },
    verificationReport: { type: String },
    views: { type: Number },
    active: { type: Boolean, default: true },
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Property", PropertySchema);
