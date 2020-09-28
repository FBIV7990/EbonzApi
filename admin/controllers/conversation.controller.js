const express = require("express");
const router = express.Router();
const conversationService = require("../../services/conversation.service");
const messageService = require("../../services/message.service");
// routes

router.post("/add", add);
router.get("/", getConversations);
router.post("/delete", _delete);
module.exports = router;

function add(req, res, next) {

    conversationService.add(req)
    .then((message) =>
      res.json(
        message      
      )
    )
    .catch(err => {     
      next(err);
    });
}

function getConversations(req, res, next) {

    conversationService.get(req.query)
    .then((message) =>
      res.json(
        message      
      )
    )
    .catch(err => {     
      next(err);
    });
}
function _delete(req, res, next) {

  conversationService._delete(req)
  .then((message) =>
    res.json(
      message      
    )
  )
  .catch(err => {     
    next(err);
  });
}