const express = require("express");
const router = express.Router();
const categoryService = require("../../services/category.service");

// routes

router.post("/create",create);
router.post("/updateImages",updateImages);
router.get("/", getAll);
router.get("/:id", getById);
router.post("/update", update);
router.delete("/:id", _delete);

module.exports = router;


function create(req, res, next) {
    categoryService
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

function update(req, res, next) {
    categoryService
    .update(req)
    .then((message) =>  res.json(message  ))
    .catch(err => next(err));
}

function updateImages(req, res, next) {
  categoryService
  .updateImages(req)
  .then((message) =>  res.json(message))
  .catch(err => next(err));
}

function _delete(req, res, next) {
    categoryService
    .delete(req.params.id)
    .then((result) => res.json(result))
    .catch(err => next(err));
}
