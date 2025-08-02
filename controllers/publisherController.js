const Publisher = require("../models/publisherModel");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const ApiFilters = require("../utils/ApiFilters");

exports.getAllPublishers = catchAsync(async (req, res, next) => {
  const features = new ApiFilters(Publisher.find(), req.query)
    .filter()
    .sort()
    .fields()
    .pagination();

  const publishers = await features.query;

  res.status(200).json({
    status: "success",
    results: publishers.length,
    data: {
      publishers,
    },
  });
});

exports.getPublisherById = catchAsync(async (req, res, next) => {
  const publisher = await Publisher.findById(req.params.id);

  if (!publisher) {
    return next(new AppError("Publisher not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      publisher,
    },
  });
});

exports.createPublisher = catchAsync(async (req, res, next) => {
  const newPublisher = await Publisher.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      publisher: newPublisher,
    },
  });
});

exports.updatePublisher = catchAsync(async (req, res, next) => {
  const publisher = await Publisher.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!publisher) {
    return next(new AppError("Publisher not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      publisher,
    },
  });
});

exports.deletePublisher = catchAsync(async (req, res, next) => {
  const publisher = await Publisher.findByIdAndDelete(req.params.id);

  if (!publisher) {
    return next(new AppError("Publisher not found", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
