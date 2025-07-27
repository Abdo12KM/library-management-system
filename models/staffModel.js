const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const staffSchema = new mongoose.Schema(
  {
    staff_fname: {
      type: String,
      required: [true, "Staff first name is required"],
      minlength: [2, "First name must be at least 2 characters"],
      maxlength: [50, "First name must not exceed 50 characters"],
    },
    staff_lname: {
      type: String,
      required: [true, "Staff last name is required"],
      minlength: [2, "Last name must be at least 2 characters"],
      maxlength: [50, "Last name must not exceed 50 characters"],
    },
    staff_email: {
      type: String,
      required: [true, "Staff must have an email"],
      unique: true,
      validate: [validator.isEmail, "Invalid email"],
    },
    staff_join_date: {
      type: Date,
      default: Date.now,
      validate: {
        validator: function (v) {
          return v <= new Date();
        },
        message: "Join date cannot be in the future",
      },
    },
    password: {
      type: String,
      required: [true, "Staff must have a password"],
      validate: [
        validator.isStrongPassword,
        "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol",
      ],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ["librarian", "admin"],
        message: "Staff role must be librarian or admin",
      },
      default: "librarian",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

// Virtual full name
staffSchema.virtual("fullName").get(function () {
  return `${this.staff_fname} ${this.staff_lname}`;
});

staffSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

staffSchema.methods.correctPassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

const Staff = mongoose.model("Staff", staffSchema);
module.exports = Staff;
