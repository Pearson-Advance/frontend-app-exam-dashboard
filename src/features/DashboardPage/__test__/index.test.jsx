/* eslint-disable func-names, react/prop-types */
import React from 'react';
import { act, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { render } from 'test-utils';
import DashboardPage from 'features/DashboardPage';
import * as api from 'features/data/api';

jest.mock('@edx/frontend-component-header', () => function () {
  return <div data-testid="header" />;
});

jest.mock('components/ExamCard', () => function ({
  title,
  status,
  examDetails,
  dropdownItems,
}) {
  return (
    <div data-testid="exam-card">
      <div>{title}</div>
      <div>{status}</div>
      <div>{examDetails?.[0]?.description}</div>
      {dropdownItems?.length > 0 && (
        <div data-testid="dropdown-items">
          {dropdownItems.map((item) => (
            <button key={item.label} onClick={item.onClick} type="button">
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

jest.mock('features/DashboardPage/components/NoContentPlaceholder', () => function ({ title, description }) {
  return <div data-testid="no-content">{title || description}</div>;
});

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

const VIEW_SCORE_REPORT_LABEL = 'View Score Report';

const examLocation = {
  test_center: {
    test_center_name: 'Alpha Center',
    test_center_address: {
      address1: '123 Main St',
      city: 'Sarajevo',
      state: '',
      postal_code: null,
      country: 'Bosnia',
    },
  },
};

const validExams = [
  {
    id: 1,
    name: 'Exam 1',
    status: 'APPT_CREATED',
    vue_appointment_id: 'abc123',
    created: '2025-07-01T10:00:00Z',
    start_at: '2025-07-30T18:00:00Z',
    ...examLocation,
  },
  {
    id: 2,
    name: 'Exam 2',
    status: 'EXAM_DELIVERED',
    vue_appointment_id: 'def456',
    created: '2025-07-01T11:00:00Z',
    start_at: '2025-07-20T16:30:00Z',
    ...examLocation,
  },
  {
    id: 3,
    name: 'Canceled Exam',
    status: 'APPT_CANCELED',
    vue_appointment_id: 'xyz789',
    created: '2025-07-01T12:00:00Z',
    start_at: '2025-07-20T16:30:00Z',
    ...examLocation,
  },
  {
    id: 4,
    name: 'Old Exam Title',
    status: 'APPT_CANCELED',
    vue_appointment_id: 'xyz789',
    created: '2025-07-01T12:00:00Z',
    start_at: '2025-07-20T16:30:00Z',
    exam_series_name: 'Tittle override Test',
    ...examLocation,
  },
];

const validVouchers = [
  {
    voucher_number: 'VCH-001',
    exam_name: 'Voucher Exam',
    exam_code: 'EX-001',
    start_at: null,
  },
];

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders NoContentPlaceholder when no exams or vouchers', async () => {
    jest.spyOn(api, 'getExams').mockResolvedValue({ data: { results: [] } });
    jest.spyOn(api, 'getVouchers').mockResolvedValue({ data: [] });

    await act(async () => {
      render(<DashboardPage />);
    });

    expect(await screen.findByText('No exams found')).toBeInTheDocument();
  });

  test('handles API error and shows placeholder', async () => {
    jest.spyOn(api, 'getExams').mockRejectedValue(new Error('API failed'));
    jest.spyOn(api, 'getVouchers').mockResolvedValue({ data: [] });

    await act(async () => {
      render(<DashboardPage />);
    });

    expect(await screen.findByText('No exams found')).toBeInTheDocument();
  });

  test('renders exams and vouchers together in Exams tab', async () => {
    jest.spyOn(api, 'getExams').mockResolvedValue({ data: { results: validExams } });
    jest.spyOn(api, 'getVouchers').mockResolvedValue({ data: [...validVouchers] });

    await act(async () => {
      render(<DashboardPage />);
    });

    const examCards = await screen.findAllByTestId('exam-card');
    expect(examCards.length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText('Exam 1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Voucher Exam').length).toBeGreaterThan(0);
  });

  test('renders exam_series_name if available', async () => {
    jest.spyOn(api, 'getExams').mockResolvedValue({ data: { results: validExams } });
    jest.spyOn(api, 'getVouchers').mockResolvedValue({ data: [...validVouchers] });

    await act(async () => {
      render(<DashboardPage />);
    });

    expect(screen.queryByText('Old Exam Title')).not.toBeInTheDocument();
    expect(screen.getAllByText('Tittle override Test').length).toBe(1);
  });
});

describe('Exam actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows "View Score Report" for completed exam with result', async () => {
    const completedExam = [{
      id: 11,
      name: 'Completed Exam',
      status: 'EXAM_DELIVERED',
      result_id: 1,
      ...examLocation,
    }];

    jest.spyOn(api, 'getExams').mockResolvedValue({ data: { results: completedExam } });
    jest.spyOn(api, 'getVouchers').mockResolvedValue({ data: [] });

    await act(async () => {
      render(<DashboardPage />);
    });

    const buttons = await screen.findAllByText(VIEW_SCORE_REPORT_LABEL);
    expect(buttons.length).toBeGreaterThan(0);
  });

  test('does not show "View Score Report" if result not available', async () => {
    const noResultExam = [{
      id: 12,
      name: 'Completed Exam',
      status: 'EXAM_DELIVERED',
      ...examLocation,
    }];

    jest.spyOn(api, 'getExams').mockResolvedValue({ data: { results: noResultExam } });
    jest.spyOn(api, 'getVouchers').mockResolvedValue({ data: [] });

    await act(async () => {
      render(<DashboardPage />);
    });

    const buttons = screen.queryAllByText(VIEW_SCORE_REPORT_LABEL);
    expect(buttons.length).toBe(0);
  });

  test('shows cancel option for scheduled exam', async () => {
    const scheduledExam = [{
      id: 10,
      name: 'Scheduled Exam',
      status: 'APPT_CREATED',
      ...examLocation,
    }];

    jest.spyOn(api, 'getExams').mockResolvedValue({ data: { results: scheduledExam } });
    jest.spyOn(api, 'getVouchers').mockResolvedValue({ data: [] });

    await act(async () => {
      render(<DashboardPage />);
    });

    const cancelButtons = await screen.findAllByText('Cancel Exam');
    expect(cancelButtons.length).toBeGreaterThan(0);
  });

  test('displays dropdown item for scheduled exam', async () => {
    const scheduledExam = [{
      id: 10,
      name: 'Scheduled Exam',
      status: 'APPT_CREATED',
      ...examLocation,
    }];

    jest.spyOn(api, 'getExams').mockResolvedValue({ data: { results: scheduledExam } });
    jest.spyOn(api, 'getVouchers').mockResolvedValue({ data: [] });

    await act(async () => {
      render(<DashboardPage />);
    });

    const rescheduleButtons = await screen.findAllByText('Reschedule Exam');
    expect(rescheduleButtons.length).toBeGreaterThan(0);
  });
});
