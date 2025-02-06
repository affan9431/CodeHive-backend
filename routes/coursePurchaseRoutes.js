const express = require("express");
const purchaseController = require("../controller/purchaseController");

const router = express.Router();

router
  .route("/")
  .get(purchaseController.getAllPurchase)
  .post(purchaseController.createPurchase);

module.exports = router;
