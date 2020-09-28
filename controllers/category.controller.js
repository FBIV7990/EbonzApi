const express = require("express");
const router = express.Router();
const categoryService = require("../services/category.service");

// routes

router.get("/", getAll);
router.get("/:id", getById);

module.exports = router;

/////////////////////////////////////
function getAll(req, res, next) {
    categoryService
    .getAll()
    .then(categories => res.json(
        categories
        ))
    .catch(err => next(err));
}

function getById(req, res, next) {
    categoryService
    .getById(req.params.id)
    .then(category => (category ? res.json(
       category) : res.sendStatus(404)))
    .catch(err => next(err));
}
