const Staff = require("../models/staffModel");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");

exports.createStaff = catchAsync(async (req, res, next) => {
  const newStaff = await Staff.create(req.body);

  res.status(201).json({
    message: "Staff created successfully",
    data: newStaff,
  });
});

// Get all staff
exports.getAllStaff = catchAsync(async (req, res, next) => {
  const staff = await Staff.find();

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
