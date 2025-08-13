const mongoose = require("mongoose");

const fineSchema = new mongoose.Schema(
  {
    loanId: {
      type: mongoose.Schema.ObjectId,
      ref: "Loan",
      required: [true, "Fine must belong to a loan"],
    },
    fine_due_date: {
      type: Date,
      required: [true, "Fine must have a due date"],
    },
    accumulated_amount: {
      type: Number,
      required: [true, "Fine must have an amount"],
      min: [0, "Fine amount cannot be negative"],
      default: 0,
    },
    penalty_rate: {
      type: Number,
      required: [true, "Fine must have a penalty rate"],
      min: [0, "Penalty rate cannot be negative"],
      default: 1.0, // Default penalty rate per day
    },
    status: {
      type: String,
      enum: ["pending", "paid", "waived"],
      default: "pending",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);

const Fine = mongoose.model("Fine", fineSchema);
module.exports = Fine;
