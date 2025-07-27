# Library Management System - Comprehensive API Testing Guide

## Base URL

```
http://localhost:5000/api
```

## 🎯 Testing Overview

This guide provides comprehensive testing for all Library Management System endpoints, including:

- ✅ **Happy Path Scenarios** - Normal operations
- 🚫 **Security & Validation Tests** - Error handling and security
- 🔄 **Business Logic Tests** - Complex workflows

## 📋 Testing Order (Important!)

Test in this order to maintain data dependencies:

1. **🔐 Authentication** - Get your admin token + security tests
2. **📚 Authors** - Create authors first + CRUD operations
3. **🏢 Publishers** - Create publishers + validation
4. **📖 Books** - Create books (needs authors & publishers) + error scenarios
5. **👥 Readers** - Create readers + profile management
6. **📋 Loans** - Create loans (needs books & readers) + business logic
7. **💰 Fines** - Test fine management + payment processing
8. **👨‍💼 Staff Management** - Admin operations
9. **🚫 Security Tests** - Comprehensive security validation

---

## 1. 🔐 AUTHENTICATION TESTS

### 1.1 ✅ Login as Admin Staff

**POST** `{{baseUrl}}/auth/login/staff`

**Body (JSON):**

```json
{
  "email": "admin1@hotmail.com",
  "password": "Admin@1234"
}
```

**Expected Response:**

```json
{
  "message": "success",
  "data": { ... },
  "token": "eyJ..."
}
```

**⚠️ IMPORTANT:** Copy the `token` from the response and use it in the Authorization header for all protected routes:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

### 1.2 ✅ Create Reader Account

**POST** `{{baseUrl}}/auth/signup/reader`

**Body (JSON):**

```json
{
  "reader_fname": "John",
  "reader_lname": "Doe",
  "reader_email": "john.doe@example.com",
  "reader_phone_no": "+1234567890",
  "reader_address": "123 Main St, City, Country",
  "password": "Reader@123"
}
```

### 1.3 ✅ Login as Reader

**POST** `{{baseUrl}}/auth/login/reader`

**Body (JSON):**

```json
{
  "email": "john.doe@example.com",
  "password": "Reader@123"
}
```

### 1.4 🚫 Invalid Login Credentials Test

**POST** `{{baseUrl}}/auth/login/staff`

**Body (JSON):**

```json
{
  "email": "invalid@example.com",
  "password": "wrongpassword"
}
```

**Expected Response:** `401 Unauthorized` with error message

### 1.5 🚫 Duplicate Reader Registration Test

**POST** `{{baseUrl}}/auth/signup/reader`

**Body (JSON):**

```json
{
  "reader_fname": "John",
  "reader_lname": "Doe",
  "reader_email": "john.doe@example.com",
  "reader_phone_no": "+1234567890",
  "reader_address": "456 Different St, City, Country",
  "password": "Reader@456"
}
```

**Expected Response:** `400/409` error about duplicate email

---

## 2. 📚 AUTHORS MANAGEMENT

### 2.1 ✅ Create Author

**POST** `{{baseUrl}}/authors`
**Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

**Body (JSON):**

```json
{
  "author_name": "J.K. Rowling",
  "email": "jk.rowling@example.com",
  "biography": "British author, best known for the Harry Potter series."
}
```

### 2.2 ✅ Get All Authors

**GET** `{{baseUrl}}/authors`

### 2.3 ✅ Get Author by ID

**GET** `{{baseUrl}}/authors/{{authorId}}`

### 2.4 ✅ Update Author

**PATCH** `{{baseUrl}}/authors/{{authorId}}`
**Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

**Body (JSON):**

```json
{
  "biography": "Updated biography: British author, best known for the Harry Potter series and other works."
}
```

---

## 3. 🏢 PUBLISHERS MANAGEMENT

### 3.1 ✅ Create Publisher

**POST** `{{baseUrl}}/publishers`
**Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

**Body (JSON):**

```json
{
  "publisher_name": "Bloomsbury Publishing",
  "publisher_website": "https://www.bloomsbury.com",
  "year_of_publication": 1986,
  "no_published_books": 100
}
```

### 3.2 ✅ Get All Publishers

**GET** `{{baseUrl}}/publishers`

### 3.3 ✅ Get Publisher by ID

**GET** `{{baseUrl}}/publishers/{{publisherId}}`

---

## 4. 📖 BOOKS MANAGEMENT

### 4.1 ✅ Create Book

**POST** `{{baseUrl}}/books`
**Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

**Body (JSON):**

```json
{
  "book_title": "Harry Potter and the Philosopher's Stone",
  "book_description": "The first book in the Harry Potter series",
  "book_pages": 223,
  "release_date": "1997-06-26",
  "book_tags": ["fantasy", "young adult", "magic"],
  "authorId": "{{authorId}}",
  "publisherId": "{{publisherId}}"
}
```

### 4.2 ✅ Get All Books

**GET** `{{baseUrl}}/books`

### 4.3 ✅ Get Book by ID

**GET** `{{baseUrl}}/books/{{bookId}}`

### 4.4 🚫 Invalid Book Creation Test

**POST** `{{baseUrl}}/books`
**Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

**Body (JSON):**

```json
{
  "book_title": "",
  "book_description": "A book with missing required fields"
}
```

**Expected Response:** `400 Bad Request` with validation error

---

## 5. 👥 READERS MANAGEMENT

### 5.1 ✅ Get All Readers (Admin only)

**GET** `{{baseUrl}}/readers`
**Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

### 5.2 ✅ Create Reader (Admin only)

**POST** `{{baseUrl}}/readers`
**Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

**Body (JSON):**

```json
{
  "reader_fname": "Jane",
  "reader_lname": "Smith",
  "reader_email": "jane.smith@example.com",
  "reader_phone_no": "+1987654321",
  "reader_address": "456 Oak Ave, City, Country",
  "password": "Reader@456"
}
```

### 5.3 ✅ Get My Profile (Reader)

**GET** `{{baseUrl}}/readers/getMe`
**Headers:** `Authorization: Bearer YOUR_READER_TOKEN`

---

## 6. 📋 LOANS MANAGEMENT

### 6.1 ✅ Create Loan (Staff only)

**POST** `{{baseUrl}}/loans`
**Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

**Body (JSON):**

```json
{
  "bookId": "{{bookId}}",
  "readerId": "{{readerId}}"
}
```

### 6.2 ✅ Get All Loans

**GET** `{{baseUrl}}/loans`
**Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

### 6.3 ✅ Get Overdue Loans

**GET** `{{baseUrl}}/loans/overdue`
**Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

### 6.4 🚫 Test Book Unavailability After Loan

**POST** `{{baseUrl}}/loans`
**Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

**Body (JSON):**

```json
{
  "bookId": "{{bookId}}", // Same book ID as the first loan
  "readerId": "{{readerId}}"
}
```

**Expected Response:** `400/409` Error indicating the book is already loaned/unavailable

**Test Description:**
This test verifies that the system properly prevents a book from being loaned twice. After creating a loan for a book, attempting to create another loan for the same book should result in a rejection, confirming that the book's availability status is being properly tracked.

### 6.5 ✅ Return Book

**PATCH** `{{baseUrl}}/loans/{{loanId}}/return`
**Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

---

## 7. 💰 FINES MANAGEMENT

### 7.1 ✅ Get All Fines

**GET** `{{baseUrl}}/fines`
**Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

### 7.2 ✅ Create Fines for Overdue Loans

**POST** `{{baseUrl}}/fines/create-overdue`
**Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

### 7.3 ✅ Create Manual Fine

**POST** `{{baseUrl}}/fines`
**Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

**Body (JSON):**

```json
{
  "loanId": "{{loanId}}",
  "accumulated_amount": 5.0,
  "penalty_rate": 1.0
}
```

### 7.4 ✅ Pay Fine

**PATCH** `{{baseUrl}}/fines/{{fineId}}/pay`
**Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

---

## 8. 👨‍💼 STAFF MANAGEMENT

### 8.1 ✅ Get All Staff (Admin only)

**GET** `{{baseUrl}}/staff`
**Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

### 8.2 ✅ Create New Staff (Admin only)

**POST** `{{baseUrl}}/staff`
**Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

**Body (JSON):**

```json
{
  "staff_fname": "Alice",
  "staff_lname": "Johnson",
  "staff_email": "alice.johnson@library.com",
  "password": "Staff@789",
  "role": "librarian"
}
```

---

## 9. 🚫 COMPREHENSIVE SECURITY & VALIDATION TESTS

### 9.1 🚫 Unauthorized Access Tests

#### Test Loans Without Token

**GET** `{{baseUrl}}/loans`
**Headers:** _(No Authorization header)_
**Expected Response:** `401 Unauthorized`

#### Test Admin Route with Reader Token

**GET** `{{baseUrl}}/staff`
**Headers:** `Authorization: Bearer YOUR_READER_TOKEN`
**Expected Response:** `401/403 Forbidden`

#### Test Invalid Token

**GET** `{{baseUrl}}/loans`
**Headers:** `Authorization: Bearer invalid_token_here`
**Expected Response:** `401 Unauthorized`

### 9.2 🚫 Business Logic Validation Tests

#### Test Loan with Non-existent Book

**POST** `{{baseUrl}}/loans`
**Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

**Body (JSON):**

```json
{
  "bookId": "507f1f77bcf86cd799439011",
  "readerId": "{{readerId}}"
}
```

**Expected Response:** `400/404` Error about invalid book

#### Test Loan with Non-existent Reader

**POST** `{{baseUrl}}/loans`
**Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

**Body (JSON):**

```json
{
  "bookId": "{{bookId}}",
  "readerId": "507f1f77bcf86cd799439012"
}
```

**Expected Response:** `400/404` Error about invalid reader

#### Test Return Non-existent Loan

**PATCH** `{{baseUrl}}/loans/507f1f77bcf86cd799439013/return`
**Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`
**Expected Response:** `400/404` Error about invalid loan

### 9.3 🚫 Data Validation Tests

#### Test Weak Password

**POST** `{{baseUrl}}/auth/signup/reader`

**Body (JSON):**

```json
{
  "reader_fname": "Test",
  "reader_lname": "User",
  "reader_email": "test@example.com",
  "reader_phone_no": "+1111111111",
  "reader_address": "Test Address",
  "password": "123"
}
```

**Expected Response:** `400` Password validation error

#### Test Invalid Email Format

**POST** `{{baseUrl}}/auth/signup/reader`

**Body (JSON):**

```json
{
  "reader_fname": "Test",
  "reader_lname": "User",
  "reader_email": "invalid-email",
  "reader_phone_no": "+1111111111",
  "reader_address": "Test Address",
  "password": "ValidPassword@123"
}
```

**Expected Response:** `400` Email validation error

---

## 🔧 ADVANCED TESTING SCENARIOS

### Test Already Loaned Book

1. Create a loan for a book
2. Try to create another loan for the same book
3. **Expected:** Error indicating book is already loaned or unavailable
4. **Test Location:** "Test Book Unavailability After Loan" in the Loans section

### Test Return Already Returned Book

1. Return a book (mark loan as returned)
2. Try to return the same loan again
3. **Expected:** Error indicating book is already returned

### Test Create Loan for Book with Pending Fines

1. Create a loan that becomes overdue
2. Generate fines for the overdue loan
3. Try to create a new loan for the same reader
4. **Expected:** Error or warning about pending fines

### Test Cascade Operations

1. Delete an author who has books
2. **Expected:** Error preventing deletion or cascade deletion of related books

---

## 📊 TESTING METRICS & SUCCESS CRITERIA

### Expected Response Times

- **Authentication:** < 500ms
- **CRUD Operations:** < 300ms
- **Complex Queries:** < 1000ms

### Success Rate Targets

- **Happy Path Tests:** 100% success
- **Security Tests:** 100% proper rejection
- **Validation Tests:** 100% proper error handling

---

## 🛠️ AUTOMATED TESTING TOOLS

### Available Testing Options

1. **📋 Postman Collection**

   - Import `LMS.postman_collection.json`
   - Run individual requests or entire collection
   - Automated test assertions included

2. **🔧 Node.js Test Script**

   - Run: `node tests/test-api.js`
   - With database reset: `node tests/test-api.js --reset`
   - Comprehensive automated testing with detailed reporting

3. **📖 Postman Testing**
   - Use Request Runner in Postman to execute all tests sequentially

---

## 🎯 TESTING BEST PRACTICES

### Before Testing

- ✅ Ensure server is running on `http://localhost:5000`
- ✅ Database is accessible and properly configured
- ✅ Admin user exists with credentials: `admin1@hotmail.com / Admin@1234`

### During Testing

- ✅ Test in the specified order to maintain data dependencies
- ✅ Save important IDs (authorId, bookId, etc.) for subsequent tests
- ✅ Verify both success responses and error responses
- ✅ Check HTTP status codes match expectations

### After Testing

- ✅ Review all test results
- ✅ Document any unexpected behaviors
- ✅ Clean up test data if needed

---

## 🏆 COMPREHENSIVE TEST COVERAGE

This guide now covers:

- **🔐 Authentication & Authorization:** 5 tests
- **📚 Authors Management:** 4 tests
- **🏢 Publishers Management:** 3 tests
- **📖 Books Management:** 4 tests
- **👥 Readers Management:** 3 tests
- **📋 Loans Management:** 4 tests
- **💰 Fines Management:** 4 tests
- **👨‍💼 Staff Management:** 2 tests
- **🚫 Security & Validation:** 8+ tests

**Total: 35+ comprehensive test scenarios**

---

## Sample Error Responses

### 401 Unauthorized

```json
{
  "status": "fail",
  "message": "Invalid token. Please log in again."
}
```

### 400 Bad Request

```json
{
  "status": "fail",
  "message": "Missing required fields: book_title, book_pages, release_date, authorId, and publisherId"
}
```

### 404 Not Found

```json
{
  "status": "fail",
  "message": "Book not found"
}
```
