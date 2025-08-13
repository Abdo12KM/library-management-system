const Book = require("../models/bookModel");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const ApiFilters = require("../utils/ApiFilters");

exports.getAllBooks = catchAsync(async (req, res, next) => {
  const features = new ApiFilters(Book.find().populate("authorId").populate("publisherId"), req.query)
    .filter()
    .sort()
    .fields();

  const bookList = await features.query;

  res.status(200).json({
    status: "success",
    results: bookList.length,
    data: {
      books: bookList,
    },
  });
});

exports.getBookById = catchAsync(async (req, res, next) => {
  const book = await Book.findById(req.params.id).populate("authorId").populate("publisherId");

  if (!book) {
    return next(new AppError("Book not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      book,
    },
  });
});

exports.createBook = catchAsync(async (req, res, next) => {
  const newBook = await Book.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      book: newBook,
    },
  });
});

exports.updateBook = catchAsync(async (req, res, next) => {
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!book) {
    return next(new AppError("Book not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      book,
    },
  });
});

exports.deleteBook = catchAsync(async (req, res, next) => {
  const book = await Book.findByIdAndDelete(req.params.id);

  if (!book) {
    return next(new AppError("Book not found", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.updateBookStatus = catchAsync(async (req, res, next) => {
  const { book_status } = req.body;
  
  if (!book_status) {
    return next(new AppError("Book status is required", 400));
  }

  const allowedStatuses = ["available", "borrowed", "maintenance", "lost"];
  if (!allowedStatuses.includes(book_status)) {
    return next(new AppError(`Invalid status. Allowed: ${allowedStatuses.join(", ")}`, 400));
  }

  const book = await Book.findByIdAndUpdate(
    req.params.id,
    { book_status },
    { new: true, runValidators: true }
  );

  if (!book) {
    return next(new AppError("Book not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      book,
    },
  });
});

exports.validateBook = (req, res, next) => {
  const { book_title, book_pages, release_date, authorId, publisherId } = req.body;
  if (!book_title || !book_pages || !release_date || !authorId || !publisherId) {
    return next(
      new AppError("Missing required fields: book_title, book_pages, release_date, authorId, and publisherId", 400)
    );
  }
  
  // Set default status if not provided
  if (!req.body.book_status) {
    req.body.book_status = "available";
  }
  
  next();
};
