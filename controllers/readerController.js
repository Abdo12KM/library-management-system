const Reader = require("../models/readerModel");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const ApiFilters = require("../utils/ApiFilters");

// Get all readers
exports.getAllReaders = catchAsync(async (req, res, next) => {
  const features = new ApiFilters(Reader.find(), req.query)
    .filter()
    .sort()
    .fields()
    .pagination();

  const readers = await features.query;

  res.status(200).json({
    message: "Readers fetched successfully",
    length: readers.length,
    data: readers,
  });
});

// Get reader by ID
exports.getReaderById = catchAsync(async (req, res, next) => {
  const reader = await Reader.findById(req.params.id);
  if (!reader) {
    return next(new AppError("Reader not found", 404));
  }

  res.status(200).json({
    message: "Reader fetched successfully",
    data: reader,
  });
});

exports.deleteReader = catchAsync(async (req, res, next) => {
  const reader = await Reader.findById(req.params.id);
  if (!reader) {
    return next(new AppError("Reader not found", 404));
  }

  await Reader.findByIdAndDelete(req.params.id);

  res.status(204).json();
});

exports.getMe = catchAsync(async (req, res, next) => {
  const reader = await Reader.findById(req.user._id);
  if (!reader) {
    return next(new AppError("Reader not found", 404));
  }

  res.status(200).json({ data: reader });
});

// Update own profile data
exports.updateMe = catchAsync(async (req, res, next) => {
  // Create error if user POSTs password data
  if (req.body.password) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  // Filter out unwanted field names that are not allowed to be updated
  const allowedFields = ["reader_fname", "reader_lname", "reader_email", "reader_phone_no", "reader_address"];
  const filteredBody = {};
  Object.keys(req.body).forEach((el) => {
    if (allowedFields.includes(el)) filteredBody[el] = req.body[el];
  });

  // Update user document
  const updatedReader = await Reader.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    message: "Reader profile updated successfully",
    data: updatedReader,
  });
});

// Update own password
exports.updateMyPassword = catchAsync(async (req, res, next) => {
  // 1) Get user from database
  const reader = await Reader.findById(req.user._id).select("+password");

  // 2) Check if POSTed current password is correct
  if (!(await reader.correctPassword(req.body.passwordCurrent))) {
    return next(new AppError("Your current password is incorrect.", 401));
  }

  // 3) Validate new password
  if (!req.body.password || !req.body.passwordConfirm) {
    return next(new AppError("Please provide both new password and password confirmation.", 400));
  }

  // 4) Check if new password matches confirmation
  if (req.body.password !== req.body.passwordConfirm) {
    return next(new AppError("Password and password confirmation do not match.", 400));
  }

  // 5) If so, update password
  reader.password = req.body.password;
  await reader.save();
  // Reader.findByIdAndUpdate will NOT work as intended because pre-save middleware won't run!

  // 6) Send response (don't send the new JWT token for security)
  res.status(200).json({
    message: "Password updated successfully",
  });
});
