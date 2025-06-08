import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BannerToast } from '../components/BannerToast';

describe('BannerToast', () => {
  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });


  it('calls onClose when close button clicked', () => {
    render(<BannerToast message="Close me" type="error" onClose={onClose} />);
    const closeBtn = screen.getByRole('button');
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});