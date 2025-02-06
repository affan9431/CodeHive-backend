const User = require("./../model/userModel");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

exports.signup = async (req, res) => {
  const newUser = await User.create({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
  });

  // create token
  const token = jwt.sign(
    { id: newUser._id, userName: newUser.userName, email: newUser.email },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      newUser,
      token,
    },
  });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassoword(password, user.password))) {
    return next(new AppError("Invalid email or password", 401));
  }

  // create token
  const token = jwt.sign(
    { id: user._id, userName: user.userName, email: user.email },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );

  res.cookie("jwt", {
    expire: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  });

  // send token
  res.status(200).json({
    status: "success",
    data: { token },
  });
};

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token)
    return next(new AppError("Not authorized to access this route", 404));

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new AppError("Not authorized to access this route.", 404));
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User changed password. Please log in again.", 401)
    );
  }

  req.user = currentUser;
  next();
};

exports.updateUser = async (req, res, next) => {
  console.log(req.params.id);
  const { userName, headline, biography, imageUrl } = req.body;

  try {
    if (!userName || !headline || !biography)
      return next(new AppError("Please fill in all fields", 400));
    const user = await User.findByIdAndUpdate(req.params.id, {
      userName,
      headline,
      biography,
      imageUrl,
    });
    res.status(200).json({ status: "success", data: { user } });
  } catch (err) {
    return next(new AppError("Something went wrong", 400));
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError("User not found", 404));
    res.status(200).json({ success: "success", data: user });
  } catch (error) {
    next(new AppError("Server error", 500));
  }
};


