const express = require("express");
const router = express.Router();
const slider = require("../services/slider.service");

// routes

router.get("/", get);

module.exports = router;

function get(req, res, next) {
  slider
    .get()
    .then((message) => res.json(message))
    .catch((err) => {
      next(err);
    });
}
