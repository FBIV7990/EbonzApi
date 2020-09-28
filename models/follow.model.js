const mongoose=require("mongoose")
const Schema=mongoose.Schema;
const followSchema=mongoose.Schema({
    _id:{type:Schema.Types.ObjectId,required:true},
    userId:{ type:Schema.Types.ObjectId},
    followers:[{ type:Schema.Types.ObjectId, ref: 'User' }],
    followings:[{ type:Schema.Types.ObjectId, ref: 'User' }],
});
module.exports=mongoose.model('Follow',followSchema);