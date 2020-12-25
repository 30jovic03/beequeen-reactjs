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
import AdministratorDashboardFeature from './components/AdministratorDashboardFeature';
import AdministratorDashboardArticle from './components/AdministratorDashboardArticle';
import { Row } from 'react-bootstrap';

ReactDOM.render(
  <React.StrictMode>
    <div id="body">
      <HashRouter>
        <Switch>
          <Route exact path="/" component={ HomePage } />
          <Route exact path="/administrator/dashboard" component={ AdministratorDashboard } />
          <Route path="/administrator/dashboard/category" component={ AdministratorDashboardCategory } />
          <Route path="/administrator/dashboard/feature/:cId" component={ AdministratorDashboardFeature } />
          <Route path="/administrator/dashboard/article" component={ AdministratorDashboardArticle } />
        </Switch>
      </HashRouter>
      <div className="left-img">
        <img src="https://firebasestorage.googleapis.com/v0/b/bee-queen.appspot.com/o/side-bees.png?alt=media&token=f29ff9bb-4561-487d-b0b3-28cd348e0cef" alt="bee" />
      </div>
      <div className="right-img">
        <img src="https://firebasestorage.googleapis.com/v0/b/bee-queen.appspot.com/o/side-bees.png?alt=media&token=f29ff9bb-4561-487d-b0b3-28cd348e0cef" alt="bee" />
      </div>
      <div id="logo">
        <Row>
          <h5>BeeQueen<br/>web shop</h5>
          <img src="https://firebasestorage.googleapis.com/v0/b/bee-queen.appspot.com/o/logo.png?alt=media&token=762dd280-126c-4733-b7c1-22d45bc52e08" alt="bee" />
        </Row>
      </div>
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
