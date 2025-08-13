const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema(
  {
    readerId: {
      type: mongoose.Schema.ObjectId,
      ref: "Reader",
      required: true,
    },
    staffId: {
      type: mongoose.Schema.ObjectId,
      ref: "Staff",
      required: true,
    },
    bookId: {
      type: mongoose.Schema.ObjectId,
      ref: "Book",
      required: true,
    },
    loan_start_date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    loan_due_date: {
      type: Date,
    },
    loan_return_date: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["active", "returned", "overdue"],
      default: "active",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);

// Pre-save middleware to set due date (14 days from start date)
loanSchema.pre("save", function (next) {
  if (this.isNew) {
    this.loan_due_date = new Date(
      this.loan_start_date.getTime() + 14 * 24 * 60 * 60 * 1000,
    );
  }
  next();
});

// Method to check and update overdue loans
loanSchema.statics.updateOverdueLoans = async function () {
  const now = new Date();
  await this.updateMany(
    {
      loan_due_date: { $lt: now },
      status: "active",
    },
    { status: "overdue" },
  );
};

// Virtual to check if loan is overdue
loanSchema.virtual("isOverdue").get(function () {
  return this.status === "active" && this.loan_due_date < new Date();
});

// Add a compound index for bookId + status to prevent duplicate active loans
loanSchema.index(
  {
    bookId: 1,
    status: 1,
  },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ["active", "overdue"] } },
  },
);

const Loan = mongoose.model("Loan", loanSchema);
module.exports = Loan;
