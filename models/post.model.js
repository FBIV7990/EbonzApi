const mongoose = require("mongoose");
const Schema=mongoose.Schema;
//Schema for creating ad posts
const PostSchema = mongoose.Schema(
  { 
    userId:{type:String,required:true},
    categoryId:{type:String,required:true},
    subcategoryId:{type:String,required:true}, 
    title:{type:String,required:true},
    description:{type:String,required:true},
    card_string:{type:String,required:true},
    price:{
        value:{type:Number,required:true},
        display_price:{type:String,required:true}
    },
    location:{
        country:{id:{type:String},name:{type:String}},
        state:{id:{type:String},name:{type:String}},
        city:{id:{type:String},name:{type:String}},
        address:{type:String},
        type:{type:String,default:'Point'},
        coordinates:{type:Array},
        zipcode:{type:String}
    },     
    thumbnail:{type:String,required:true},
    images:[{
        _id:false,
        key:{type:String,required:true},
        thumb:{type:String,required:true},
        url:{type:String,required:true}}
    ],
    videos:[{
        _id:false,
        key:{type:String,required:true},
        thumb:{type:String,required:true},
        url:{type:String,required:true}}
    ],  
    parameters:Schema.Types.Mixed,
    user:{ type:Schema.Types.ObjectId, ref: 'User' },
    verified:{type:Boolean,default:false},
    report:{type:String},       //Verification report url
    views:{type:Number},        //Views of the post
    likes:{type:Number},        //Likes of the post
    reviews:{type:Number},      //Reviews of the post
    calls:{type:Number},        //Calls on the post  
    rating:{type:Number},       //Ratings on the post  
    active:{type:Boolean,default:true},
    posted_on:{type:Date},
    expiry_date:{type:Date},
   
    deleted:{type:Boolean,default:false}
  }
);
module.exports = mongoose.model("Post", PostSchema);
