const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  courseID: {
    type: mongoose.Schema.ObjectId,
    ref: "Course",
    required: [true, "Course ID is required"],
  },
  userID: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
  },
  message: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

reviewSchema.index({ courseID: 1, userID: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "courseID",
    select: " -__v",
  }).populate({
    path: "userID",
    select: "-_id userName",
  });

  next();
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
