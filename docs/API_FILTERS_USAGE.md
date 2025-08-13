# API Filters Usage Guide

The API filters have been integrated into all the `getAll` endpoints of the Library Management System. This provides powerful querying capabilities for all resources.

## Available Filter Features

### 1. Filtering

Filter results based on field values:

```
GET /api/books?book_title=Harry Potter
GET /api/authors?author_fname=John
GET /api/readers?reader_email=john@example.com
```

### 2. Sorting

Sort results by one or more fields:

```
GET /api/books?sort=book_title
GET /api/books?sort=-release_date (descending)
GET /api/books?sort=book_title,-release_date (multiple fields)
```

### 3. Field Selection

Select only specific fields to return:

```
GET /api/books?fields=book_title,release_date
GET /api/authors?fields=author_fname,author_lname
```

### 4. Pagination

Paginate through large result sets:

```
GET /api/books?page=2&limit=10
GET /api/readers?page=1&limit=5
```

## Endpoints with API Filters

The following endpoints now support API filters:

- `GET /api/authors` - Get all authors with filtering
- `GET /api/books` - Get all books with filtering
- `GET /api/publishers` - Get all publishers with filtering
- `GET /api/readers` - Get all readers with filtering (Admin/Librarian only)
- `GET /api/staff` - Get all staff with filtering (Admin only)
- `GET /api/loans` - Get all loans with filtering (Admin/Librarian only)
- `GET /api/loans/overdue` - Get overdue loans with filtering (Admin/Librarian only)
- `GET /api/fines` - Get all fines with filtering (Admin/Librarian only)

## Example Usage

### Get books by specific author with pagination

```
GET /api/books?authorId=64a1b2c3d4e5f6789012345&page=1&limit=5
```

### Get readers sorted by last name, first name

```
GET /api/readers?sort=reader_lname,reader_fname
```

### Get books released after 2020, sorted by title

```
GET /api/books?release_date[gte]=2020-01-01&sort=book_title
```

### Get only book titles and authors

```
GET /api/books?fields=book_title,authorId&populate=authorId
```

### Get active loans with pagination

```
GET /api/loans?status=active&page=1&limit=10
```

### Get unpaid fines

```
GET /api/fines?status=unpaid&sort=-accumulated_amount
```

## MongoDB Query Operators

You can use MongoDB query operators in your filters:

- `[gte]` - Greater than or equal
- `[gt]` - Greater than
- `[lte]` - Less than or equal
- `[lt]` - Less than
- `[ne]` - Not equal
- `[in]` - In array
- `[nin]` - Not in array

### Examples:

```
GET /api/books?book_pages[gte]=200
GET /api/fines?accumulated_amount[gt]=10
GET /api/loans?status[in]=active,overdue
```

## Response Format

All endpoints with filters will return data in this format:

```json
{
  "status": "success",
  "results": 10,
  "data": {
    "books": [
      // Array of books
    ]
  }
}
```

The `results` field shows the number of items returned in the current page/query.
