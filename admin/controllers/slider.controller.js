const express = require("express");
const router = express.Router();
const slider = require("../../services/slider.service");

// routes

router.post("/add", add);
router.post("/delete", remove);
router.get("/",get)


module.exports = router;

function add(req, res, next) {
  slider.add(req)
    .then((message) =>
      res.json(
        message      
      )
    )
    .catch(err => {     
      next(err);
    });
}

function remove(req, res, next) {
  slider.remove(req)
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
  slider.get()
    .then((message) =>
      res.json(
        message      
      )
    )
    .catch(err => {     
      next(err);
    });
}