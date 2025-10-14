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
];

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows loading spinner initially', async () => {
    jest.spyOn(api, 'getExams').mockResolvedValueOnce({
      data: { results: [] },
    });

    render(<DashboardPage />);
    expect(screen.getAllByText(/loading exams/i)).toHaveLength(2);

    await waitFor(() => {
      expect(screen.queryByText(/loading exams/i)).not.toBeInTheDocument();
    });
  });

  test('renders NoContentPlaceholder when no valid exams', async () => {
    jest.spyOn(api, 'getExams').mockResolvedValueOnce({
      data: { results: [] },
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('No exams found')).toBeInTheDocument();
    });
  });

  test('handles API error and shows placeholder', async () => {
    jest.spyOn(api, 'getExams').mockRejectedValueOnce(new Error('API failed'));

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText('No exams found')).toBeInTheDocument();
    });
  });

  test('displays correct exam details for scheduled and unscheduled exams', async () => {
    jest.spyOn(api, 'getExams').mockResolvedValueOnce({
      data: { results: validExams },
    });

    render(<DashboardPage />);

    await waitFor(() => {
      const exams = screen.getAllByText('Exam 1');
      const pastExams = screen.getAllByText('Exam 2');

      expect(exams).toHaveLength(2);
      expect(pastExams).toHaveLength(2);

      expect(screen.getAllByText('complete')).toHaveLength(2);
      expect(screen.getAllByText('scheduled')).toHaveLength(2);
    });
  });
});

describe('Exam actions', () => {
  test('Should show view score option for completed exam if the result is available', async () => {
    const scheduledExam = [
      {
        id: 11,
        name: 'Completed Exam',
        status: 'EXAM_DELIVERED',
        vue_appointment_id: 'drop123',
        created: '2025-08-10T10:14:50Z',
        start_at: '2025-08-15T14:10:00Z',
        result_id: 1,
        ...examLocation,
      },
    ];

    jest.spyOn(api, 'getExams').mockResolvedValueOnce({
      data: { results: scheduledExam },
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getAllByText('complete')).toHaveLength(2);
      expect(screen.getAllByText(VIEW_SCORE_REPORT_LABEL)).toHaveLength(2);
    });
  });

  test('Should not show view score option for completed exam if the result is NOT available', async () => {
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
      expect(screen.getAllByText('complete')).toHaveLength(2);
      expect(
        screen.queryAllByRole('button', { name: VIEW_SCORE_REPORT_LABEL }),
      ).toHaveLength(0);
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
      expect(screen.getAllByText('scheduled')).toHaveLength(2);
      expect(screen.getAllByText('Cancel Exam')).toHaveLength(2);
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
      expect(screen.getAllByText('Scheduled Exam')).toHaveLength(2);
      expect(screen.getAllByText('Reschedule Exam')).toHaveLength(2);
    });
  });
});
