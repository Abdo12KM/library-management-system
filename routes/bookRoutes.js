const express = require("express");
const {
  getAllBooks,
  createBook,
  getBookById,
  updateBook,
  deleteBook,
  validateBook,
} = require("../controllers/bookController");
const { protect, restrictTo } = require("../controllers/authController");

const Router = express.Router();

Router.get("/", getAllBooks);

Router.post("/", protect, restrictTo("admin", "librarian"), validateBook, createBook);

Router.get("/:id", getBookById);

Router.patch("/:id", protect, restrictTo("admin", "librarian"), updateBook);

Router.delete("/:id", protect, restrictTo("admin"), deleteBook);

module.exports = Router;
