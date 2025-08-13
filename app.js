const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");

const bookRoutes = require("./routes/bookRoutes");
const readerRouter = require("./routes/readerRoutes");
const staffRouter = require("./routes/staffRoutes");
const authorRouter = require("./routes/authorRoutes");
const publisherRouter = require("./routes/publisherRoutes");
const loanRouter = require("./routes/loanRoutes");
const fineRouter = require("./routes/fineRoutes");
const authRouter = require("./routes/authRoutes");
const dashboardRouter = require("./routes/dashboardRoutes");

dotenv.config({ path: "./.env" });

const app = express();

// CORS configuration for frontend
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://fue-lms.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, etc.)
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        process.env.NODE_ENV === "development"
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(morgan("dev"));

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Library Management System API is running!",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Service is healthy",
  });
});

// Library Management System Routes
app.use("/api/books", bookRoutes);
app.use("/api/readers", readerRouter);
app.use("/api/staff", staffRouter);
app.use("/api/authors", authorRouter);
app.use("/api/publishers", publisherRouter);
app.use("/api/loans", loanRouter);
app.use("/api/fines", fineRouter);
app.use("/api/auth", authRouter);
app.use("/api/dashboard", dashboardRouter);

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
