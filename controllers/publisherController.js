const Publisher = require("../models/publisherModel");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const ApiFilters = require("../utils/ApiFilters");

exports.getAllPublishers = catchAsync(async (req, res, next) => {
  const features = new ApiFilters(Publisher.find().populate('no_published_books'), req.query)
    .filter()
    .sort()
    .fields();

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
  const publisher = await Publisher.findById(req.params.id).populate('no_published_books');

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
  // Remove no_published_books from req.body if it exists (since it's auto-calculated)
  delete req.body.no_published_books;
  
  const newPublisher = await Publisher.create(req.body);
  
  // Populate the virtual field for the response
  await newPublisher.populate('no_published_books');

  res.status(201).json({
    status: "success",
    data: {
      publisher: newPublisher,
    },
  });
});

exports.updatePublisher = catchAsync(async (req, res, next) => {
  // Remove no_published_books from req.body if it exists (since it's auto-calculated)
  delete req.body.no_published_books;
  
  const publisher = await Publisher.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('no_published_books');

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
