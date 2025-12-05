import { useState, useEffect } from 'react';
import { borrowedBooksApi, booksApi, usersApi } from '../services/api';
import type { BorrowedBook, Book, User } from '../types';
import { format } from 'date-fns';

const BorrowedBooks = () => {
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    bookId: '',
    userId: '',
  });
  const [filterUserId, setFilterUserId] = useState('');

  useEffect(() => {
    fetchBorrowedBooks();
    fetchBooks();
    fetchUsers();
  }, [filterUserId]);

  const fetchBorrowedBooks = async () => {
    try {
      setLoading(true);
      let data: BorrowedBook[];
      if (filterUserId) {
        data = await borrowedBooksApi.getAllByUser(filterUserId);
      } else {
        data = await borrowedBooksApi.getAll();
      }
      setBorrowedBooks(data.filter((bb) => !bb.returnedAt));
    } catch (error) {
      console.error('Failed to fetch borrowed books:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await booksApi.getAll({ available: true });
      setBooks(response.data);
    } catch (error) {
      console.error('Failed to fetch books:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await usersApi.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleBorrow = () => {
    setFormData({ bookId: '', userId: '' });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await borrowedBooksApi.borrow(formData);
      setShowModal(false);
      fetchBorrowedBooks();
      fetchBooks(); // Refresh available books
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to borrow book');
    }
  };

  const handleReturn = async (borrowedBookId: string) => {
    if (!confirm('Are you sure you want to return this book?')) return;
    try {
      await borrowedBooksApi.return(borrowedBookId);
      fetchBorrowedBooks();
      fetchBooks(); // Refresh available books
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to return book');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Borrowed Books</h1>
        <button
          onClick={handleBorrow}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Borrow Book
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by User
        </label>
        <select
          value={filterUserId}
          onChange={(e) => setFilterUserId(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">All Users</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username} ({user.email})
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {borrowedBooks.map((borrowedBook) => (
            <li key={borrowedBook.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    {borrowedBook.book?.title || 'Unknown Book'}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Author: {borrowedBook.book?.author?.name || 'Unknown'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Borrowed by: {borrowedBook.user?.username || 'Unknown'} (
                    {borrowedBook.user?.email || 'Unknown'})
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Borrowed on: {format(new Date(borrowedBook.borrowedAt), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => handleReturn(borrowedBook.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Return
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {borrowedBooks.length === 0 && (
          <div className="text-center py-12 text-gray-500">No borrowed books found</div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold mb-4">Borrow Book</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Book</label>
                <select
                  required
                  value={formData.bookId}
                  onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Book</option>
                  {books.map((book) => (
                    <option key={book.id} value={book.id}>
                      {book.title} by {book.author?.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
                <select
                  required
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.username} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Borrow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowedBooks;

