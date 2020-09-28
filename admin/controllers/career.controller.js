const express = require("express");
const router = express.Router();
const career = require("../../services/career.service");

// routes

router.post("/add", add);
router.get("/",get);
router.post("/remove",remove)


module.exports = router;

function add(req, res, next) {
  career.add(req)
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
  career.get(req)
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

  career.remove(req)
  .then((message) =>
    res.json(
      message    
    )
  )
  .catch(err => {     
    next(err);
  });
}
