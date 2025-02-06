const express = require("express");
const authController = require("../controller/authController");
const surveyController = require("../controller/surveyController");

const router = express.Router();

router
  .route("/")
  .get(surveyController.getAllSurvey)
  .post(surveyController.createSurvey);

module.exports = router;
