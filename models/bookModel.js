const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    book_title: {
      type: String,
      required: [true, "Book must have a title"],
      unique: true,
      trim: true,
    },
    book_description: {
      type: String,
      maxlength: [1000, "Description must not exceed 1000 characters"],
    },
    book_pages: {
      type: Number,
      required: [true, "Book must have number of pages"],
      min: [1, "Pages must be at least 1"],
    },
    release_date: {
      type: Date,
      required: [true, "Book must have a release date"],
      validate: {
        validator: function (v) {
          return v <= new Date();
        },
        message: "Release date cannot be in the future",
      },
    },
    book_tags: [
      {
        type: String,
        trim: true,
      },
    ],
    authorId: {
      type: mongoose.Schema.ObjectId,
      ref: "Author",
      required: [true, "Book must have an author"],
    },
    publisherId: {
      type: mongoose.Schema.ObjectId,
      ref: "Publisher",
      required: [true, "Book must have a publisher"],
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
