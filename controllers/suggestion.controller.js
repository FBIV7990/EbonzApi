const express = require("express");
const router = express.Router();
const suggestionService = require("../services/suggestion.service");
// routes

router.get("/", getAll);
router.get("/:id", getById); // User Id

module.exports = router;

function add(req, res, next) {
  suggestionService
    .add(req)
    .then((message) => res.json(message))
    .catch((err) => {
      next(err);
    });
}
function update(req, res, next) {
  suggestionService
    .update(req)
    .then((message) => res.json(message))
    .catch((err) => {
      next(err);
    });
}

function getById(req, res, next) {
  suggestionService
    .getById(req.params.id)
    .then((suggestion) => res.json(suggestion))
    .catch((err) => next(err));
}

function getAll(req, res, next) {
  suggestionService
    .getAll(req.query)
    .then((suggestions) => res.json({ success: true, suggestions }))
    .catch((err) => next(err));
}

function remove(req, res, next) {
  suggestionService
    .delete(req.params.id)
    .then((message) => res.json(message))
    .catch((err) => {
      next(err);
    });
}
