const express = require("express");
const router = express.Router();
const notificationService = require("../services/notification.service");

// routes

router.post("/add", add);
router.post("/sendNotification", notification);
router.get("/", get);
router.post("/markasRead", markasRead);
router.post("/delete", _delete);
module.exports = router;

function add(req, res, next) {
  notificationService
    .add(req)
    .then((message) => res.json(message))
    .catch((err) => {
      next(err);
    });
}

function notification(req, res, next) {
  notificationService
    .onPostVerified(req.body.id)
    .then((message) => res.json(message))
    .catch((err) => {
      next(err);
    });
}

function get(req, res, next) {
  notificationService
    .get(req.query)
    .then((message) => res.json(message))
    .catch((err) => {
      next(err);
    });
}
function markasRead(req, res, next) {
  notificationService
    .markasRead(req.body)
    .then((message) => res.json(message))
    .catch((err) => {
      next(err);
    });
}

function _delete(req, res, next) {
  notificationService
    ._delete(req.body)
    .then((message) => res.json(message))
    .catch((err) => {
      next(err);
    });
}
