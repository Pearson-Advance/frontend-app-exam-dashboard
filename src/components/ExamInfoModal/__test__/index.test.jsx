/* eslint-disable func-names, react/prop-types */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExamInfoModal from 'components/ExamInfoModal';

describe('ExamInfoModal', () => {
  const mockOnClose = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    title: 'Test Exam',
    data: [],
    isLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders modal with title', () => {
    render(<ExamInfoModal {...defaultProps} />);

    const titles = screen.getAllByText('Test Exam');
    expect(titles.length).toBeGreaterThan(0);
  });

  test('renders data details when provided', () => {
    const data = [
      { title: 'Discount Code:', description: 'ABC123' },
      { title: 'Expiry Date:', description: '2025-12-31' },
    ];

    render(
      <ExamInfoModal
        {...defaultProps}
        data={data}
      />,
    );

    expect(screen.getByText('Discount Code:')).toBeInTheDocument();
    expect(screen.getByText('ABC123')).toBeInTheDocument();
    expect(screen.getByText('Expiry Date:')).toBeInTheDocument();
    expect(screen.getByText('2025-12-31')).toBeInTheDocument();
  });

  test('shows loading spinner when isLoading is true', () => {
    render(
      <ExamInfoModal
        {...defaultProps}
        isLoading
      />,
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('does not show data when loading', () => {
    const data = [
      { title: 'Discount Code:', description: 'ABC123' },
    ];

    render(
      <ExamInfoModal
        {...defaultProps}
        data={data}
        isLoading
      />,
    );

    expect(screen.queryByText('Discount Code:')).not.toBeInTheDocument();
    expect(screen.queryByText('ABC123')).not.toBeInTheDocument();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('renders empty list when no data provided', () => {
    render(
      <ExamInfoModal
        {...defaultProps}
        data={[]}
      />,
    );

    const listItems = screen.queryAllByRole('listitem');
    expect(listItems).toHaveLength(0);
  });

  test('renders correct number of list items', () => {
    const data = [
      { title: 'Item 1', description: 'Description 1' },
      { title: 'Item 2', description: 'Description 2' },
      { title: 'Item 3', description: 'Description 3' },
    ];

    render(
      <ExamInfoModal
        {...defaultProps}
        data={data}
      />,
    );

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);
  });

  test('does not render dialog when isOpen is false', () => {
    const { container } = render(
      <ExamInfoModal
        {...defaultProps}
        isOpen={false}
      />,
    );

    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });

  test('renders with default isLoading prop', () => {
    render(
      <ExamInfoModal
        isOpen
        onClose={mockOnClose}
        title="Test"
        data={[]}
      />,
    );

    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });
});
