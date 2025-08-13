const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Load environment variables from .env file
dotenv.config({ path: "./.env" });

// Validate required environment variables
if (!process.env.DATABASE_URI) {
  console.error("DATABASE_URI environment variable is required");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET environment variable is required");
  process.exit(1);
}

// Connect to MongoDB Atlas using Mongoose
mongoose
  .connect(process.env.DATABASE_URI)
  .then(() => {
    console.log("DB connection successfully");
  })
  .catch((err) => {
    console.log(err.message); // Show error message if connection fails
  });

// Get the port number from environment variables or default to 5000
const PortNumber = process.env.PORT || 5000;

// Start the Express server and listen on the given port
app.listen(PortNumber, () => {
  console.log(`server is running on port ${PortNumber}`);
});
