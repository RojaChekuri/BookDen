import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BookCard from '../components/Card';
import { MemoryRouter } from 'react-router-dom';

// Mock useNavigate from react-router-dom
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('BookCard Component', () => {
  const defaultProps = {
    id: '1',
    title: 'Test Book',
    author: 'Author',
    genre: 'Fiction',
    imageUrl: 'test-image.jpg',
    isFavorite: false,
    toggleFavorite: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders book title, author, and image with lazy loading', () => {
    render(
      <MemoryRouter>
        <BookCard year={0} {...defaultProps} />
      </MemoryRouter>
    );

    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.author)).toBeInTheDocument();

    const img = screen.getByAltText(`Cover of ${defaultProps.title}`);
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', defaultProps.imageUrl);
    expect(img).toHaveAttribute('loading', 'lazy'); // lazy loading check
  });

  it('calls toggleFavorite when favorite star clicked', () => {
    render(
      <MemoryRouter>
        <BookCard year={0} {...defaultProps} />
      </MemoryRouter>
    );

    const star = screen.getByLabelText('Add to favorites');
    fireEvent.click(star);

    expect(defaultProps.toggleFavorite).toHaveBeenCalledWith(defaultProps.id);
  });

  it('navigates to book details on click', () => {
    render(
      <MemoryRouter>
        <BookCard year={0} {...defaultProps} />
      </MemoryRouter>
    );

    const card = screen.getByRole('button', { name: `View details for ${defaultProps.title}` });
    fireEvent.click(card);

    expect(mockedNavigate).toHaveBeenCalledWith(`/books/${defaultProps.id}`);
  });

  it('navigates to book details on Enter key press', () => {
    render(
      <MemoryRouter>
        <BookCard year={0} {...defaultProps} />
      </MemoryRouter>
    );

    const card = screen.getByRole('button', { name: `View details for ${defaultProps.title}` });
    fireEvent.keyDown(card, { key: 'Enter', code: 'Enter' });

    expect(mockedNavigate).toHaveBeenCalledWith(`/books/${defaultProps.id}`);
  });

  it('navigates to book details on Space key press', () => {
    render(
      <MemoryRouter>
        <BookCard year={0} {...defaultProps} />
      </MemoryRouter>
    );

    const card = screen.getByRole('button', { name: `View details for ${defaultProps.title}` });
    fireEvent.keyDown(card, { key: ' ', code: 'Space' });

    expect(mockedNavigate).toHaveBeenCalledWith(`/books/${defaultProps.id}`);
  });

  it('renders filled star icon when isFavorite true', () => {
    render(
      <MemoryRouter>
        <BookCard year={0} {...defaultProps} isFavorite={true} />
      </MemoryRouter>
    );

    const star = screen.getByLabelText('Remove from favorites');
    expect(star).toBeInTheDocument();
  });
});