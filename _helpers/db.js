const config = require("../config/database.config");
const mongoose = require("mongoose");

mongoose.connect( config.url, {
  useCreateIndex: true,
  useNewUrlParser: true
});
// mongoose.connect(process.env.MONGODB_URI || config.connectionString, {
//   useCreateIndex: true,
//   useNewUrlParser: true
// });
mongoose.Promise = global.Promise;

module.exports = {
  Admin: require("../models/admin.model"),
  User: require("../models/user.model"),
  Category:require("../models/category.model"),
  SubCategory:require("../models/subcategory.model"),
  Post:require("../models/post.model"),
  Suggestion:require("../models/suggestion.model"),
  Favorite:require("../models/favorite.model"),
  Follow:require("../models/follow.model"),
  Review:require("../models/reviews.model"), 
  Conversation:require("../models/conversation.model"),
  Message:require("../models/message.model"), 
  Notification:require("../models/notification.model"),
  BlockedUser:require("../models/blockedUser.model"),
  Feedback:require("../models/feedback.model"),
  ContactUs:require("../models/contactus.model"),
  Career:require("../models/career.model"),
  Slider:require("../models/slider.model"),
  FAQ:require("../models/faq.model"),
  Color:require("../models/color.model"),
  ReportPost:require("../models/reportpost.model"),
  ReportUser:require("../models/reportuser.model")
};
