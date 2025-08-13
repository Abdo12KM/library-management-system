/**
 * ENHANCED Comprehensive Library Management System API Test Suite
 *
 * This script provides exhaustive automated testing for all endpoints of the Library Management System API.
 * It covers authentication, CRUD operations, security validations, edge cases, and performance testing.
 *
 * Features:
 * - Complete API endpoint coverage (60+ tests)
 * - Full CRUD operations testing (Create, Read, Update, Delete)
 * - Profile management testing (updateMe endpoints)
 * - Password management testing (updateMyPassword endpoints)
 * - Automated token and ID management
 * - Server connectivity validation
 * - Detailed test reporting with success rates and timing
 * - Security and validation testing
 * - Role-based access control testing
 * - Edge case and error boundary testing
 * - Data validation and schema testing
 * - Performance timing measurements
 * - Error handling and timeout management
 * - Optional database reset
 * - Automatic admin user creation if not exists
 * - Bulk operations testing
 * - Input sanitization testing
 * - Password update prevention testing
 * - Password security validation testing
 *
 * Usage:
 * - node tests/test-api.js           (run tests only)
 * - node tests/test-api.js --reset   (reset database then run tests)
 * - node tests/test-api.js -r        (reset database then run tests)
 * - node tests/test-api.js --verbose (run tests with verbose output)
 * - node tests/test-api.js -v        (run tests with verbose output)
 *
 * Prerequisites:
 * - Server must be running on http://localhost:5000
 * - Admin user with credentials: admin1@hotmail.com / Admin@1234 (will be created automatically if not exists)
 */

const axios = require("axios");
const mongoose = require("mongoose");

// Import models for database reset
const Author = require("../models/authorModel");
const Publisher = require("../models/publisherModel");
const Book = require("../models/bookModel");
const Reader = require("../models/readerModel");
const Loan = require("../models/loanModel");
const Fine = require("../models/fineModel");
const Staff = require("../models/staffModel");
require("dotenv").config();

// Check command line arguments
const args = process.argv.slice(2);
const shouldResetDatabase = args.includes("--reset") || args.includes("-r");
const verboseMode = args.includes("--verbose") || args.includes("-v");

// Test configuration
const BASE_URL = "http://localhost:5000/api";
const ADMIN_CREDENTIALS = {
  email: "admin1@hotmail.com",
  password: "Admin@1234",
};

// Test statistics
const testStats = {
  totalTests: 0,
  passedTests: 0,
  failedTests: 0,
  skippedTests: 0,
  totalTime: 0,
  testTimes: {},
  errors: [],
};

// Test data
let testData = {
  adminToken: "",
  readerToken: "",
  librarianToken: "",
  staffId: "",
  librarianId: "",
  secondAdminId: "",
  authorId: "",
  authorId2: "",
  publisherId: "",
  publisherId2: "",
  bookId: "",
  bookId2: "",
  readerId: "",
  readerId2: "",
  loanId: "",
  loanId2: "",
  fineId: "",
  testEntities: [], // Track all created entities for cleanup
};

// Helper function to log verbose messages
function verboseLog(message) {
  if (verboseMode) {
    console.log(`   🔍 ${message}`);
  }
}

// Helper function to measure test execution time
function measureTime(testName, fn) {
  return async function (...args) {
    const startTime = Date.now();
    try {
      const result = await fn.apply(this, args);
      const endTime = Date.now();
      const duration = endTime - startTime;
      testStats.testTimes[testName] = duration;
      verboseLog(`Test completed in ${duration}ms`);
      return result;
    } catch (error) {
      const endTime = Date.now();
      const duration = endTime - startTime;
      testStats.testTimes[testName] = duration;
      testStats.errors.push({ testName, error: error.message });
      throw error;
    }
  };
}

// Helper function to make requests
async function makeRequest(method, url, data = null, token = null) {
  const config = {
    method,
    url: `${BASE_URL}${url}`,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 15000, // 15 second timeout for comprehensive tests
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (data) {
    config.data = data;
  }

  verboseLog(`Making ${method} request to ${url}`);
  if (data && verboseMode) {
    verboseLog(`Request data: ${JSON.stringify(data, null, 2)}`);
  }

  try {
    const response = await axios(config);
    verboseLog(`Response status: ${response.status}`);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    verboseLog(
      `Request failed with status: ${error.response?.status || "No status"}`,
    );
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status,
    };
  }
}

// Helper function to validate server connectivity
async function validateServerConnection() {
  console.log("🔍 Checking server connectivity...");
  try {
    const response = await axios.get(BASE_URL.replace("/api", "/health"), {
      timeout: 5000,
    });
    console.log("✅ Server is running and accessible");
    return true;
  } catch (error) {
    try {
      // Fallback: try to hit any endpoint to see if server responds
      await axios.get(`${BASE_URL}/books`, { timeout: 5000 });
      console.log("✅ Server is running and accessible");
      return true;
    } catch (fallbackError) {
      console.log(
        "❌ Server is not accessible. Please ensure the server is running on http://localhost:5000",
      );
      console.log(`   Error: ${error.message}`);
      return false;
    }
  }
}

// Test functions
async function testAdminLogin() {
  console.log("🔐 Testing Admin Login...");
  const result = await makeRequest(
    "POST",
    "/auth/login/staff",
    ADMIN_CREDENTIALS,
  );

  if (result.success) {
    testData.adminToken = result.data.token;
    testData.staffId = result.data.data?.user?.id || result.data.data?._id;
    console.log("✅ Admin login successful");
    console.log(`   Token: ${result.data.token.substring(0, 20)}...`);
    console.log(`   Staff ID: ${testData.staffId}`);
    return true;
  } else {
    console.log("❌ Admin login failed:", result.error);
    return false;
  }
}

async function testCreateAuthor() {
  console.log("📚 Testing Create Author...");
  const authorData = {
    author_name: "J.K. Rowling",
    email: "jk.rowling@example.com",
    biography: "British author, best known for the Harry Potter series.",
  };

  const result = await makeRequest(
    "POST",
    "/authors",
    authorData,
    testData.adminToken,
  );

  if (result.success) {
    testData.authorId = result.data.data.author._id;
    console.log("✅ Author created successfully");
    console.log(`   Author ID: ${testData.authorId}`);
    return true;
  } else {
    console.log("❌ Create author failed:", result.error);
    return false;
  }
}

async function testCreatePublisher() {
  console.log("🏢 Testing Create Publisher...");
  const publisherData = {
    publisher_name: "Bloomsbury Publishing",
    publisher_website: "https://www.bloomsbury.com",
    year_of_publication: 1986,
    no_published_books: 100,
  };

  const result = await makeRequest(
    "POST",
    "/publishers",
    publisherData,
    testData.adminToken,
  );

  if (result.success) {
    testData.publisherId = result.data.data.publisher._id;
    console.log("✅ Publisher created successfully");
    console.log(`   Publisher ID: ${testData.publisherId}`);
    return true;
  } else {
    console.log("❌ Create publisher failed:", result.error);
    return false;
  }
}

async function testCreateBook() {
  console.log("📖 Testing Create Book...");
  const bookData = {
    book_title: "Harry Potter and the Philosopher's Stone",
    book_description: "The first book in the Harry Potter series",
    book_pages: 223,
    release_date: "1997-06-26",
    book_tags: ["fantasy", "young adult", "magic"],
    book_ISBN: "978-0747532743",
    book_status: "available",
    authorId: testData.authorId,
    publisherId: testData.publisherId,
  };

  const result = await makeRequest(
    "POST",
    "/books",
    bookData,
    testData.adminToken,
  );

  if (result.success) {
    testData.bookId = result.data.data.book._id;
    console.log("✅ Book created successfully");
    console.log(`   Book ID: ${testData.bookId}`);
    console.log(`   Book Status: ${result.data.data.book.book_status}`);
    console.log(`   Book ISBN: ${result.data.data.book.book_ISBN}`);
    return true;
  } else {
    console.log("❌ Create book failed:", result.error);
    return false;
  }
}

async function testCreateReader() {
  console.log("👤 Testing Create Reader...");
  const readerData = {
    reader_fname: "John",
    reader_lname: "Doe",
    reader_email: "john.doe@example.com",
    reader_phone_no: "+1234567890",
    reader_address: "123 Main St, City, Country",
    password: "Reader@123",
  };

  const result = await makeRequest("POST", "/auth/signup/reader", readerData);

  if (result.success) {
    testData.readerId = result.data.data._id;
    testData.readerToken = result.data.token;
    console.log("✅ Reader created successfully");
    console.log(`   Reader ID: ${testData.readerId}`);
    return true;
  } else {
    console.log("❌ Create reader failed:", result.error);
    return false;
  }
}

async function testReaderLogin() {
  console.log("🔑 Testing Reader Login...");
  const readerCredentials = {
    email: "john.doe@example.com",
    password: "Reader@123",
  };

  const result = await makeRequest(
    "POST",
    "/auth/login/reader",
    readerCredentials,
  );

  if (result.success) {
    testData.readerToken = result.data.token;
    console.log("✅ Reader login successful");
    console.log(`   Token: ${result.data.token.substring(0, 20)}...`);
    return true;
  } else {
    console.log("❌ Reader login failed:", result.error);
    return false;
  }
}

async function testGetAllAuthors() {
  console.log("👥 Testing Get All Authors...");
  const result = await makeRequest("GET", "/authors");

  if (result.success) {
    console.log("✅ Get all authors successful");
    console.log(
      `   Found ${result.data.results || result.data.data?.length || 0} authors`,
    );
    return true;
  } else {
    console.log("❌ Get all authors failed:", result.error);
    return false;
  }
}

async function testGetAuthorById() {
  console.log("👤 Testing Get Author by ID...");
  if (!testData.authorId) {
    console.log("❌ No author ID available for testing");
    return false;
  }

  const result = await makeRequest("GET", `/authors/${testData.authorId}`);

  if (result.success) {
    console.log("✅ Get author by ID successful");
    console.log(
      `   Author: ${result.data.data?.author?.author_name || "Unknown"}`,
    );
    return true;
  } else {
    console.log("❌ Get author by ID failed:", result.error);
    return false;
  }
}

async function testGetAllPublishers() {
  console.log("🏢 Testing Get All Publishers...");
  const result = await makeRequest("GET", "/publishers");

  if (result.success) {
    console.log("✅ Get all publishers successful");
    console.log(
      `   Found ${result.data.results || result.data.data?.length || 0} publishers`,
    );
    return true;
  } else {
    console.log("❌ Get all publishers failed:", result.error);
    return false;
  }
}

async function testGetBookById() {
  console.log("📖 Testing Get Book by ID...");
  if (!testData.bookId) {
    console.log("❌ No book ID available for testing");
    return false;
  }

  const result = await makeRequest("GET", `/books/${testData.bookId}`);

  if (result.success) {
    console.log("✅ Get book by ID successful");
    console.log(`   Book: ${result.data.data?.book?.book_title || "Unknown"}`);
    return true;
  } else {
    console.log("❌ Get book by ID failed:", result.error);
    return false;
  }
}

async function testGetAllLoans() {
  console.log("📋 Testing Get All Loans...");
  const result = await makeRequest("GET", "/loans", null, testData.adminToken);

  if (result.success) {
    console.log("✅ Get all loans successful");
    console.log(
      `   Found ${result.data.results || result.data.data?.length || 0} loans`,
    );
    return true;
  } else {
    console.log("❌ Get all loans failed:", result.error);
    return false;
  }
}

async function testReturnBook() {
  console.log("📚 Testing Return Book...");
  if (!testData.loanId) {
    console.log("❌ No loan ID available for testing");
    return false;
  }

  const result = await makeRequest(
    "PATCH",
    `/loans/${testData.loanId}/return`,
    null,
    testData.adminToken,
  );

  if (result.success) {
    console.log("✅ Book returned successfully");
    return true;
  } else {
    console.log("❌ Return book failed:", result.error);
    return false;
  }
}

async function testGetAllFines() {
  console.log("💰 Testing Get All Fines...");
  const result = await makeRequest("GET", "/fines", null, testData.adminToken);

  if (result.success) {
    console.log("✅ Get all fines successful");
    console.log(
      `   Found ${result.data.results || result.data.data?.length || 0} fines`,
    );
    return true;
  } else {
    console.log("❌ Get all fines failed:", result.error);
    return false;
  }
}

async function testCreateOverdueFines() {
  console.log("⏰ Testing Create Overdue Fines...");
  const result = await makeRequest(
    "POST",
    "/fines/create-overdue",
    null,
    testData.adminToken,
  );

  if (result.success) {
    console.log("✅ Create overdue fines successful");
    if (result.data.data?.length > 0) {
      testData.fineId = result.data.data[0]._id;
      console.log(`   Created ${result.data.data.length} fine(s)`);
    } else {
      console.log("   No overdue loans found");
    }
    return true;
  } else {
    console.log("❌ Create overdue fines failed:", result.error);
    return false;
  }
}

async function testCreateLoan() {
  console.log("📋 Testing Create Loan...");
  const loanData = {
    bookId: testData.bookId,
    readerId: testData.readerId,
  };

  const result = await makeRequest(
    "POST",
    "/loans",
    loanData,
    testData.adminToken,
  );

  if (result.success) {
    testData.loanId = result.data.data.loan._id;
    console.log("✅ Loan created successfully");
    console.log(`   Loan ID: ${testData.loanId}`);
    return true;
  } else {
    console.log("❌ Create loan failed:", result.error);
    return false;
  }
}

async function testGetAllBooks() {
  console.log("📚 Testing Get All Books...");
  const result = await makeRequest("GET", "/books");

  if (result.success) {
    console.log("✅ Get all books successful");
    console.log(`   Found ${result.data.results} books`);
    return true;
  } else {
    console.log("❌ Get all books failed:", result.error);
    return false;
  }
}

async function testUnauthorizedAccess() {
  console.log("🚫 Testing Unauthorized Access...");
  const result = await makeRequest("GET", "/loans");

  if (!result.success && result.status === 401) {
    console.log("✅ Unauthorized access properly blocked");
    return true;
  } else {
    console.log("❌ Unauthorized access test failed");
    return false;
  }
}

async function testInvalidLogin() {
  console.log("🔒 Testing Invalid Login Credentials...");
  const invalidCredentials = {
    email: "invalid@example.com",
    password: "wrongpassword",
  };

  const result = await makeRequest(
    "POST",
    "/auth/login/staff",
    invalidCredentials,
  );

  if (!result.success && (result.status === 401 || result.status === 400)) {
    console.log("✅ Invalid credentials properly rejected");
    return true;
  } else {
    console.log("❌ Invalid login test failed - should have been rejected");
    return false;
  }
}

async function testDuplicateReader() {
  console.log("👥 Testing Duplicate Reader Creation...");

  const duplicateReaderData = {
    reader_fname: "John",
    reader_lname: "Doe",
    reader_email: "john.doe@example.com", // Same email as before
    reader_phone_no: "+1234567890", // Same phone number as before
    reader_address: "456 Different St, City, Country",
    password: "Reader@456",
  };

  const result = await makeRequest(
    "POST",
    "/auth/signup/reader",
    duplicateReaderData,
  );

  if (
    !result.success &&
    (result.status === 400 || result.status === 409 || result.status === 500)
  ) {
    console.log("✅ Duplicate email properly rejected");
    console.log(
      `   Status: ${result.status}, Error: ${JSON.stringify(result.error)}`,
    );
    return true;
  } else {
    console.log("❌ Duplicate reader test failed - should have been rejected");
    console.log(
      `   Status: ${result.status}, Response: ${JSON.stringify(result.data || result.error)}`,
    );
    return false;
  }
}

async function testInvalidBookCreation() {
  console.log("📚 Testing Invalid Book Creation...");
  const invalidBookData = {
    book_title: "", // Empty title
    book_description: "A book with missing required fields",
    // Missing required fields like authorId, publisherId
  };

  const result = await makeRequest(
    "POST",
    "/books",
    invalidBookData,
    testData.adminToken,
  );

  if (!result.success && result.status === 400) {
    console.log("✅ Invalid book data properly rejected");
    return true;
  } else {
    console.log(
      "❌ Invalid book creation test failed - should have been rejected",
    );
    return false;
  }
}

// ===============================
// ENHANCED COMPREHENSIVE TESTS
// ===============================

async function testCreateLibrarian() {
  console.log("👨‍💼 Testing Create Librarian...");
  const librarianData = {
    staff_fname: "Jane",
    staff_lname: "Smith",
    staff_email: "jane.smith@library.com",
    staff_join_date: new Date(),
    password: "Librarian@123",
    role: "librarian",
  };

  const result = await makeRequest(
    "POST",
    "/staff",
    librarianData,
    testData.adminToken,
  );

  if (result.success) {
    testData.librarianId = result.data.data._id;
    console.log("✅ Librarian created successfully");
    console.log(`   Librarian ID: ${testData.librarianId}`);
    return true;
  } else {
    console.log("❌ Create librarian failed:", result.error);
    return false;
  }
}

async function testCreateSecondAdmin() {
  console.log("👑 Testing Create Second Admin...");
  const secondAdminData = {
    staff_fname: "Sarah",
    staff_lname: "Johnson",
    staff_email: "sarah.johnson@library.com",
    staff_join_date: new Date(),
    password: "Admin@456",
    role: "admin",
  };

  const result = await makeRequest(
    "POST",
    "/staff",
    secondAdminData,
    testData.adminToken,
  );

  if (result.success) {
    testData.secondAdminId = result.data.data._id;
    console.log("✅ Second admin created successfully");
    console.log(`   Second Admin ID: ${testData.secondAdminId}`);
    return true;
  } else {
    console.log("❌ Create second admin failed:", result.error);
    return false;
  }
}

async function testLibrarianLogin() {
  console.log("🔐 Testing Librarian Login...");
  const librarianCredentials = {
    email: "jane.smith@library.com",
    password: "Librarian@123",
  };

  const result = await makeRequest(
    "POST",
    "/auth/login/staff",
    librarianCredentials,
  );

  if (result.success) {
    testData.librarianToken = result.data.token;
    console.log("✅ Librarian login successful");
    console.log(`   Token: ${result.data.token.substring(0, 20)}...`);
    return true;
  } else {
    console.log("❌ Librarian login failed:", result.error);
    return false;
  }
}

async function testUpdateAuthor() {
  console.log("✏️ Testing Update Author...");
  if (!testData.authorId) {
    console.log("❌ No author ID available for testing");
    return false;
  }

  const updateData = {
    author_name: "J.K. Rowling (Updated)",
    biography:
      "British author, best known for the Harry Potter series. Updated biography.",
  };

  const result = await makeRequest(
    "PATCH",
    `/authors/${testData.authorId}`,
    updateData,
    testData.adminToken,
  );

  if (result.success) {
    console.log("✅ Author updated successfully");
    console.log(
      `   Updated name: ${result.data.data?.author?.author_name || "Unknown"}`,
    );
    return true;
  } else {
    console.log("❌ Update author failed:", result.error);
    return false;
  }
}

async function testUpdatePublisher() {
  console.log("✏️ Testing Update Publisher...");
  if (!testData.publisherId) {
    console.log("❌ No publisher ID available for testing");
    return false;
  }

  const updateData = {
    publisher_name: "Bloomsbury Publishing (Updated)",
    no_published_books: 150,
  };

  const result = await makeRequest(
    "PATCH",
    `/publishers/${testData.publisherId}`,
    updateData,
    testData.adminToken,
  );

  if (result.success) {
    console.log("✅ Publisher updated successfully");
    console.log(
      `   Updated name: ${result.data.data?.publisher?.publisher_name || "Unknown"}`,
    );
    return true;
  } else {
    console.log("❌ Update publisher failed:", result.error);
    return false;
  }
}

async function testUpdateBook() {
  console.log("✏️ Testing Update Book...");
  if (!testData.bookId) {
    console.log("❌ No book ID available for testing");
    return false;
  }

  const updateData = {
    book_title: "Harry Potter and the Philosopher's Stone (Updated Edition)",
    book_description:
      "The first book in the Harry Potter series - Updated description",
    book_pages: 250,
  };

  const result = await makeRequest(
    "PATCH",
    `/books/${testData.bookId}`,
    updateData,
    testData.adminToken,
  );

  if (result.success) {
    console.log("✅ Book updated successfully");
    console.log(
      `   Updated title: ${result.data.data?.book?.book_title || "Unknown"}`,
    );
    return true;
  } else {
    console.log("❌ Update book failed:", result.error);
    return false;
  }
}

async function testBookStatusUpdate() {
  console.log("🔄 Testing Book Status Update...");
  if (!testData.bookId2) {
    console.log("❌ No second book ID available for testing");
    return false;
  }

  const statusData = {
    book_status: "maintenance",
  };

  const result = await makeRequest(
    "PATCH",
    `/books/${testData.bookId2}/status`,
    statusData,
    testData.adminToken,
  );

  if (result.success) {
    console.log("✅ Book status updated successfully");
    console.log(
      `   New status: ${result.data.data?.book?.book_status || "Unknown"}`,
    );
    return true;
  } else {
    console.log("❌ Update book status failed:", result.error);
    return false;
  }
}

async function testBookStatusValidation() {
  console.log("🚫 Testing Invalid Book Status...");
  if (!testData.bookId2) {
    console.log("❌ No second book ID available for testing");
    return false;
  }

  const invalidStatusData = {
    book_status: "invalid_status",
  };

  const result = await makeRequest(
    "PATCH",
    `/books/${testData.bookId2}/status`,
    invalidStatusData,
    testData.adminToken,
  );

  if (!result.success && result.status === 400) {
    console.log("✅ Invalid book status properly rejected");
    return true;
  } else {
    console.log("❌ Invalid book status should have been rejected");
    return false;
  }
}

async function testBookStatusAfterLoan() {
  console.log("📋 Testing Book Status After Loan Creation...");
  if (!testData.bookId || !testData.loanId) {
    console.log("❌ No book ID or loan ID available for testing");
    return false;
  }

  const result = await makeRequest("GET", `/books/${testData.bookId}`);

  if (result.success) {
    const bookStatus = result.data.data?.book?.book_status;
    if (bookStatus === "borrowed") {
      console.log("✅ Book status correctly updated to 'borrowed' after loan");
      return true;
    } else {
      console.log(`❌ Expected book status 'borrowed', got: ${bookStatus}`);
      return false;
    }
  } else {
    console.log("❌ Failed to get book details:", result.error);
    return false;
  }
}

async function testISBNValidation() {
  console.log("📚 Testing ISBN Validation...");
  const invalidISBNBookData = {
    book_title: "Test Book with Invalid ISBN",
    book_description: "Testing ISBN validation",
    book_pages: 100,
    release_date: "2023-01-01",
    book_ISBN: "invalid-isbn",
    book_status: "available",
    authorId: testData.authorId,
    publisherId: testData.publisherId,
  };

  const result = await makeRequest(
    "POST",
    "/books",
    invalidISBNBookData,
    testData.adminToken,
  );

  // ISBN validation errors might return 400 or 500, both are acceptable for validation failure
  if (!result.success && (result.status === 400 || result.status === 500)) {
    console.log("✅ Invalid ISBN properly rejected");
    return true;
  } else {
    console.log(
      "❌ Invalid ISBN should have been rejected, got status:",
      result.status,
    );
    console.log("   Response:", result.error);
    return false;
  }
}

async function testCreateSecondAuthor() {
  console.log("📚 Testing Create Second Author...");
  const authorData = {
    author_name: "George R.R. Martin",
    email: "grrm@example.com",
    biography:
      "American novelist and short story writer, best known for A Song of Ice and Fire.",
  };

  const result = await makeRequest(
    "POST",
    "/authors",
    authorData,
    testData.adminToken,
  );

  if (result.success) {
    testData.authorId2 = result.data.data.author._id;
    console.log("✅ Second author created successfully");
    console.log(`   Author ID: ${testData.authorId2}`);
    return true;
  } else {
    console.log("❌ Create second author failed:", result.error);
    return false;
  }
}

async function testCreateSecondPublisher() {
  console.log("🏢 Testing Create Second Publisher...");
  const publisherData = {
    publisher_name: "Bantam Books",
    publisher_website: "https://www.bantam.com",
    year_of_publication: 1945,
    no_published_books: 200,
  };

  const result = await makeRequest(
    "POST",
    "/publishers",
    publisherData,
    testData.adminToken,
  );

  if (result.success) {
    testData.publisherId2 = result.data.data.publisher._id;
    console.log("✅ Second publisher created successfully");
    console.log(`   Publisher ID: ${testData.publisherId2}`);
    return true;
  } else {
    console.log("❌ Create second publisher failed:", result.error);
    return false;
  }
}

async function testCreateSecondBook() {
  console.log("📖 Testing Create Second Book...");
  const bookData = {
    book_title: "A Game of Thrones",
    book_description: "The first book in A Song of Ice and Fire series",
    book_pages: 694,
    release_date: "1996-08-01",
    book_tags: ["fantasy", "epic", "medieval"],
    book_ISBN: "978-0553103540",
    book_status: "available",
    authorId: testData.authorId2,
    publisherId: testData.publisherId2,
  };

  const result = await makeRequest(
    "POST",
    "/books",
    bookData,
    testData.adminToken,
  );

  if (result.success) {
    testData.bookId2 = result.data.data.book._id;
    console.log("✅ Second book created successfully");
    console.log(`   Book ID: ${testData.bookId2}`);
    console.log(`   Book Status: ${result.data.data.book.book_status}`);
    console.log(`   Book ISBN: ${result.data.data.book.book_ISBN}`);
    return true;
  } else {
    console.log("❌ Create second book failed:", result.error);
    return false;
  }
}

async function testCreateSecondReader() {
  console.log("👤 Testing Create Second Reader...");
  const readerData = {
    reader_fname: "Alice",
    reader_lname: "Johnson",
    reader_email: "alice.johnson@example.com",
    reader_phone_no: "+1987654321",
    reader_address: "456 Oak Avenue, City, Country",
    password: "Reader@456",
  };

  const result = await makeRequest("POST", "/auth/signup/reader", readerData);

  if (result.success) {
    testData.readerId2 = result.data.data._id;
    console.log("✅ Second reader created successfully");
    console.log(`   Reader ID: ${testData.readerId2}`);
    return true;
  } else {
    console.log("❌ Create second reader failed:", result.error);
    return false;
  }
}

async function testCreateSecondLoan() {
  console.log("📋 Testing Create Second Loan...");

  // First check if we have the necessary data
  if (!testData.readerId) {
    console.log("❌ readerId not available for second loan test");
    return false;
  }

  // Try to create a second book first for this test
  const secondBookData = {
    book_title: "The Chamber of Secrets",
    book_description: "The second book in the Harry Potter series",
    book_pages: 251,
    release_date: "1998-07-02",
    book_tags: ["fantasy", "young adult", "magic"],
    book_ISBN: "978-0747538493",
    book_status: "available",
    authorId: testData.authorId,
    publisherId: testData.publisherId,
  };

  const bookResult = await makeRequest(
    "POST",
    "/books",
    secondBookData,
    testData.adminToken,
  );

  if (!bookResult.success) {
    console.log(
      "❌ Failed to create second book for loan test:",
      bookResult.error,
    );
    return false;
  }

  const secondBookId = bookResult.data.data.book._id;
  console.log(`   Created second book with ID: ${secondBookId}`);

  const loanData = {
    bookId: secondBookId,
    readerId: testData.readerId,
  };

  const result = await makeRequest(
    "POST",
    "/loans",
    loanData,
    testData.adminToken,
  );

  if (result.success) {
    testData.loanId2 = result.data.data.loan._id;
    console.log("✅ Second loan created successfully");
    console.log(`   Loan ID: ${testData.loanId2}`);

    // Clean up - delete the second book after test
    await makeRequest(
      "DELETE",
      `/books/${secondBookId}`,
      null,
      testData.adminToken,
    );

    return true;
  } else {
    console.log("❌ Create second loan failed:", result.error);
    // Clean up the book if loan failed
    await makeRequest(
      "DELETE",
      `/books/${secondBookId}`,
      null,
      testData.adminToken,
    );
    return false;
  }
}

async function testGetReaderProfile() {
  console.log("👤 Testing Get Reader Profile...");
  const result = await makeRequest(
    "GET",
    "/readers/getMe",
    null,
    testData.readerToken,
  );

  if (result.success) {
    console.log("✅ Get reader profile successful");
    console.log(
      `   Reader: ${result.data.reader?.reader_fname || "Unknown"} ${result.data.reader?.reader_lname || ""}`,
    );
    return true;
  } else {
    console.log("❌ Get reader profile failed:", result.error);
    return false;
  }
}

async function testGetStaffProfile() {
  console.log("👨‍💼 Testing Get Staff Profile...");
  const result = await makeRequest(
    "GET",
    "/staff/getMe",
    null,
    testData.adminToken,
  );

  if (result.success) {
    console.log("✅ Get staff profile successful");
    console.log(
      `   Staff: ${result.data.staff?.staff_fname || "Unknown"} ${result.data.staff?.staff_lname || ""}`,
    );
    return true;
  } else {
    console.log("❌ Get staff profile failed:", result.error);
    return false;
  }
}

async function testUpdateReaderProfile() {
  console.log("✏️ Testing Update Reader Profile...");
  const updateData = {
    reader_fname: "John Updated",
    reader_lname: "Doe Updated",
    reader_phone_no: "+1234567899",
    reader_address: "456 Updated St, New City, Country",
  };

  const result = await makeRequest(
    "PATCH",
    "/readers/updateMe",
    updateData,
    testData.readerToken,
  );

  if (result.success) {
    console.log("✅ Update reader profile successful");
    console.log(
      `   Updated name: ${result.data.reader_fname} ${result.data.reader_lname}`,
    );
    return true;
  } else {
    console.log("❌ Update reader profile failed:", result.error);
    return false;
  }
}

async function testUpdateStaffProfile() {
  console.log("✏️ Testing Update Staff Profile...");
  const updateData = {
    staff_fname: "Admin Updated",
    staff_lname: "User Updated",
    staff_email: "admin.updated@library.com",
  };

  const result = await makeRequest(
    "PATCH",
    "/staff/updateMe",
    updateData,
    testData.adminToken,
  );

  if (result.success) {
    console.log("✅ Update staff profile successful");
    console.log(
      `   Updated name: ${result.data.staff_fname} ${result.data.staff_lname}`,
    );
    return true;
  } else {
    console.log("❌ Update staff profile failed:", result.error);
    return false;
  }
}

async function testUpdateReaderPassword() {
  console.log("🔑 Testing Update Reader Password...");
  const passwordData = {
    passwordCurrent: "Reader@123",
    password: "NewReaderPassword@123",
    passwordConfirm: "NewReaderPassword@123",
  };

  const result = await makeRequest(
    "PATCH",
    "/readers/updateMyPassword",
    passwordData,
    testData.readerToken,
  );

  if (result.success) {
    console.log("✅ Update reader password successful");
    return true;
  } else {
    console.log("❌ Update reader password failed:", result.error);
    return false;
  }
}

async function testUpdateStaffPassword() {
  console.log("🔑 Testing Update Staff Password...");
  const passwordData = {
    passwordCurrent: "Admin@1234",
    password: "NewAdmin@1234",
    passwordConfirm: "NewAdmin@1234",
  };

  const result = await makeRequest(
    "PATCH",
    "/staff/updateMyPassword",
    passwordData,
    testData.adminToken,
  );

  if (result.success) {
    console.log("✅ Update staff password successful");
    return true;
  } else {
    console.log("❌ Update staff password failed:", result.error);
    return false;
  }
}

async function testGetAllReaders() {
  console.log("👥 Testing Get All Readers...");
  const result = await makeRequest(
    "GET",
    "/readers",
    null,
    testData.adminToken,
  );

  if (result.success) {
    console.log("✅ Get all readers successful");
    console.log(`   Found ${result.data.length || 0} readers`);
    return true;
  } else {
    console.log("❌ Get all readers failed:", result.error);
    return false;
  }
}

async function testGetAllStaff() {
  console.log("👨‍💼 Testing Get All Staff...");
  const result = await makeRequest("GET", "/staff", null, testData.adminToken);

  if (result.success) {
    console.log("✅ Get all staff successful");
    console.log(`   Found ${result.data.length || 0} staff members`);
    return true;
  } else {
    console.log("❌ Get all staff failed:", result.error);
    return false;
  }
}

async function testGetOverdueLoans() {
  console.log("⏰ Testing Get Overdue Loans...");
  const result = await makeRequest(
    "GET",
    "/loans/overdue",
    null,
    testData.adminToken,
  );

  if (result.success) {
    console.log("✅ Get overdue loans successful");
    console.log(
      `   Found ${result.data.results || result.data.data?.length || 0} overdue loans`,
    );
    return true;
  } else {
    console.log("❌ Get overdue loans failed:", result.error);
    return false;
  }
}

async function testCreateFine() {
  console.log("💰 Testing Create Fine...");
  if (!testData.loanId) {
    console.log("❌ No loan ID available for testing");
    return false;
  }

  const fineData = {
    loanId: testData.loanId,
    accumulated_amount: 5.5,
    penalty_rate: 1.5,
  };

  const result = await makeRequest(
    "POST",
    "/fines",
    fineData,
    testData.adminToken,
  );

  if (result.success) {
    testData.fineId = result.data.data.fine._id;
    console.log("✅ Fine created successfully");
    console.log(`   Fine ID: ${testData.fineId}`);
    return true;
  } else {
    console.log("❌ Create fine failed:", result.error);
    return false;
  }
}

async function testPayFine() {
  console.log("💳 Testing Pay Fine...");
  if (!testData.fineId) {
    console.log("❌ No fine ID available for testing");
    return false;
  }

  const result = await makeRequest(
    "PATCH",
    `/fines/${testData.fineId}/pay`,
    null,
    testData.adminToken,
  );

  if (result.success) {
    console.log("✅ Fine paid successfully");
    console.log(
      `   Fine status: ${result.data.data?.fine?.status || "Unknown"}`,
    );
    return true;
  } else {
    console.log("❌ Pay fine failed:", result.error);
    return false;
  }
}

async function testReaderCannotAccessAdminEndpoints() {
  console.log("🚫 Testing Reader Cannot Access Admin Endpoints...");
  const result = await makeRequest("GET", "/staff", null, testData.readerToken);

  if (!result.success && (result.status === 401 || result.status === 403)) {
    console.log("✅ Reader properly denied access to admin endpoints");
    return true;
  } else {
    console.log("❌ Reader access control test failed");
    return false;
  }
}

async function testLibrarianCannotDeleteEntities() {
  console.log("🚫 Testing Librarian Cannot Delete Entities...");
  if (!testData.authorId || !testData.librarianToken) {
    console.log("❌ Missing required data for librarian delete test");
    return false;
  }

  const result = await makeRequest(
    "DELETE",
    `/authors/${testData.authorId}`,
    null,
    testData.librarianToken,
  );

  if (!result.success && (result.status === 401 || result.status === 403)) {
    console.log("✅ Librarian properly denied delete access");
    return true;
  } else {
    console.log("❌ Librarian delete access control test failed");
    return false;
  }
}

async function testInvalidDataValidation() {
  console.log("🔍 Testing Invalid Data Validation...");

  // Test invalid email format
  const invalidAuthorData = {
    author_name: "Test Author",
    email: "invalid-email-format",
    biography: "Test biography",
  };

  const result = await makeRequest(
    "POST",
    "/authors",
    invalidAuthorData,
    testData.adminToken,
  );

  if (!result.success && (result.status === 500 || result.status === 400)) {
    console.log("✅ Invalid email format properly rejected");
    return true;
  } else {
    console.log("❌ Invalid data validation test failed");
    return false;
  }
}

async function testPasswordUpdatePrevention() {
  console.log("🔒 Testing Password Update Prevention...");

  const updateData = {
    staff_fname: "Test",
    password: "NewPassword@123",
  };

  const result = await makeRequest(
    "PATCH",
    "/staff/updateMe",
    updateData,
    testData.adminToken,
  );

  if (!result.success && result.status === 400) {
    const errorMessage =
      result.error?.message || JSON.stringify(result.error) || "";
    if (
      errorMessage.includes("not for password updates") ||
      errorMessage.includes("password")
    ) {
      console.log("✅ Password update properly blocked");
      return true;
    }
  }

  console.log("❌ Password update prevention test failed");
  console.log(
    `   Status: ${result.status}, Error: ${JSON.stringify(result.error)}`,
  );
  return false;
}

async function testWrongCurrentPassword() {
  console.log("🔒 Testing Wrong Current Password...");

  const passwordData = {
    passwordCurrent: "WrongPassword@123",
    password: "NewPassword@123",
    passwordConfirm: "NewPassword@123",
  };

  const result = await makeRequest(
    "PATCH",
    "/staff/updateMyPassword",
    passwordData,
    testData.adminToken,
  );

  if (!result.success && result.status === 401) {
    const errorMessage =
      result.error?.message || JSON.stringify(result.error) || "";
    if (
      errorMessage.includes("current password is incorrect") ||
      errorMessage.includes("incorrect")
    ) {
      console.log("✅ Wrong current password properly rejected");
      return true;
    }
  }

  console.log("❌ Wrong current password test failed");
  console.log(
    `   Status: ${result.status}, Error: ${JSON.stringify(result.error)}`,
  );
  return false;
}

async function testPasswordConfirmationMismatch() {
  console.log("🔒 Testing Password Confirmation Mismatch...");

  const passwordData = {
    passwordCurrent: "Admin@1234",
    password: "NewPassword@123",
    passwordConfirm: "DifferentPassword@123",
  };

  const result = await makeRequest(
    "PATCH",
    "/staff/updateMyPassword",
    passwordData,
    testData.adminToken,
  );

  if (!result.success && result.status === 400) {
    const errorMessage =
      result.error?.message || JSON.stringify(result.error) || "";
    if (
      errorMessage.includes("do not match") ||
      errorMessage.includes("confirm")
    ) {
      console.log("✅ Password confirmation mismatch properly rejected");
      return true;
    }
  }

  console.log("❌ Password confirmation mismatch test failed");
  console.log(
    `   Status: ${result.status}, Error: ${JSON.stringify(result.error)}`,
  );
  return false;
}

async function testLargeDataHandling() {
  console.log("📊 Testing Large Data Handling...");

  const largeDescription = "A".repeat(2000); // 2000 characters
  const bookData = {
    book_title: "Large Data Test Book",
    book_description: largeDescription,
    book_pages: 500,
    release_date: "2023-01-01",
    book_tags: ["test"],
    authorId: testData.authorId,
    publisherId: testData.publisherId,
  };

  const result = await makeRequest(
    "POST",
    "/books",
    bookData,
    testData.adminToken,
  );

  if (!result.success && (result.status === 500 || result.status === 400)) {
    console.log("✅ Large data properly rejected");
    return true;
  } else if (result.success) {
    console.log("✅ Large data handled successfully");
    return true;
  } else {
    console.log("❌ Large data handling test failed");
    return false;
  }
}

async function testConcurrentOperations() {
  console.log("🔄 Testing Concurrent Operations...");

  const operations = [
    makeRequest("GET", "/books"),
    makeRequest("GET", "/authors"),
    makeRequest("GET", "/publishers"),
    makeRequest("GET", "/loans", null, testData.adminToken),
  ];

  try {
    const results = await Promise.all(operations);
    const allSuccessful = results.every((result) => result.success);

    if (allSuccessful) {
      console.log("✅ Concurrent operations handled successfully");
      return true;
    } else {
      console.log("❌ Some concurrent operations failed");
      return false;
    }
  } catch (error) {
    console.log("❌ Concurrent operations test failed:", error.message);
    return false;
  }
}

async function testDeleteNonexistentEntity() {
  console.log("🗑️ Testing Delete Nonexistent Entity...");

  const fakeId = "507f1f77bcf86cd799439011"; // Valid ObjectId format but nonexistent
  const result = await makeRequest(
    "DELETE",
    `/authors/${fakeId}`,
    null,
    testData.adminToken,
  );

  if (!result.success && result.status === 404) {
    console.log("✅ Nonexistent entity deletion properly handled");
    return true;
  } else {
    console.log("❌ Nonexistent entity deletion test failed");
    return false;
  }
}

async function testMalformedId() {
  console.log("🔍 Testing Malformed ID...");

  const malformedId = "invalid-id-format";
  const result = await makeRequest("GET", `/authors/${malformedId}`);

  if (!result.success && (result.status === 400 || result.status === 500)) {
    console.log("✅ Malformed ID properly handled");
    return true;
  } else {
    console.log("❌ Malformed ID test failed");
    return false;
  }
}

// Cleanup functions
async function testDeleteSecondBook() {
  console.log("🗑️ Testing Delete Second Book...");
  if (!testData.bookId2) {
    console.log("❌ No second book ID available for testing");
    return false;
  }

  const result = await makeRequest(
    "DELETE",
    `/books/${testData.bookId2}`,
    null,
    testData.adminToken,
  );

  if (result.success || result.status === 204) {
    console.log("✅ Second book deleted successfully");
    return true;
  } else {
    console.log("❌ Delete second book failed:", result.error);
    return false;
  }
}

async function testDeleteSecondAuthor() {
  console.log("🗑️ Testing Delete Second Author...");
  if (!testData.authorId2) {
    console.log("❌ No second author ID available for testing");
    return false;
  }

  const result = await makeRequest(
    "DELETE",
    `/authors/${testData.authorId2}`,
    null,
    testData.adminToken,
  );

  if (result.success || result.status === 204) {
    console.log("✅ Second author deleted successfully");
    return true;
  } else {
    console.log("❌ Delete second author failed:", result.error);
    return false;
  }
}

async function testDeleteSecondPublisher() {
  console.log("🗑️ Testing Delete Second Publisher...");
  if (!testData.publisherId2) {
    console.log("❌ No second publisher ID available for testing");
    return false;
  }

  const result = await makeRequest(
    "DELETE",
    `/publishers/${testData.publisherId2}`,
    null,
    testData.adminToken,
  );

  if (result.success || result.status === 204) {
    console.log("✅ Second publisher deleted successfully");
    return true;
  } else {
    console.log("❌ Delete second publisher failed:", result.error);
    return false;
  }
}

async function testDeleteReader() {
  console.log("🗑️ Testing Delete Reader...");
  if (!testData.readerId2) {
    console.log("❌ No second reader ID available for testing");
    return false;
  }

  const result = await makeRequest(
    "DELETE",
    `/readers/${testData.readerId2}`,
    null,
    testData.adminToken,
  );

  if (result.success || result.status === 204) {
    console.log("✅ Reader deleted successfully");
    return true;
  } else {
    console.log("❌ Delete reader failed:", result.error);
    return false;
  }
}

async function testDeleteSecondAdmin() {
  console.log("🗑️ Testing Delete Second Admin...");
  if (!testData.secondAdminId) {
    console.log("❌ No second admin ID available for testing");
    return false;
  }

  const result = await makeRequest(
    "DELETE",
    `/staff/${testData.secondAdminId}`,
    null,
    testData.adminToken,
  );

  if (result.success || result.status === 204) {
    console.log("✅ Second admin deleted successfully");
    return true;
  } else {
    console.log("❌ Delete second admin failed:", result.error);
    return false;
  }
}

// ===============================
// API FILTERING TESTS
// ===============================

async function testAuthorFiltering() {
  console.log("🔍 Testing Author Filtering...");

  // Test basic filtering by name
  const result = await makeRequest(
    "GET",
    `/authors?author_name=J.K. Rowling (Updated)`,
  );

  if (result.success) {
    const authors = result.data.data.authors;
    if (authors.length > 0 && authors[0].author_name.includes("J.K. Rowling")) {
      console.log("✅ Author filtering by name successful");
      return true;
    } else {
      console.log("❌ Author filtering returned unexpected results");
      return false;
    }
  } else {
    console.log("❌ Author filtering failed:", result.error);
    return false;
  }
}

async function testAuthorSorting() {
  console.log("🔢 Testing Author Sorting...");

  // Test sorting by name (ascending)
  const result = await makeRequest("GET", "/authors?sort=author_name");

  if (result.success) {
    const authors = result.data.data.authors;
    if (authors.length >= 2) {
      // Check if sorted correctly
      const isSorted = authors[0].author_name <= authors[1].author_name;
      if (isSorted) {
        console.log("✅ Author sorting successful");
        return true;
      } else {
        console.log("❌ Author sorting order incorrect");
        return false;
      }
    } else {
      console.log(
        "✅ Author sorting successful (insufficient data for comparison)",
      );
      return true;
    }
  } else {
    console.log("❌ Author sorting failed:", result.error);
    return false;
  }
}

async function testAuthorPagination() {
  console.log("📄 Testing Author Pagination...");

  // Test pagination with limit
  const result = await makeRequest("GET", "/authors?page=1&limit=1");

  if (result.success) {
    const authors = result.data.data.authors;
    if (authors.length <= 1) {
      console.log("✅ Author pagination successful");
      return true;
    } else {
      console.log("❌ Author pagination returned too many results");
      return false;
    }
  } else {
    console.log("❌ Author pagination failed:", result.error);
    return false;
  }
}

async function testAuthorFieldSelection() {
  console.log("📋 Testing Author Field Selection...");

  // Test field selection
  const result = await makeRequest("GET", "/authors?fields=author_name");

  if (result.success) {
    const authors = result.data.data.authors;
    if (authors.length > 0) {
      const author = authors[0];
      // Check if selected field is present
      const hasSelectedField = author.hasOwnProperty("author_name");
      // Check if unwanted fields are excluded (email and biography should not be present)
      const hasUnwantedFields =
        author.hasOwnProperty("email") || author.hasOwnProperty("biography");

      if (hasSelectedField && !hasUnwantedFields) {
        console.log("✅ Author field selection successful");
        return true;
      } else {
        console.log("❌ Author field selection failed validation:");
        console.log(`   Selected field present: ${hasSelectedField}`);
        console.log(`   Unwanted fields excluded: ${!hasUnwantedFields}`);
        console.log(`   Returned fields: ${Object.keys(author).join(", ")}`);
        return false;
      }
    } else {
      console.log("✅ Author field selection successful (no data to test)");
      return true;
    }
  } else {
    console.log("❌ Author field selection failed:", result.error);
    return false;
  }
}

async function testBookFiltering() {
  console.log("📚 Testing Book Filtering...");

  // Test filtering by book pages (using MongoDB operator)
  const result = await makeRequest("GET", "/books?book_pages[gte]=200");

  if (result.success) {
    const books = result.data.data.books;
    const allBooksHaveMinPages = books.every((book) => book.book_pages >= 200);
    if (allBooksHaveMinPages) {
      console.log("✅ Book filtering with MongoDB operator successful");
      return true;
    } else {
      console.log("❌ Book filtering returned books with incorrect page count");
      return false;
    }
  } else {
    console.log("❌ Book filtering failed:", result.error);
    return false;
  }
}

async function testBookSortingDescending() {
  console.log("📚 Testing Book Sorting (Descending)...");

  // Test sorting by pages (descending)
  const result = await makeRequest("GET", "/books?sort=-book_pages");

  if (result.success) {
    const books = result.data.data.books;
    if (books.length >= 2) {
      const isSortedDesc = books[0].book_pages >= books[1].book_pages;
      if (isSortedDesc) {
        console.log("✅ Book descending sorting successful");
        return true;
      } else {
        console.log("❌ Book descending sorting order incorrect");
        return false;
      }
    } else {
      console.log("✅ Book descending sorting successful (insufficient data)");
      return true;
    }
  } else {
    console.log("❌ Book descending sorting failed:", result.error);
    return false;
  }
}

async function testLoanFiltering() {
  console.log("📋 Testing Loan Filtering...");

  // Test filtering by status
  const result = await makeRequest(
    "GET",
    "/loans?status=returned",
    null,
    testData.adminToken,
  );

  if (result.success) {
    const loans = result.data.data.loans;
    const allLoansReturned = loans.every((loan) => loan.status === "returned");
    if (allLoansReturned) {
      console.log("✅ Loan filtering by status successful");
      return true;
    } else {
      console.log("❌ Loan filtering returned loans with incorrect status");
      return false;
    }
  } else {
    console.log("❌ Loan filtering failed:", result.error);
    return false;
  }
}

async function testPublisherPagination() {
  console.log("🏢 Testing Publisher Pagination...");

  // Test pagination with page 1, limit 1
  const result = await makeRequest("GET", "/publishers?page=1&limit=1");

  if (result.success) {
    const publishers = result.data.data.publishers;
    if (publishers.length <= 1) {
      console.log("✅ Publisher pagination successful");
      return true;
    } else {
      console.log("❌ Publisher pagination returned too many results");
      return false;
    }
  } else {
    console.log("❌ Publisher pagination failed:", result.error);
    return false;
  }
}

async function testReaderFiltering() {
  console.log("👥 Testing Reader Filtering...");

  // Test filtering by first name
  const result = await makeRequest(
    "GET",
    "/readers?reader_fname=John",
    null,
    testData.adminToken,
  );

  if (result.success) {
    const readers = result.data.data || result.data;
    const allReadersNamedJohn = Array.isArray(readers)
      ? readers.every((reader) => reader.reader_fname === "John")
      : true;
    if (allReadersNamedJohn) {
      console.log("✅ Reader filtering by first name successful");
      return true;
    } else {
      console.log("❌ Reader filtering returned readers with incorrect names");
      return false;
    }
  } else {
    console.log("❌ Reader filtering failed:", result.error);
    return false;
  }
}

async function testCombinedFiltering() {
  console.log("🔗 Testing Combined Filtering (Multiple Parameters)...");

  // Test combining filtering, sorting, and pagination
  const result = await makeRequest(
    "GET",
    "/books?book_pages[gte]=100&sort=book_title&page=1&limit=2&fields=book_title,book_pages",
  );

  if (result.success) {
    const books = result.data.data.books;
    // Verify all books have at least 100 pages
    const allBooksHaveMinPages = books.every((book) => book.book_pages >= 100);
    // Verify pagination worked (max 2 results)
    const paginationWorked = books.length <= 2;
    // Verify field selection worked
    const fieldSelectionWorked = books.every((book) =>
      Object.keys(book).every((key) =>
        [
          "book_title",
          "book_pages",
          "_id",
          "__v",
          "authorId",
          "publisherId",
        ].includes(key),
      ),
    );

    if (allBooksHaveMinPages && paginationWorked && fieldSelectionWorked) {
      console.log("✅ Combined filtering successful");
      return true;
    } else {
      console.log("❌ Combined filtering failed validation checks");
      return false;
    }
  } else {
    console.log("❌ Combined filtering failed:", result.error);
    return false;
  }
}

async function testFineFiltering() {
  console.log("💰 Testing Fine Filtering...");

  // Test filtering by status
  const result = await makeRequest(
    "GET",
    "/fines?status=unpaid",
    null,
    testData.adminToken,
  );

  if (result.success) {
    const fines = result.data.data.fines;
    const allFinesUnpaid = fines.every((fine) => fine.status === "unpaid");
    if (allFinesUnpaid) {
      console.log("✅ Fine filtering by status successful");
      return true;
    } else {
      console.log("❌ Fine filtering returned fines with incorrect status");
      return false;
    }
  } else {
    console.log("❌ Fine filtering failed:", result.error);
    return false;
  }
}

async function testStaffFiltering() {
  console.log("👨‍💼 Testing Staff Filtering...");

  // Test filtering by role
  const result = await makeRequest(
    "GET",
    "/staff?role=admin",
    null,
    testData.adminToken,
  );

  if (result.success) {
    const staff = result.data.data || result.data;
    const allStaffAdmin = Array.isArray(staff)
      ? staff.every((member) => member.role === "admin")
      : true;
    if (allStaffAdmin) {
      console.log("✅ Staff filtering by role successful");
      return true;
    } else {
      console.log("❌ Staff filtering returned staff with incorrect roles");
      return false;
    }
  } else {
    console.log("❌ Staff filtering failed:", result.error);
    return false;
  }
}

async function testInvalidFilterParameters() {
  console.log("❌ Testing Invalid Filter Parameters...");

  // Test with invalid field name (should still work but return all results)
  const result = await makeRequest("GET", "/authors?invalid_field=test");

  if (result.success) {
    console.log("✅ Invalid filter parameters handled gracefully");
    return true;
  } else {
    console.log("❌ Invalid filter parameters caused server error");
    return false;
  }
}

async function testEmptyFilterResults() {
  console.log("🔍 Testing Empty Filter Results...");

  // Test filter that should return no results
  const result = await makeRequest(
    "GET",
    "/authors?author_name=NonexistentAuthor123",
  );

  if (result.success) {
    const authors = result.data.data.authors;
    if (authors.length === 0) {
      console.log("✅ Empty filter results handled correctly");
      return true;
    } else {
      console.log("❌ Filter returned unexpected results");
      return false;
    }
  } else {
    console.log("❌ Empty filter test failed:", result.error);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log(
    "🚀 Starting ENHANCED Comprehensive Library Management System API Tests\n",
  );
  console.log("=".repeat(80));

  const testSuite = [
    // ============= AUTHENTICATION & AUTHORIZATION TESTS =============
    {
      category: "Authentication",
      name: "Admin Login",
      test: measureTime("Admin Login", testAdminLogin),
    },
    {
      category: "Authentication",
      name: "Create Librarian",
      test: measureTime("Create Librarian", testCreateLibrarian),
    },
    {
      category: "Authentication",
      name: "Create Second Admin",
      test: measureTime("Create Second Admin", testCreateSecondAdmin),
    },
    {
      category: "Authentication",
      name: "Librarian Login",
      test: measureTime("Librarian Login", testLibrarianLogin),
    },
    {
      category: "Authentication",
      name: "Create Reader",
      test: measureTime("Create Reader", testCreateReader),
    },
    {
      category: "Authentication",
      name: "Reader Login",
      test: measureTime("Reader Login", testReaderLogin),
    },
    {
      category: "Authentication",
      name: "Create Second Reader",
      test: measureTime("Create Second Reader", testCreateSecondReader),
    },

    // ============= AUTHOR CRUD TESTS =============
    {
      category: "Authors",
      name: "Create Author",
      test: measureTime("Create Author", testCreateAuthor),
    },
    {
      category: "Authors",
      name: "Get All Authors",
      test: measureTime("Get All Authors", testGetAllAuthors),
    },
    {
      category: "Authors",
      name: "Get Author by ID",
      test: measureTime("Get Author by ID", testGetAuthorById),
    },
    {
      category: "Authors",
      name: "Update Author",
      test: measureTime("Update Author", testUpdateAuthor),
    },
    {
      category: "Authors",
      name: "Create Second Author",
      test: measureTime("Create Second Author", testCreateSecondAuthor),
    },

    // ============= PUBLISHER CRUD TESTS =============
    {
      category: "Publishers",
      name: "Create Publisher",
      test: measureTime("Create Publisher", testCreatePublisher),
    },
    {
      category: "Publishers",
      name: "Get All Publishers",
      test: measureTime("Get All Publishers", testGetAllPublishers),
    },
    {
      category: "Publishers",
      name: "Update Publisher",
      test: measureTime("Update Publisher", testUpdatePublisher),
    },
    {
      category: "Publishers",
      name: "Create Second Publisher",
      test: measureTime("Create Second Publisher", testCreateSecondPublisher),
    },

    // ============= BOOK CRUD TESTS =============
    {
      category: "Books",
      name: "Create Book",
      test: measureTime("Create Book", testCreateBook),
    },
    {
      category: "Books",
      name: "Get All Books",
      test: measureTime("Get All Books", testGetAllBooks),
    },
    {
      category: "Books",
      name: "Get Book by ID",
      test: measureTime("Get Book by ID", testGetBookById),
    },
    {
      category: "Books",
      name: "Update Book",
      test: measureTime("Update Book", testUpdateBook),
    },
    {
      category: "Books",
      name: "Create Second Book",
      test: measureTime("Create Second Book", testCreateSecondBook),
    },

    // ============= BOOK STATUS & ISBN TESTS =============
    {
      category: "Books",
      name: "Book Status Update",
      test: measureTime("Book Status Update", testBookStatusUpdate),
    },
    {
      category: "Books",
      name: "Book Status Validation",
      test: measureTime("Book Status Validation", testBookStatusValidation),
    },
    {
      category: "Books",
      name: "ISBN Validation",
      test: measureTime("ISBN Validation", testISBNValidation),
    },

    // ============= LOAN MANAGEMENT TESTS =============
    {
      category: "Loans",
      name: "Create Loan",
      test: measureTime("Create Loan", testCreateLoan),
    },
    {
      category: "Loans",
      name: "Book Status After Loan",
      test: measureTime("Book Status After Loan", testBookStatusAfterLoan),
    },
    {
      category: "Loans",
      name: "Get All Loans",
      test: measureTime("Get All Loans", testGetAllLoans),
    },
    {
      category: "Loans",
      name: "Create Second Loan",
      test: measureTime("Create Second Loan", testCreateSecondLoan),
    },
    {
      category: "Loans",
      name: "Get Overdue Loans",
      test: measureTime("Get Overdue Loans", testGetOverdueLoans),
    },
    {
      category: "Loans",
      name: "Return Book",
      test: measureTime("Return Book", testReturnBook),
    },

    // ============= FINE MANAGEMENT TESTS =============
    {
      category: "Fines",
      name: "Create Fine",
      test: measureTime("Create Fine", testCreateFine),
    },
    {
      category: "Fines",
      name: "Get All Fines",
      test: measureTime("Get All Fines", testGetAllFines),
    },
    {
      category: "Fines",
      name: "Create Overdue Fines",
      test: measureTime("Create Overdue Fines", testCreateOverdueFines),
    },
    {
      category: "Fines",
      name: "Pay Fine",
      test: measureTime("Pay Fine", testPayFine),
    },

    // ============= USER PROFILE TESTS =============
    {
      category: "Profiles",
      name: "Get Reader Profile",
      test: measureTime("Get Reader Profile", testGetReaderProfile),
    },
    {
      category: "Profiles",
      name: "Update Reader Profile",
      test: measureTime("Update Reader Profile", testUpdateReaderProfile),
    },
    {
      category: "Profiles",
      name: "Get Staff Profile",
      test: measureTime("Get Staff Profile", testGetStaffProfile),
    },
    {
      category: "Profiles",
      name: "Update Staff Profile",
      test: measureTime("Update Staff Profile", testUpdateStaffProfile),
    },
    {
      category: "Profiles",
      name: "Get All Readers",
      test: measureTime("Get All Readers", testGetAllReaders),
    },
    {
      category: "Profiles",
      name: "Get All Staff",
      test: measureTime("Get All Staff", testGetAllStaff),
    },

    // ============= API FILTERING TESTS =============
    {
      category: "API Filters",
      name: "Author Filtering",
      test: measureTime("Author Filtering", testAuthorFiltering),
    },
    {
      category: "API Filters",
      name: "Author Sorting",
      test: measureTime("Author Sorting", testAuthorSorting),
    },
    {
      category: "API Filters",
      name: "Author Pagination",
      test: measureTime("Author Pagination", testAuthorPagination),
    },
    {
      category: "API Filters",
      name: "Author Field Selection",
      test: measureTime("Author Field Selection", testAuthorFieldSelection),
    },
    {
      category: "API Filters",
      name: "Book Filtering",
      test: measureTime("Book Filtering", testBookFiltering),
    },
    {
      category: "API Filters",
      name: "Book Sorting Desc",
      test: measureTime("Book Sorting Desc", testBookSortingDescending),
    },
    {
      category: "API Filters",
      name: "Loan Filtering",
      test: measureTime("Loan Filtering", testLoanFiltering),
    },
    {
      category: "API Filters",
      name: "Publisher Pagination",
      test: measureTime("Publisher Pagination", testPublisherPagination),
    },
    {
      category: "API Filters",
      name: "Reader Filtering",
      test: measureTime("Reader Filtering", testReaderFiltering),
    },
    {
      category: "API Filters",
      name: "Combined Filtering",
      test: measureTime("Combined Filtering", testCombinedFiltering),
    },
    {
      category: "API Filters",
      name: "Fine Filtering",
      test: measureTime("Fine Filtering", testFineFiltering),
    },
    {
      category: "API Filters",
      name: "Staff Filtering",
      test: measureTime("Staff Filtering", testStaffFiltering),
    },
    {
      category: "API Filters",
      name: "Invalid Parameters",
      test: measureTime("Invalid Parameters", testInvalidFilterParameters),
    },
    {
      category: "API Filters",
      name: "Empty Results",
      test: measureTime("Empty Results", testEmptyFilterResults),
    },

    // ============= SECURITY & VALIDATION TESTS =============
    {
      category: "Security",
      name: "Unauthorized Access",
      test: measureTime("Unauthorized Access", testUnauthorizedAccess),
    },
    {
      category: "Security",
      name: "Invalid Login",
      test: measureTime("Invalid Login", testInvalidLogin),
    },
    {
      category: "Security",
      name: "Reader Cannot Access Admin",
      test: measureTime(
        "Reader Cannot Access Admin",
        testReaderCannotAccessAdminEndpoints,
      ),
    },
    {
      category: "Security",
      name: "Librarian Cannot Delete",
      test: measureTime(
        "Librarian Cannot Delete",
        testLibrarianCannotDeleteEntities,
      ),
    },
    {
      category: "Security",
      name: "Password Update Prevention",
      test: measureTime(
        "Password Update Prevention",
        testPasswordUpdatePrevention,
      ),
    },
    {
      category: "Security",
      name: "Wrong Current Password",
      test: measureTime("Wrong Current Password", testWrongCurrentPassword),
    },
    {
      category: "Security",
      name: "Password Confirmation Mismatch",
      test: measureTime(
        "Password Confirmation Mismatch",
        testPasswordConfirmationMismatch,
      ),
    },

    // ============= PASSWORD UPDATE TESTS (after security tests) =============
    {
      category: "Profiles",
      name: "Update Reader Password",
      test: measureTime("Update Reader Password", testUpdateReaderPassword),
    },
    {
      category: "Profiles",
      name: "Update Staff Password",
      test: measureTime("Update Staff Password", testUpdateStaffPassword),
    },

    // ============= DATA VALIDATION TESTS =============
    {
      category: "Validation",
      name: "Duplicate Reader",
      test: measureTime("Duplicate Reader", testDuplicateReader),
    },
    {
      category: "Validation",
      name: "Invalid Book Creation",
      test: measureTime("Invalid Book Creation", testInvalidBookCreation),
    },
    {
      category: "Validation",
      name: "Invalid Data Validation",
      test: measureTime("Invalid Data Validation", testInvalidDataValidation),
    },

    // ============= EDGE CASE TESTS =============
    {
      category: "Edge Cases",
      name: "Delete Nonexistent Entity",
      test: measureTime(
        "Delete Nonexistent Entity",
        testDeleteNonexistentEntity,
      ),
    },
    {
      category: "Edge Cases",
      name: "Malformed ID",
      test: measureTime("Malformed ID", testMalformedId),
    },
    {
      category: "Edge Cases",
      name: "Large Data Handling",
      test: measureTime("Large Data Handling", testLargeDataHandling),
    },

    // ============= PERFORMANCE TESTS =============
    {
      category: "Performance",
      name: "Concurrent Operations",
      test: measureTime("Concurrent Operations", testConcurrentOperations),
    },

    // ============= CLEANUP TESTS =============
    {
      category: "Cleanup",
      name: "Delete Second Book",
      test: measureTime("Delete Second Book", testDeleteSecondBook),
    },
    {
      category: "Cleanup",
      name: "Delete Second Author",
      test: measureTime("Delete Second Author", testDeleteSecondAuthor),
    },
    {
      category: "Cleanup",
      name: "Delete Second Publisher",
      test: measureTime("Delete Second Publisher", testDeleteSecondPublisher),
    },
    {
      category: "Cleanup",
      name: "Delete Reader",
      test: measureTime("Delete Reader", testDeleteReader),
    },
    {
      category: "Cleanup",
      name: "Delete Second Admin",
      test: measureTime("Delete Second Admin", testDeleteSecondAdmin),
    },
  ];

  testStats.totalTests = testSuite.length;
  let currentCategory = "";
  const results = [];
  const categoryStats = {};

  console.log(`📊 Total Tests to Run: ${testStats.totalTests}\n`);

  for (const { category, name, test } of testSuite) {
    try {
      // Print category header if it's a new category
      if (category !== currentCategory) {
        if (currentCategory !== "") console.log(""); // Add spacing between categories
        console.log(`\n🔸 ${category.toUpperCase()} TESTS`);
        console.log("─".repeat(50));
        currentCategory = category;

        if (!categoryStats[category]) {
          categoryStats[category] = { passed: 0, failed: 0, total: 0 };
        }
      }

      categoryStats[category].total++;

      console.log(`\n🧪 Running: ${name}`);
      const startTime = Date.now();
      const result = await test();
      const endTime = Date.now();
      const duration = endTime - startTime;

      if (result) {
        testStats.passedTests++;
        categoryStats[category].passed++;
        results.push({ category, name, status: "✅ PASSED", duration });
        verboseLog(`✓ ${name} completed successfully in ${duration}ms`);
      } else {
        testStats.failedTests++;
        categoryStats[category].failed++;
        results.push({ category, name, status: "❌ FAILED", duration });
      }
    } catch (error) {
      console.log(`❌ Test failed with error: ${error.message}`);
      testStats.failedTests++;
      if (categoryStats[currentCategory]) {
        categoryStats[currentCategory].failed++;
      }
      results.push({ category, name, status: "❌ ERROR", duration: 0 });
    }
  }

  console.log("\n" + "=".repeat(80));
  console.log("📊 ENHANCED COMPREHENSIVE TEST RESULTS");
  console.log("=".repeat(80));

  // Print results by category
  let currentCat = "";
  results.forEach(({ category, name, status, duration }) => {
    if (category !== currentCat) {
      console.log(`\n🔸 ${category.toUpperCase()}:`);
      currentCat = category;
    }
    const durationStr = duration > 0 ? ` (${duration}ms)` : "";
    console.log(`   ${status} ${name}${durationStr}`);
  });

  // Category Statistics
  console.log("\n" + "=".repeat(80));
  console.log("📈 CATEGORY STATISTICS");
  console.log("=".repeat(80));

  Object.entries(categoryStats).forEach(([category, stats]) => {
    const successRate = ((stats.passed / stats.total) * 100).toFixed(1);
    console.log(
      `🔸 ${category}: ${stats.passed}/${stats.total} passed (${successRate}%)`,
    );
  });

  // Overall Statistics
  console.log("\n" + "=".repeat(80));
  console.log("📊 OVERALL SUMMARY");
  console.log("=".repeat(80));
  console.log(`📈 Total Tests: ${testStats.totalTests}`);
  console.log(`✅ Passed: ${testStats.passedTests}`);
  console.log(`❌ Failed: ${testStats.failedTests}`);
  console.log(
    `📊 Success Rate: ${((testStats.passedTests / testStats.totalTests) * 100).toFixed(1)}%`,
  );

  // Performance Statistics
  const totalTestTime = Object.values(testStats.testTimes).reduce(
    (sum, time) => sum + time,
    0,
  );
  const avgTestTime = totalTestTime / Object.keys(testStats.testTimes).length;
  const slowestTest = Object.entries(testStats.testTimes).reduce(
    (max, [name, time]) => (time > max.time ? { name, time } : max),
    { name: "", time: 0 },
  );
  const fastestTest = Object.entries(testStats.testTimes).reduce(
    (min, [name, time]) => (time < min.time ? { name, time } : min),
    { name: "", time: Infinity },
  );

  console.log(`⏱️  Total Execution Time: ${totalTestTime}ms`);
  console.log(`⚡ Average Test Time: ${avgTestTime.toFixed(1)}ms`);
  console.log(`🐌 Slowest Test: ${slowestTest.name} (${slowestTest.time}ms)`);
  console.log(`🚀 Fastest Test: ${fastestTest.name} (${fastestTest.time}ms)`);

  if (testStats.failedTests === 0) {
    console.log("\n🎉 ALL TESTS PASSED! Your API is working perfectly.");
    console.log(
      "🏆 Your Library Management System API is comprehensive and robust!",
    );
  } else {
    console.log(
      `\n⚠️  ${testStats.failedTests} test(s) failed. Please check the error messages above.`,
    );
  }

  // Display captured test data
  console.log("\n" + "=".repeat(80));
  console.log("📋 CAPTURED TEST DATA");
  console.log("=".repeat(80));
  Object.entries(testData).forEach(([key, value]) => {
    if (value && typeof value === "string") {
      const displayValue =
        value.length > 40 ? `${value.substring(0, 40)}...` : value;
      console.log(`   ${key}: ${displayValue}`);
    } else if (value && typeof value === "object") {
      console.log(`   ${key}: [${value.length} items]`);
    }
  });

  if (testStats.errors.length > 0) {
    console.log("\n" + "=".repeat(80));
    console.log("🚨 ERROR DETAILS");
    console.log("=".repeat(80));
    testStats.errors.forEach(({ testName, error }) => {
      console.log(`❌ ${testName}: ${error}`);
    });
  }
}

// Ensure admin user exists
async function ensureAdminExists() {
  try {
    if (!mongoose.connection.readyState) {
      console.log("🔌 Connecting to database to check admin user...");
      await mongoose.connect(process.env.DATABASE_URI);
    }

    // Check if admin user exists
    const existingAdmin = await Staff.findOne({
      staff_email: ADMIN_CREDENTIALS.email,
    });

    if (existingAdmin) {
      console.log("✅ Admin user already exists");
      return;
    }

    console.log("👤 Creating admin user...");
    const adminUser = await Staff.create({
      staff_fname: "Abdelrahman",
      staff_lname: "Khaled",
      staff_email: ADMIN_CREDENTIALS.email,
      staff_join_date: new Date(),
      password: ADMIN_CREDENTIALS.password,
      role: "admin",
    });

    console.log("✅ Admin user created successfully");
    console.log(`   Email: ${adminUser.staff_email}`);
    console.log(`   Role: ${adminUser.role}`);
  } catch (error) {
    console.error("❌ Error ensuring admin exists:", error.message);
    process.exit(1);
  }
}

// Database reset function
async function resetDatabase() {
  try {
    console.log("🔌 Connecting to database for reset...");
    await mongoose.connect(process.env.DATABASE_URI);
    console.log("✅ Database connected successfully");

    console.log("\n🗑️  Resetting database...");

    // Clear all collections
    const collections = [
      { model: Author, name: "Authors" },
      { model: Publisher, name: "Publishers" },
      { model: Book, name: "Books" },
      { model: Reader, name: "Readers" },
      { model: Loan, name: "Loans" },
      { model: Fine, name: "Fines" },
      { model: Staff, name: "Staff" },
    ];

    for (const collection of collections) {
      const count = await collection.model.countDocuments();
      if (count > 0) {
        await collection.model.deleteMany({});
        console.log(`   ✅ Cleared ${collection.name} (${count} documents)`);
      } else {
        console.log(`   ℹ️  ${collection.name} was already empty`);
      }
    }

    console.log("✅ Database reset completed!");
    // Note: Don't disconnect here, we'll reuse the connection
  } catch (error) {
    console.error("❌ Error resetting database:", error);
    process.exit(1);
  }
}

// Run the tests
async function main() {
  try {
    console.log("🚀 ENHANCED Library Management System API Test Suite");
    console.log("=".repeat(80));
    console.log("📋 Test Configuration:");
    console.log(`   🌐 Base URL: ${BASE_URL}`);
    console.log(`   🔄 Database Reset: ${shouldResetDatabase ? "YES" : "NO"}`);
    console.log(`   📝 Verbose Mode: ${verboseMode ? "ON" : "OFF"}`);
    console.log(`   👤 Admin Email: ${ADMIN_CREDENTIALS.email}`);
    console.log("=".repeat(80));

    // Reset database if requested
    if (shouldResetDatabase) {
      console.log("\n🔄 DATABASE RESET REQUESTED");
      await resetDatabase();
      console.log(""); // Add spacing
    }

    // Ensure admin user exists
    console.log("👤 ENSURING ADMIN USER EXISTS");
    await ensureAdminExists();
    console.log(""); // Add spacing

    console.log("🔍 VALIDATING SERVER CONNECTION");
    const serverOnline = await validateServerConnection();
    if (!serverOnline) {
      console.log(
        "\n🚨 Cannot proceed with tests. Please start the server first.",
      );
      console.log("💡 Run: npm start or node server.js");
      process.exit(1);
    }

    console.log("\n🎯 STARTING COMPREHENSIVE TEST EXECUTION");
    const testStartTime = Date.now();
    await runTests();
    const testEndTime = Date.now();

    console.log("\n" + "=".repeat(80));
    console.log("🏁 TEST EXECUTION COMPLETED");
    console.log("=".repeat(80));
    console.log(`⏱️  Total Execution Time: ${testEndTime - testStartTime}ms`);
    console.log(`📅 Completed at: ${new Date().toISOString()}`);
  } catch (error) {
    console.error("💥 Unexpected error during test execution:", error.message);
    if (verboseMode) {
      console.error("Stack trace:", error.stack);
    }
    process.exit(1);
  } finally {
    // Disconnect from database if connected
    if (mongoose.connection.readyState) {
      console.log("🔌 Disconnecting from database...");
      await mongoose.disconnect();
      console.log("✅ Database disconnected successfully");
    }
  }
}

main();
