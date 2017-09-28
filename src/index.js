import React from 'react';
import { render } from 'react-dom';
import { IntlProvider } from 'react-intl';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import WebFont from 'webfontloader';

import acceptLanguage from 'accept-language';
import Cookies from "universal-cookie";

// Stylesheets
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import './assets/stylesheets/application.scss'

// Translated strings
import localeData from './locales/locales.json';

acceptLanguage.languages(['en']); // Add more languages later on

const cookies = new Cookies();
const language = cookies.get('userLocale') || ((navigator.languages && navigator.languages[0]) ||
                     navigator.language ||
                     navigator.userLanguage);

const messages = localeData[language] || localeData.en;
const locale = acceptLanguage.get(language);

WebFont.load({
  google: {
    families: ['Roboto:300,400,500,700', 'sans-serif']
  }
});

render(
  <IntlProvider locale={locale} messages={messages}>
    <App />
  </IntlProvider>,
  document.getElementById('root')
);

registerServiceWorker();
