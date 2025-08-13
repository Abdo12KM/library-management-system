# Database Seeding Guide

This guide explains how to use the database seeding system to populate your Library Management System with test data.

## Quick Start

### Seed All Data at Once (Recommended)
```bash
pnpm db:seedAll
```
This command will seed all data in the correct order:
1. Authors
2. Publishers  
3. Staff
4. Readers
5. Books (with proper author/publisher references)

### Delete All Data
```bash
pnpm db:deleteAll
```
This command will delete all data from the database in the correct order to handle dependencies.

## Individual Model Seeding

You can also seed individual models:

### Import Data
```bash
pnpm db:seedReaders     # Seed readers
pnpm db:seedAuthors     # Seed authors
pnpm db:seedPublishers  # Seed publishers
pnpm db:seedStaff       # Seed staff
pnpm db:seedBooks       # Seed books (requires authors and publishers to exist)
```

### Delete Data
```bash
pnpm db:deleteReaders     # Delete all readers
pnpm db:deleteAuthors     # Delete all authors
pnpm db:deletePublishers  # Delete all publishers
pnpm db:deleteStaff       # Delete all staff
pnpm db:deleteBooks       # Delete all books
```

## Seed Data Files

The following JSON files contain the seed data:

### `seed/readers.json` (10 readers)
- Contains reader accounts with various personal information
- All passwords follow strong password requirements
- Unique emails and phone numbers

### `seed/authors.json` (10 authors)
- Famous authors with biographies
- Includes Stephen King, J.K. Rowling, George Orwell, etc.

### `seed/publishers.json` (10 publishers)
- Real publishing houses with websites and founding years
- Includes Penguin Random House, HarperCollins, etc.

### `seed/staff.json` (5 staff members)
- Mix of librarians and admins
- All passwords follow strong password requirements

### `seed/books.json` (15 books)
- Classic and popular books
- Various statuses: available, borrowed, maintenance
- Proper ISBN numbers and realistic data
- References authors and publishers by name (automatically resolved to ObjectIds)

## Data Relationships

The seeding system automatically handles the following relationships:

1. **Books → Authors**: Books reference authors by name, which gets resolved to ObjectId
2. **Books → Publishers**: Books reference publishers by name, which gets resolved to ObjectId
3. **Dependency Order**: Data is seeded in the correct order to satisfy foreign key constraints

## Sample Data Overview

After seeding, you'll have:
- **10 Authors**: Including Stephen King, J.K. Rowling, George Orwell
- **10 Publishers**: Including Penguin Random House, HarperCollins, Scholastic
- **5 Staff Members**: Mix of librarians and admins
- **10 Readers**: Various user accounts for testing
- **15 Books**: Mix of classic and modern literature with different statuses

## Usage Examples

### Complete Database Reset and Seed
```bash
# Delete all existing data
pnpm db:deleteAll

# Seed all fresh data
pnpm db:seedAll
```

### Partial Updates
```bash
# Add more books (requires existing authors/publishers)
pnpm db:seedBooks

# Add more readers
pnpm db:seedReaders
```

## Notes

- **Environment**: Make sure your `.env` file is properly configured with `DATABASE_URI`
- **Order Matters**: When seeding books individually, ensure authors and publishers exist first
- **Unique Constraints**: The system respects unique constraints (emails, ISBNs, etc.)
- **Password Security**: All seeded passwords follow the application's security requirements
- **Book Status**: Books are seeded with various statuses to test different scenarios

## Troubleshooting

### Common Issues

1. **"Author not found in database"**: Ensure authors are seeded before books
2. **"Publisher not found in database"**: Ensure publishers are seeded before books  
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
