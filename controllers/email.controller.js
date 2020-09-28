const express = require("express");
const router = express.Router();
const email = require("../services/fbivemail.service");

// routes

router.post("/add", add);


module.exports = router;

function add(req, res, next) {
  email.sendEnquiry(req)
    .then((message) =>
      res.json(
        message      
      )
    )
    .catch(err => {     
      next(err);
    });
}


