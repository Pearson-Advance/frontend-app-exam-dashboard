/* eslint-disable global-require */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom';

jest.mock('@edx/frontend-platform/react', () => {
  const React = require('react');

  return {
    AppContext: React.createContext({
      authenticatedUser: null,
      config: {},
    }),
  };
});

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({
    WEBNG_PLUGIN_API_BASE_URL: 'https://test.api',
    EXAM_DASHBOARD_PATH: '/schedule',
    LOGO_URL: 'logo.png',
    LMS_BASE_URL: 'https://lms.example.com',
  })),
  ensureConfig: jest.fn(),
  subscribe: jest.fn(),
}));
