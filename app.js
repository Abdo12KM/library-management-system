const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");

const bookRoutes = require("./routes/bookRoutes");
const readerRouter = require("./routes/readerRoutes");
const staffRouter = require("./routes/staffRoutes");
const authorRouter = require("./routes/authorRoutes");
const publisherRouter = require("./routes/publisherRoutes");
const loanRouter = require("./routes/loanRoutes");
const fineRouter = require("./routes/fineRoutes");
const authRouter = require("./routes/authRoutes");

dotenv.config({ path: "./.env" });

const app = express();

app.use(express.json());
app.use(morgan("dev"));

// Library Management System Routes
app.use("/api/books", bookRoutes);
app.use("/api/readers", readerRouter);
app.use("/api/staff", staffRouter);
app.use("/api/authors", authorRouter);
app.use("/api/publishers", publisherRouter);
app.use("/api/loans", loanRouter);
app.use("/api/fines", fineRouter);
app.use("/api/auth", authRouter);

// Global error handling middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Handle JWT errors
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    err.statusCode = 401;
    err.message =
      err.name === "JsonWebTokenError"
        ? "Invalid token. Please log in again."
        : "Your token has expired. Please log in again.";
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
