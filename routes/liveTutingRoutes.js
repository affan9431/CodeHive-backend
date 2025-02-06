const express = require("express");
const router = express.Router();
const liveTutingController = require("../controller/liveTutingController");

router
  .route("/")
  .get(liveTutingController.getAllLiveTuting)
  .post(liveTutingController.createLiveTuting);

module.exports = router;
