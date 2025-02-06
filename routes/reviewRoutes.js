const express = require("express");
const reviewController = require("./../controller/reviewController");

const router = express.Router();

router.route("/createReview").post(reviewController.createReview);
router.route("/getReviews").get(reviewController.getReviws);

router.route("/:id").delete(reviewController.deleteReview);

module.exports = router;
