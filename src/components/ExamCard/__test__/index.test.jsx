import React from 'react';
import '@testing-library/jest-dom';
import {
  screen,
  fireEvent,
  cleanup,
  act,
} from '@testing-library/react';

import { render } from 'test-utils';
import ExamCard from 'components/ExamCard';
import { examStatus } from 'features/utils/constants';

const mockScheduleClick = jest.fn();
const mockVoucherClick = jest.fn();

const baseProps = {
  title: 'Sample Exam',
  status: examStatus.SCHEDULED,
  image: 'https://example.com/image.jpg',
  examDetails: [
    { title: 'Date', description: 'July 3, 2025' },
    { title: 'Time', description: '10:00 AM' },
  ],
  dropdownItems: [],
  onScheduleClick: mockScheduleClick,
  onVoucherDetailsClick: mockVoucherClick,
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

  describe('Buttons behavior', () => {
    test('calls onVoucherDetailsClick when clicking "Voucher Details"', () => {
      render(<ExamCard {...baseProps} status={examStatus.SCHEDULED} />);
      fireEvent.click(screen.getByText('Voucher Details'));
      expect(mockVoucherClick).toHaveBeenCalledTimes(1);
    });

    test('renders correct button based on each status', () => {
      const statuses = Object.values(examStatus);

      statuses.forEach((status) => {
        cleanup();
        render(<ExamCard {...baseProps} status={status} />);

        expect(screen.getByText('Voucher Details')).toBeInTheDocument();
        expect(screen.queryByText('Schedule Exam')).not.toBeInTheDocument();
      });
    });
  });

  describe('Dropdown behavior', () => {
    test('renders dropdown when status is allowed (scheduled)', async () => {
      const mockItemClick = jest.fn();
      const dropdownItems = [{ label: 'Edit', iconClass: 'fa-edit', onClick: mockItemClick }];
      render(<ExamCard {...baseProps} status={examStatus.SCHEDULED} dropdownItems={dropdownItems} />);

      const toggle = screen.getByRole('button', { name: /menu/i });

      await act(async () => {
        fireEvent.click(toggle);
      });

      await act(async () => {
        fireEvent.click(screen.getByText('Edit'));
      });

      expect(mockItemClick).toHaveBeenCalled();
    });

    test('does not render dropdown when status is not allowed', () => {
      const dropdownItems = [{ label: 'Edit', iconClass: 'fa-edit', onClick: jest.fn() }];
      render(<ExamCard {...baseProps} status={examStatus.NO_SHOW} dropdownItems={dropdownItems} />);
      expect(screen.queryByRole('button', { name: /menu/i })).not.toBeInTheDocument();
    });

    test('renders disabled dropdown item text correctly', async () => {
      const dropdownItems = [{ label: 'Delete', onClick: jest.fn(), disabled: true }];
      render(<ExamCard {...baseProps} status={examStatus.SCHEDULED} dropdownItems={dropdownItems} />);

      const toggle = screen.getByRole('button', { name: /menu/i });
      await act(async () => {
        fireEvent.click(toggle);
      });

      expect(await screen.findByText('Operation in process...')).toBeInTheDocument();
    });
  });
});
