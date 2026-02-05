import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import {
  APP_INIT_ERROR, APP_READY, subscribe, initialize,
} from '@edx/frontend-platform';
import { AppProvider, ErrorPage } from '@edx/frontend-platform/react';
import { IntlProvider } from 'react-intl';

import Main from 'features/Main';

import appMessages from './i18n';

import './index.scss';

const container = document.getElementById('root');
const root = createRoot(container);

subscribe(APP_READY, () => {
  root.render(
    <StrictMode>
      <IntlProvider locale="en">
        <AppProvider>
          <Main />
        </AppProvider>
      </IntlProvider>
    </StrictMode>,
    document.getElementById('root'),
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  root.render(<ErrorPage message={error.message} />);
});

initialize({
  messages: [
    appMessages,
  ],
  requireAuthenticatedUser: true,
});
