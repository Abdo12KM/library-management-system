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
9. **� API Filtering & Pagination** - Test filtering, sorting, pagination features
10. **�🚫 Security Tests** - Comprehensive security validation

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
  "book_ISBN": "978-0747532743",
  "book_status": "available",
  "authorId": "{{authorId}}",
  "publisherId": "{{publisherId}}"
}
```

### 4.2 ✅ Get All Books

**GET** `{{baseUrl}}/books`

### 4.3 ✅ Get Book by ID

**GET** `{{baseUrl}}/books/{{bookId}}`

### 4.4 ✅ Update Book

**PATCH** `{{baseUrl}}/books/{{bookId}}`
**Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

**Body (JSON):**

```json
{
  "book_title": "Harry Potter and the Philosopher's Stone (Updated Edition)",
  "book_description": "The first book in the Harry Potter series - Updated description",
  "book_pages": 250
}
```

### 4.5 ✅ Update Book Status

**PATCH** `{{baseUrl}}/books/{{bookId}}/status`
**Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

**Body (JSON):**

```json
{
  "book_status": "maintenance"
}
```

### 4.6 🚫 Invalid Book Creation Test

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

### 4.7 🚫 Invalid Book Status Test

**PATCH** `{{baseUrl}}/books/{{bookId}}/status`
**Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

**Body (JSON):**

```json
{
  "book_status": "invalid_status"
}
```

**Expected Response:** `400 Bad Request` with validation error

### 4.8 🚫 Invalid ISBN Validation Test

**POST** `{{baseUrl}}/books`
**Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

**Body (JSON):**

```json
{
  "book_title": "Test Book with Invalid ISBN",
  "book_description": "Testing ISBN validation",
  "book_pages": 100,
  "release_date": "2023-01-01",
  "book_ISBN": "invalid-isbn",
  "book_status": "available",
  "authorId": "{{authorId}}",
  "publisherId": "{{publisherId}}"
}
```

**Expected Response:** `400 Bad Request` with ISBN validation error

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

### 5.4 ✅ Update My Profile (Reader)

**PATCH** `{{baseUrl}}/readers/updateMe`
**Headers:** `Authorization: Bearer YOUR_READER_TOKEN`

**Body (JSON):**

```json
{
  "reader_fname": "John Updated",
  "reader_lname": "Doe Updated",
  "reader_phone_no": "+1234567899",
  "reader_address": "456 Updated St, New City, Country"
}
```

**Note:** Only readers can update their own profile. Password updates are not allowed through this endpoint.

### 5.5 ✅ Update My Password (Reader)

**PATCH** `{{baseUrl}}/readers/updateMyPassword`
**Headers:** `Authorization: Bearer YOUR_READER_TOKEN`

**Body (JSON):**

```json
{
  "passwordCurrent": "Reader@123",
  "password": "NewReaderPassword@123",
  "passwordConfirm": "NewReaderPassword@123"
}
```

**Note:** Requires current password verification. New password must match confirmation.

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

### 8.3 ✅ Get My Profile (Staff)

**GET** `{{baseUrl}}/staff/getMe`
**Headers:** `Authorization: Bearer YOUR_STAFF_TOKEN`

### 8.4 ✅ Update My Profile (Staff)

**PATCH** `{{baseUrl}}/staff/updateMe`
**Headers:** `Authorization: Bearer YOUR_STAFF_TOKEN`

**Body (JSON):**

```json
{
  "staff_fname": "Admin Updated",
  "staff_lname": "User Updated",
  "staff_email": "admin.updated@library.com"
}
```

**Note:** Only staff can update their own profile. Password updates are not allowed through this endpoint.

### 8.5 ✅ Update My Password (Staff)

**PATCH** `{{baseUrl}}/staff/updateMyPassword`
**Headers:** `Authorization: Bearer YOUR_STAFF_TOKEN`

**Body (JSON):**

```json
{
  "passwordCurrent": "Admin@1234",
  "password": "NewAdminPassword@123",
  "passwordConfirm": "NewAdminPassword@123"
}
```

**Note:** Requires current password verification. New password must match confirmation.

---

## 9. � API FILTERING, SORTING & PAGINATION TESTS

### 9.1 ✅ Basic Filtering Tests

#### 9.1.1 Author Name Filtering

**GET** `{{baseUrl}}/authors?author_name=J.K. Rowling`

**Expected Response:** Only authors with the name "J.K. Rowling"

#### 9.1.2 Book Pages Filtering (MongoDB Operator)

**GET** `{{baseUrl}}/books?book_pages[gte]=200`

**Expected Response:** Only books with 200 or more pages

#### 9.1.3 Loan Status Filtering

**GET** `{{baseUrl}}/loans?status=active`
**Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

**Expected Response:** Only active loans

#### 9.1.4 Reader Filtering by First Name

**GET** `{{baseUrl}}/readers?reader_fname=John`
**Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

**Expected Response:** Only readers with first name "John"

### 9.2 ✅ Sorting Tests

#### 9.2.1 Sort Authors by Name (Ascending)

**GET** `{{baseUrl}}/authors?sort=author_name`

**Expected Response:** Authors sorted alphabetically by name

#### 9.2.2 Sort Books by Pages (Descending)

**GET** `{{baseUrl}}/books?sort=-book_pages`

**Expected Response:** Books sorted by page count, highest first

#### 9.2.3 Sort Publishers by Name

**GET** `{{baseUrl}}/publishers?sort=publisher_name`

**Expected Response:** Publishers sorted alphabetically

### 9.3 ✅ Pagination Tests

#### 9.3.1 Basic Pagination

**GET** `{{baseUrl}}/books?page=1&limit=2`

**Expected Response:** Maximum 2 books, first page

#### 9.3.2 Second Page

**GET** `{{baseUrl}}/authors?page=2&limit=1`

**Expected Response:** Second page of authors, 1 per page

### 9.4 ✅ Field Selection Tests

#### 9.4.1 Select Specific Book Fields

**GET** `{{baseUrl}}/books?fields=book_title,book_pages`

**Expected Response:** Books with only title and pages fields (plus \_id)

#### 9.4.2 Select Author Name Only

**GET** `{{baseUrl}}/authors?fields=author_name`

**Expected Response:** Authors with only name field (plus \_id)

### 9.5 ✅ Combined Filtering Tests

#### 9.5.1 Multiple Filters + Sorting + Pagination

**GET** `{{baseUrl}}/books?book_pages[gte]=100&sort=book_title&page=1&limit=2&fields=book_title,book_pages`

**Expected Response:**

- Books with 100+ pages
- Sorted by title
- First page, 2 items max
- Only title and pages fields

#### 9.5.2 Complex Author Query

**GET** `{{baseUrl}}/authors?sort=-author_name&limit=3&fields=author_name,biography`

**Expected Response:**

- Authors sorted by name (descending)
- Maximum 3 results
- Only name and biography fields

### 9.6 ✅ MongoDB Operator Tests

#### 9.6.1 Greater Than or Equal (gte)

**GET** `{{baseUrl}}/books?book_pages[gte]=250`

**Expected Response:** Books with 250+ pages

#### 9.6.2 Less Than or Equal (lte)

**GET** `{{baseUrl}}/books?book_pages[lte]=300`

**Expected Response:** Books with 300 or fewer pages

#### 9.6.3 Range Query (gte + lte)

**GET** `{{baseUrl}}/books?book_pages[gte]=200&book_pages[lte]=500`

**Expected Response:** Books with 200-500 pages

#### 9.6.4 Not Equal (ne)

**GET** `{{baseUrl}}/loans?status[ne]=returned`
**Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

**Expected Response:** Loans that are not returned

### 9.7 ✅ Advanced Filtering Examples

#### 9.7.1 Fine Amount Filtering

**GET** `{{baseUrl}}/fines?accumulated_amount[gt]=5`
**Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

**Expected Response:** Fines with amount greater than $5

#### 9.7.2 Staff Role Filtering

**GET** `{{baseUrl}}/staff?role=librarian`
**Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

**Expected Response:** Only librarian staff members

#### 9.7.3 Date Range Filtering (if applicable)

**GET** `{{baseUrl}}/books?release_date[gte]=2000-01-01&release_date[lte]=2020-12-31`

**Expected Response:** Books released between 2000-2020

### 9.8 🚫 Edge Case Filtering Tests

#### 9.8.1 Invalid Field Name

**GET** `{{baseUrl}}/authors?invalid_field=test`

**Expected Response:** Should work gracefully, return all authors

#### 9.8.2 Empty Filter Results

**GET** `{{baseUrl}}/authors?author_name=NonexistentAuthor123`

**Expected Response:** Empty results array

#### 9.8.3 Invalid Pagination

**GET** `{{baseUrl}}/books?page=0&limit=-1`

**Expected Response:** Should handle gracefully, use default values

#### 9.8.4 Very Large Limit

**GET** `{{baseUrl}}/authors?limit=99999`

**Expected Response:** Should handle gracefully, may use system max limit

### 9.9 📊 Performance Testing

#### 9.9.1 Complex Query Performance

**GET** `{{baseUrl}}/books?book_pages[gte]=100&sort=-book_title&page=1&limit=10&fields=book_title,book_pages,authorId`

**Expected Performance:** Response time < 1000ms

#### 9.9.2 Large Dataset Pagination

**GET** `{{baseUrl}}/books?page=1&limit=50`

**Expected Performance:** Response time < 500ms

### 🎯 API Filtering Best Practices

#### Query Parameter Format

```
# Basic filtering
/books?field=value

# MongoDB operators
/books?field[operator]=value

# Multiple filters
/books?field1=value1&field2=value2

# Sorting
/books?sort=field          # ascending
/books?sort=-field         # descending
/books?sort=field1,-field2 # multiple fields

# Pagination
/books?page=1&limit=10

# Field selection
/books?fields=field1,field2

# Combined
/books?field=value&sort=field&page=1&limit=5&fields=field1,field2
```

#### Supported MongoDB Operators

- `[gte]` - Greater than or equal
- `[gt]` - Greater than
- `[lte]` - Less than or equal
- `[lt]` - Less than
- `[ne]` - Not equal
- `[in]` - In array (e.g., `status[in]=active,pending`)
- `[nin]` - Not in array

---

## 10. �🚫 COMPREHENSIVE SECURITY & VALIDATION TESTS

### 10.1 🚫 Unauthorized Access Tests

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

### 10.2 🚫 Business Logic Validation Tests

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

#### Test Password Update Prevention

**PATCH** `{{baseUrl}}/staff/updateMe`
**Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

**Body (JSON):**

```json
{
  "staff_fname": "Test",
  "password": "NewPassword@123"
}
```

**Expected Response:** `400 Bad Request` with message about password updates not allowed

#### Test Wrong Current Password

**PATCH** `{{baseUrl}}/staff/updateMyPassword`
**Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

**Body (JSON):**

```json
{
  "passwordCurrent": "WrongPassword123",
  "password": "NewPassword@123",
  "passwordConfirm": "NewPassword@123"
}
```

**Expected Response:** `401 Unauthorized` with message about incorrect current password

#### Test Password Confirmation Mismatch

**PATCH** `{{baseUrl}}/staff/updateMyPassword`
**Headers:** `Authorization: Bearer YOUR_ADMIN_TOKEN`

**Body (JSON):**

```json
{
  "passwordCurrent": "Admin@1234",
  "password": "NewPassword@123",
  "passwordConfirm": "DifferentPassword@123"
}
```

**Expected Response:** `400 Bad Request` with message about passwords not matching

### 10.3 🚫 Data Validation Tests

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
- **👥 Readers Management:** 5 tests (includes password update)
- **📋 Loans Management:** 4 tests
- **💰 Fines Management:** 4 tests
- **👨‍💼 Staff Management:** 5 tests (includes password update)
- **� API Filtering & Pagination:** 20+ tests (filtering, sorting, pagination, field selection)
- **�🚫 Security & Validation:** 12+ tests (includes password security)

**Total: 65+ comprehensive test scenarios**

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
