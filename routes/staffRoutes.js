const express = require("express");
const { createStaff, getAllStaff, getStaffById, deleteStaff, getMe } = require("../controllers/staffController");
const { protect, restrictTo } = require("../controllers/authController");

const staffRouter = express.Router();
staffRouter.get("/", protect, restrictTo("admin"), getAllStaff);
staffRouter.get("/getMe", protect, getMe);
staffRouter.get("/:id", protect, restrictTo("admin"), getStaffById);
staffRouter.post("/", protect, restrictTo("admin"), createStaff);
staffRouter.delete("/:id", protect, restrictTo("admin"), deleteStaff);

module.exports = staffRouter;
