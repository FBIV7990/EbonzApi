const express = require("express");
const router = express.Router();
const postService = require("../services/post.service");
const reportService=require("../services/reportpost.service");
// routes

router.post("/create", create);
router.get("/",get)
router.get("/getRelevant",getRelevant)
router.post("/markAsSold",markAsSold);
router.post("/report",report);
router.get("/myposts/:id", getByUserId);
router.delete("/:id",remove);


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
  .getAllVerified(req.query)
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
  .getRelevant(req.query)
  .then(posts => res.json({     
     success: true,
     posts}) )
  .catch(err => next(err));
}

function getByUserId(req, res, next) {
  postService
  .getByUserId(req.params.id)
  .then(posts => res.json({     
     success: true,
     posts}) )
  .catch(err => next(err));
}

function markAsSold(req,res,next)
{

  postService
  .markAsSold(req)
  .then(posts => res.json(posts) )
  .catch(err => next(err));
}

function remove(req,res,next)
{

  postService
  ._delete(req.params.id)
  .then(posts => res.json(posts) )
  .catch(err => next(err));
}

function report(req,res,next)
{
  reportService
  .add(req)
  .then(data => res.json(data) )
  .catch(err => next(err));
}