const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Load environment variables from .env file
dotenv.config({ path: "./.env" });

// Connect to MongoDB Atlas using Mongoose
mongoose
  .connect(process.env.DATABASE_URI)
  .then(() => {
    console.log("DB connection successfully");
  })
  .catch((err) => {
    console.log(err.message); // Show error message if connection fails
  });

// Get the port number from environment variables
const PortNumber = process.env.PORT;

// Start the Express server and listen on the given port
app.listen(PortNumber, () => {
  console.log(`server is running on port ${PortNumber}`);
});
