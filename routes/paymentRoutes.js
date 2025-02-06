const express = require("express");
const paymentController = require("./../controller/paymentController");
const authController = require("./../controller/authController");
const bodyParser = require("body-parser");

const router = express.Router();

router.route("/create-charge").post(paymentController.getCheckoutSession);
router.route("/verify").post(paymentController.verifyPayment);
router.route("/create-charge-live").post(paymentController.getCheckoutSession1);

module.exports = router;
