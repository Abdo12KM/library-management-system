const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const readerSchema = new mongoose.Schema(
  {
    reader_fname: {
      type: String,
      required: [true, "Reader first name is required"],
      minlength: [2, "First name must be at least 2 characters"],
      maxlength: [50, "First name must not exceed 50 characters"],
    },
    reader_lname: {
      type: String,
      required: [true, "Reader last name is required"],
      minlength: [2, "Last name must be at least 2 characters"],
      maxlength: [50, "Last name must not exceed 50 characters"],
    },
    reader_email: {
      type: String,
      required: [true, "Reader must have an email"],
      unique: true,
      validate: [validator.isEmail, "Invalid email"],
    },
    reader_phone_no: {
      type: String,
      required: [true, "Reader must have a phone number"],
      unique: true,
    },
    reader_address: {
      type: String,
      required: [true, "Reader address is required"],
    },
    password: {
      type: String,
      required: [true, "Reader must have a password"],
      validate: [
        validator.isStrongPassword,
        "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol",
      ],
      select: false,
    },
    role: {
      type: String,
      default: "reader",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  },
);

// Virtual full name
readerSchema.virtual("fullName").get(function () {
  return `${this.reader_fname} ${this.reader_lname}`;
});

readerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

readerSchema.methods.correctPassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

const Reader = mongoose.model("Reader", readerSchema);
module.exports = Reader;
