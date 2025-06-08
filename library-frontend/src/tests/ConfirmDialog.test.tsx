import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmDialog } from '../components/Dialog';

describe('ConfirmDialog', () => {
  const onConfirm = jest.fn();
  const onCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title and description', () => {
    render(
      <ConfirmDialog
        id="dialog"
        open={true}
        title="Confirm Delete"
        description="Are you sure?"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );
    expect(screen.getByText(/confirm delete/i)).toBeInTheDocument();
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
  });

  it('calls onConfirm and onCancel handlers when buttons clicked', () => {
    render(
      <ConfirmDialog
        id="dialog"
        open={true}
        title="Confirm Delete"
        description="Are you sure?"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    // Use getByText since buttons lack accessible names
    fireEvent.click(screen.getByText(/yes, delete/i));
    expect(onConfirm).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText(/cancel/i));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});