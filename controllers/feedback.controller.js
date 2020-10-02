const express = require("express");
const router = express.Router();
const feedbackService = require("../services/feedback.service");

// routes

router.post("/add", add);

module.exports = router;

function add(req, res, next) {
  feedbackService
    .add(req)
    .then((message) => res.json(message))
    .catch((err) => {
      next(err);
    });
}
