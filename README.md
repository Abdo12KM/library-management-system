# 📚 Library Management System Backend

A comprehensive **Library Management System Backend** built with **Node.js**, **Express.js**, and **MongoDB**. This production-ready API provides complete library operations including book management, user authentication, loan tracking, fine management, and advanced dashboard analytics.

## ✨ Key Features

- 🔐 **Multi-role Authentication & Authorization** (Admin, Librarian, Reader)
- 📖 **Complete Book Management** with Author & Publisher relations and status tracking
- 👥 **Staff Management** with comprehensive role-based access control
- 📋 **Advanced Loan Tracking** with automatic due dates, overdue detection, and business rules
- 💰 **Intelligent Fine Management** with automatic calculation, payment tracking, and waiving
- 📊 **Real-time Dashboard Analytics** for admins/librarians and personalized reader dashboards
- 🔍 **Advanced API Filtering** with sorting, pagination, field selection, and MongoDB operators
- 🌐 **Production-Ready Deployment** with Render integration and CORS configuration
- 🧪 **Comprehensive Testing Suite** (75+ automated tests across 10 categories)
- 🗃️ **Advanced Database Seeding** with realistic test data and granular control
- 📚 **Extensive Documentation** including API guides and frontend development guide

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v14+)
- **MongoDB** (local or Atlas)
- **pnpm** (recommended) or npm

### Installation

1. **Clone and install**

   ```bash
   git clone <repository-url>
   cd library-management-system-backend
   pnpm install
   ```

2. **Environment Setup**
   Create `.env` file:

   ```env
   DATABASE_URI=mongodb://localhost:27017/library-management
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=7d
   PORT=5000
   NODE_ENV=development
   ```

3. **Database Setup & Seeding**
   ```bash
   pnpm db:seedAdmin    # Create admin user
   pnpm db:seedAll      # Seed with comprehensive test data (optional)
   ```

4. **Start the application**
   ```bash
   pnpm start           # Production mode
   pnpm dev             # Development mode with auto-reload
   ```

API available at: `http://localhost:5000`

## 📋 API Endpoints

### 🏥 Health & Status

- `GET /` - API status and timestamp
- `GET /health` - Health check endpoint

### 🔐 Authentication

- `POST /api/auth/signup/reader` - Register new reader
- `POST /api/auth/login/reader` - Reader login
- `POST /api/auth/login/staff` - Staff (admin/librarian) login

### 👤 Profile Management

#### Reader Profiles
- `GET /api/readers/getMe` - Get my profile (reader)
- `PATCH /api/readers/updateMe` - Update my profile (reader)
- `PATCH /api/readers/updateMyPassword` - Update my password (reader)

#### Staff Profiles
- `GET /api/staff/getMe` - Get my profile (staff)
- `PATCH /api/staff/updateMe` - Update my profile (staff)
- `PATCH /api/staff/updateMyPassword` - Update my password (staff)

### 📊 Dashboard Analytics

- `GET /api/dashboard/admin` - Admin/Librarian dashboard with statistics and trends
- `GET /api/dashboard/reader` - Reader personal dashboard with loans and fines

### 📚 Core Resources

| Resource          | GET All  | GET One  | POST     | PATCH    | DELETE   |
| ----------------- | -------- | -------- | -------- | -------- | -------- |
| `/api/authors`    | ✅       | ✅       | 🔒 Staff | 🔒 Staff | 🔒 Admin |
| `/api/publishers` | ✅       | ✅       | 🔒 Staff | 🔒 Staff | 🔒 Admin |
| `/api/books`      | ✅       | ✅       | 🔒 Staff | 🔒 Staff | 🔒 Admin |
| `/api/readers`    | 🔒 Staff | 🔒 Staff | 🔒 Admin | 🔒 Admin | 🔒 Admin |
| `/api/staff`      | 🔒 Admin | 🔒 Admin | 🔒 Admin | 🔒 Admin | 🔒 Admin |
| `/api/loans`      | 🔒 Staff | 🔒 Staff | 🔒 Staff | 🔒 Staff |          |
| `/api/fines`      | 🔒 Staff | 🔒 Staff | 🔒 Staff | 🔒 Staff |          |

#### Special Loan Operations
- `PATCH /api/loans/:id/return` - Return a book (librarian)
- `GET /api/loans/overdue` - Get all overdue loans

#### Fine Operations
- `PATCH /api/fines/:id/pay` - Process fine payment
- `PATCH /api/fines/:id/waive` - Waive fine (admin only)

**Legend:** ✅ Public, 🔒 Authentication required

### 🔍 Advanced API Filtering & Query Features

All GET endpoints support comprehensive filtering, sorting, pagination, and field selection:

#### Basic & Advanced Filtering

```bash
# Basic field filtering
GET /api/books?book_title=Harry Potter
GET /api/authors?author_fname=J.K.

# MongoDB operators for advanced queries
GET /api/books?book_pages[gte]=200         # Pages >= 200
GET /api/fines?accumulated_amount[lt]=10   # Amount < $10
GET /api/loans?status[in]=active,overdue   # Multiple status values
GET /api/books?release_date[gte]=2020-01-01&release_date[lte]=2023-12-31
```

#### Sorting

```bash
# Single field sorting
GET /api/books?sort=book_title              # A-Z ascending
GET /api/books?sort=-release_date           # Newest first (descending)

# Multi-field sorting
GET /api/authors?sort=author_lname,author_fname,-createdAt
```

#### Pagination

```bash
GET /api/books?page=2&limit=10              # Page 2, 10 items per page
GET /api/authors?limit=5                    # First 5 results only
```

#### Field Selection

```bash
GET /api/books?fields=book_title,book_pages,release_date
GET /api/authors?fields=author_fname,author_lname,author_email
```

#### Combined Complex Queries

```bash
# Advanced filtering with multiple parameters
GET /api/books?book_pages[gte]=200&sort=-release_date&page=1&limit=5&fields=book_title,book_pages,release_date

# Status-based filtering with sorting
GET /api/loans?status=active&sort=-loan_start_date&fields=readerId,bookId,loan_due_date
```

**Supported MongoDB Operators:** `[gte]`, `[gt]`, `[lte]`, `[lt]`, `[ne]`, `[in]`, `[nin]`, `[regex]`

💡 **Pro Tip:** All filtering features are documented in detail in `docs/API_FILTERS_USAGE.md`

### 📊 Dashboard Features

#### Admin/Librarian Dashboard (`GET /api/dashboard/admin`)
- **Real-time Statistics:** Total books, active readers, active loans, outstanding fines
- **Growth Metrics:** Monthly growth percentages with trend analysis
- **Book Status Distribution:** Available, borrowed, maintenance, lost books breakdown
- **Loan Trends:** 30-day loan activity charts and patterns
- **Overdue Tracking:** Overdue loan counts and monitoring

#### Reader Dashboard (`GET /api/dashboard/reader`)
- **Personal Loan Status:** Current active loans with book details
- **Due Date Alerts:** Books due soon (within 3 days)
- **Outstanding Fines:** Total unpaid fines amount
- **Reading History:** Recent returned books and total books read
- **Quick Actions:** Easy access to profile and payment features

### 🗃️ Database Seeding System

Comprehensive seeding system with realistic test data:

```bash
# Complete database seeding (recommended)
pnpm db:seedAll        # Seeds all entities with relationships

# Individual entity seeding
pnpm db:seedReaders    # 40 diverse reader profiles
pnpm db:seedAuthors    # 35 famous and contemporary authors
pnpm db:seedPublishers # 25 real publishing houses
pnpm db:seedStaff      # 15 library staff (admins & librarians)
pnpm db:seedBooks      # 60+ books with varied statuses
pnpm db:seedLoans      # 30+ loans (active, overdue, returned)
pnpm db:seedFines      # 25+ fines (pending, paid, waived)

# Database cleanup
pnpm db:deleteAll      # Clean all data
pnpm db:reset          # Reset preserving staff accounts
pnpm db:resetAll       # Complete reset including staff
```

📚 **Detailed seeding documentation:** `seed/README.md`

## 🧪 Testing & Quality Assurance

### Comprehensive Test Suite

**75+ automated tests** across 10 categories ensuring robust functionality:

```bash
# Test execution options
pnpm test                    # Run all tests (quick)
pnpm test:verbose           # Detailed output with timing
pnpm test:reset             # Reset DB + run tests
pnpm test:full              # Complete: Reset + Verbose + Tests
```

### Test Categories & Coverage

1. **Authentication & Authorization** (7 tests)
   - Multi-role login/logout
   - Token management and validation
   - Role-based access control

2. **Authors Management** (5 tests)
   - CRUD operations and validation
   - Bulk operations and edge cases

3. **Publishers Management** (4 tests)
   - Complete publisher lifecycle
   - Data integrity validation

4. **Books Management** (8 tests)
   - Complex CRUD with relationships
   - Status management (available, borrowed, maintenance, lost)
   - ISBN validation and uniqueness

5. **Loans Management** (6 tests)
   - Loan creation and return workflows
   - Overdue detection and status updates
   - Business rule enforcement (one active loan per book)

6. **Fines Management** (4 tests)
   - Automatic fine calculation
   - Payment processing and waiving
   - Financial accuracy validation

7. **Profile Management** (8 tests)
   - Reader and staff profile updates
   - Password change security
   - Profile access control

8. **API Filters** (14 tests)
   - Comprehensive filtering scenarios
   - Sorting and pagination validation
   - MongoDB operator testing
   - Field selection and complex queries

9. **Security Testing** (7 tests)
   - Authentication bypass attempts
   - Input sanitization and validation
   - Password security enforcement

10. **Edge Cases & Performance** (12+ tests)
    - Concurrent operations
    - Error boundary testing
    - Data validation extremes
    - Cleanup and maintenance

### Testing Tools & Reports

- **Custom Test Framework:** Detailed categorized reporting
- **Performance Metrics:** Individual test timing and success rates
- **Error Analysis:** Comprehensive error reporting with stack traces
- **Postman Collection:** `tests/LMS.postman_collection.json` (65+ scenarios)

📊 **Success Rate Tracking:** Real-time pass/fail statistics with detailed breakdown
⏱️ **Performance Monitoring:** Fastest/slowest test identification and optimization

### Testing Documentation

- `tests/SCRIPT_API_Testing_Guide.md` - Comprehensive testing guide
- `tests/POSTMAN_API_Testing_Guide.md` - Postman collection usage

## 🗄️ Database Schema & Models

### Core Collections with Advanced Features

#### **Authors Collection**
- Author information, biography, and social profiles
- Relationship tracking with books
- Search and filtering capabilities

#### **Publishers Collection**
- Publisher details, publication history
- Contact information and metadata
- Book catalog associations

#### **Books Collection**
- Complete book catalog with metadata
- **Status Tracking:** `available`, `borrowed`, `maintenance`, `lost`
- ISBN validation and uniqueness constraints
- Author and publisher relationships
- Advanced tagging system

#### **Readers Collection**
- Reader accounts with contact details
- Profile management and preferences
- Loan and fine history tracking

#### **Staff Collection**
- **Multi-role Support:** `admin`, `librarian`
- Hierarchical permissions and access control
- Profile management with audit trails

#### **Loans Collection**
- **Advanced Loan Tracking:** 14-day automatic loan periods
- **Status Management:** `active`, `returned`, `overdue`
- **Business Rules:** One active loan per book constraint
- Automatic overdue detection and status updates
- Comprehensive audit trail

#### **Fines Collection**
- **Automatic Calculation:** $1/day penalty for overdue books
- **Status Tracking:** `pending`, `paid`, `waived`
- **Payment Processing:** Multiple payment methods support
- **Admin Controls:** Fine waiving capabilities

### Advanced Schema Features

- **Automatic Timestamps:** Created/updated tracking on all models
- **Data Validation:** Comprehensive input validation and sanitization
- **Indexes & Performance:** Optimized database queries and constraints
- **Referential Integrity:** Proper relationships and cascading operations
- **Virtual Fields:** Computed properties for enhanced functionality

## 🔧 Available Scripts & Commands

### Development & Production

```bash
pnpm start              # Start production server
pnpm dev                # Start development server with auto-reload
```

### Database Management

```bash
# Admin & Authentication
pnpm db:seedAdmin       # Create default admin user
pnpm db:reset           # Reset database (preserve staff accounts)
pnpm db:resetAll        # Complete database reset

# Comprehensive Seeding
pnpm db:seedAll         # Seed all entities with realistic data
pnpm db:deleteAll       # Delete all data from database

# Individual Entity Management
pnpm db:seedReaders     # Import 40 diverse reader profiles
pnpm db:seedAuthors     # Import 35 famous authors
pnpm db:seedPublishers  # Import 25 publishing houses
pnpm db:seedStaff       # Import 15 library staff members
pnpm db:seedBooks       # Import 60+ books with varied statuses
pnpm db:seedLoans       # Import 30+ loan scenarios
pnpm db:seedFines       # Import 25+ fine scenarios

# Individual Entity Cleanup
pnpm db:deleteReaders   # Delete all readers
pnpm db:deleteAuthors   # Delete all authors
pnpm db:deletePublishers # Delete all publishers
pnpm db:deleteStaff     # Delete all staff
pnpm db:deleteBooks     # Delete all books
pnpm db:deleteLoans     # Delete all loans
pnpm db:deleteFines     # Delete all fines
```

### Testing & Quality Assurance

```bash
# Test Execution
pnpm test              # Run complete test suite
pnpm test:verbose      # Run tests with detailed output
pnpm test:reset        # Reset database + run tests
pnpm test:full         # Complete testing workflow
```

### Default Admin Credentials

- **Email:** `admin1@hotmail.com`
- **Password:** `Admin@1234`

## 🏗️ Project Structure & Architecture

```
library-management-system-backend/
├── controllers/           # Business logic and request handling
│   ├── authController.js     # Authentication & authorization
│   ├── dashboardController.js # Dashboard analytics & statistics
│   ├── authorController.js   # Author management
│   ├── bookController.js     # Book management with status tracking
│   ├── fineController.js     # Fine management & payment processing
│   ├── loanController.js     # Loan lifecycle management
│   ├── publisherController.js # Publisher management
│   ├── readerController.js   # Reader profile management
│   └── staffController.js    # Staff management
├── models/               # MongoDB schemas and data models
│   ├── authorModel.js       # Author schema with validation
│   ├── bookModel.js         # Book schema with status & relationships
│   ├── fineModel.js         # Fine schema with payment tracking
│   ├── loanModel.js         # Loan schema with business rules
│   ├── publisherModel.js    # Publisher schema
│   ├── readerModel.js       # Reader schema with authentication
│   └── staffModel.js        # Staff schema with role management
├── routes/               # API endpoint definitions
│   ├── authRoutes.js        # Authentication endpoints
│   ├── dashboardRoutes.js   # Dashboard API endpoints
│   └── [resource]Routes.js  # CRUD endpoints for each resource
├── utils/                # Helper functions and utilities
│   ├── ApiFilters.js        # Advanced filtering implementation
│   ├── appError.js          # Error handling utilities
│   └── catchAsync.js        # Async error wrapper
├── tests/                # Comprehensive testing suite
│   ├── test-api.js          # 75+ automated API tests
│   ├── LMS.postman_collection.json # Postman test collection
│   ├── SCRIPT_API_Testing_Guide.md  # Testing documentation
│   └── POSTMAN_API_Testing_Guide.md # Postman usage guide
├── scripts/              # Database utilities and automation
│   ├── createAdmin.js       # Admin user creation
│   ├── resetDatabase.js     # Database reset utilities
│   └── testBookStatus.js    # Book status testing utility
├── seed/                 # Database seeding system
│   ├── seed.js              # Main seeding logic
│   ├── seed-caller.js       # Seeding orchestrator
│   ├── README.md            # Seeding documentation
│   └── [entity].json       # Realistic test data files
├── docs/                 # Comprehensive documentation
│   ├── API_FILTERS_USAGE.md          # API filtering guide
│   ├── API_FILTERING_IMPLEMENTATION_SUMMARY.md
│   └── FRONTEND_DEVELOPMENT_GUIDE.md # Next.js frontend guide
├── app.js               # Express application configuration
├── server.js            # Application entry point
├── render.yaml          # Deployment configuration
├── DEPLOYMENT.md        # Production deployment guide
└── package.json         # Dependencies and scripts
```

### Architecture Highlights

- **MVC Pattern:** Clean separation of concerns with controllers, models, and routes
- **Middleware Integration:** Authentication, CORS, error handling, and logging
- **Modular Design:** Each feature is self-contained with clear dependencies
- **Comprehensive Error Handling:** Centralized error management with detailed responses
- **Security First:** JWT authentication, input validation, and sanitization
- **Production Ready:** Environment configuration, deployment scripts, and monitoring

## 🛡️ Security & Business Logic

### Authentication & Security
- **JWT Token Authentication** with configurable expiration
- **Role-based Authorization** (Admin, Librarian, Reader) with fine-grained permissions
- **Password Encryption** using bcrypt with salt rounds
- **Input Validation & Sanitization** preventing injection attacks
- **CORS Configuration** with allowed origins for frontend integration
- **Error Handling** without exposing sensitive information

### Advanced Business Rules
- **One Active Loan per Book** constraint with database-level enforcement
- **Automatic Overdue Detection** with status updates and notifications
- **14-Day Loan Period** with automatic due date calculation
- **$1/Day Fine Calculation** for overdue books with payment tracking
- **Book Status Management** (available, borrowed, maintenance, lost)
- **Fine Waiving System** with admin-level controls
- **Profile Management** with secure password updates

### Data Integrity & Validation
- **Referential Integrity** across all relationships
- **ISBN Validation** with format checking and uniqueness
- **Email & Phone Uniqueness** validation across user accounts
- **Date Validation** preventing future release dates
- **Required Field Enforcement** with descriptive error messages
- **Data Sanitization** for all user inputs

## 🚀 Production Deployment

### Render Deployment (Recommended)

The project includes complete Render deployment configuration:

1. **Automatic Deployment:** Push to main branch triggers deployment
2. **Environment Variables:** Secure handling of secrets and configuration
3. **Health Checks:** Built-in monitoring and status endpoints
4. **CORS Configuration:** Frontend integration with whitelisted domains

```bash
# Deployment files included:
render.yaml           # Render service configuration
DEPLOYMENT.md         # Step-by-step deployment guide
```

### Frontend Integration

- **CORS Enabled** for `localhost:3000` and `fue-lms.vercel.app`
- **RESTful API Design** following industry standards
- **Comprehensive Documentation** for frontend developers
- **Next.js Development Guide** included in `docs/FRONTEND_DEVELOPMENT_GUIDE.md`

### Environment Configuration

```env
# Production Environment Variables
NODE_ENV=production
DATABASE_URI=mongodb+srv://user:pass@cluster.mongodb.net/lms
JWT_SECRET=your-super-secure-32-character-secret
JWT_EXPIRES_IN=7d
PORT=5000 # Set automatically by Render
```

## 📚 Documentation & Resources

### API Documentation
- **Comprehensive API Guide:** Complete endpoint documentation with examples
- **Filtering Guide:** `docs/API_FILTERS_USAGE.md` - Advanced query capabilities
- **Implementation Summary:** `docs/API_FILTERING_IMPLEMENTATION_SUMMARY.md`

### Development Resources
- **Frontend Guide:** `docs/FRONTEND_DEVELOPMENT_GUIDE.md` - Next.js integration guide
- **Testing Guides:** Postman and script-based testing documentation
- **Seeding Guide:** `seed/README.md` - Database population strategies

### Production Support
- **Deployment Guide:** `DEPLOYMENT.md` - Render deployment instructions
- **Health Monitoring:** Built-in health check endpoints
- **Error Logging:** Comprehensive error tracking and reporting

## 🤝 Contributing & Development

### Development Setup
1. Clone repository and install dependencies
2. Set up MongoDB (local or Atlas)
3. Configure environment variables
4. Run database seeding for test data
5. Start development server with hot reload

### Testing Before Deployment
```bash
pnpm test:full        # Complete test suite with database reset
```

### Code Quality
- **ESLint & Prettier** configuration included
- **Consistent Code Style** across all modules
- **Error Handling Patterns** standardized
- **Security Best Practices** implemented

---

## 📞 Support & Contact

For issues, feature requests, or contributions, please refer to the project repository and documentation files included in the `docs/` directory.
