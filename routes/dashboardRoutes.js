const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const authController = require("../controllers/authController");

// Protect all routes
router.use(authController.protect);

// Admin/Librarian dashboard route
router.get(
  "/admin",
  authController.restrictTo("admin", "librarian"),
  dashboardController.getAdminDashboardStats,
);

// Reader dashboard route
router.get(
  "/reader",
  authController.restrictTo("reader"),
  dashboardController.getReaderDashboardStats,
);

module.exports = router;
