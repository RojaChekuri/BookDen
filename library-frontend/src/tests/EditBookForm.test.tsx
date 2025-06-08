import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AddEditBookForm } from '../components/Form';

const existingBook = {
  title: 'Existing Book',
  author: 'Existing Author',
  year: 2020,
  genre: 'Adventure',
  description: 'Existing description',
  imageUrl: '/uploads/existing.jpg',
};

describe('EditBookForm component', () => {
  const onSubmit = jest.fn();
  const onCancel = jest.fn();
  const onDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

 it('prefills form fields with initial data', () => {
  render(
    <AddEditBookForm
      initialData={existingBook}
      onSubmit={onSubmit}
      onCancel={onCancel}
      onDelete={onDelete}
    />
  );

  expect(screen.getByLabelText('Title (required)')).toHaveValue(existingBook.title);
  expect(screen.getByLabelText('Author (required)')).toHaveValue(existingBook.author);
  expect(screen.getByLabelText('Year published (required)')).toHaveValue(String(existingBook.year));
  expect(screen.getByLabelText('Genre (required)')).toHaveValue(existingBook.genre);
  expect(screen.getByLabelText('Description (optional)')).toHaveValue(existingBook.description);
});

  it('calls onDelete when Delete button is clicked', () => {
    render(
      <AddEditBookForm
        initialData={existingBook}
        onSubmit={onSubmit}
        onCancel={onCancel}
        onDelete={onDelete}
      />
    );

    const deleteBtn = screen.getByRole('button', { name: /Delete/i });
    fireEvent.click(deleteBtn);
    expect(onDelete).toHaveBeenCalled();
  });
});