const Staff = require("../models/staffModel");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const ApiFilters = require("../utils/ApiFilters");

exports.createStaff = catchAsync(async (req, res, next) => {
  const newStaff = await Staff.create(req.body);

  res.status(201).json({
    message: "Staff created successfully",
    data: newStaff,
  });
});

// Get all staff
exports.getAllStaff = catchAsync(async (req, res, next) => {
  const features = new ApiFilters(Staff.find(), req.query)
    .filter()
    .sort()
    .fields()
    .pagination();

  const staff = await features.query;

  res.status(200).json({
    message: "Staff fetched successfully",
    length: staff.length,
    data: staff,
  });
});

// Get staff by ID
exports.getStaffById = catchAsync(async (req, res, next) => {
  const staff = await Staff.findById(req.params.id);
  if (!staff) {
    return next(new AppError("Staff not found", 404));
  }

  res.status(200).json({
    message: "Staff fetched successfully",
    data: staff,
  });
});

exports.deleteStaff = catchAsync(async (req, res, next) => {
  const staff = await Staff.findById(req.params.id);
  if (!staff) {
    return next(new AppError("Staff not found", 404));
  }

  await Staff.findByIdAndDelete(req.params.id);

  res.status(204).json();
});

exports.getMe = catchAsync(async (req, res, next) => {
  const staff = await Staff.findById(req.user._id);
  if (!staff) {
    return next(new AppError("Staff not found", 404));
  }

  res.status(200).json({ staff });
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
  const allowedFields = ["staff_fname", "staff_lname", "staff_email"];
  const filteredBody = {};
  Object.keys(req.body).forEach((el) => {
    if (allowedFields.includes(el)) filteredBody[el] = req.body[el];
  });

  // Update user document
  const updatedStaff = await Staff.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    message: "Staff profile updated successfully",
    data: updatedStaff,
  });
});

// Update own password
exports.updateMyPassword = catchAsync(async (req, res, next) => {
  // 1) Get user from database
  const staff = await Staff.findById(req.user._id).select("+password");

  // 2) Check if POSTed current password is correct
  if (!(await staff.correctPassword(req.body.passwordCurrent))) {
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
  staff.password = req.body.password;
  await staff.save();
  // Staff.findByIdAndUpdate will NOT work as intended because pre-save middleware won't run!

  // 6) Send response (don't send the new JWT token for security)
  res.status(200).json({
    message: "Password updated successfully",
  });
});
