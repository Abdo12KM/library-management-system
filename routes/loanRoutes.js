const express = require("express");
const {
  getAllLoans,
  createLoan,
  returnBook,
  getOverdueLoans,
} = require("../controllers/loanController");
const { protect, restrictTo } = require("../controllers/authController");

const loanRouter = express.Router();

loanRouter.get("/", protect, restrictTo("admin", "librarian"), getAllLoans);
loanRouter.get(
  "/overdue",
  protect,
  restrictTo("admin", "librarian"),
  getOverdueLoans,
);
loanRouter.post("/", protect, restrictTo("admin", "librarian"), createLoan);
loanRouter.patch(
  "/:id/return",
  protect,
  restrictTo("admin", "librarian"),
  returnBook,
);

module.exports = loanRouter;
