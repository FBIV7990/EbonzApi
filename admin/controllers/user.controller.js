const express = require("express");
const router = express.Router();
const userService = require("../../services/user.service");


// routes
router.post("/authenticate", authenticate);
router.post("/register", register);
router.post("/verifyOTP", verifyOTP);
router.put("/setPassword", setPassword);
router.put("/changePassword", changePassword);
router.post("/updatePhoto/:id", uploadPhoto);
router.put("/activate/:id", activate);
router.put("/deactivate/:id", deactivate);
router.get("/", getAll);
router.get("/current", getCurrent);
router.get("/:id", getById);
router.get("/get/count", getCount);
router.put("/:id", update);
router.delete("/:id", _delete);

module.exports = router;

///////////////AUTHENTICATE USER///////////////////

function authenticate(req, res, next) {
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

/////////////////////////////////////
function getAll(req, res, next) {
  userService
    .getAll()
    .then(users => res.json(users))
    .catch(err => next(err));
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
function activate(req, res, next) {
  userService
    .activate(req.params.id)
    .then(msg =>
      res.json(      
       msg
      )
    )
    .catch(err => {
      next(err);
    });
}
function deactivate(req, res, next) {
  userService
    .deactivate(req.params.id)
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
      res.json({
    msg
      })
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
    .update(req.params.id, req.body)
    .then((user) => res.json({user}))
    .catch(err => next(err));
}

function _delete(req, res, next) {
  userService
    .delete(req.params.id)
    .then(() => res.json({}))
    .catch(err => next(err));
}

function getCount(req, res, next) {
  userService
    .getTotal()
    .then((result) => res.json(result))
    .catch(err => next(err));
}
