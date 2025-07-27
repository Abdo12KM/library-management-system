const Reader = require("../models/readerModel");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");

// Get all readers
exports.getAllReaders = catchAsync(async (req, res, next) => {
  const readers = await Reader.find();

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
