const express = require("express");
const router = express.Router();
const postService = require("../../services/post.service");
// routes

router.post("/create", create);
router.put("/verifyPost/:id",verifyPost)
router.put("/rejectPost/:id",rejectPost)
router.put("/delete/:id",_delete)
router.get("/",get)
router.get("/:id", getById);
router.get("/getRelevant/:id",getRelevant)
router.get("/myposts/:id", getByUserId);
router.get("/get/count", getCount);


module.exports = router;



function create(req, res, next) {

    postService
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

function get(req, res, next) {
  

  postService
  .getAll(req.query)
  .then(posts => res.json({
       code: 200,
      success: true,
      posts}
      ))
  .catch(err => next(err));
}

function getById(req, res, next) {
  postService
  .getById(req.params.id)
  .then(post => res.json({     
     success: true,
     post}) )
  .catch(err => next(err));
}

function getRelevant(req, res, next) {
  postService
  .getRelevant(req.params.id)
  .then(posts => res.json({     
     success: true,
     posts}) )
  .catch(err => next(err));
}

function verifyPost(req, res, next) {

  postService
  .verifyPost(req.params.id)
  .then((message) =>
    res.json(
      message       
    )
  )
  .catch(err => {     
    next(err);
  });
}
function rejectPost(req, res, next) {

  postService
  .unVerifyPost(req.params.id)
  .then((message) =>
    res.json(
      message       
    )
  )
  .catch(err => {     
    next(err);
  });
}
function _delete(req, res, next) {

  postService
  ._delete(req.params.id)
  .then((message) =>
    res.json(
      message       
    )
  )
  .catch(err => {     
    next(err);
  });
}

function getByUserId(req, res, next) {
  postService
  .getByUserId(req.params.id)
  .then(posts => res.json({     
     success: true,
     posts}) )
  .catch(err => next(err));
}

function getCount(req, res, next) {
  postService
    .getTotal()
    .then((result) => res.json(result))
    .catch(err => next(err));
}