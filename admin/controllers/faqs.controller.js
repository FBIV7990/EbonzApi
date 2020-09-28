const express = require("express");
const router = express.Router();
const faq = require("../../services/faq.service");

// routes

router.post("/add", add);
router.post("/delete", remove);
router.post("/update",update);
router.get("/",get)


module.exports = router;

function add(req, res, next) {
  faq.add(req)
    .then((message) =>
      res.json(
        message      
      )
    )
    .catch(err => {     
      next(err);
    });
}

function update(req, res, next) {
  faq.update(req)
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
  faq.remove(req)
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
  faq.get()
    .then((message) =>
      res.json(
        message      
      )
    )
    .catch(err => {     
      next(err);
    });
}