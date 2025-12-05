import { useState, useEffect } from 'react';
import { booksApi, authorsApi } from '../services/api';
import type { Book, Author } from '../types';
import { format } from 'date-fns';

const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    authorId: '',
    available: undefined as boolean | undefined,
  });
  const [formData, setFormData] = useState({
    title: '',
    isbn: '',
    publishedAt: '',
    authorId: '',
  });

  useEffect(() => {
    fetchBooks();
    fetchAuthors();
  }, [filters]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await booksApi.getAll({
        search: filters.search || undefined,
        authorId: filters.authorId || undefined,
        available: filters.available,
      });
      setBooks(response.data);
    } catch (error) {
      console.error('Failed to fetch books:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthors = async () => {
    try {
      const data = await authorsApi.getAll();
      setAuthors(data);
    } catch (error) {
      console.error('Failed to fetch authors:', error);
    }
  };

  const handleCreate = () => {
    setEditingBook(null);
    setFormData({ title: '', isbn: '', publishedAt: '', authorId: '' });
    setShowModal(true);
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      isbn: book.isbn || '',
      publishedAt: book.publishedAt ? format(new Date(book.publishedAt), 'yyyy-MM-dd') : '',
      authorId: book.authorId,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await booksApi.update(editingBook.id, formData);
      } else {
        await booksApi.create(formData);
      }
      setShowModal(false);
      fetchBooks();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save book');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return;
    try {
      await booksApi.delete(id);
      fetchBooks();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete book');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Books</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Book
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search books..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
          <select
            value={filters.authorId}
            onChange={(e) => setFilters({ ...filters, authorId: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">All Authors</option>
            {authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
          <select
            value={filters.available === undefined ? '' : filters.available.toString()}
            onChange={(e) =>
              setFilters({
                ...filters,
                available: e.target.value === '' ? undefined : e.target.value === 'true',
              })
            }
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">All Books</option>
            <option value="true">Available</option>
            <option value="false">Borrowed</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {books.map((book) => (
            <li key={book.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900">{book.title}</h3>
                    <span
                      className={`ml-3 px-2 py-1 text-xs rounded-full ${
                        book.isAvailable
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {book.isAvailable ? 'Available' : 'Borrowed'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Author: {book.author?.name || 'Unknown'}
                  </p>
                  {book.isbn && <p className="text-sm text-gray-500">ISBN: {book.isbn}</p>}
                  {book.publishedAt && (
                    <p className="text-sm text-gray-500">
                      Published: {format(new Date(book.publishedAt), 'MMM dd, yyyy')}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(book)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {books.length === 0 && (
          <div className="text-center py-12 text-gray-500">No books found</div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold mb-4">
              {editingBook ? 'Edit Book' : 'Add New Book'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                <input
                  type="text"
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Published Date
                </label>
                <input
                  type="date"
                  value={formData.publishedAt}
                  onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <select
                  required
                  value={formData.authorId}
                  onChange={(e) => setFormData({ ...formData, authorId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Author</option>
                  {authors.map((author) => (
                    <option key={author.id} value={author.id}>
                      {author.name}
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
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Books;

