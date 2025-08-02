const Loan = require("../models/loanModel");
const Book = require("../models/bookModel");
const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const ApiFilters = require("../utils/ApiFilters");

exports.getAllLoans = catchAsync(async (req, res, next) => {
  const features = new ApiFilters(
    Loan.find()
      .populate({
        path: "readerId",
        select: "reader_fname reader_lname reader_email",
      })
      .populate({
        path: "staffId",
        select: "staff_fname staff_lname staff_email",
      })
      .populate({
        path: "bookId",
        select: "book_title",
      }),
    req.query
  )
    .filter()
    .sort()
    .fields()
    .pagination();

  const loans = await features.query;

  res.status(200).json({
    status: "success",
    results: loans.length,
    data: {
      loans,
    },
  });
});

exports.createLoan = catchAsync(async (req, res, next) => {
  const { bookId, readerId } = req.body;

  if (!bookId || !readerId) {
    return next(new AppError("Loan must include bookId and readerId", 400));
  }

  // Ensure only staff members can create loans
  if (req.user.role === "reader") {
    return next(new AppError("Only staff members can create loans", 403));
  }

  // Check if book exists
  const book = await Book.findById(bookId);
  if (!book) {
    return next(new AppError(`Book with ID ${bookId} not found`, 404));
  }

  // Check if reader exists
  const Reader = require("../models/readerModel");
  const reader = await Reader.findById(readerId);
  if (!reader) {
    return next(new AppError(`Reader with ID ${readerId} not found`, 404));
  }

  // Check if book is already loaned - a book can only have one active loan at a time
  const existingActiveLoan = await Loan.findOne({
    bookId: bookId,
    status: { $in: ["active", "overdue"] }, // Include overdue loans as they're still "out"
  });

  console.log("Existing Active Loan:", existingActiveLoan);

  if (existingActiveLoan) {
    return next(new AppError("This book is currently on loan and not available", 400));
  }

  try {
    const newLoan = await Loan.create({
      readerId,
      staffId: req.user._id, // Staff member processing the loan
      bookId,
    });

    res.status(201).json({
      status: "success",
      data: {
        loan: newLoan,
      },
    });
  } catch (error) {
    // Handle duplicate key error from the unique index
    if (error.code === 11000 && error.keyPattern && error.keyPattern.bookId) {
      return next(new AppError("This book is currently on loan and not available", 400));
    }
    // Re-throw other errors
    throw error;
  }
});

exports.returnBook = catchAsync(async (req, res, next) => {
  const loan = await Loan.findById(req.params.id);

  if (!loan) {
    return next(new AppError("Loan not found", 404));
  }

  if (loan.status === "returned") {
    return next(new AppError("Book has already been returned", 400));
  }

  loan.loan_return_date = new Date();
  loan.status = "returned";
  await loan.save();

  res.status(200).json({
    status: "success",
    data: {
      loan,
    },
  });
});

exports.getOverdueLoans = catchAsync(async (req, res, next) => {
  // Update overdue loans first
  await Loan.updateOverdueLoans();

  const features = new ApiFilters(
    Loan.find({ status: "overdue" })
      .populate({
        path: "readerId",
        select: "reader_fname reader_lname reader_email",
      })
      .populate({
        path: "bookId",
        select: "book_title",
      }),
    req.query
  )
    .filter()
    .sort()
    .fields()
    .pagination();

  const overdueLoans = await features.query;

  res.status(200).json({
    status: "success",
    results: overdueLoans.length,
    data: {
      loans: overdueLoans,
    },
  });
});
