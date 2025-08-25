import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import NoContentPlaceholder from 'features/DashboardPage/components/NoContentPlaceholder';

describe('NoContentPlaceholder', () => {
  test('Should render default title and description when no props are provided', () => {
    render(<NoContentPlaceholder />);
    expect(screen.getByText('No exams found')).toBeInTheDocument();
    expect(screen.getByText("It looks like you don't have exams or vouchers.")).toBeInTheDocument();
  });

  test('Should render custom title and description when props are provided', () => {
    render(
      <NoContentPlaceholder
        title="Custom Title"
        description="Custom Description"
      />,
    );
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom Description')).toBeInTheDocument();
  });
});
