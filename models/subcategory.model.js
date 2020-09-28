const mongoose = require("mongoose");

const SubCategorySchema = mongoose.Schema({ 
  category_id:{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, 
  key: { type: String, unique: true, required: true },
  name: { type: String, unique: true, required: true },
  display_index: { type: Number,  required: true },
  photo_limit:{min:{type:Number},max:{type:Number}},
  card_display_string:{type:String},
  description: { type: String },   
  sorting_options: [{ _id:false, key:Number,name:String }],
  parameters: [
    {  _id:false, 
       key:{type: String}, 
       name:{type: String},       
       label: {type:String},
       display_index:{type:Number},
       control_type:{type:String,uppercase:true,enum: ['TEXT', 'NUMBER', 'SELECT','TEXTAREA','BUTTON_LIST','RANGE_SLIDER']},
       values:[{ _id:false, key:Number,name:String }],
       is_required:{type:Boolean},
       error_msg: {type:String},
       min:{type: Number},
       max: {type:Number} 
    }
  ],
  icon: { type: String },
  banner: { type: String },  
  is_blocked:{type:Boolean,default:false},
  is_deleted: { type: Boolean, default: false }
});
module.exports = mongoose.model("SubCategory", SubCategorySchema);
