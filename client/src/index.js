import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import 'moment/locale/hu';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
moment.locale('hu');

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
