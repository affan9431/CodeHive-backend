const Review = require("./../model/reviewModel");
const mongoose = require("mongoose");

exports.createReview = async (req, res) => {
  const review = await Review.create({
    courseID: req.body.id,
    userID: req.body.userId,
    message: req.body.message,
    rating: req.body.rating,
  });

  res.status(201).json({ status: "success", data: review });
};

exports.getReviws = async (req, res) => {
  const reviews = await Review.find();

  res.status(200).json({ status: "success", data: reviews });
};

exports.deleteReview = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ status: "fail", message: "Invalid ID format" });
  }

  try {
    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return res
        .status(404)
        .json({ status: "fail", message: `Review with id ${id} not found` });
    }

    res.status(204).json({
      status: "success",
      message: `Review with id ${id} was deleted`,
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};
