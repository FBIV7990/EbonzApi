const mongoose = require("mongoose");
const Schema=mongoose.Schema;
const FilterSchema = mongoose.Schema(
  {     
     userId:{ type:Schema.Types.ObjectId},
     categories:[{type:Schema.Types.ObjectId}],
     sortBy:String,
     price:{min:Number,max:Number},
     range:Number,
     state:String,
     city:String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Filter", FilterSchema);
