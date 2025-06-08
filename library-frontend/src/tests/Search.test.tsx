import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Search } from '../components/Search';

const books = [
  { id: '1', title: 'Harry Potter', author: 'J.K. Rowling', genre: 'Fantasy', year: 1999 },
  { id: '2', title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy', year: 1937 },
  { id: '3', title: '1984', author: 'George Orwell', genre: 'Dystopia', year: 1949 },
];

describe('Search component', () => {
  const onFilteredBooks = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search input and clear button toggles visibility', () => {
    render(<Search books={books} onFilteredBooks={onFilteredBooks} />);

    const input = screen.getByRole('searchbox', { name: /search books/i });
    expect(input).toBeInTheDocument();

    // Initially clear button not present
    expect(screen.queryByLabelText(/clear search/i)).toBeNull();

    // Type in input triggers clear button
    fireEvent.change(input, { target: { value: 'Harry' } });
    expect(screen.getByLabelText(/clear search/i)).toBeInTheDocument();

    // Clear button clears input and focuses
    fireEvent.click(screen.getByLabelText(/clear search/i));
    expect(input).toHaveValue('');
  });

  it('calls onFilteredBooks with filtered books on input change', () => {
    render(<Search books={books} onFilteredBooks={onFilteredBooks} />);

    const input = screen.getByRole('searchbox', { name: /search books/i });

    fireEvent.change(input, { target: { value: 'fantasy' } });

    expect(onFilteredBooks).toHaveBeenCalled();

    // The first call's argument is the filtered books array
    const filtered = onFilteredBooks.mock.calls[0][0];
    expect(filtered.length).toBe(3);
    expect(filtered.some((b: any) => b.title === 'Harry Potter')).toBe(true);
    expect(filtered.some((b: any) => b.title === 'The Hobbit')).toBe(true);
  });
});