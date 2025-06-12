import 'core-js/stable';
import 'regenerator-runtime/runtime';

import {
  APP_INIT_ERROR, APP_READY, subscribe, initialize,
} from '@edx/frontend-platform';
import { AppProvider, ErrorPage } from '@edx/frontend-platform/react';
import ReactDOM from 'react-dom';

<<<<<<< HEAD
import Header from '@edx/frontend-component-header';
import FooterSlot from '@openedx/frontend-slot-footer';
import messages from './i18n';
import App from './components';
=======
import Header, { messages as headerMessages } from '@edx/frontend-component-header';
import Footer, { messages as footerMessages } from '@edx/frontend-component-footer';

import appMessages from './i18n';
import ExamplePage from './example/ExamplePage';

>>>>>>> vue/reset-olive-version
import './index.scss';

subscribe(APP_READY, () => {
  ReactDOM.render(
    <AppProvider>
      <Header />
<<<<<<< HEAD
      <App />
      <FooterSlot />
=======
      <ExamplePage />
      <Footer />
>>>>>>> vue/reset-olive-version
    </AppProvider>,
    document.getElementById('root'),
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  ReactDOM.render(<ErrorPage message={error.message} />, document.getElementById('root'));
});

initialize({
<<<<<<< HEAD
  messages,
=======
  messages: [
    appMessages,
    headerMessages,
    footerMessages,
  ],
>>>>>>> vue/reset-olive-version
});
