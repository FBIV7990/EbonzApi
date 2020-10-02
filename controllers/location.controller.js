const express = require("express");
const router = express.Router();
const locationService = require("../services/jsondata/location.service");
// routes

router.get("/", getAll);
// router.get("/:id", getById);// User Id

module.exports = router;

function getAll(req, res, next) {
  locationService
    .get(req.query)
    .then((data) => res.json(data))
    .catch((err) => next(err));
}
