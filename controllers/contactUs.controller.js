const express = require("express");
const router = express.Router();
const contactus = require("../services/contactus.service");

// routes

router.post("/add", add);

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

