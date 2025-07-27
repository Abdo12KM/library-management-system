const Loan = require("../models/loanModel");
const Fine = require("../models/fineModel");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");

exports.getAllFines = catchAsync(async (req, res, next) => {
  const fines = await Fine.find().populate({
    path: "loanId",
    populate: [
      {
        path: "bookId",
        select: "book_title",
      },
      {
        path: "readerId",
        select: "reader_fname reader_lname",
      },
    ],
  });

  res.status(200).json({
    status: "success",
    results: fines.length,
    data: {
      fines,
    },
  });
});

exports.createFine = catchAsync(async (req, res, next) => {
  const { loanId, accumulated_amount, penalty_rate } = req.body;

  // Check if loan exists
  const loan = await Loan.findById(loanId);
  if (!loan) {
    return next(new AppError("No loan found with that ID", 404));
  }

  // Check if fine already exists for this loan
  const existingFine = await Fine.findOne({ loanId });
  if (existingFine) {
    return next(new AppError("Fine already exists for this loan", 400));
  }

  const newFine = await Fine.create({
    loanId,
    accumulated_amount: accumulated_amount || 0,
    penalty_rate: penalty_rate || 1.0,
    fine_due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  });

  res.status(201).json({
    status: "success",
    data: {
      fine: newFine,
    },
  });
});

exports.payFine = catchAsync(async (req, res, next) => {
  const fine = await Fine.findById(req.params.id);

  if (!fine) {
    return next(new AppError("Fine not found", 404));
  }

  if (fine.status === "paid") {
    return next(new AppError("Fine has already been paid", 400));
  }

  fine.status = "paid";
  await fine.save();

  res.status(200).json({
    status: "success",
    data: {
      fine,
    },
  });
});

exports.createFinesForOverdueLoans = catchAsync(async (req, res, next) => {
  // Update overdue loans first
  await Loan.updateOverdueLoans();

  // Find overdue loans that don't have fines yet
  const overdueLoans = await Loan.find({ status: "overdue" });

  let createdFines = 0;

  for (const loan of overdueLoans) {
    // Check if fine already exists for this loan
    const existingFine = await Fine.findOne({ loanId: loan._id });

    if (!existingFine) {
      // Calculate days overdue
      const daysOverdue = Math.ceil((new Date() - loan.loan_due_date) / (1000 * 60 * 60 * 24));
      const accumulatedAmount = daysOverdue * 1.0; // $1 per day

      await Fine.create({
        loanId: loan._id,
        accumulated_amount: accumulatedAmount,
        penalty_rate: 1.0,
        fine_due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      });

      createdFines++;
    }
  }

  res.status(200).json({
    status: "success",
    message: `Created ${createdFines} fines for overdue loans`,
    data: {
      createdFines,
    },
  });
});
