const express = require("express");
const {
  getAllAuthors,
  createAuthor,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
} = require("../controllers/authorController");
const { protect, restrictTo } = require("../controllers/authController");

const authorRouter = express.Router();

authorRouter.get("/", getAllAuthors);
authorRouter.post("/", protect, restrictTo("admin", "librarian"), createAuthor);
authorRouter.get("/:id", getAuthorById);
authorRouter.patch("/:id", protect, restrictTo("admin", "librarian"), updateAuthor);
authorRouter.delete("/:id", protect, restrictTo("admin"), deleteAuthor);

module.exports = authorRouter;
