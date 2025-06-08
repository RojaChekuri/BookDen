import { act } from 'react-dom/test-utils';
import { useBooksStore } from '../store/bookstore';

const mockBooks = [
  {
    id: '1',
    title: 'Test Book',
    author: 'Author',
    year: 2020,
    genre: 'Fiction',
    description: 'Desc',
    favorite: false,
  },
];

describe('BooksStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetchBooks success updates state correctly', async () => {
    (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockBooks,
    });

    await act(async () => {
      await useBooksStore.getState().fetchBooks();
    });

    const state = useBooksStore.getState();
    expect(state.books).toEqual(mockBooks);
    expect(state.error).toBeNull();
    expect(state.loading).toBe(false);
  });

  it('fetchBooks failure sets error state', async () => {
    (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Failed to fetch' }),
      statusText: 'Bad Request',
    });

    await act(async () => {
      await useBooksStore.getState().fetchBooks();
    });

    const state = useBooksStore.getState();
    expect(state.error).toBe('Failed to fetch');
    expect(state.loading).toBe(false);
  });

  it('addBook success triggers successMessage', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) }) // addBook response
      .mockResolvedValueOnce({ ok: true, json: async () => mockBooks }); // fetchBooks response

    await act(async () => {
      await useBooksStore.getState().addBook(new FormData());
    });

    const state = useBooksStore.getState();
    expect(state.successMessage).toBe('Book added successfully!');
    expect(state.error).toBeNull();
  });

  it('addBook failure sets error', async () => {
    (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Add failed' }),
      statusText: 'Bad Request',
    });

    await act(async () => {
      await useBooksStore.getState().addBook(new FormData());
    });

    const state = useBooksStore.getState();
    expect(state.error).toBe('Add failed');
    expect(state.successMessage).toBeNull();
  });

  // Similarly, you can add tests for updateBook, deleteBook, toggleFavorite if needed
});