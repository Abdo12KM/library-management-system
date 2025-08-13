const mongoose = require("mongoose");

const publisherSchema = new mongoose.Schema(
  {
    publisher_name: {
      type: String,
      required: [true, "Publisher name is required"],
      minlength: [2, "Publisher name must be at least 2 characters"],
      maxlength: [100, "Publisher name must not exceed 100 characters"],
      trim: true,
    },
    publisher_website: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: "Invalid website URL format",
      },
    },
    year_of_publication: {
      type: Number,
      min: [1000, "Year must be at least 1000"],
      max: [new Date().getFullYear(), "Year cannot be in the future"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);

// Virtual field to calculate number of published books
publisherSchema.virtual('no_published_books', {
  ref: 'Book',
  localField: '_id',
  foreignField: 'publisherId',
  count: true
});

const Publisher = mongoose.model("Publisher", publisherSchema);
module.exports = Publisher;
