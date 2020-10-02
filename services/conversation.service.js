const Joi = require("@hapi/joi");
const db = require("../_helpers/db");

const Conversation = db.Conversation;
const User = db.User;
const Message = db.Message;
const Post = db.Post;
const BlockedUser = db.BlockedUser;

var socketsController = require("../controllers/chat.controller");

module.exports = { add, get, getConversationById, delete: _delete };

async function add(req) {
  return new Promise(async (resolve, reject) => {
    const schema = Joi.object().keys({
      postId: Joi.string().min(24).max(24).required(),
      sellerId: Joi.string().min(24).max(24).required(),
      buyerId: Joi.string().min(24).max(24).required(),
    });
    const conversationParam = req.body;

    //Validating the schema
    const { error, value } = schema.validate(conversationParam);
    //If the request is not in the expected format
    if (error) {
      reject(error);
      return;
    }

    const { postId, sellerId, buyerId } = conversationParam;

    const users = await User.find({ _id: { $in: [sellerId, buyerId] } });
    if (users.length == 2) {
      Post.findById(postId)
        .then((post) => {
          if (!post) {
            reject({ success: false, message: "Invalid post Id" });
            return;
          }
          if (post.userId === sellerId) {
            Conversation.findOne({
              post: postId,
              seller: sellerId,
              buyer: buyerId,
            })
              .then((convers) => {
                if (!convers) {
                  const conversation = new Conversation();
                  const message = new Message();
                  message.conversationId = conversation._id;
                  message.senderId = buyerId;
                  message.recieverId = sellerId;
                  message.messageType = "text";
                  message.message = "Hi, I am interested in " + post.title;
                  message
                    .save()
                    .then((msg) => {
                      console.log(conversation);
                      conversation.post = postId;
                      conversation.seller = sellerId;
                      conversation.buyer = buyerId;
                      conversation.messages.push(msg);
                      conversation
                        .save()
                        .then((con) => {
                          Conversation.findById(con._id)
                            .populate("post", "title price thumbnail")
                            .populate("seller", "profile")
                            .populate("buyer", "profile")
                            .populate("messages")
                            .then((conv) => {
                              const sellerOnline = socketsController.checkOnline(
                                conv.seller._id
                              );
                              const buyerOnline = socketsController.checkOnline(
                                conv.buyer._id
                              );

                              const result = {
                                id: conv._id,
                                post: conv.post,
                                seller: {
                                  _id: conv.seller._id,
                                  profile: conv.seller.profile,
                                  online: sellerOnline,
                                },
                                buyer: {
                                  _id: conv.buyer._id,
                                  profile: conv.buyer.profile,
                                  online: buyerOnline,
                                },
                                messages: conv.messages,
                              };
                              resolve({ success: true, conversation: result });

                              // resolve({success:true,message:"Conversation Created",conversation:conv});
                            });
                        })
                        .catch((err) => {
                          console.log(err);
                          console.log(err);
                        });
                    })
                    .catch((err) => {
                      console.log(err);
                      resolve({ success: false, message: err });
                    });
                } else {
                  resolve({
                    success: false,
                    message: "Duplicate Conversation!",
                  });
                }
              })
              .catch((err) => {
                console.log(err);
                resolve({ success: false, message: err });
              });
          } else {
            resolve({ success: false, message: "Invalid Seller Id" });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      resolve({ success: false, message: "Invalid user ID" });
    }
  });
}

async function get(params) {
  const schema = Joi.object().keys({
    postId: Joi.string().min(24).max(24),
    userId: Joi.string().min(24).max(24),
    conversationId: Joi.string().min(24).max(24),
  });

  //Validating the schema
  const { error, value } = schema.validate(params);
  //If the request is not in the expected format
  if (error) {
    return { success: false, message: "Invalid userID" };
  }

  console.log(params);

  if (params.conversationId && params.userId) {
    return Conversation.findById(params.conversationId)
      .populate("post", "title price thumbnail")
      .populate("seller", "profile")
      .populate("buyer", "profile")
      .populate("messages")
      .then((conversation) => {
        if (!conversation)
          return { success: false, message: "Conversation not found" };

        const sellerOnline = socketsController.checkOnline(
          conversation.seller._id
        );
        const buyerOnline = socketsController.checkOnline(
          conversation.buyer._id
        );

        const messages = conversation.messages.filter((message) => {
          if (
            message.senderId === params.userId &&
            message.deleted_by_sender == false
          )
            return message;
          else if (
            message.recieverId === params.userId &&
            message.deleted_by_reciever == false
          )
            return message;
        });

        const result = {
          id: conversation._id,
          post: conversation.post,
          seller: {
            _id: conversation.seller._id,
            profile: conversation.seller.profile,
            online: sellerOnline,
          },
          buyer: {
            _id: conversation.buyer._id,
            profile: conversation.buyer.profile,
            online: buyerOnline,
          },
          messages: messages,
        };
        return { success: true, conversation: result };
        //  return { success: true, conversation: conversation };
      })
      .catch((err) => {
        console.log(err);
        return { success: false, message: "Error in getting conversation" };
      });
  } else if (params.userId) {
    return User.findById(params.userId)
      .then((user) => {
        if (!user) {
          return { success: false, message: "User not found" };
        }
        return Conversation.find({
          $or: [{ seller: params.userId }, { buyer: params.userId }],
        })
          .sort({ createdAt: -1 })
          .populate("post", "title price thumbnail")
          .populate("seller", "profile")
          .populate("buyer", "profile")
          .populate("messages")
          .then((conversations) => {
            if (!conversations)
              return { success: false, message: "Conversations not found" };
            else {
              var res = conversations.map((conv) => {
                return {
                  id: conv._id,
                  post: conv.post,
                  seller: conv.seller,
                  buyer: conv.buyer,
                  message:
                    conv.messages.length > 0
                      ? conv.messages[conv.messages.length - 1]
                      : [],
                };
              });

              return { success: true, conversations: res };
            }
          })
          .catch((err) => {
            return { success: false, message: "Conversation not found" };
          });
      })
      .catch((err) => {
        return { success: false, message: "User not found" };
      });
  } else if (params.postId) {
    return Conversation.find({ post: params.postId })
      .populate("post", "title price thumbnail")
      .populate("seller", "profile")
      .populate("buyer", "profile")
      .populate("messages")
      .then((conversation) => {
        if (!conversation)
          return { success: false, message: "Conversation not found" };

        return { success: true, conversation: conversation };
      })
      .catch((err) => {
        return { success: false, message: "Error in getting conversation" };
      });
  }
}

function getConversationById(params) {
  return new Promise((resolve, reject) => {
    const schema = Joi.object().keys({
      userId: Joi.string().min(24).max(24).required(),
      sellerId: Joi.string().min(24).max(24).required(),
      buyerId: Joi.string().min(24).max(24).required(),
      postId: Joi.string().min(24).max(24).required(),
    });

    //Validating the schema
    const { error, value } = schema.validate(params);
    //If the request is not in the expected format
    if (error) {
      reject(error);
    }
    Conversation.findOne({
      post: params.postId,
      seller: params.sellerId,
      buyer: params.buyerId,
    })
      .populate("post", "title price thumbnail")
      .populate("seller", "profile")
      .populate("buyer", "profile")
      .populate("messages")
      .then((conversation) => {
        if (!conversation) {
          resolve({ success: false, message: "Conversation not found" });
          return;
        }

        const sellerOnline = socketsController.checkOnline(
          conversation.seller._id
        );
        const buyerOnline = socketsController.checkOnline(
          conversation.buyer._id
        );

        const messages = conversation.messages.filter((message) => {
          if (
            message.senderId === params.userId &&
            message.deleted_by_sender == false
          )
            return message;
          else if (
            message.recieverId === params.userId &&
            message.deleted_by_reciever == false
          )
            return message;
        });

        const result = {
          id: conversation._id,
          post: conversation.post,
          seller: {
            _id: conversation.seller._id,
            profile: conversation.seller.profile,
            online: sellerOnline,
          },
          buyer: {
            _id: conversation.buyer._id,
            profile: conversation.buyer.profile,
            online: buyerOnline,
          },
          messages: messages,
        };
        resolve({ success: true, conversation: result });
      })
      .catch((err) => {
        console.log(err);
        reject({ success: false, message: "Error in getting conversation" });
      });
  });
}

function _delete(req) {
  return new Promise(async (resolve, reject) => {
    const schema = Joi.object().keys({
      conversationId: Joi.string().min(24).max(24).required(),
      userId: Joi.string().min(24).max(24).required(),
    });

    const conversationParam = req.body;
    //Validating the schema
    const { error, value } = schema.validate(conversationParam);
    //If the request is not in the expected format
    if (error) {
      console.log(error);
      return { success: false, message: "Invalid userID" };
    }
    const { conversationId, userId } = conversationParam;
    Conversation.findById(conversationId)
      .then((conversation) => {
        if (!conversation) {
          resolve({ success: false, message: "Conversation not found" });
          return;
        }
        Message.find({ conversationId: conversationId }).then((messages) => {
          messages.forEach((message) => {
            if (message.senderId === userId) {
              message.deleted_by_sender = true;
            } else if (message.recieverId === userId) {
              message.deleted_by_reciever = true;
            }
            message.save();
          });
        });
        resolve({ success: true, message: "Conversation deleted!" });
      })
      .catch((err) => {
        resolve({ success: false, message: conversation });
      });
  });
}
