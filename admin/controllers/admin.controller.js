const express = require("express");
const router = express.Router();
const adminService = require("../services/admin.service");

// routes
router.post("/authenticate", authenticate);
router.post("/register", register);
router.post("/verifyOTP", verifyOTP);
router.post("/forgetPassword", forgetPassword);
router.put("/setPassword", setPassword);
router.put("/changePassword", changePassword);
router.get("/current", getCurrent);
router.get("/getAll",getAll)
router.put("/remove",remove)


module.exports = router;

///////////////AUTHENTICATE USER///////////////////

function authenticate(req, res, next) {
 
  adminService
    .authenticate(req.body)
    .then(user =>
      user
        ? res.json(          
           user
          )
        : res.status(400).json({          
            error: "Username or password is incorrect"
          })
    )
    .catch(err => next(err));
}

//////////////////REGISTER USER///////////////////
function register(req, res, next) {
  adminService
    .create(req)
    .then(user =>
     res.json(user)        
    )
    .catch(err => {
      next(err);
    });
}

function getCurrent(req, res, next) {
  console.log(req);
  adminService
    .getById(req.user.uid)
    .then(user => (user ? res.json(user) : res.sendStatus(404)))
    .catch(err => next(err));
}

function getById(req, res, next) {
  adminService
    .getById(req.params.id)
    .then(user => (user ? res.json(user) : res.sendStatus(404)))
    .catch(err => next(err));
}

function getAll(req, res, next) {
  adminService
    .getAll()
    .then(user => (user ? res.json(user) : res.sendStatus(404)))
    .catch(err => next(err));
}

function verifyOTP(req, res, next) {
  adminService
    .verifyOTP(req.body)
    .then(msg =>
      res.json(      
       msg
      )
    )
    .catch(err => {
      next(err);
    });
}

function resendOTP(req, res, next) {
  adminService
    .resendOTP(req.body)
    .then(msg =>
      res.json(      
       msg
      )
    )
    .catch(err => {
      next(err);
    });
}



function setPassword(req, res, next) {
  adminService
    .setPassword(req)
    .then(msg =>
      res.json(     
        msg
      )
    )
    .catch(err => {
      next(err);
    });
}

function remove(req, res, next) {
  adminService
    .remove(req.body)
    .then(msg =>
      res.json(     
        msg
      )
    )
    .catch(err => {
      next(err);
    });
}

function forgetPassword(req, res, next) {
  adminService
    .forgetPassword(req.body)
    .then(msg =>
      res.json(     
        msg
      )
    )
    .catch(err => {
      next(err);
    });
}
function changePassword(req, res, next) {
  adminService
    .changePassword(req.body)
    .then(msg =>
      res.json(   
        msg
      )
    )
    .catch(err => {
      next(err);
    });
}
function update(req, res, next) {
  adminService
    .update( req.body)
    .then(msg => res.json(msg))
    .catch(err => next(err));
}