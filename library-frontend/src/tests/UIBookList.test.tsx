import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BookCard from '../components/Card';
import { MemoryRouter } from 'react-router-dom';  // import MemoryRouter

describe('BookCard component', () => {
  const defaultProps = {
    id: '123',
    title: 'Test Book Title',
    author: 'Test Author',
    year: 2023,
    genre: 'Fantasy',
    imageUrl: '/uploads/test-image.jpg',
    isFavorite: false,
    toggleFavorite: jest.fn(),
    className: '',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders book details and favorite icon correctly', () => {
    render(
      <MemoryRouter>
        <BookCard {...defaultProps} />
      </MemoryRouter>
    );

    expect(screen.getByText('Test Book Title')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
    expect(screen.getByText('Fantasy')).toBeInTheDocument();

    const img = screen.getByAltText('Cover of Test Book Title') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain('/uploads/test-image.jpg');

    const starBtn = screen.getByRole('button', { name: /Add to favorites/i });
    expect(starBtn).toBeInTheDocument();
    expect(starBtn).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls toggleFavorite on star click and keyboard interaction', () => {
    render(
      <MemoryRouter>
        <BookCard {...defaultProps} />
      </MemoryRouter>
    );

    const starBtn = screen.getByRole('button', { name: /Add to favorites/i });

    fireEvent.click(starBtn);
    expect(defaultProps.toggleFavorite).toHaveBeenCalledWith('123');

    fireEvent.keyDown(starBtn, { key: 'Enter', code: 'Enter', charCode: 13 });
    expect(defaultProps.toggleFavorite).toHaveBeenCalledTimes(2);

    fireEvent.keyDown(starBtn, { key: ' ', code: 'Space', charCode: 32 });
    expect(defaultProps.toggleFavorite).toHaveBeenCalledTimes(3);
  });
});