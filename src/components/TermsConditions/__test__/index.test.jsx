import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import TermsConditions from 'components/TermsConditions';

describe('TermsConditions', () => {
  const onAcceptMock = jest.fn();
  const onCancelMock = jest.fn();

  beforeEach(() => {
    render(<TermsConditions onAccept={onAcceptMock} onCancel={onCancelMock} />);
  });

  test('renders checkbox and buttons', () => {
    expect(screen.getByLabelText(/i have read and agree/i)).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
  });

  test('shows error if checkbox not checked and continue clicked', () => {
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    expect(screen.getByText(/You must agree to the terms and conditions to continue./i)).toBeInTheDocument();
    expect(onAcceptMock).not.toHaveBeenCalled();
  });

  test('calls onAccept if checkbox is checked and continue clicked', () => {
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    expect(onAcceptMock).toHaveBeenCalledTimes(1);
  });

  test('calls onCancel when cancel button is clicked', () => {
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onCancelMock).toHaveBeenCalledTimes(1);
  });
});
