import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AddEditBookForm } from '../components/Form';

describe('AddEditBookForm component', () => {
  const onSubmit = jest.fn();
  const onCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields with empty initial data', () => {
    render(<AddEditBookForm onSubmit={onSubmit} onCancel={onCancel} />);

    expect(screen.getByLabelText(/Title/i)).toHaveValue('');
    expect(screen.getByLabelText(/Author/i)).toHaveValue('');
    expect(screen.getByLabelText(/Year published/i)).toHaveValue('');
    expect(screen.getByLabelText(/Genre/i)).toHaveValue('');
    expect(screen.getByLabelText(/Description/i)).toHaveValue('');
    expect(screen.getByLabelText(/Book Cover Image/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Add book/i })).toBeDisabled();
  });

  it('validates required fields and calls onSubmit on valid form submission', () => {
    render(<AddEditBookForm onSubmit={onSubmit} onCancel={onCancel} />);

    // Fill required fields
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'New Book' } });
    fireEvent.change(screen.getByLabelText(/Author/i), { target: { value: 'Author Name' } });
    fireEvent.change(screen.getByLabelText(/Year published/i), { target: { value: '2023' } });
    fireEvent.change(screen.getByLabelText(/Genre/i), { target: { value: 'Fantasy' } });

    // Now submit button should be enabled
    const submitBtn = screen.getByRole('button', { name: /Add book/i });
    expect(submitBtn).toBeEnabled();

    fireEvent.click(submitBtn);

    expect(onSubmit).toHaveBeenCalled();
    // onSubmit receives FormData, so we cannot directly check object,
    // but we can check that onSubmit was called once.
  });
});