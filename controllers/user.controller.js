const express = require("express");
const router = express.Router();
const userService = require("../services/user.service");
const reportService= require("../services/reportuser.service");

// routes
router.post("/authenticate", authenticate);
router.post("/register", register);
router.post("/verifyOTP", verifyOTP);
router.post("/resendOTP", resendOTP);
router.post("/report",report);
router.post("/forgetPassword", forgetPassword);
router.post("/saveSetting", saveSetting);
router.get("/getSetting/:id",getSetting)
router.put("/setPassword", setPassword);
router.put("/changePassword", changePassword);
router.post("/updatePhoto/:id", uploadPhoto);
router.get("/current", getCurrent);
router.get("/:id", getById);
router.post("/update", update);
router.post("/setToken", setToken);

module.exports = router;

///////////////AUTHENTICATE USER///////////////////

function authenticate(req, res, next) {
  console.log('controller called');
  userService
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
  userService
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
  userService
    .getById(req.user.uid)
    .then(user => (user ? res.json(user) : res.sendStatus(404)))
    .catch(err => next(err));
}

function getById(req, res, next) {
  userService
    .getById(req.params.id)
    .then(user => (user ? res.json(user) : res.sendStatus(404)))
    .catch(err => next(err));
}

function verifyOTP(req, res, next) {
  userService
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
  userService
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

//////////////////REGISTER USER///////////////////
function uploadPhoto(req, res, next) {
  userService
    .updateUserPhoto(req)
    .then(msg =>
      res.json(msg)
    )
    .catch(err => {
      next(err);
    });
}

function setPassword(req, res, next) {
  userService
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

function saveSetting(req, res, next) {
  userService
    .saveSetting(req.body)
    .then(msg =>
      res.json(      
       msg
      )
    )
    .catch(err => {
      next(err);
    });
}

function getSetting(req, res, next) {
  userService
    .getSetting(req.params.id)
    .then(msg =>
      res.json(      
       msg
      )
    )
    .catch(err => {
      next(err);
    });
}

function setToken(req, res, next) {
  console.log(req.body);
  userService
    .setfirebaseToken(req.body)
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
  console.log(req.body);
  userService
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
  userService
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
  userService
    .update(req.body)
    .then(msg => res.json(msg))
    .catch(err => next(err));
}

function report(req,res,next)
{
  reportService
  .add(req)
  .then(data => res.json(data) )
  .catch(err => next(err));
}