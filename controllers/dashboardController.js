const Book = require("../models/bookModel");
const Reader = require("../models/readerModel");
const Loan = require("../models/loanModel");
const Fine = require("../models/fineModel");
const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// Get dashboard statistics for admin/librarian
exports.getAdminDashboardStats = catchAsync(async (req, res, next) => {
  try {
    // Get distinct reader IDs with active loans first
    const activeReaderIds = await Loan.distinct("readerId", {
      status: "active",
    });

    // Parallel queries for better performance
    const [
      totalBooks,
      activeReaders,
      activeLoans,
      totalOutstandingFines,
      booksStats,
      loanTrends,
      overdueLoans,
    ] = await Promise.all([
      // Total books count
      Book.countDocuments(),

      // Active readers (readers who have at least one active loan or have borrowed in the last 30 days)
      Reader.countDocuments({
        $or: [
          {
            createdAt: {
              $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
          { _id: { $in: activeReaderIds } },
        ],
      }),

      // Active loans count
      Loan.countDocuments({ status: "active" }),

      // Total outstanding fines amount
      Fine.aggregate([
        { $match: { status: "pending" } },
        { $group: { _id: null, total: { $sum: "$accumulated_amount" } } },
      ]),

      // Books by status
      Book.aggregate([{ $group: { _id: "$book_status", count: { $sum: 1 } } }]),

      // Loan trends (last 30 days)
      Loan.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // Overdue loans
      Loan.countDocuments({
        status: "active",
        loan_due_date: { $lt: new Date() },
      }),
    ]);

    // Calculate monthly growth (comparing with previous month)
    const currentMonth = new Date();
    const lastMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1,
    );
    const currentMonthStart = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1,
    );

    const [
      currentMonthBooks,
      lastMonthBooks,
      currentMonthReaders,
      lastMonthReaders,
    ] = await Promise.all([
      Book.countDocuments({ createdAt: { $gte: currentMonthStart } }),
      Book.countDocuments({
        createdAt: { $gte: lastMonth, $lt: currentMonthStart },
      }),
      Reader.countDocuments({ createdAt: { $gte: currentMonthStart } }),
      Reader.countDocuments({
        createdAt: { $gte: lastMonth, $lt: currentMonthStart },
      }),
    ]);

    // Calculate percentage changes
    const bookGrowth =
      lastMonthBooks > 0
        ? (
            ((currentMonthBooks - lastMonthBooks) / lastMonthBooks) *
            100
          ).toFixed(1)
        : 0;
    const readerGrowth =
      lastMonthReaders > 0
        ? (
            ((currentMonthReaders - lastMonthReaders) / lastMonthReaders) *
            100
          ).toFixed(1)
        : 0;

    const stats = {
      totalBooks: {
        count: totalBooks,
        growth: `${bookGrowth > 0 ? "+" : ""}${bookGrowth}% from last month`,
      },
      activeReaders: {
        count: activeReaders,
        growth: `${readerGrowth > 0 ? "+" : ""}${readerGrowth}% from last month`,
      },
      activeLoans: {
        count: activeLoans,
        overdueCount: overdueLoans,
      },
      outstandingFines: {
        amount: totalOutstandingFines[0]?.total || 0,
      },
      booksStats,
      loanTrends,
      overdueLoans,
    };

    res.status(200).json({
      status: "success",
      data: stats,
    });
  } catch (error) {
    return next(new AppError("Error fetching dashboard statistics", 500));
  }
});

// Get dashboard statistics for readers
exports.getReaderDashboardStats = catchAsync(async (req, res, next) => {
  const readerId = req.user._id;

  try {
    const [
      activeLoans,
      dueSoonLoans,
      outstandingFines,
      totalBooksRead,
      readerHistory,
    ] = await Promise.all([
      // Active loans for this reader
      Loan.find({
        readerId,
        status: "active",
      })
        .populate("bookId", "book_title")
        .populate("staffId", "staff_fname staff_lname"),

      // Loans due in next 3 days
      Loan.countDocuments({
        readerId,
        status: "active",
        loan_due_date: {
          $gte: new Date(),
          $lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        },
      }),

      // Outstanding fines for this reader
      Fine.aggregate([
        {
          $lookup: {
            from: "loans",
            localField: "loanId",
            foreignField: "_id",
            as: "loan",
          },
        },
        {
          $match: {
            "loan.readerId": readerId,
            status: "pending",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$accumulated_amount" },
          },
        },
      ]),

      // Total books read (returned loans)
      Loan.countDocuments({
        readerId,
        status: "returned",
      }),

      // Recent reading history
      Loan.find({
        readerId,
        status: "returned",
      })
        .populate("bookId", "book_title")
        .sort({ loan_return_date: -1 })
        .limit(5),
    ]);

    const stats = {
      activeLoans: {
        count: activeLoans.length,
        books: activeLoans,
      },
      dueSoon: dueSoonLoans,
      outstandingFines: {
        amount: outstandingFines[0]?.total || 0,
      },
      totalBooksRead,
      recentHistory: readerHistory,
    };

    res.status(200).json({
      status: "success",
      data: stats,
    });
  } catch (error) {
    return next(
      new AppError("Error fetching reader dashboard statistics", 500),
    );
  }
});
