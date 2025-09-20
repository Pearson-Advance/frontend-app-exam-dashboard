/* eslint-disable func-names */
import React from 'react';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

import { render } from 'test-utils';

import Main from 'features/Main';

jest.mock('features/SchedulePage', () => function () {
  return <div>Mocked SchedulePage</div>;
});

jest.mock('features/DashboardPage', () => function () {
  return <div>Mocked DashboardPage</div>;
});

jest.mock('@edx/frontend-component-footer', () => function () {
  return <div>Mocked Footer</div>;
});

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({
    EXAM_DASHBOARD_PATH: '/schedule',
  })),
  ensureConfig: jest.fn(),
  subscribe: jest.fn(),
}));

describe('Main Component ', () => {
  test('redirects unknown route to /schedule/dashboard', () => {
    render(
      <MemoryRouter initialEntries={['/unknown']}>
        <Main />
      </MemoryRouter>,
    );
    expect(screen.getByText('Mocked DashboardPage')).toBeInTheDocument();
  });
});
