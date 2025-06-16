import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from 'components/Footer';
import '@testing-library/jest-dom';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({
    FOOTER_PRIVACY_POLICY_LINK: 'https://example.com/privacy',
    FOOTER_TERMS_OF_SERVICE_LINK: 'https://example.com/terms',
  })),
}));

describe('Footer component', () => {
  test('renders privacy and terms links with correct hrefs', () => {
    render(<Footer />);

    const privacyLink = screen.getByRole('link', { name: /privacy policy/i });
    const termsLink = screen.getByRole('link', { name: /terms of service/i });

    expect(privacyLink).toHaveAttribute('href', 'https://example.com/privacy');
    expect(termsLink).toHaveAttribute('href', 'https://example.com/terms');
  });

  test('renders the current year in the copyright', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(
        new RegExp(`Copyright ${currentYear} Pearson Education`, 'i'),
      ),
    ).toBeInTheDocument();
  });
});
