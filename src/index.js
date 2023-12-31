import React from 'react';
import { render } from 'react-dom';
import { IntlProvider } from 'react-intl';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import WebFont from 'webfontloader';
import createHistory from 'history/createBrowserHistory';

import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import { Router } from 'react-router-dom';

import {StripeProvider} from 'react-stripe-elements';

// Stylesheets
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import './assets/stylesheets/application.scss';

// Translated strings
import localeData from './locales/locales.json';

const messages = localeData.en;
const history = createHistory();

WebFont.load({
  google: {
    families: ['Roboto:300,400,500,700', 'sans-serif']
  }
});

render(
  (<IntlProvider locale={'en'} messages={messages}>
    <LocaleProvider locale={enUS}>
      <StripeProvider apiKey={ process.env.REACT_APP_STRIPE_API_KEY }>
        <Router history={ history }>
          <App />
        </Router>
      </StripeProvider>
    </LocaleProvider>
  </IntlProvider>),
  document.getElementById('root')
);

registerServiceWorker();
