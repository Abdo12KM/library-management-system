# Database Seeding Guide

This guide explains how to use the comprehensive database seeding system to populate your Library Management System with realistic test data covering all entities and scenarios.

## Quick Start

### Seed All Data at Once (Recommended)
```bash
pnpm db:seedAll
```
This command will seed all data in the correct order:
1. Authors (35 diverse authors)
2. Publishers (25 publishing houses)  
3. Staff (15 library staff members)
4. Readers (40 library patrons)
5. Books (60+ books with varied statuses)
6. Loans (30+ loans with different scenarios)
7. Fines (25+ fines covering various states)

### Delete All Data
```bash
pnpm db:deleteAll
```
This command will delete all data from the database in the correct order to handle dependencies.

## Individual Model Seeding

You can also seed individual models:

### Import Data
```bash
pnpm db:seedReaders     # Seed 40 readers with diverse profiles
pnpm db:seedAuthors     # Seed 35 famous and contemporary authors
pnpm db:seedPublishers  # Seed 25 real publishing houses
pnpm db:seedStaff       # Seed 15 library staff (librarians & admins)
pnpm db:seedBooks       # Seed 60+ books with various statuses
pnpm db:seedLoans       # Seed 30+ loans (active, overdue, returned)
pnpm db:seedFines       # Seed 25+ fines (pending, paid, waived)
```

### Delete Data
```bash
pnpm db:deleteReaders     # Delete all readers
pnpm db:deleteAuthors     # Delete all authors
pnpm db:deletePublishers  # Delete all publishers
pnpm db:deleteStaff       # Delete all staff
pnpm db:deleteBooks       # Delete all books
pnpm db:deleteLoans       # Delete all loans
pnpm db:deleteFines       # Delete all fines
```

## Comprehensive Seed Data Files

### `seed/readers.json` (40 readers)
- Diverse demographics and locations across the USA
- Realistic email addresses from various providers
- Complete address information with real city/state/zip codes
- Strong passwords following security requirements
- Mix of new and experienced library users

### `seed/authors.json` (35 authors)
- Classic authors: Stephen King, J.K. Rowling, George Orwell, Agatha Christie
- Contemporary voices: Chimamanda Ngozi Adichie, Sally Rooney, Liu Cixin
- Diverse backgrounds: African American, Latin American, Asian, European
- Various genres: fiction, non-fiction, poetry, science fiction, fantasy
- Real biographical information

### `seed/publishers.json` (25 publishers)
- Major publishers: Penguin Random House, HarperCollins, Simon & Schuster
- Academic presses: Oxford University Press, Cambridge University Press
- Specialty publishers: Tor Books, Europa Editions, Beacon Press
- Various founding years from 1534 to 1994
- Real websites and publication histories

### `seed/staff.json` (15 staff members)
- Mix of librarians and administrators
- Diverse names and backgrounds
- Strong passwords following security requirements
- Realistic library email addresses

### `seed/books.json` (60+ books)
- Classic literature: Pride and Prejudice, 1984, To Kill a Mockingbird
- Contemporary fiction: Normal People, Americanah, The Underground Railroad
- Various genres: horror, fantasy, science fiction, mystery, literary fiction
- Multiple books per popular author (Harry Potter series, Stephen King novels)
- **Diverse statuses for testing scenarios:**
  - `available`: Ready for borrowing
  - `borrowed`: Currently on loan
  - `maintenance`: Being repaired or processed
  - `lost`: Missing from collection
- Realistic page counts, publication dates, and ISBN numbers
- Rich descriptions and accurate tagging

### `seed/loans.json` (30+ loans)
- **Active loans**: Currently borrowed, within due period
- **Overdue loans**: Past due date, accumulating fines
- **Returned loans**: Complete transaction history
- **Diverse scenarios:**
  - Recent loans (December 2024)
  - Overdue situations from November 2024
  - Historical returns throughout 2024
- Realistic borrowing patterns and staff assignments
- Proper date handling for due dates and return dates

### `seed/fines.json` (25+ fines)
- **Pending fines**: Overdue books with accumulating penalties
- **Paid fines**: Resolved financial obligations
- **Waived fines**: Forgiven penalties (student discounts, special circumstances)
- **Varied penalty rates**: $1.00 - $3.00 per day based on book type
- **Realistic amounts**: $8.50 - $68.00 based on days overdue
- Different due dates spanning the entire year
- Proper fine calculation scenarios

## Data Relationships & Scenarios

The seeding system creates realistic interconnected data:

### Book Status Distribution
- **Available** (40%): Ready for checkout
- **Borrowed** (35%): Currently with patrons  
- **Maintenance** (15%): Being processed/repaired
- **Lost** (10%): Missing from collection

### Loan Scenarios
- **Active loans**: Books currently borrowed, due dates in future
- **Overdue loans**: Past due dates, triggering fine generation
- **Returned loans**: Complete borrowing history for analytics
- **Staff assignments**: Different librarians handling various transactions

### Fine Management
- **Pending fines**: Active overdue charges
- **Payment tracking**: Resolved financial obligations
- **Waiver system**: Forgiven fines for special circumstances
- **Escalating penalties**: Higher rates for valuable/rare books

### Author Diversity
- **Geographic representation**: American, British, Nigerian, Japanese, Colombian, etc.
- **Genre coverage**: Literary fiction, science fiction, mystery, horror, non-fiction
- **Time periods**: Victorian classics to contemporary bestsellers
- **Cultural perspectives**: Diverse voices and experiences

## Advanced Testing Scenarios

After seeding, you'll have data to test:

### Library Operations
- **Book availability checks** across different statuses
- **Borrowing workflows** with proper validation
- **Return processing** with date calculations
- **Fine calculations** with various penalty rates

### User Management
- **Reader registration** with validation
- **Staff authentication** with role-based access
- **Profile management** with diverse demographics

### Reporting & Analytics
- **Popular books** tracking (multiple copies/high demand)
- **Overdue analysis** with fine correlation
- **Staff performance** across different transactions
- **Collection management** with status distribution

### Search & Filtering
- **Multi-genre searching** across diverse collection
- **Author-based queries** with prolific writers
- **Status-based filtering** for availability
- **Date range analysis** for loans and returns

## Usage Examples

### Complete Database Reset and Seed
```bash
# Delete all existing data
pnpm db:deleteAll

# Seed all fresh data with realistic scenarios
pnpm db:seedAll
```

### Testing Specific Workflows
```bash
# Test overdue loan processing
pnpm db:seedLoans
pnpm db:seedFines

# Test book management
pnpm db:seedBooks  # Multiple statuses available

# Test user scenarios
pnpm db:seedReaders  # Diverse user base
```

### Development Workflow
```bash
# Quick reset for testing
pnpm db:deleteAll && pnpm db:seedAll

# Focus on specific features
pnpm db:seedBooks && pnpm db:seedLoans  # Borrowing system
```

## Data Quality Features

- **Referential Integrity**: All foreign keys properly resolved
- **Date Consistency**: Logical chronological ordering
- **Realistic Values**: Authentic page counts, ISBNs, addresses
- **Diverse Scenarios**: Edge cases and normal operations covered
- **Cultural Sensitivity**: Respectful representation of diverse authors and characters

## Sample Data Overview

After seeding, you'll have:
- **35 Authors**: From Stephen King to Chimamanda Ngozi Adichie
- **25 Publishers**: Major houses to specialty presses
- **15 Staff Members**: Librarians and administrators
- **40 Readers**: Diverse library patrons across the USA
- **60+ Books**: Classic and contemporary literature
- **30+ Loans**: Active, overdue, and returned transactions
- **25+ Fines**: Pending, paid, and waived financial records

## Troubleshooting

### Common Issues

1. **"Author not found in database"**: Ensure authors are seeded before books
2. **"Publisher not found in database"**: Ensure publishers are seeded before books
3. **"Reader not found in database"**: Ensure readers are seeded before loans
4. **"Book not found in database"**: Ensure books are seeded before loans
5. **"Loan not found for fine"**: Some fines may be skipped if corresponding loans don't exist

### Environment Setup
- **Environment**: Make sure your `.env` file is properly configured with `DATABASE_URI`
- **Dependencies**: Ensure all npm packages are installed
- **Order Matters**: When seeding individually, follow the dependency order
- **Data Validation**: All seeded data follows the application's validation rules

### Performance Notes
- **Large Dataset**: 200+ total records across all collections
- **Seeding Time**: Complete seeding takes 30-60 seconds depending on system
- **Memory Usage**: Adequate for development/testing environments
- **Production**: Consider subset of data for production testing  
3. **Duplicate key errors**: Data might already exist - try deleting first
4. **Connection errors**: Check your DATABASE_URI in `.env`

### Manual Seeding Commands

If you prefer to use the direct commands:

```bash
# Seed all data
node seed/seed-caller.js --seed-all

# Delete all data  
node seed/seed-caller.js --delete-all

# Seed specific model
node seed/seed-caller.js --import readers

# Delete specific model
node seed/seed-caller.js --delete readers
```

## Extending the Seed Data

To add more seed data:

1. Edit the appropriate JSON file in the `seed/` directory
2. For books, use author and publisher names that exist in their respective files
3. Ensure data follows the model validation rules
4. Run the seeding command to apply changes
