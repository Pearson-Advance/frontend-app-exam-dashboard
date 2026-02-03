/* eslint-disable func-names, react/prop-types */
import React from 'react';
import { screen } from '@testing-library/react';
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

jest.mock('@edx/frontend-component-header', () => function () {
  return <div>Mocked Header</div>;
});

jest.mock('react-paragon-topaz', () => ({
  __esModule: true,
  Button: ({ children, ...props }) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),
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
