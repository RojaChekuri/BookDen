import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Search } from '../components/Search';

const dummyBooks = [
  { id: '1', title: 'Book One', author: 'Author A', genre: 'Fiction', year: 2020 },
  { id: '2', title: 'Book Two', author: 'Author B', genre: 'Non-fiction', year: 2019 },
];

describe('Search Component', () => {
  const onSearchChange = jest.fn();
  const onSearchSubmit = jest.fn();
  const onFilteredBooks = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders input with placeholder and initial value', () => {
    render(
      <Search
        books={dummyBooks}
        onFilteredBooks={onFilteredBooks}
      />
    );
    const input = screen.getByRole('searchbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('initial');
    expect(input).toHaveAttribute('placeholder');
  });

  it('calls onSearchChange when typing', () => {
    render(
      <Search
        books={dummyBooks}
        onFilteredBooks={onFilteredBooks}
      />
    );
    const input = screen.getByRole('searchbox');

    userEvent.type(input, 'abc');
    expect(onSearchChange).toHaveBeenCalledTimes(3);
    expect(onSearchChange).toHaveBeenCalledWith('a');
    expect(onSearchChange).toHaveBeenCalledWith('ab');
    expect(onSearchChange).toHaveBeenCalledWith('abc');
  });

  it('calls onSearchSubmit when form submitted', () => {
    render(
      <Search
        books={dummyBooks}
        onFilteredBooks={onFilteredBooks}
      />
    );
    const form = screen.getByRole('search');
    fireEvent.submit(form);
    expect(onSearchSubmit).toHaveBeenCalledWith('query');
  });

  it('clears input and focuses when clear button clicked', () => {
    render(
      <Search
        books={dummyBooks}
        onFilteredBooks={onFilteredBooks}
      />
    );
    const clearBtn = screen.getByLabelText(/clear search/i);
    const input = screen.getByRole('searchbox');

    fireEvent.click(clearBtn);

    expect(onSearchChange).toHaveBeenCalledWith('');
    expect(input).toHaveFocus();
  });
});