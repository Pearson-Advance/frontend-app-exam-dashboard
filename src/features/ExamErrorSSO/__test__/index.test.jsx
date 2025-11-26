import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import { MemoryRouter, useHistory } from 'react-router-dom';
import '@testing-library/jest-dom';

import {
  ERROR_CODES,
  ERROR_MESSAGES,
  WORKFLOWS,
  REDIRECT_URLS,
  BUTTON_LABELS,
  BUTTON_LABELS_MAP,
} from 'features/utils/constants';

import ExamErrorSSO from 'features/ExamErrorSSO';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: jest.fn(),
}));

const renderWithQuery = (query = '') => {
  const initialRoute = `/error${query}`;

  const wrapper = ({ children }) => (
    <MemoryRouter initialEntries={[initialRoute]}>
      {children}
    </MemoryRouter>
  );

  render(<ExamErrorSSO />, { wrapper });
};

describe('ExamErrorSSO', () => {
  test('renders generic error message when no errorCode is provided', () => {
    renderWithQuery();
    expect(screen.getByText(ERROR_MESSAGES[ERROR_CODES.GENERIC])).toBeInTheDocument();
  });

  test('renders the correct message for a known error code', () => {
    renderWithQuery(`?s=${ERROR_CODES.INVALID_PAYLOAD}`);
    expect(screen.getByText(ERROR_MESSAGES[ERROR_CODES.INVALID_PAYLOAD])).toBeInTheDocument();
  });

  test('falls back to generic message when errorCode is unknown', () => {
    renderWithQuery('?s=UNKNOWN');
    expect(screen.getByText(ERROR_MESSAGES[ERROR_CODES.GENERIC])).toBeInTheDocument();
  });

  test('renders passthrough button label when workflow is passthrough', () => {
    renderWithQuery(`?w=${WORKFLOWS.PASSTHROUGH}`);
    expect(screen.getByRole('button')).toHaveTextContent(
      BUTTON_LABELS_MAP[WORKFLOWS.PASSTHROUGH],
    );
  });

  test('renders dashboard label when workflow is dashboard', () => {
    renderWithQuery(`?w=${WORKFLOWS.DASHBOARD}`);
    expect(screen.getByRole('button')).toHaveTextContent(
      BUTTON_LABELS_MAP[WORKFLOWS.DASHBOARD],
    );
  });

  test('falls back to default dashboard label when workflow is invalid', () => {
    renderWithQuery('?w=invalid');
    expect(screen.getByRole('button')).toHaveTextContent(BUTTON_LABELS.DASHBOARD);
  });

  test('redirects to IT Specialist when workflow is passthrough', () => {
    delete window.location;
    window.location = { href: '' };

    renderWithQuery(`?w=${WORKFLOWS.PASSTHROUGH}`);
    fireEvent.click(screen.getByRole('button'));

    expect(window.location.href).toBe(REDIRECT_URLS.IT_SPECIALIST);
  });

  test('redirects to dashboard when workflow is dashboard', () => {
    const pushMock = jest.fn();
    useHistory.mockReturnValue({ push: pushMock });

    renderWithQuery(`?w=${WORKFLOWS.DASHBOARD}`);
    fireEvent.click(screen.getByRole('button'));

    expect(pushMock).toHaveBeenCalledWith(REDIRECT_URLS.DASHBOARD);
  });

  test('redirects to home when workflow is invalid', () => {
    const pushMock = jest.fn();
    useHistory.mockReturnValue({ push: pushMock });

    renderWithQuery('?w=invalid');
    fireEvent.click(screen.getByRole('button'));

    expect(pushMock).toHaveBeenCalledWith(REDIRECT_URLS.HOME);
  });
});
