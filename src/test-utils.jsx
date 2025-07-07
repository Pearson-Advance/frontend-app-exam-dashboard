import React from 'react';
import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

const AllTheProviders = ({ children }) => (
  <IntlProvider locale="en">
    {children}
  </IntlProvider>
);

const customRender = (ui, options = {}) => render(ui, { wrapper: AllTheProviders, ...options });

export { customRender as render };
