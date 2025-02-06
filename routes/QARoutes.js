const express = require("express");
const router = express.Router();
const {
  createQuestion,
  getQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion,
  addAnswer,
  voteQuestion,
  searchQuestions,
} = require("../controller/QAController");

router.route("/").get(getQuestions);
router
  .route("/:id")
  .get(getQuestion)
  .patch(updateQuestion)
  .post(createQuestion)
  .delete(deleteQuestion);

router.post("/:id/answers", addAnswer);
router.post("/questions/:id/vote", voteQuestion);
router.get("/questions/search", searchQuestions);

module.exports = router;
