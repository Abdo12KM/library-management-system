const mongoose = require("mongoose");
const validator = require("validator");

const authorSchema = new mongoose.Schema(
  {
    author_name: {
      type: String,
      required: [true, "Author name is required"],
      minlength: [2, "Author name must be at least 2 characters"],
      maxlength: [100, "Author name must not exceed 100 characters"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Author must have an email"],
      validate: [validator.isEmail, "Invalid email format"],
    },
    biography: {
      type: String,
      maxlength: [1000, "Biography must not exceed 1000 characters"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

const Author = mongoose.model("Author", authorSchema);
module.exports = Author;
