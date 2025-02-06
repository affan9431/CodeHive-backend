const Survey = require("../model/surveyModel");
const AppError = require("../utils/AppError");

exports.createSurvey = async (req, res, next) => {
  try {
    const survey = await Survey.create(req.body);

    res.status(201).json({ status: "success", data: survey });
  } catch (error) {
    console.log("Something went wrong");
  }
};

exports.getAllSurvey = async (req, res, next) => {
  try {
    const surveys = await Survey.find();

    if (!surveys) {
      return next(new AppError("No surveys found", 404));
    }
    res.status(200).json({
      status: "success",
      results: surveys.length,
      data: {
        surveys,
      },
    });
  } catch (error) {
    console.log("Something went wrong for getting data");
  }
};
