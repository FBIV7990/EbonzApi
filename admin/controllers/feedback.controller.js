const express = require("express");
const router = express.Router();
const feedbackService = require("../../services/feedback.service");

// routes

router.post("/add", add);
router.get("/",get)
router.post("/remove",remove);

module.exports = router;

function add(req, res, next) {
  feedbackService.add(req)
    .then((message) =>
      res.json(
        message      
      )
    )
    .catch(err => {     
      next(err);
    });
}

function get(req, res, next) {
  feedbackService.get(req)
    .then((message) =>
      res.json(
        message      
      )
    )
    .catch(err => {     
      next(err);
    });
}


function remove(req, res, next) {
  feedbackService.remove(req)
    .then((message) =>
      res.json(
        message      
      )
    )
    .catch(err => {     
      next(err);
    });
}