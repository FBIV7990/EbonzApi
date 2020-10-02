const express = require("express");
const router = express.Router();
const color = require("../../services/color.service");

// routes

router.post("/add", add);
router.post("/update", update);
router.post("/active", active);
router.get("/", get);
router.post("/remove", remove);

module.exports = router;

function add(req, res, next) {
  color
    .add(req)
    .then((message) => res.json(message))
    .catch((err) => {
      next(err);
    });
}

function update(req, res, next) {
  color
    .update(req)
    .then((message) => res.json(message))
    .catch((err) => {
      next(err);
    });
}

function active(req, res, next) {
  color
    .setActive(req)
    .then((message) => res.json(message))
    .catch((err) => {
      next(err);
    });
}

function get(req, res, next) {
  color
    .getAll()
    .then((message) => res.json(message))
    .catch((err) => {
      next(err);
    });
}

function remove(req, res, next) {
  color
    .delete(req)
    .then((message) => res.json(message))
    .catch((err) => {
      next(err);
    });
}
