import React from 'react';
import { render } from 'react-dom';
import { IntlProvider } from 'react-intl';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import WebFont from 'webfontloader';

import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import { BrowserRouter as Router } from 'react-router-dom';

import {StripeProvider} from 'react-stripe-elements';
import ReactGA from 'react-ga';

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

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_TRACKING_ID); // Initialize Google Analytics

render(
  (<IntlProvider locale={locale} messages={messages}>
    <LocaleProvider locale={enUS}>
      <StripeProvider apiKey={ process.env.REACT_APP_STRIPE_API_KEY }>
        <Router onUpdate={ () => { console.log(window.location.hash); ReactGA.pageview(window.location.hash); } }>
          <App />
        </Router>
      </StripeProvider>
    </LocaleProvider>
  </IntlProvider>),
  document.getElementById('root')
);

registerServiceWorker();
