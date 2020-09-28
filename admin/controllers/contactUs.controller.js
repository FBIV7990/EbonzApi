const express = require("express");
const router = express.Router();
const contactus = require("../../services/contactus.service");

// routes

router.post("/add", add);
router.get("/",get);
router.post("/remove",remove)

module.exports = router;

function add(req, res, next) {
  contactus.add(req)
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
  contactus.get(req)
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
  contactus.remove(req)
    .then((message) =>
      res.json(
        message      
      )
    )
    .catch(err => {     
      next(err);
    });
}