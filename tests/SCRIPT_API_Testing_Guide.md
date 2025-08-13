# Enhanced Library Management System API Test Suite

## Overview

This is a comprehensive, enhanced test suite for the Library Management System API. It provides exhaustive testing coverage including CRUD operations, security validation, edge cases, performance testing, and more.

## Features

### 🎯 Comprehensive Testing Coverage

- **75+ Individual Tests** across all endpoints
- **Full CRUD Operations** (Create, Read, Update, Delete)
- **API Filtering, Sorting & Pagination** testing
- **Authentication & Authorization** testing
- **Role-based Access Control** validation
- **Profile Management** testing (updateMe endpoints)
- **Security Testing** (Password Protection, etc.)
- **Data Validation** and schema testing
- **Edge Cases** and error boundary testing
- **Performance Testing** (concurrent operations)

### 📊 Enhanced Reporting

- **Categorized Test Results** for easy analysis
- **Performance Timing** for each test
- **Success Rate Statistics** per category and overall
- **Detailed Error Reporting** with stack traces
- **Test Execution Metrics** (fastest/slowest tests)

### 🔧 Advanced Features

- **Automatic Database Reset** (optional)
- **Automatic Admin User Creation**
- **Verbose Mode** for detailed debugging
- **Concurrent Operation Testing**
- **Input Sanitization Validation**

## Test Categories

### 1. Authentication & Authorization (7 tests)

- Admin login
- Librarian creation and login
- Reader creation and login
- Multiple user account management
- Second admin creation

### 2. Authors (5 tests)

- Full CRUD operations
- Data validation
- Bulk operations

### 3. Publishers (4 tests)

- Full CRUD operations
- Data validation
- Update operations

### 4. Books (5 tests)

- Full CRUD operations with relationships
- Validation with author/publisher dependencies
- Complex data handling

### 5. Loans (5 tests)

- Loan creation and management
- Book return functionality
- Overdue loan tracking
- Availability validation

### 6. Fines (4 tests)

- Fine creation and management
- Payment processing
- Overdue fine generation
- Financial calculations

### 7. User Profiles (8 tests)

- Reader profile management
- Reader profile updates
- Reader password updates
- Staff profile management
- Staff profile updates
- Staff password updates
- User listing and access

### 8. API Filters (14 tests)

- Field-based filtering (authors, books, readers, etc.)
- Sorting (ascending/descending)
- Pagination (page and limit parameters)
- Field selection (choosing specific fields to return)
- MongoDB operators (gte, lte, in, etc.)
- Combined filtering (multiple parameters)
- Edge cases (invalid parameters, empty results)

### 9. Security (7 tests)

- Unauthorized access prevention
- Role-based access control
- Password update prevention
- Password security validation
- Authentication validation

### 10. Data Validation (3 tests)

- Input validation
- Duplicate prevention
- Business rule enforcement

### 11. Edge Cases (3 tests)

- Nonexistent entity handling
- Malformed ID handling
- Large data processing

### 12. Performance (1 test)

- Concurrent operation handling

### 13. Cleanup (5 tests)

- Resource cleanup
- Data consistency
- Proper deletion handling

## Usage

### Basic Usage

```bash
# Run all tests
node tests/test-api.js

# Run tests with database reset
node tests/test-api.js --reset
node tests/test-api.js -r

# Run tests with verbose output
node tests/test-api.js --verbose
node tests/test-api.js -v

# Combine options
node tests/test-api.js --reset --verbose
```

### Prerequisites

1. **Server Running**: Ensure the API server is running on `http://localhost:5000`
2. **Database Connection**: MongoDB connection should be available
3. **Dependencies**: All npm packages should be installed

```bash
# Start the server (in separate terminal)
npm start
# or
node server.js

# Then run tests
node tests/test-api.js
```

### Test Data

The test suite automatically creates and manages test data:

- **Admin User**: `admin1@hotmail.com` / `Admin@1234`
- **Librarian**: `jane.smith@library.com` / `Librarian@123`
- **Readers**: Multiple test readers with unique emails
- **Authors**: Test authors (J.K. Rowling, George R.R. Martin)
- **Publishers**: Test publishers (Bloomsbury, Bantam Books)
- **Books**: Test books with proper relationships
- **Loans & Fines**: Test transactions

## Sample Output

```
🚀 ENHANCED Library Management System API Test Suite
================================================================================
📋 Test Configuration:
   🌐 Base URL: http://localhost:5000/api
   🔄 Database Reset: YES
   📝 Verbose Mode: ON
   👤 Admin Email: admin1@hotmail.com
================================================================================

🔄 DATABASE RESET REQUESTED
🗑️  Resetting database (preserving only Abdelrahman Khaled admin)...
   ✅ Cleared Authors (0 documents)
   ✅ Cleared Publishers (0 documents)
   ...

🎯 STARTING COMPREHENSIVE TEST EXECUTION
📊 Total Tests to Run: 60

🔸 AUTHENTICATION TESTS
──────────────────────────────────────────────────────

🧪 Running: Admin Login
✅ Admin login successful
   Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   Staff ID: 507f1f77bcf86cd799439011

🧪 Running: Create Librarian
✅ Librarian created successfully
   Librarian ID: 507f1f77bcf86cd799439012

...

📊 ENHANCED COMPREHENSIVE TEST RESULTS
================================================================================

🔸 AUTHENTICATION:
   ✅ PASSED Admin Login (245ms)
   ✅ PASSED Create Librarian (189ms)
   ✅ PASSED Librarian Login (156ms)
   ...

📈 CATEGORY STATISTICS
================================================================================
🔸 Authentication: 7/7 passed (100.0%)
🔸 Authors: 5/5 passed (100.0%)
🔸 Publishers: 4/4 passed (100.0%)
🔸 Books: 5/5 passed (100.0%)
🔸 Loans: 5/5 passed (100.0%)
🔸 Fines: 4/4 passed (100.0%)
🔸 Profiles: 4/4 passed (100.0%)
🔸 Security: 5/5 passed (100.0%)
🔸 Validation: 3/3 passed (100.0%)
🔸 Edge Cases: 3/3 passed (100.0%)
🔸 Performance: 1/1 passed (100.0%)
🔸 Cleanup: 5/5 passed (100.0%)

📊 OVERALL SUMMARY
================================================================================
📈 Total Tests: 60
✅ Passed: 51
❌ Failed: 0
📊 Success Rate: 100.0%
⏱️  Total Execution Time: 15234ms
⚡ Average Test Time: 292.8ms
🐌 Slowest Test: Concurrent Operations (1234ms)
🚀 Fastest Test: Get All Authors (89ms)

🎉 ALL TESTS PASSED! Your API is working perfectly.
🏆 Your Library Management System API is comprehensive and robust!
```

## Error Handling

The test suite includes comprehensive error handling:

- **Network Timeouts**: 15-second timeout for requests
- **Database Connection Issues**: Automatic retry and graceful failure
- **API Errors**: Detailed error reporting with status codes
- **Test Failures**: Individual test isolation (one failure doesn't stop others)
- **Cleanup**: Automatic database disconnection

## Customization

### Adding New Tests

1. Create a new test function following the pattern:

```javascript
async function testNewFeature() {
  console.log("🧪 Testing New Feature...");
  // Your test logic here
  const result = await makeRequest("GET", "/new-endpoint");

  if (result.success) {
    console.log("✅ New feature test successful");
    return true;
  } else {
    console.log("❌ New feature test failed:", result.error);
    return false;
  }
}
```

2. Add it to the test suite in `runTests()`:

```javascript
{ category: "New Category", name: "New Feature", test: measureTime("New Feature", testNewFeature) },
```

### Modifying Test Configuration

Update the configuration constants at the top of the file:

```javascript
const BASE_URL = "http://localhost:5000/api";
const ADMIN_CREDENTIALS = {
  email: "your-admin@email.com",
  password: "YourPassword123",
};
```

## Troubleshooting

### Common Issues

1. **Server Not Running**

   ```
   ❌ Server is not accessible. Please ensure the server is running on http://localhost:5000
   ```

   **Solution**: Start the API server first

2. **Database Connection Issues**

   ```
   ❌ Error resetting database: MongooseError: Connection failed
   ```

   **Solution**: Check MongoDB connection and DATABASE_URI in .env

3. **Authentication Failures**

   ```
   ❌ Admin login failed: Invalid credentials
   ```

   **Solution**: Verify admin user exists or allow auto-creation

4. **Test Timeouts**
   ```
   ❌ Test failed with error: timeout of 15000ms exceeded
   ```
   **Solution**: Check server performance or increase timeout

### Verbose Mode

Use verbose mode for detailed debugging:

```bash
node tests/test-api.js --verbose
```

This provides:

- Detailed request/response logging
- Timing information for each operation
- Stack traces for errors
- Step-by-step test execution details

## Contributing

To enhance the test suite:

1. Follow the existing patterns for consistency
2. Add appropriate error handling
3. Include timing measurements
4. Categorize tests appropriately
5. Update documentation

## License

This test suite is part of the Library Management System project and follows the same license terms.
