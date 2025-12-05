export interface User {
  id: string;
  username: string;
  email: string;
  createdAt?: string;
}

export interface Author {
  id: string;
  name: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    books: number;
  };
}

export interface Book {
  id: string;
  title: string;
  isbn?: string;
  publishedAt?: string;
  authorId: string;
  author?: Author;
  isAvailable?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BorrowedBook {
  id: string;
  bookId: string;
  userId: string;
  borrowedAt: string;
  returnedAt?: string;
  book?: Book;
  user?: User;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface BooksResponse {
  data: Book[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

