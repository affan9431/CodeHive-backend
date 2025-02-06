const express = require("express");
const authController = require("./../controller/authController");

const router = express.Router();

router.route("/signup").post(authController.signup);
router.route("/signin").post(authController.login);

router
  .route("/:id")
  .get(authController.getUserById)
  .patch(authController.updateUser);


module.exports = router;

