import { create } from 'zustand';
import { Book, BooksState } from '../types/libraryTypes';

const API = 'http://localhost:4000/books';
const PAGE_LIMIT = 20;

async function parseError(res: Response): Promise<string> {
  try {
    const data = await res.json();
    return data.error || res.statusText || 'Unknown error';
  } catch {
    return res.statusText || 'Unknown error';
  }
}

export const useBooksStore = create<BooksState>()((set, get) => ({
  books: [],
  loading: false,
  loadingMore: false,
  error: null,
  successMessage: null,
  hasMore: true,

  setError: (msg) => set({ error: msg }),
  setSuccessMessage: (msg) => set({ successMessage: msg }),

  fetchBooks: async ({ page = 1, searchTerm = '', append = false } = {}) => {
    if (append) set({ loadingMore: true, error: null, successMessage: null });
    else set({ loading: true, error: null, successMessage: null });
  
    try {
      const baseUrl = searchTerm
        ? `/books/search?title=${encodeURIComponent(searchTerm)}`
        : '/books';
      const url = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}page=${page}&limit=${PAGE_LIMIT}`;
  
      const res = await fetch(url);
      if (!res.ok) {
        const errorMsg = await parseError(res);
        throw new Error(errorMsg);
      }
      const data: Book[] = await res.json();
  
      set((state) => ({
        books: append ? [...state.books, ...data] : data,
        loading: false,
        loadingMore: false,
        error: null,
        successMessage: null,
        hasMore: data.length === PAGE_LIMIT,
      }));
    } catch (err: any) {
      set({
        loading: false,
        loadingMore: false,
        error: err.message || 'Could not fetch books.',
        successMessage: null,
      });
    }
  },

  addBook: async (formData) => {
    set({ error: null, successMessage: null });
    try {
      const res = await fetch(API, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const errorMsg = await parseError(res);
        throw new Error(errorMsg);
      }
      await get().fetchBooks({ page: 1, append: false });
      set({ successMessage: 'Book added successfully!' });
    } catch (err: any) {
      set({ error: err.message || 'Could not add book.', successMessage: null });
    }
  },

  updateBook: async (id, formData) => {
    set({ error: null, successMessage: null });
    try {
      const res = await fetch(`${API}/${id}`, {
        method: 'PUT',
        body: formData,
      });
      if (!res.ok) {
        const errorMsg = await parseError(res);
        throw new Error(errorMsg);
      }
      await get().fetchBooks({ page: 1, append: false });
      set({ successMessage: 'Book updated successfully!' });
    } catch (err: any) {
      set({ error: err.message || 'Could not update book.', successMessage: null });
    }
  },

  deleteBook: async (id) => {
    set({ error: null, successMessage: null });
    try {
      const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errorMsg = await parseError(res);
        throw new Error(errorMsg);
      }
      await get().fetchBooks({ page: 1, append: false });
      set({ successMessage: 'Book deleted successfully!' });
    } catch (err: any) {
      set({ error: err.message || 'Could not delete book.', successMessage: null });
    }
  },

  markFavorite: async (id) => {
    set({ error: null, successMessage: null });
    try {
      const res = await fetch(`${API}/${id}/favorite`, { method: 'POST' });
      if (!res.ok) {
        const errorMsg = await parseError(res);
        throw new Error(errorMsg);
      }
      set((state) => ({
        books: state.books.map((b) => (b.id === id ? { ...b, favorite: true } : b)),
      }));
    } catch (err: any) {
      set({ error: err.message || 'Could not mark favorite.', successMessage: null });
    }
  },

  unmarkFavorite: async (id) => {
    set({ error: null, successMessage: null });
    try {
      const res = await fetch(`${API}/${id}/favorite`, { method: 'DELETE' });
      if (!res.ok) {
        const errorMsg = await parseError(res);
        throw new Error(errorMsg);
      }
      set((state) => ({
        books: state.books.map((b) => (b.id === id ? { ...b, favorite: false } : b)),
      }));
    } catch (err: any) {
      set({ error: err.message || 'Could not unmark favorite.', successMessage: null });
    }
  },

  toggleFavorite: async (id, current) => {
    if (current) {
      await get().unmarkFavorite(id);
    } else {
      await get().markFavorite(id);
    }
  },
}));