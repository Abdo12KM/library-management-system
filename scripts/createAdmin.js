const mongoose = require("mongoose");
const Staff = require("../models/staffModel");
require("dotenv").config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);

    const adminUser = await Staff.create({
      staff_fname: "Abdelrahman",
      staff_lname: "Khaled",
      staff_email: "admin1@hotmail.com",
      staff_join_date: new Date(),
      password: "Admin@1234",
      role: "admin",
    });

    console.log("Admin user created successfully:", adminUser);
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
};

createAdmin();
