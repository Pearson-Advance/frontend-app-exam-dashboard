/* eslint-disable func-names, react/prop-types */
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
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
          {dropdownItems.map(item => (
            <button key={item.label} onClick={item.onClick} type="button">{item.label}</button>
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

describe('DashboardPage', () => {
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
      ...examLocation,
    },
  ];

  const invalidExams = [
    {
      id: 4,
      name: 'Expired Exam',
      status: 'EXPIRED',
      created: '2025-07-01T12:00:00Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows loading spinner initially', async () => {
    jest.spyOn(api, 'getExams').mockResolvedValueOnce({
      data: { results: [] },
    });

    render(<DashboardPage />);
    expect(screen.getByText(/loading exams/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/loading exams/i)).not.toBeInTheDocument();
    });
  });

  test('renders NoContentPlaceholder when no valid exams', async () => {
    jest.spyOn(api, 'getExams').mockResolvedValueOnce({
      data: { results: invalidExams },
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByTestId('no-content')).toBeInTheDocument();
    });
  });

  test('handles API error and shows placeholder', async () => {
    jest.spyOn(api, 'getExams').mockRejectedValueOnce(new Error('API failed'));

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByTestId('no-content')).toBeInTheDocument();
    });
  });

  test('displays correct exam details for scheduled and unscheduled exams', async () => {
    jest.spyOn(api, 'getExams').mockResolvedValueOnce({
      data: { results: validExams },
    });

    render(<DashboardPage />);

    await waitFor(() => {
      const exam1 = screen.getByText('Exam 1');
      const exam2 = screen.getByText('Exam 2');

      expect(exam1).toBeInTheDocument();
      expect(exam2).toBeInTheDocument();

      expect(screen.getByText('complete')).toBeInTheDocument();
      expect(screen.getByText('scheduled')).toBeInTheDocument();
    });
  });

  test('Should show cancel option for scheduled exam', async () => {
    const scheduledExam = [
      {
        id: 10,
        name: 'Scheduled Exam',
        status: 'APPT_CREATED',
        vue_appointment_id: 'drop123',
        created: '2025-08-10T10:14:50Z',
        start_at: '2025-08-15T14:10:00Z',
        ...examLocation,
      },
    ];

    jest.spyOn(api, 'getExams').mockResolvedValueOnce({
      data: { results: scheduledExam },
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('scheduled')).toBeInTheDocument();
      expect(screen.getByText('Cancel Exam')).toBeInTheDocument();
    });
  });

  test('Should show view score option for completed exam', async () => {
    const scheduledExam = [
      {
        id: 11,
        name: 'Completed Exam',
        status: 'EXAM_DELIVERED',
        vue_appointment_id: 'drop123',
        created: '2025-08-10T10:14:50Z',
        start_at: '2025-08-15T14:10:00Z',
        ...examLocation,
      },
    ];

    jest.spyOn(api, 'getExams').mockResolvedValueOnce({
      data: { results: scheduledExam },
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('complete')).toBeInTheDocument();
      expect(screen.getByText('View Score Report')).toBeInTheDocument();
    });
  });

  test('displays dropdown item for scheduled exam', async () => {
    const scheduledExam = [
      {
        id: 10,
        name: 'Scheduled Exam',
        status: 'APPT_CREATED',
        vue_appointment_id: 'drop123',
        created: '2025-07-05T10:00:00Z',
        start_at: '2025-07-25T14:00:00Z',
        ...examLocation,
      },
    ];

    jest.spyOn(api, 'getExams').mockResolvedValueOnce({
      data: { results: scheduledExam },
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('Scheduled Exam')).toBeInTheDocument();
      expect(screen.getByText('Reschedule Exam')).toBeInTheDocument();
    });
  });
});
