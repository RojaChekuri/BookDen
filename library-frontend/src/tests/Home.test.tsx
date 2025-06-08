import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Home } from '../views/Home';
import { useBooksStore } from '../store/bookstore';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../store/bookstore');

describe('Home View', () => {
  const mockBooks = [
    {
      id: '1',
      title: 'Book One',
      author: 'Author A',
      year: 2021,
      genre: 'Fantasy',
      imageUrl: '/uploads/1.jpg',
      favorite: false,
    },
  ];

  beforeEach(() => {
    (useBooksStore as unknown as jest.Mock).mockReturnValue({
      books: mockBooks,
      loading: false,
      loadingMore: false,
      error: null,
      hasMore: true,
      fetchBooks: jest.fn(),
      toggleFavorite: jest.fn(),
    });
  });

  it('shows "Back to top" button when scrolled and scrolls to top on click', () => {
    // Mock scrollTo function early
    window.scrollTo = jest.fn();

    // Define scrollY to 400 *before* rendering
    Object.defineProperty(window, 'scrollY', { writable: true, configurable: true, value: 400 });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Dispatch scroll event to trigger scroll listener
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    const backToTopBtn = screen.getByRole('button', { name: /back to top/i });
    expect(backToTopBtn).toBeInTheDocument();

    fireEvent.click(backToTopBtn);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});