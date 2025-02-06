const mongoose = require("mongoose");

const surveySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  experience: {
    type: String,
    enum: ["new", "some", "experienced"],
    required: true,
  },
  content: {
    type: String,
    enum: ["video", "beginner", "preparing"],
    required: true,
  },
  students: {
    type: String,
    enum: ["none", "small", "established"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

surveySchema.pre(/^find/, function (next) {
  this.populate({ path: "userId", select: "userName email" });
  next();
});

module.exports = mongoose.model("Survey", surveySchema);
