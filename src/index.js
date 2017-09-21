import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import WebFont from 'webfontloader';

// Stylesheets
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import './assets/stylesheets/application.scss'

WebFont.load({
  google: {
    families: ['Roboto:300,400,500,700', 'sans-serif']
  }
});

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
