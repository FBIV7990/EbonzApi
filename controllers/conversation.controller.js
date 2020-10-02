const express = require("express");
const router = express.Router();
const conversationService = require("../services/conversation.service");
const messageService = require("../services/message.service");
const blockedService = require("../services/blockUser.service");
// routes

router.post("/add", add);
router.get("/", getConversations);
router.get("/getById", getConversationById);
router.post("/sendMessage", sendMessage);
router.post("/deleteMessage", deleteMessage);
router.post("/blockUser", blockUser);
router.post("/unblockUser", unblockUser);
router.get("/getBlockedUser/:id", getBlockedUsers);
router.post("/delete", _delete);
module.exports = router;

function add(req, res, next) {
  conversationService
    .add(req)
    .then((message) => res.json(message))
    .catch((err) => {
      next(err);
    });
}

function sendMessage(req, res, next) {
  messageService
    .create(req.body)
    .then((message) => res.json(message))
    .catch((err) => {
      next(err);
    });
}

function deleteMessage(req, res, next) {
  messageService
    .delete(req)
    .then((message) => res.json(message))
    .catch((err) => {
      next(err);
    });
}

function getConversations(req, res, next) {
  conversationService
    .get(req.query)
    .then((message) => res.json(message))
    .catch((err) => {
      next(err);
    });
}

function getConversationById(req, res, next) {
  console.log(req.query);
  conversationService
    .getConversationById(req.query)
    .then((message) => res.json(message))
    .catch((err) => {
      next(err);
    });
}

function blockUser(req, res, next) {
  blockedService
    .block(req)
    .then((message) => res.json(message))
    .catch((err) => {
      next(err);
    });
}

function unblockUser(req, res, next) {
  blockedService
    .unblock(req)
    .then((message) => res.json(message))
    .catch((err) => {
      next(err);
    });
}

function getBlockedUsers(req, res, next) {
  blockedService
    .get(req.params)
    .then((message) => res.json(message))
    .catch((err) => {
      next(err);
    });
}

function _delete(req, res, next) {
  conversationService
    .delete(req)
    .then((message) => res.json(message))
    .catch((err) => {
      next(err);
    });
}
