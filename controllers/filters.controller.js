const express = require("express");
const router = express.Router();
const filterService = require("../services/filters.service");
// routes

router.post("/add", add);
// router.delete('/remove',remove);
 router.get("/",get)

module.exports = router;

function add(req, res, next) {
  filterService
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

function get(req, res, next) {
  filterService
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