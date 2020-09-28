const mongoose=require("mongoose")
const Schema=mongoose.Schema;
const reportSchema=mongoose.Schema({   
    user:{ type:Schema.Types.ObjectId, ref: 'User'},
    reported_by:{ type:Schema.Types.ObjectId, ref: 'User'},
    issue:{type: String},
    comment:{type :String,default:""},
    action_taken:{type:Boolean,default:false},
    deleted:{type:Boolean,default:false},
    reported_on: {
        type: Date,
        default: Date.now,
      }
});
module.exports=mongoose.model('UserReport',reportSchema);