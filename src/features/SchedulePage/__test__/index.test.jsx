/* eslint-disable func-names, react/prop-types */
import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import SchedulePage from 'features/SchedulePage';

import { updateUserData } from 'features/data/api';
import { render } from 'test-utils';

jest.mock('constants', () => ({
  countries: [
    { name: 'United States of America', dialingCode: '+1', cca3: 'USA' },
  ],
}));

jest.mock('@edx/frontend-platform', () => ({
  getConfig: () => ({
    LOGO_URL: 'logo.png',
    LMS_BASE_URL: 'https://lms.example.com',
    WEBNG_PLUGIN_API_BASE_URL: 'https://mfe.example.com',
  }),
}));

jest.mock('features/data/api', () => ({
  updateUserData: jest.fn(),
}));

jest.mock('react-paragon-topaz', () => ({
  Header: ({ src, logoUrl }) => (
    <div data-testid="header" data-src={src} data-url={logoUrl}>Mock Header</div>
  ),
  Button: () => (
    <div data-testid="button">Button</div>
  ),
  Select: () => (
    <div data-testid="select">Select</div>
  ),
}));

jest.mock('@edx/paragon', () => {
  const actualParagon = jest.requireActual('@edx/paragon');

  return {
    ...actualParagon,
    Container: ({ children }) => <div data-testid="container">{children}</div>,
  };
});

jest.mock('components/TermsConditions', () => function ({ onAccept, onCancel }) {
  return (
    <div data-testid="terms">
      TermsConditions Component
      <button type="button" onClick={onAccept}>Accept</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </div>
  );
});

jest.mock('components/form', () => function MockForm({ onSubmit }) {
  return (
    <div>
      <p>Verify your identity</p>
      <button
        onClick={() => onSubmit({
          firstName: { value: 'John' },
          lastName: { value: 'Doe' },
          email: { value: 'test@example.com' },
          dialingCode: { value: 'United States' },
          phone: { value: '1111111111' },
          address: { value: '123 Main St' },
          apartment: { value: '' },
          city: { value: 'Miami' },
          state: { value: 'FL' },
          postalCode: { value: '12345' },
          country: { value: 'United States of America' },
        })}
        type="button"
      >
        Submit
      </button>
    </div>
  );
});

describe('SchedulePage', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    delete window.location;
    window.location = { href: '' };
  });

  afterAll(() => {
    window.location = originalLocation;
  });

  test('renders the header and terms component initially', () => {
    render(<SchedulePage />);

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('terms')).toBeInTheDocument();
  });

  test('redirects on cancel click', () => {
    render(<SchedulePage />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(window.location.href).toBe('https://www.pearsonvue.com/us/en/itspecialist.html');
  });

  test('renders form component after accepting terms', () => {
    render(<SchedulePage />);

    fireEvent.click(screen.getByText('Accept'));
    expect(screen.queryByTestId('terms')).not.toBeInTheDocument();
    expect(screen.getByText('Verify your identity')).toBeInTheDocument();
  });

  test('calls updateUserData and redirects on successful submit', async () => {
    updateUserData.mockResolvedValue({});

    render(<SchedulePage />);
    fireEvent.click(screen.getByText('Accept'));
    fireEvent.click(screen.getByText('Submit'));

    expect(updateUserData).toHaveBeenCalledWith({
      email: 'test@example.com',
      first_name: 'John',
      last_name: 'Doe',
      postal_code: '12345',
      phone_country_code: '1',
      state: 'FL',
      profile: {
        country: 'United States of America',
        city: 'Miami',
        mailing_address: '123 Main St',
        phone_number: '1111111111',
      },
    });
  });
});
