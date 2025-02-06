const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "Please provide a name"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  headline: {
    type: String,
  },
  biography: {
    type: String,
  },
  imageUrl: {
    type: String,
    default: null,
  },
  createdAt: { type: Date, default: Date.now },
  changedPasswordAt: Date,
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassoword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Check if password changed after token issuance
userSchema.methods.changedPasswordAfter = function (JwtTimeStamp) {
  if (this.changedPasswordAt) {
    const changePassword = parseInt(
      this.changedPasswordAt.getTime() / 1000,
      10
    );
    return JwtTimeStamp < changePassword;
  }
  return false;
};

// Create User model
const User = mongoose.model("User", userSchema);

module.exports = User;
