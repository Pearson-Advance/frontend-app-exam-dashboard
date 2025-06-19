/* eslint-disable func-names, react/prop-types */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import SchedulePage from 'features/SchedulePage';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: () => ({
    LOGO_URL: 'logo.png',
    LMS_BASE_URL: 'https://lms.example.com',
  }),
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
});
