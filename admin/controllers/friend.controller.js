const express = require("express");
const router = express.Router();
const followService=require("../../services/follow.service");

// routes
router.post("/follow", follow);
router.post("/unfollow", unfollow);
router.get("/", getFriends);
module.exports = router;


//----------------------------------------------------------------------------------------//
//----------------------------FOLLOWERS & FOLLOWINGS--------------------------------------//
//----------------------------------------------------------------------------------------//
function follow(req, res, next) {
  followService
    .follow(req)
    .then(msg =>
      res.json(      
       msg
      )
    )
    .catch(err => {
      next(err);
    });
}
function unfollow(req, res, next) {
  followService
    .unfollow(req)
    .then(msg =>
      res.json(      
       msg
      )
    )
    .catch(err => {
      next(err);
    });
}
function getFriends(req, res, next) {
  followService
    .get(req.query)
    .then(msg =>
      res.json(      
       msg
      )
    )
    .catch(err => {
      next(err);
    });
}