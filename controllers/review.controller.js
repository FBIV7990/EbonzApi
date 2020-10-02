const express = require("express");
const router = express.Router();
const reviewService = require("../services/review.service");
// routes

router.post("/add", add);
router.delete("/remove", remove);
router.get("/", getAll);
// router.get("/:id", getById);// User Id

module.exports = router;

function add(req, res, next) {
  reviewService
    .add(req)
    .then((message) => res.json(message))
    .catch((err) => {
      next(err);
    });
}

function getAll(req, res, next) {
  reviewService
    .get(req.query)
    .then((reviews) => res.json(reviews))
    .catch((err) => next(err));
}

function remove(req, res, next) {
  reviewService
    .remove(req)
    .then((message) => res.json(message))
    .catch((err) => {
      next(err);
    });
}
