const express = require("express");
const router = express.Router();
const color = require("../services/color.service");

// routes

router.get("/",get);
module.exports = router;

function get(req, res, next) {
  color.getPlatformWise(req.query)
    .then((message) =>
      res.json(
        message      
      )
    )
    .catch(err => {     
      next(err);
    });
}


