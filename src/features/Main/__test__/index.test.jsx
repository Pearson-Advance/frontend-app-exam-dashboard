/* eslint-disable func-names */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

import Main from 'features/Main';

jest.mock('features/SchedulePage', () => function () {
  return <div>Mocked SchedulePage</div>;
});
jest.mock('features/DashboardPage', () => function () {
  return <div>Mocked DashboardPage</div>;
});
jest.mock('components/Footer', () => function () {
  return <div>Mocked Footer</div>;
});

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({
    EXAM_DASHBOARD_PATH: '/schedule',
  })),
}));

describe('Main routing with BrowserRouter (via MemoryRouter in test)', () => {
  test('renders SchedulePage for /schedule/exam', () => {
    render(
      <MemoryRouter initialEntries={['/schedule/exam']}>
        <Main />
      </MemoryRouter>,
    );
    expect(screen.getByText('Mocked SchedulePage')).toBeInTheDocument();
  });

  test('redirects unknown route to /schedule/exam', () => {
    render(
      <MemoryRouter initialEntries={['/unknown']}>
        <Main />
      </MemoryRouter>,
    );
    expect(screen.getByText('Mocked SchedulePage')).toBeInTheDocument();
  });
});
