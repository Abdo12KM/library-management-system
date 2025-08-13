const express = require("express");
const {
  getAllReaders,
  getReaderById,
  deleteReader,
  getMe,
  updateMe,
  updateMyPassword,
} = require("../controllers/readerController");
const { protect, restrictTo } = require("../controllers/authController");

const readerRouter = express.Router();
readerRouter.get("/", protect, restrictTo("admin", "librarian"), getAllReaders);
readerRouter.get("/getMe", protect, getMe);
readerRouter.patch("/updateMe", protect, updateMe);
readerRouter.patch("/updateMyPassword", protect, updateMyPassword);
readerRouter.get(
  "/:id",
  protect,
  restrictTo("admin", "librarian"),
  getReaderById,
);
readerRouter.delete("/:id", protect, restrictTo("admin"), deleteReader);

module.exports = readerRouter;
