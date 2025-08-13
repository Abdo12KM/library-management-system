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
    book_ISBN: {
      type: String,
      unique: true,
      sparse: true, // Allow multiple null values but enforce uniqueness when present
      trim: true,
      validate: {
        validator: function (v) {
          // Basic ISBN validation (10 or 13 digits with optional hyphens)
          if (!v) return true; // Allow empty/null
          const isbn = v.replace(/[-\s]/g, ''); // Remove hyphens and spaces
          return /^\d{10}(\d{3})?$/.test(isbn);
        },
        message: "Invalid ISBN format. Must be 10 or 13 digits.",
      },
    },
    book_status: {
      type: String,
      enum: ["available", "borrowed", "maintenance", "lost"],
      default: "available",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
