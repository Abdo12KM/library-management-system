const express = require("express");
const {
  getAllFines,
  createFine,
  payFine,
  createFinesForOverdueLoans,
} = require("../controllers/fineController");
const { protect, restrictTo } = require("../controllers/authController");

const fineRouter = express.Router();

fineRouter.get("/", protect, restrictTo("admin", "librarian"), getAllFines);
fineRouter.post("/", protect, restrictTo("admin", "librarian"), createFine);
fineRouter.post(
  "/create-overdue",
  protect,
  restrictTo("admin", "librarian"),
  createFinesForOverdueLoans,
);
fineRouter.patch("/:id/pay", protect, payFine);

module.exports = fineRouter;
