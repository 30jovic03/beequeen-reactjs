import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'jquery/dist/jquery.js';
import 'popper.js/dist/popper.js';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import { HashRouter, Route, Switch } from 'react-router-dom';
import HomePage from './components/HomePage';
import AdministratorDashboard from './components/AdministratorDashboard';
import AdministratorDashboardCategory from './components/AdministratorDashboardCategory';

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
    <Switch>
        <Route exact path="/" component={ HomePage } />
        <Route exact path="/administrator/dashboard" component={ AdministratorDashboard } />
        <Route path="/administrator/dashboard/category" component={ AdministratorDashboardCategory } />
      </Switch>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
