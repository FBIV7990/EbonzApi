const express = require("express");
const router = express.Router();
const subCategoryService = require("../services/subcategory.service");

// routes

router.get("/", getAll);
router.get("/:id", getById);
router.get("/getByCategory/:id", getByCategoryId);

module.exports = router;




/////////////////////////////////////
function getAll(req, res, next) {
    subCategoryService
    .getAll()
    .then(categories => res.json(
        categories
        ))
    .catch(err => next(err));
}

function getById(req, res, next) {
    subCategoryService
    .getById(req.params.id)
    .then(category => (category ? res.json(
       category) : res.sendStatus(404)))
    .catch(err => next(err));
}
function getByCategoryId(req, res, next) {
  subCategoryService
  .getByCategory(req.params.id)
  .then(category => (category ? res.json(
     category) : res.sendStatus(404)))
  .catch(err => next(err));
}

