const express = require("express");
const {
  createStaff,
  getAllStaff,
  getStaffById,
  deleteStaff,
  getMe,
  updateMe,
  updateMyPassword,
} = require("../controllers/staffController");
const { protect, restrictTo } = require("../controllers/authController");

const staffRouter = express.Router();
staffRouter.get("/", protect, restrictTo("admin"), getAllStaff);
staffRouter.get("/getMe", protect, getMe);
staffRouter.patch("/updateMe", protect, updateMe);
staffRouter.patch("/updateMyPassword", protect, updateMyPassword);
staffRouter.get("/:id", protect, restrictTo("admin"), getStaffById);
staffRouter.post("/", protect, restrictTo("admin"), createStaff);
staffRouter.delete("/:id", protect, restrictTo("admin"), deleteStaff);

module.exports = staffRouter;
