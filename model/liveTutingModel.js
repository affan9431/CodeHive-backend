const mongoose = require("mongoose");

const liveTutingScehema = new mongoose.Schema({
  name: { type: String, required: true },
  zoomId: { type: String, required: true },
  price: { type: Number, required: true },
  symbol: { type: String, required: true },
  startDate: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: { type: String, required: true },
  instructorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

liveTutingScehema.pre(/^find/, function (next) {
  this.populate({
    path: "instructorID",
    select: "userName email",
  });
  next();
});

module.exports = mongoose.model("LiveTutoringModel", liveTutingScehema);
