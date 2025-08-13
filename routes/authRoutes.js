const express = require("express");
const {
  signUpReader,
  loginReader,
  loginStaff,
} = require("../controllers/authController");

const authRouter = express.Router();
authRouter.post("/signup/reader", signUpReader);
authRouter.post("/login/reader", loginReader);
authRouter.post("/login/staff", loginStaff);

module.exports = authRouter;
