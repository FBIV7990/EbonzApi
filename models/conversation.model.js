const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const conversationSchema = mongoose.Schema({
  post: { type: Schema.Types.ObjectId, ref: "Post" },
  seller: { type: Schema.Types.ObjectId, ref: "User" },
  buyer: { type: Schema.Types.ObjectId, ref: "User" },
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  deleted_by_seller: { type: Boolean, default: false },
  deleted_by_buyer: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Conversation", conversationSchema);

// const mongoose=require("mongoose")
// const Schema=mongoose.Schema;
// const conversationSchema=mongoose.Schema({
//     userOne:{ type:Schema.Types.ObjectId, ref: 'User' },
//     userTwo:{ type:Schema.Types.ObjectId, ref: 'User' },
//     messages:[{ type:Schema.Types.ObjectId, ref: 'Message' }],
// });
// module.exports=mongoose.model('Conversation',conversationSchema);
