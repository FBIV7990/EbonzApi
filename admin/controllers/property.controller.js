const express = require("express");
const router = express.Router();
const propertyService = require("../../services/property.service");

// routes

router.post("/create", create);
router.put("/activate/:id",activate);
router.get("/", getAll);
router.get("/getNearBy", getNearby);
router.post("/uploadReport", uploadReport);
router.get("/:id", getById);
router.post("/update/:id", update);
router.put("/updateData",updateData);
router.post("/updateFiles",updateFiles);
router.delete("/:id", _delete);

module.exports = router;



function create(req, res, next) {

    propertyService
    .create(req)
    .then((message) =>
      res.json({
        code: 200,
        success: true,
        message       
      })
    )
    .catch(err => {     
      next(err);
    });
}

function uploadReport(req, res, next) {

  propertyService
  .uploadReport(req)
  .then((message) =>
    res.json({
      code: 200,
      success: true,
      message       
    })
  )
  .catch(err => {     
    next(err);
  });
}



/////////////////////////////////////
function getAll(req, res, next) {
    propertyService
    .getAll()
    .then(properties => res.json({
         code: 200,
        success: true,
        properties}
        ))
    .catch(err => next(err));
}

function getNearby(req, res, next) {

  propertyService
  .getNearBy(req.query)
  .then(properties => res.json({
       code: 200,
      success: true,
      properties}
      ))
  .catch(err => next(err));
}

function getById(req, res, next) {
    propertyService
    .getById(req.params.id)
    .then(property => (property ? res.json({
        code: 200,
       success: true,
       property}) : res.sendStatus(404)))
    .catch(err => next(err));
}





function update(req, res, next) {
    propertyService
    .update(req)
    .then((message) =>  res.json({
        code: 200,
        success: true,
        message        
      }))
    .catch(err => next(err));
}

function updateData(req, res, next) {
  propertyService
  .updateData(req)
  .then((property) =>  res.json({
      code: 200,
      success: true,
      property:property        
    }))
  .catch(err => next(err));
}

function updateFiles(req, res, next) {
  propertyService
  .updateFiles(req)
  .then((property) =>  res.json({
      code: 200,
      success: true,
      property:property        
    }))
  .catch(err => next(err));
}

function _delete(req, res, next) {
    propertyService
    .delete(req.params.id)
    .then(() => res.json({
        code: 200,
        success: true,
        message:'Property deleted'        
      }))
    .catch(err => next(err));
}

function activate(req, res, next) {
  propertyService
  .activate(req.params.id)
  .then((msg) => res.json({
      code: 200,
      success: true,
      message:msg     
    }))
  .catch(err => next(err));
}
