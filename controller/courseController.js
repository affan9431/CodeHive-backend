const AppError = require("../utils/AppError");
const Course = require("../model/courseModel");
const Review = require("../model/reviewModel");

exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        course,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Error creating course",
      error: error.message,
    });
  }
};

exports.getAllCourses = async (req, res, next) => {
  const courses = await Course.find();

  if (!courses) {
    return next(new AppError("No courses found", 404));
  }

  res
    .status(200)
    .json({ status: "success", results: courses.length, data: { courses } });
};

exports.getCourse = async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new AppError("No course found with that ID", 404));
  }

  res.status(200).json({ status: "success", data: course });
};

exports.updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ status: "success", data: course });
  } catch (error) {
    next(new AppError("Error updating the course", 500));
  }
};

exports.getCourseByQuery = async (req, res, next) => {
  try {
    const { q } = req.query;

    const courses = await Course.find({
      $or: [
        { categoryName: { $regex: q, $options: "i" } }, // Case-insensitive search in category
        { courseTitle: { $regex: q, $options: "i" } }, // Case-insensitive search in course title
      ],
    });

    res.status(200).json({
      status: "success",
      results: courses.length,
      data: { courses },
    });
  } catch (error) {
    next(new AppError("Error getting the course", 500));
  }
};
