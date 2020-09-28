const mongoose=require("mongoose")
const Schema=mongoose.Schema;
const reviewSchema=mongoose.Schema({
    _id:{type:Schema.Types.ObjectId,required:true},  //Id will be the postID
    reviews:[
        {      
         userId:{ type:Schema.Types.ObjectId, ref: 'User'},
         date :{type:Date,default:new Date()},
         text:{type:String,required:true},
         deleted:{type:Boolean,default:false}
    }],
});

// const reviewSchema=mongoose.Schema({
//     _id:{type:Schema.Types.ObjectId,required:true},  //Id will be the postID
//     reviews:{type:Schema.Types.Mixed},
// });
module.exports=mongoose.model('Review',reviewSchema);