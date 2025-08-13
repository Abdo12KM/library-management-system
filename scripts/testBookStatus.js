const mongoose = require("mongoose");
const Book = require("../models/bookModel");
require("dotenv").config();

async function testBookStatus() {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
    console.log("Connected to database");

    // Test creating a book with the new fields
    const testBook = {
      book_title: "Test Book with Status",
      book_description: "A test book to verify status field",
      book_pages: 250,
      release_date: new Date("2023-01-01"),
      book_ISBN: "978-1234567890",
      book_status: "available",
      authorId: "507f1f77bcf86cd799439011", // Replace with actual author ID
      publisherId: "507f1f77bcf86cd799439012", // Replace with actual publisher ID
    };

    console.log("Creating test book...");
    const newBook = await Book.create(testBook);
    console.log("Book created successfully:", newBook);

    // Test updating book status
    console.log("Updating book status to borrowed...");
    const updatedBook = await Book.findByIdAndUpdate(
      newBook._id,
      { book_status: "borrowed" },
      { new: true },
    );
    console.log("Book updated successfully:", updatedBook);

    // Clean up - delete the test book
    await Book.findByIdAndDelete(newBook._id);
    console.log("Test book cleaned up");
  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database");
  }
}

testBookStatus();
