import axios from 'axios';
import type {
  User,
  Author,
  Book,
  BorrowedBook,
  LoginCredentials,
  AuthResponse,
  BooksResponse,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

// Auth APIs
export const authApi = {
  login: (credentials: LoginCredentials): Promise<AuthResponse> =>
    api.post('/auth/login', credentials).then((res) => res.data),
  register: (user: { username: string; email: string; password: string }): Promise<AuthResponse> =>
    api.post('/auth/register', user).then((res) => res.data),
};

// Users APIs
export const usersApi = {
  getAll: (): Promise<User[]> =>
    api.get('/users').then((res) => res.data),
  create: (user: { username: string; email: string; password: string }): Promise<User> =>
    api.post('/users', user).then((res) => res.data),
  getById: (id: string): Promise<User> =>
    api.get(`/users/${id}`).then((res) => res.data),
};

// Authors APIs
export const authorsApi = {
  getAll: (): Promise<Author[]> =>
    api.get('/authors').then((res) => res.data),
  getById: (id: string): Promise<Author> =>
    api.get(`/authors/${id}`).then((res) => res.data),
  create: (author: { name: string; bio?: string }): Promise<Author> =>
    api.post('/authors', author).then((res) => res.data),
  update: (id: string, author: { name?: string; bio?: string }): Promise<Author> =>
    api.patch(`/authors/${id}`, author).then((res) => res.data),
  delete: (id: string): Promise<void> =>
    api.delete(`/authors/${id}`).then(() => undefined),
};

// Books APIs
export const booksApi = {
  getAll: (params?: {
    search?: string;
    authorId?: string;
    available?: boolean;
    publishedFrom?: string;
    publishedTo?: string;
    page?: number;
    limit?: number;
  }): Promise<BooksResponse> =>
    api.get('/books', { params }).then((res) => res.data),
  getById: (id: string): Promise<Book> =>
    api.get(`/books/${id}`).then((res) => res.data),
  create: (book: {
    title: string;
    isbn?: string;
    publishedAt?: string;
    authorId: string;
  }): Promise<Book> =>
    api.post('/books', book).then((res) => res.data),
  update: (
    id: string,
    book: {
      title?: string;
      isbn?: string;
      publishedAt?: string;
      authorId?: string;
    },
  ): Promise<Book> =>
    api.patch(`/books/${id}`, book).then((res) => res.data),
  delete: (id: string): Promise<void> =>
    api.delete(`/books/${id}`).then(() => undefined),
};

// Borrowed Books APIs
export const borrowedBooksApi = {
  borrow: (data: { bookId: string; userId: string }): Promise<BorrowedBook> =>
    api.post('/borrowed-books/borrow', data).then((res) => res.data),
  return: (borrowedBookId: string): Promise<BorrowedBook> =>
    api.post('/borrowed-books/return', { borrowedBookId }).then((res) => res.data),
  getAllByUser: (userId: string): Promise<BorrowedBook[]> =>
    api.get(`/borrowed-books/user/${userId}`).then((res) => res.data),
  getAll: (): Promise<BorrowedBook[]> =>
    api.get('/borrowed-books').then((res) => res.data),
};

