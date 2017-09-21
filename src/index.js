import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
// Stylesheets
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import './assets/stylesheets/application.scss'

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
