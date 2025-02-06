const Question = require("../model/QASectionModel"); // Assuming the model is in a separate file
const AppError = require("../utils/AppError");

// Create a new question
exports.createQuestion = async (req, res) => {
  try {
    const { content, userId, courseId } = req.body;

    const newQuestion = await Question.create({
      content,
      user: userId,
      course: courseId,
    });

    res.status(201).json({
      success: true,
      data: newQuestion,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get all questions (with pagination)
exports.getQuestions = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const total = await Question.countDocuments();
    const questions = await Question.find()
      .skip(startIndex)
      .limit(limit)
      .populate("user", "userName")
      .populate("course", "title");

    res.status(200).json({
      success: true,
      count: questions.length,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalQuestions: total,
      },
      data: questions,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Get a single question by ID
exports.getQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate("user", "name")
      .populate("course", "title")
      .populate("answers.user", "name");

    if (!question) {
      return res.status(404).json({
        success: false,
        error: "Question not found",
      });
    }

    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Update a question
exports.updateQuestion = async (req, res) => {
  try {
    const { content, tags } = req.body;

    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { content, tags, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        error: "Question not found",
      });
    }

    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete a question
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        error: "Question not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Add an answer to a question
exports.addAnswer = async (req, res, next) => {
  try {
    const { content, userId } = req.body;

    const question = await Question.findOne({ course: req.params.id });

    if (!question) {
      next(new AppError("Question not found", 404));
    }

    const newAnswer = {
      content,
      user: userId,
    };

    console.log(newAnswer);

    if (!question.answers) {
      question.answers = [];
    }

    question.answers.push(newAnswer);
    question.updatedAt = Date.now();

    await question.save();

    await question.populate({
      path: "answers.user", 
      select: "userName email",
    });

    res.status(201).json({
      success: true,
      data: question,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Vote on a question
exports.voteQuestion = async (req, res) => {
  try {
    const { vote } = req.body; // 1 for upvote, -1 for downvote

    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { $inc: { votes: vote } },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        error: "Question not found",
      });
    }

    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// Search questions
exports.searchQuestions = async (req, res) => {
  try {
    const { query } = req.query;

    const questions = await Question.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .populate("user", "name")
      .populate("course", "title");

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
