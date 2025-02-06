const Purchase = require("../model/coursePurchase");
const AppError = require("../utils/AppError");

exports.createPurchase = async (req, res, next) => {
  try {
    const data = await Purchase.create({ ...req.body });
    res.status(201).json({ status: "success", data });
  } catch (error) {
    next(new AppError("Something went wrong", 500));
  }
};

exports.getAllPurchase = async (req, res, next) => {
  try {
    const data = await Purchase.find({});
    res.status(200).json({ status: "success", data });
  } catch (error) {
    next(new AppError("Something went wrong, please try again later.", 500));
  }
};