/* eslint-disable func-names, react/prop-types */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import VoucherDetailsModal from 'components/VoucherDetailsModal';

describe('VoucherDetailsModal', () => {
  const mockOnClose = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    examTitle: 'Test Exam',
    voucherDetails: [],
    isLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders voucher details with data', () => {
    const voucherDetails = [
      { title: 'Discount Code:', description: 'ABC123' },
      { title: 'Expiry Date:', description: '2025-12-31' },
    ];

    render(
      <VoucherDetailsModal
        {...defaultProps}
        voucherDetails={voucherDetails}
        isLoading={false}
      />,
    );

    expect(screen.getByText('Test Exam')).toBeInTheDocument();
    expect(screen.getByText('Discount Code:')).toBeInTheDocument();
    expect(screen.getByText('ABC123')).toBeInTheDocument();
    expect(screen.getByText('Expiry Date:')).toBeInTheDocument();
    expect(screen.getByText('2025-12-31')).toBeInTheDocument();
  });

  test('shows loading state when fetching voucher details', () => {
    render(
      <VoucherDetailsModal
        {...defaultProps}
        isLoading
      />,
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('renders empty list when no voucher details', () => {
    render(
      <VoucherDetailsModal
        {...defaultProps}
        voucherDetails={[]}
        isLoading={false}
      />,
    );

    expect(screen.getByText('Test Exam')).toBeInTheDocument();
    const listItems = screen.queryAllByRole('listitem');
    expect(listItems).toHaveLength(0);
  });

  test('does not render dialog when isOpen is false', () => {
    const { container } = render(
      <VoucherDetailsModal
        {...defaultProps}
        isOpen={false}
      />,
    );
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });
});
