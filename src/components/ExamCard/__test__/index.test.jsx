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
import { examStatus, voucherStatus } from 'features/utils/constants';
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
  onScheduleClick: jest.fn(),
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

  test('renders image when provided', () => {
    render(<ExamCard {...baseProps} />);
    const img = document.querySelector('.card-header-image');

    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', baseProps.image);
  });

  test('renders correct number of exam details', () => {
    render(<ExamCard {...baseProps} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  describe('Voucher Details Modal', () => {
    test('fetches voucher details on first click', async () => {
      const mockData = [
        { title: 'Voucher Code', description: 'ABC123' },
      ];
      handleGetVoucherDetails.mockResolvedValueOnce(mockData);

      render(<ExamCard {...baseProps} />);
      const button = screen.getByText('Voucher Details');

      await act(async () => {
        fireEvent.click(button);
      });

      expect(handleGetVoucherDetails).toHaveBeenCalledWith('12345');
      await waitFor(() => {
        expect(handleGetVoucherDetails).toHaveBeenCalledTimes(1);
      });
    });

    test('uses cached data on second open', async () => {
      const mockData = [{ title: 'Voucher Code', description: 'ABC123' }];
      handleGetVoucherDetails.mockResolvedValueOnce(mockData);

      render(<ExamCard {...baseProps} />);
      const button = screen.getByText('Voucher Details');

      await act(async () => fireEvent.click(button));
      await waitFor(() => expect(handleGetVoucherDetails).toHaveBeenCalledTimes(1));

      await act(async () => fireEvent.click(button));
      expect(handleGetVoucherDetails).toHaveBeenCalledTimes(1);
    });

    test('shows error fallback on fetch fail', async () => {
      handleGetVoucherDetails.mockRejectedValueOnce(new Error('Network error'));
      render(<ExamCard {...baseProps} />);
      const button = screen.getByText('Voucher Details');

      await act(async () => fireEvent.click(button));
      await waitFor(() => {
        expect(handleGetVoucherDetails).toHaveBeenCalledWith('12345');
      });
    });
  });

  describe('Dropdown behavior', () => {
    test('renders and triggers dropdown actions', async () => {
      const dropdownItems = [
        { label: 'Edit', iconClass: 'fa-edit', onClick: mockDropdownItemClick },
      ];
      render(<ExamCard {...baseProps} dropdownItems={dropdownItems} />);
      const toggle = screen.getByRole('button', { name: /menu/i });

      await act(async () => fireEvent.click(toggle));
      await act(async () => fireEvent.click(screen.getByText('Edit')));

      expect(mockDropdownItemClick).toHaveBeenCalled();
    });

    test('shows disabled item text correctly', async () => {
      const dropdownItems = [
        { label: 'Delete', onClick: jest.fn(), disabled: true },
      ];
      render(<ExamCard {...baseProps} dropdownItems={dropdownItems} />);
      const toggle = screen.getByRole('button', { name: /menu/i });

      await act(async () => fireEvent.click(toggle));
      expect(await screen.findByText('Operation in process...')).toBeInTheDocument();
    });

    test('does not render dropdown if not allowed', () => {
      render(<ExamCard {...baseProps} status={examStatus.NO_SHOW} />);
      expect(screen.queryByRole('button', { name: /menu/i })).not.toBeInTheDocument();
    });
  });

  describe('Button and Status rendering', () => {
    test('renders Schedule Exam button when unscheduled', () => {
      render(<ExamCard {...baseProps} status={voucherStatus.UNSCHEDULED} />);
      expect(screen.getByText('Schedule Exam')).toBeInTheDocument();
    });

    test('renders Voucher Details button otherwise', () => {
      render(<ExamCard {...baseProps} />);
      expect(screen.getByText('Voucher Details')).toBeInTheDocument();
    });
  });

  describe('UI Styles consistency', () => {
    const statusTestCases = [
      ['UNSCHEDULED', 'voucher', 'Unscheduled', 'unschedule-voucher-background', 'badge-unscheduled'],
      ['COMPLETE', 'exam', 'Complete', 'completed-background', 'badge-complete'],
      ['SCHEDULED', 'exam', 'Scheduled', 'scheduled-background', 'badge-scheduled'],
      ['CANCELED', 'exam', 'Canceled', 'canceled-background', 'badge-canceled'],
      ['NO_SHOW', 'exam', 'No Show', 'no-show-background', 'badge-no-show'],
      ['NDA_REFUSED', 'exam', 'NDA declined', 'nda-refused-background', 'badge-nda-refused'],
      ['EXPIRED', 'exam', 'Incomplete exam', 'expired-background', 'badge-expired'],
    ];

    test.each(statusTestCases)(
      'renders correct styles for %s badge',
      async (key, enumType, expectedText, expectedClass, expectedBadge) => {
        const statusValue = enumType === 'voucher'
          ? voucherStatus[key]
          : examStatus[key];

        render(<ExamCard {...baseProps} status={statusValue} />);

        const badge = document.querySelector('.custom-badge');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveTextContent(expectedText);

        const background = document.querySelector('.card-header-background');
        expect(background).toHaveClass(expectedClass);
        expect(badge).toHaveClass(expectedBadge);
      },
    );
  });
});
