// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { render } from 'test-utils';

import ExamCard from 'components/ExamCard';

const defaultProps = {
  title: 'Sample Exam',
  status: 'unscheduled',
  image: 'https://example.com/image.jpg',
  examDetails: [
    { title: 'Date', description: 'July 3, 2025' },
    { title: 'Time', description: '10:00 AM' },
  ],
  additionalExamDetails: [
    { title: 'Location', description: 'Room A' },
    { title: 'Proctor', description: 'John Doe' },
  ],
  onScheduleExam: jest.fn(),
};

test('Should render title and exam details', () => {
  render(
    <ExamCard {...defaultProps} />,
  );

  expect(screen.getByText('Sample Exam')).toBeInTheDocument();
  expect(screen.getByText('Date')).toBeInTheDocument();
  expect(screen.getByText('July 3, 2025')).toBeInTheDocument();
});

test('Should show voucher button when status is scheduled', () => {
  render(<ExamCard {...defaultProps} status="scheduled" />);

  expect(screen.getByText('Voucher Details')).toBeInTheDocument();
});

test('Should open modal when clicking voucher button', () => {
  render(<ExamCard {...defaultProps} status="scheduled" />);

  fireEvent.click(screen.getByText('Voucher Details'));

  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(screen.getByText('Location')).toBeInTheDocument();
});

test('Should open modal when clicking schedule exam button', () => {
  render(<ExamCard {...defaultProps} status="canceled" hideVoucherButton />);

  fireEvent.click(screen.getByText('Schedule Exam'));

  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(screen.getByText('Terms and Conditions')).toBeInTheDocument();
});

test('Should render dropdown items when allowed and items are present', () => {
  const onClickMock = jest.fn();

  render(
    <ExamCard
      {...defaultProps}
      status="scheduled"
      dropdownItems={[{ label: 'Edit', iconClass: 'fa-edit', onClick: onClickMock }]}
    />,
  );

  fireEvent.click(screen.getByRole('button', { name: /menu/i }));
  fireEvent.click(screen.getByText('Edit'));

  expect(onClickMock).toHaveBeenCalled();
});

test('Should not render dropdown when status is not allowed', () => {
  render(
    <ExamCard
      {...defaultProps}
      status="unscheduled"
      dropdownItems={[{ label: 'Edit', iconClass: 'fa-edit', onClick: jest.fn() }]}
    />,
  );

  expect(screen.queryByRole('button', { name: /menu/i })).not.toBeInTheDocument();
});
