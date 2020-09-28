const express = require("express");
const router = express.Router();
const subCategoryService = require("../../services/subcategory.service");

// routes

router.post("/create",create);
router.post("/updateImages",updateImages);
router.get("/", getAll);
router.get("/:id", getById);
router.get("/getByCategory/:id", getByCategoryId);
router.post("/update", update);
router.delete("/:id", _delete);

module.exports = router;

function create(req, res, next) {
    subCategoryService
    .create(req)
    .then((message) =>
      res.json(
        message       
      )
    )
    .catch(err => {     
      next(err);
    });
}


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

function update(req, res, next) {
    subCategoryService
    .update(req)
    .then((message) =>  res.json(message  ))
    .catch(err => next(err));
}

function updateImages(req, res, next) {
    subCategoryService
  .updateImages(req)
  .then((message) =>  res.json(message))
  .catch(err => next(err));
}

function _delete(req, res, next) {
    subCategoryService
    .delete(req.params.id)
    .then((result) => res.json(result))
    .catch(err => next(err));
}
