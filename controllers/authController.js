const Reader = require("../models/readerModel");
const Staff = require("../models/staffModel");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");

const signToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signUpReader = catchAsync(async (req, res, next) => {
  const { reader_fname, reader_lname, reader_email, reader_phone_no, reader_address, password } = req.body;

  // Verify email and phone number uniqueness
  const existingReader = await Reader.findOne({
    $or: [{ reader_email }, { reader_phone_no }],
  });

  if (existingReader) {
    return next(new AppError("Email or phone number already exists", 400));
  }

  const newReader = await Reader.create({
    reader_fname,
    reader_lname,
    reader_email,
    reader_phone_no,
    reader_address,
    password,
  });

  const token = signToken({ id: newReader._id, role: newReader.role });

  res.status(201).json({
    message: "success",
    data: newReader,
    token,
  });
});

exports.loginReader = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const reader = await Reader.findOne({ reader_email: email }).select("+password");

  if (!reader || !(await reader.correctPassword(password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const token = signToken({ id: reader._id, role: reader.role });
  res.status(200).json({
    message: "success",
    token,
    data: {
      user: {
        id: reader._id,
        name: reader.fullName,
        email: reader.reader_email,
        role: reader.role,
      },
    },
  });
});

exports.loginStaff = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const staff = await Staff.findOne({ staff_email: email }).select("+password");

  if (!staff || !(await staff.correctPassword(password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const token = signToken({ id: staff._id, role: staff.role });
  res.status(200).json({
    message: "success",
    token,
    data: {
      user: {
        id: staff._id,
        name: staff.fullName,
        email: staff.staff_email,
        role: staff.role,
      },
    },
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
    return next(new AppError("You are not logged in! please log in to get access", 401));
  }

  const token = req.headers.authorization.split(" ")[1]; // Bearer token => [Bearer , token]

  // Add token validation
  if (!token) {
    return next(new AppError("No token provided", 401));
  }

  let decode;
  try {
    decode = await jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(new AppError("Invalid token", 401));
    } else if (error.name === "TokenExpiredError") {
      return next(new AppError("Token has expired", 401));
    }
    return next(new AppError("Token verification failed", 401));
  }

  let user;

  // Try to find user in Reader collection first
  user = await Reader.findById(decode.id);
  if (!user) {
    // If not found in Reader, try Staff collection
    user = await Staff.findById(decode.id);
  }

  if (!user) {
    return next(new AppError("User no longer exists", 404));
  }
  req.user = user;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to perform this action", 403));
    }

    next();
  };
};
