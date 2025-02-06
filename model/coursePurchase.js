const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  purchasedBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  instructor: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: mongoose.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  status: {
    type: String,
    enumValues: ["pending", "completed"],
  },
  createdAt: { type: Date, default: () => new Date() },
});

purchaseSchema.pre(/^find/, function (next) {
  this.populate({ path: "course" })
    .populate({ path: "instructor" })
    .populate({ path: "purchasedBy" });
  next();
});

module.exports = mongoose.model("Purchase", purchaseSchema);
