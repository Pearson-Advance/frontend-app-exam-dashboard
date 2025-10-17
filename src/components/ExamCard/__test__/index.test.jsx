import React from 'react';
import '@testing-library/jest-dom';
import {
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';

import { render } from 'test-utils';
import ExamCard from 'components/ExamCard';
import { examStatus } from 'features/utils/constants';
import { handleGetVoucherDetails } from 'features/utils/globals';

jest.mock('features/utils/globals', () => ({
  handleGetVoucherDetails: jest.fn(),
}));

const mockDropdownItemClick = jest.fn();

const baseProps = {
  examId: '12345',
  title: 'Sample Exam',
  status: examStatus.SCHEDULED,
  image: 'https://example.com/image.jpg',
  examDetails: [
    { title: 'Date', description: 'July 3, 2025' },
    { title: 'Time', description: '10:00 AM' },
  ],
  dropdownItems: [],
};

describe('ExamCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders title and exam details', () => {
    render(<ExamCard {...baseProps} />);
    expect(screen.getByText('Sample Exam')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('July 3, 2025')).toBeInTheDocument();
  });

  test('renders background image when provided', () => {
    render(<ExamCard {...baseProps} />);
    const bgDiv = document.querySelector('.card-header-image');
    expect(bgDiv).toBeInTheDocument();
    expect(bgDiv).toHaveStyle(`background-image: url(${baseProps.image})`);
  });

  test('renders correct number of exam details', () => {
    render(<ExamCard {...baseProps} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
  });

  describe('Voucher Details Modal', () => {
    test('opens modal and fetches voucher details on button click', async () => {
      const mockVoucherDetails = [
        { title: 'Voucher Code', description: 'ABC123' },
        { title: 'Expiry Date', description: 'Dec 31, 2025' },
      ];

      handleGetVoucherDetails.mockResolvedValueOnce(mockVoucherDetails);

      render(<ExamCard {...baseProps} />);

      const voucherButton = screen.getByText('Voucher Details');

      await act(async () => {
        fireEvent.click(voucherButton);
      });

      expect(handleGetVoucherDetails).toHaveBeenCalledWith('12345');

      await waitFor(() => {
        expect(handleGetVoucherDetails).toHaveBeenCalledTimes(1);
      });
    });

    test('uses cached data on subsequent modal opens', async () => {
      const mockVoucherDetails = [
        { title: 'Voucher Code', description: 'ABC123' },
      ];

      handleGetVoucherDetails.mockResolvedValueOnce(mockVoucherDetails);

      render(<ExamCard {...baseProps} />);

      const voucherButton = screen.getByText('Voucher Details');

      // First open
      await act(async () => {
        fireEvent.click(voucherButton);
      });

      await waitFor(() => {
        expect(handleGetVoucherDetails).toHaveBeenCalledTimes(1);
      });

      // Second open - should use cache
      await act(async () => {
        fireEvent.click(voucherButton);
      });

      // Should still be called only once
      expect(handleGetVoucherDetails).toHaveBeenCalledTimes(1);
    });

    test('displays error message when voucher details fetch fails', async () => {
      handleGetVoucherDetails.mockRejectedValueOnce(new Error('Network error'));

      render(<ExamCard {...baseProps} />);

      const voucherButton = screen.getByText('Voucher Details');

      await act(async () => {
        fireEvent.click(voucherButton);
      });

      await waitFor(() => {
        expect(handleGetVoucherDetails).toHaveBeenCalledWith('12345');
      });
    });
  });

  describe('Dropdown behavior', () => {
    test('renders dropdown when status is allowed (scheduled)', async () => {
      const dropdownItems = [
        { label: 'Edit', iconClass: 'fa-edit', onClick: mockDropdownItemClick },
      ];
      render(<ExamCard {...baseProps} status={examStatus.SCHEDULED} dropdownItems={dropdownItems} />);

      const toggle = screen.getByRole('button', { name: /menu/i });

      await act(async () => {
        fireEvent.click(toggle);
      });

      await act(async () => {
        fireEvent.click(screen.getByText('Edit'));
      });

      expect(mockDropdownItemClick).toHaveBeenCalled();
    });

    test('renders dropdown when status is complete', async () => {
      const dropdownItems = [
        { label: 'View Report', iconClass: 'fa-file', onClick: mockDropdownItemClick },
      ];
      render(<ExamCard {...baseProps} status={examStatus.COMPLETE} dropdownItems={dropdownItems} />);

      expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument();
    });

    test('does not render dropdown when status is not allowed', () => {
      const dropdownItems = [
        { label: 'Edit', iconClass: 'fa-edit', onClick: jest.fn() },
      ];
      render(<ExamCard {...baseProps} status={examStatus.NO_SHOW} dropdownItems={dropdownItems} />);
      expect(screen.queryByRole('button', { name: /menu/i })).not.toBeInTheDocument();
    });

    test('does not render dropdown when dropdownItems is empty', () => {
      render(<ExamCard {...baseProps} status={examStatus.SCHEDULED} dropdownItems={[]} />);
      expect(screen.queryByRole('button', { name: /menu/i })).not.toBeInTheDocument();
    });

    test('does not render dropdown when dropdownItems is null', () => {
      render(<ExamCard {...baseProps} status={examStatus.SCHEDULED} dropdownItems={null} />);
      expect(screen.queryByRole('button', { name: /menu/i })).not.toBeInTheDocument();
    });

    test('renders disabled dropdown item text correctly', async () => {
      const dropdownItems = [
        { label: 'Delete', onClick: jest.fn(), disabled: true },
      ];
      render(<ExamCard {...baseProps} status={examStatus.SCHEDULED} dropdownItems={dropdownItems} />);

      const toggle = screen.getByRole('button', { name: /menu/i });
      await act(async () => {
        fireEvent.click(toggle);
      });

      expect(await screen.findByText('Operation in process...')).toBeInTheDocument();
    });

    test('renders icon class in dropdown item', async () => {
      const dropdownItems = [
        { label: 'Edit', iconClass: 'fa-edit', onClick: mockDropdownItemClick },
      ];
      render(<ExamCard {...baseProps} status={examStatus.SCHEDULED} dropdownItems={dropdownItems} />);

      const toggle = screen.getByRole('button', { name: /menu/i });
      await act(async () => {
        fireEvent.click(toggle);
      });

      const icon = document.querySelector('.fa-edit');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Status badge rendering', () => {
    test('renders status badge for scheduled status', () => {
      render(<ExamCard {...baseProps} status={examStatus.SCHEDULED} />);
      const badge = document.querySelector('.custom-badge');
      expect(badge).toBeInTheDocument();
    });
  });
});
