const express = require("express");
const {
  getAllPublishers,
  createPublisher,
  getPublisherById,
  updatePublisher,
  deletePublisher,
} = require("../controllers/publisherController");
const { protect, restrictTo } = require("../controllers/authController");

const publisherRouter = express.Router();

publisherRouter.get("/", getAllPublishers);
publisherRouter.post(
  "/",
  protect,
  restrictTo("admin", "librarian"),
  createPublisher,
);
publisherRouter.get("/:id", getPublisherById);
publisherRouter.patch(
  "/:id",
  protect,
  restrictTo("admin", "librarian"),
  updatePublisher,
);
publisherRouter.delete("/:id", protect, restrictTo("admin"), deletePublisher);

module.exports = publisherRouter;
