import React from 'react';
import { render, screen } from '@testing-library/react';
import BookCard from '../components/Card';
import { MemoryRouter } from 'react-router-dom';  // Import router for test

test('image has loading="lazy" attribute', () => {
  render(
    <MemoryRouter>
      <BookCard
        id="1"
        title="Test Book"
        author="Author"
        year={2020}
        genre="Fiction"
        imageUrl="test-image.jpg"
        isFavorite={false}
        toggleFavorite={() => {}}
      />
    </MemoryRouter>
  );

  const img = screen.getByAltText(/cover of test book/i);
  expect(img).toHaveAttribute('loading', 'lazy');
});
