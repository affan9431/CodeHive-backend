const express = require("express");
const authController = require("./../controller/authController");
const courseController = require("./../controller/courseController");

const router = express.Router();

router.route("/search").get(courseController.getCourseByQuery);

router
  .route("/")
  .get(courseController.getAllCourses)
  .post(courseController.createCourse);

router
  .route("/:id")
  .get(courseController.getCourse)
  .patch(courseController.updateCourse);


module.exports = router;
