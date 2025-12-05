# Book Manager - Full-Stack Library Management System

A comprehensive full-stack library management system built with NestJS, Prisma, PostgreSQL, and React (TypeScript).

## 🚀 Features

### Core Functionalities

- **Books Management**: Complete CRUD operations for books with advanced filtering (search, author, availability, date ranges, pagination)
- **Authors Management**: CRUD operations for authors
- **Users Management**: Create and list users
- **Borrowing System**: Borrow books, return books, and view borrowed books by user
- **Authentication**: JWT-based authentication for protected operations

### Technical Stack

- **Backend**: NestJS (TypeScript)
- **ORM**: Prisma with migrations
- **Database**: PostgreSQL
- **Frontend**: React.js (TypeScript) with Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **API Style**: REST
- **Authentication**: JWT
- **Documentation**: Swagger/OpenAPI

### Good-to-Have Features Implemented

- ✅ Dockerized development environment (backend + Postgres)
- ✅ Swagger/OpenAPI documentation for the backend
- ✅ Advanced server-side filtering for books
- ✅ Clean, modern UI with Tailwind CSS

## 📸 Screenshots

### Dashboard
![Dashboard](Images/dashboard.png)

### Books Management
![Books Management](Images/book.png)

### Authors Management
![Authors Management](Images/author.png)

##  Prerequisites

- Node.js 20+ and npm
- PostgreSQL 15+ (or use Docker)
- Docker and Docker Compose (optional, for containerized setup)

## 🛠️ Setup Instructions

### Option 1: Using Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   cd Book-Manager
   ```

2. **Create environment file**
   ```bash
   cp backend/.env.example backend/.env
   ```
   
   Edit `backend/.env` if needed (defaults work with docker-compose):
   ```env
   DATABASE_URL="postgresql://user:password@postgres:5432/bookmanager?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-change-in-production"
   JWT_EXPIRES_IN="7d"
   PORT=3000
   FRONTEND_URL="http://localhost:3001"
   ```

3. **Start services**
   ```bash
   docker-compose up -d
   ```

4. **Run migrations and seed data**
   ```bash
   docker-compose exec backend npm run prisma:migrate
   docker-compose exec backend npm run prisma:seed
   ```

5. **Access the application**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000
   - Swagger Documentation: http://localhost:3000/api

### Option 2: Local Development (Without Docker)

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the `backend` directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/bookmanager?schema=public"
   JWT_SECRET="your-super-secret-jwt-key-change-in-production"
   JWT_EXPIRES_IN="7d"
   PORT=3000
   FRONTEND_URL="http://localhost:3001"
   ```

4. **Start PostgreSQL** (if not using Docker)
   Make sure PostgreSQL is running on your machine.

5. **Run Prisma migrations**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

6. **Seed the database**
   ```bash
   npm run prisma:seed
   ```

7. **Start the backend server**
   ```bash
   npm run start:dev
   ```

   The backend will be available at http://localhost:3000

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file** (optional)
   Create a `.env` file if you need to change the API URL:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The frontend will be available at http://localhost:3001

##  Authentication

### Getting a Token

1. **Using the frontend**: 
   - Navigate to http://localhost:3001/login
   - Use default credentials:
     - Email: `admin@example.com`
     - Password: `password123`

2. **Using API directly**:
   ```bash
   curl -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@example.com","password":"password123"}'
   ```

### Testing Protected Routes

Include the token in the Authorization header:
```bash
curl -X GET http://localhost:3000/books \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

##  API Endpoints

### Authentication
- `POST /auth/login` - Login and get JWT token

### Books
- `GET /books` - List all books (with filters: search, authorId, available, publishedFrom, publishedTo, page, limit)
- `GET /books/:id` - Get book by ID
- `POST /books` - Create new book (protected)
- `PATCH /books/:id` - Update book (protected)
- `DELETE /books/:id` - Delete book (protected)

### Authors
- `GET /authors` - List all authors (protected)
- `GET /authors/:id` - Get author by ID (protected)
- `POST /authors` - Create new author (protected)
- `PATCH /authors/:id` - Update author (protected)
- `DELETE /authors/:id` - Delete author (protected)

### Users
- `GET /users` - List all users (protected)
- `GET /users/:id` - Get user by ID (protected)
- `POST /users` - Create new user (protected)

### Borrowed Books
- `POST /borrowed-books/borrow` - Borrow a book (protected)
- `POST /borrowed-books/return` - Return a borrowed book (protected)
- `GET /borrowed-books/user/:userId` - Get all borrowed books for a user (protected)
- `GET /borrowed-books` - Get all currently borrowed books (protected)

Full API documentation is available at http://localhost:3000/api (Swagger UI)

##  Database Schema

### Models

- **User**: Users of the system (id, username, email, password)
- **Author**: Authors of books (id, name, bio)
- **Book**: Books in the library (id, title, isbn, publishedAt, authorId)
- **BorrowedBook**: Tracks book borrowings (id, bookId, userId, borrowedAt, returnedAt)

### Relationships

- Author has many Books (one-to-many)
- User has many BorrowedBooks (one-to-many)
- Book has many BorrowedBooks (one-to-many)
- Book belongs to Author (many-to-one)

##  Design Decisions & Assumptions

1. **Authentication**: Only login endpoint is public. All other endpoints require JWT authentication.

2. **User Management**: Users can be created by authenticated admins. Password is hashed using bcrypt.

3. **Book Borrowing**: 
   - A book can only be borrowed if it's not currently borrowed (returnedAt is null)
   - When a book is returned, returnedAt is set to current timestamp
   - Books are soft-available (can see if currently borrowed)

4. **Cascading Deletes**:
   - Deleting an author will cascade delete all their books
   - Deleting a book will cascade delete all borrow records for that book
   - Deleting a user will cascade delete all their borrow records

5. **Filtering**: Books can be filtered by:
   - Search term (searches in title and ISBN)
   - Author ID
   - Availability status (available/borrowed)
   - Published date range

6. **State Management**: Using React Context API for authentication state, and local component state for data management.

7. **Error Handling**: Frontend displays user-friendly error messages, backend returns appropriate HTTP status codes.

##  Running Tests

### Backend Tests
```bash
cd backend
npm run test              # Unit tests
npm run test:e2e          # E2E tests
npm run test:cov          # Coverage
```

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Access backend container
docker-compose exec backend sh

# Access postgres container
docker-compose exec postgres psql -U user -d bookmanager

# Run migrations in container
docker-compose exec backend npm run prisma:migrate

# Seed database in container
docker-compose exec backend npm run prisma:seed
```

##  Building for Production

### Backend
```bash
cd backend
npm run build
npm run start:prod
```

### Frontend
```bash
cd frontend
npm run build
# Output will be in frontend/dist
```

## 🔧 Environment Variables

### Backend (.env)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - JWT token expiration (default: 7d)
- `PORT` - Backend server port (default: 3000)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:3001)

### Frontend (.env)
- `VITE_API_URL` - Backend API URL (default: http://localhost:3000)

##  Default Seed Data

The seed script creates:
- 3 authors: J.K. Rowling, George R.R. Martin, J.R.R. Tolkien
- 3 books: Sample books by these authors
- 

##  Troubleshooting

1. **Database connection errors**: Ensure PostgreSQL is running and DATABASE_URL is correct
2. **CORS errors**: Check FRONTEND_URL matches your frontend URL
3. **Token expired**: Logout and login again
4. **Port already in use**: Change PORT in .env file or stop the conflicting service


