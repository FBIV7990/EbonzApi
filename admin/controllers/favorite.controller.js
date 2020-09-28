const express = require("express");
const router = express.Router();
const favoriteService = require("../../services/favorite.service");
// routes

router.post("/add", add);
router.post('/remove',remove);
router.post("/addSubCategory", addSubCategory);
router.post('/removeSubCategory',removeSubCategory);
router.get("/",getAll)
// router.get("/:id", getById);// User Id


module.exports = router;

function add(req, res, next) {

    favoriteService
    .add(req)
    .then((message) =>
      res.json(
        message      
      )
    )
    .catch(err => {     
      next(err);
    });
}
function addSubCategory(req, res, next) {
  favoriteService
  .addSubCategory(req)
  .then((message) =>
    res.json(
      message      
    )
  )
  .catch(err => {     
    next(err);
  });
}
function getById(req, res, next) {
    favoriteService
  .get(req.params)
  .then(favorites => res.json(favorites
      ))
  .catch(err => next(err));
}
function getAll(req, res, next) {
    favoriteService
  .get(req.query)
  .then(favorites => res.json(favorites
      ))
  .catch(err => next(err));
}

function remove(req, res, next) {

  favoriteService
  .remove(req)
  .then((message) =>
    res.json(
      message       
    )
  )
  .catch(err => {     
    next(err);
  });
}
function removeSubCategory(req, res, next) {

  favoriteService
  .removeSubCategory(req)
  .then((message) =>
    res.json(
     
      message    
    )
  )
  .catch(err => {     
    next(err);
  });
}