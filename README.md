# 📚 Library Management System

A comprehensive **Library Management System** built with **Node.js**, **Express.js**, and **MongoDB**. Features complete library operations including book management, user authentication, loan tracking, and fine management.

## ✨ Key Features

- 🔐 **Multi-role Authentication** (Admin, Librarian, Reader)
- 📖 **Complete Book Management** with Author & Publisher relations
- 👥 **User Management** with role-based access control
- 📋 **Loan Tracking** with automatic due dates and overdue detection
- 💰 **Fine Management** with automatic calculation and payment tracking
- 🧪 **Comprehensive Testing** (51+ automated tests)

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v14+)
- **MongoDB** (local or Atlas)

### Installation

1. **Clone and install**

   ```bash
   git clone <repository-url>
   cd library-management-system
   pnpm install
   ```

2. **Environment Setup**
   Create `.env` file:

   ```env
   DATABASE_URI=mongodb://localhost:27017/library-management
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=7d
   PORT=5000
   ```

3. **Start the application**
   ```bash
   pnpm run db:seedAdmin  # Create admin user
   pnpm start            # Start server
   ```

API available at: `http://localhost:5000`

## 📋 API Endpoints

### Authentication

- `POST /api/auth/signup/reader` - Register reader
- `POST /api/auth/login/reader` - Reader login
- `POST /api/auth/login/staff` - Staff login

### Core Resources

| Resource          | GET      | POST     | PATCH     | DELETE   | Access |
| ----------------- | -------- | -------- | --------- | -------- | ------ |
| `/api/authors`    | ✅       | 🔒 Staff | 🔒 Staff  | 🔒 Admin |
| `/api/publishers` | ✅       | 🔒 Staff | 🔒 Staff  | 🔒 Admin |
| `/api/books`      | ✅       | 🔒 Staff | 🔒 Staff  | 🔒 Admin |
| `/api/readers`    | 🔒 Staff | 🔒 Admin | -         | 🔒 Admin |
| `/api/staff`      | 🔒 Admin | 🔒 Admin | -         | 🔒 Admin |
| `/api/loans`      | 🔒 Staff | 🔒 Staff | 🔒 Staff (`/return`) | -        |
| `/api/fines`      | 🔒 Staff | 🔒 Staff | ✅ (`/pay`)  | -        |

**Legend:** ✅ Public, 🔒 Authentication required

### Default Admin Credentials

- **Email:** `admin1@hotmail.com`
- **Password:** `Admin@1234`

## 🧪 Testing

```bash
pnpm test                    # Run all tests
pnpm run test:verbose        # Detailed output
pnpm run test:reset          # Reset DB + run tests
pnpm run test:full            # Reset DB + Detailed output + run tests
```

**Postman Collection:** Import `tests/LMS.postman_collection.json`

## 🗄️ Database Schema

**Core Collections:**

- **Authors** - Author information and biography
- **Publishers** - Publisher details and publication data
- **Books** - Book catalog with author/publisher references
- **Readers** - Reader accounts and contact info
- **Staff** - Admin/Librarian accounts
- **Loans** - Active/returned book loans (14-day period)
- **Fines** - Overdue penalties and payment tracking

## 🔧 Available Scripts

```bash
pnpm start              # Start development server
pnpm test              # Run test suite
pnpm run db:reset      # Reset database (preserve staff accounts)
pnpm run db:resetAll   # Reset whole database
pnpm run db:seedAdmin  # Create admin user
```

## 🏗️ Project Structure

```
library-management-system/
├── controllers/       # Business logic
├── models/           # MongoDB schemas
├── routes/           # API endpoints
├── utils/            # Helper functions
├── tests/            # Test suite + Postman collection
├── scripts/          # Database utilities
├── app.js           # Express configuration
└── server.js        # Application entry point
```

## 🛡️ Security & Business Logic

- **JWT Authentication** with role-based access control
- **Password encryption** using bcrypt
- **Input validation** and sanitization
- **One active loan per book** constraint
- **Automatic overdue detection** and fine calculation
- **$1/day penalty rate** for overdue books

## 🚀 Production Deployment

1. Set `NODE_ENV=production`
2. Use MongoDB Atlas for database
3. Set strong `JWT_SECRET` (32+ characters)
4. Configure HTTPS and CORS
5. Set up proper logging and monitoring
