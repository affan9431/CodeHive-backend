const LiveTutoringModel = require("../model/liveTutingModel");
const AppError = require("../utils/AppError");

exports.getAllLiveTuting = async (req, resizeBy, next) => {
  try {
    const data = await LiveTutoringModel.find({});

    resizeBy.status(200).json({
      status: "success",
      data: data,
    });
  } catch (err) {
    next(new AppError(`${err}: ${JSON.stringify(req)}`, 500));
  }
};

exports.createLiveTuting = async (req, res, next) => {
  try {
    const data = await LiveTutoringModel.create(req.body);
    console.log(req.body);
    res.status(201).json({
      status: "success",
      data: data,
    });
  } catch (err) {
    next(new AppError("An Error Occured", 500));
  }
};
