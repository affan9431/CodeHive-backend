const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseFor: {
    type: [String],
    required: true,
  },
  intendedLearners: {
    type: [String],
    required: true,
  },
  prerequisites: {
    type: [String],
    required: true,
  },
  captions: {
    type: [String],
    required: true,
  },
  courseTitle: {
    type: String,
    required: true,
  },
  courseSubtitle: {
    type: String,
  },
  courseDescription: {
    type: String,
    required: true,
  },
  categoryName: {
    type: String,
    required: true,
  },
  languageName: {
    type: String,
    required: true,
  },
  levelName: {
    type: String,
    required: true,
  },
  promotionalVideo: {
    type: String,
    default: null,
  },
  imagePreview: {
    type: String,
    default: null,
  },
  currency: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["draft", "published", "archived"],
    default: "draft",
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  randomID: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

courseSchema.pre(/^find/, function (next) {
  this.populate({
    path: "createdBy",
    select: "-__v -createdAt -password",
  });
  next();
});

courseSchema.index({ courseTitle: 1, categoryName: 1 });

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
