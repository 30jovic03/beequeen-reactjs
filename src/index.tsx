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
import CategoryPage from './components/CategoryPage';
import ArticlePage from './components/ArticlePage';
import UserSignup from './components/UserSignup';
import { AuthProvider } from './firebase/AuthContext';
import UserLogin from './components/UserLogin';
import MyPage from './components/MyPage';
import AdministratorLogin from './components/AdministratorLogin';
import About from './components/About';
import Contact from './components/Contact';
import AdministratorDashboardOrder from './components/AdministratorDashboardOrder';
import UpdateProfile from './components/UpdateProfile';
import ForgotPassword from './components/ForgotPassword';

ReactDOM.render(
  <React.StrictMode>
    <div id="body">
      <div className="left-img">
        <img src="https://firebasestorage.googleapis.com/v0/b/bee-queen.appspot.com/o/side-bees.png?alt=media&token=f29ff9bb-4561-487d-b0b3-28cd348e0cef" alt="bee" />
      </div>
      <div className="right-img">
        <img src="https://firebasestorage.googleapis.com/v0/b/bee-queen.appspot.com/o/side-bees.png?alt=media&token=f29ff9bb-4561-487d-b0b3-28cd348e0cef" alt="bee" />
      </div>
      <div id="logo">
        <img src="https://firebasestorage.googleapis.com/v0/b/bee-queen.appspot.com/o/logo.png?alt=media&token=3f761ab0-d406-4327-8154-74f3ebabd37a" alt="bee" />
        <h4>BeeQueen<br/>web shop</h4>
      </div>
      <div id="natural">
        <img src="https://firebasestorage.googleapis.com/v0/b/bee-queen.appspot.com/o/natural.png?alt=media&token=55134bd4-cfbc-4793-9bb3-b390c9b2b52f" alt="natural" />
      </div>
      <div className="component">
      <HashRouter>
        <AuthProvider>
          <Switch>
            <Route exact path="/" component={ HomePage } />
            <Route path="/about" component={About} />
            <Route path="/contact" component={Contact} />
            <Route path="/signup" component={UserSignup} />
            <Route path="/login" component={UserLogin} />
            <Route path="/my-page" component={MyPage} />
            <Route path="/update-profile" component={UpdateProfile} />
            <Route path="/forgot-password" component={ForgotPassword} />
            <Route path="/category/:cId" component={ CategoryPage } />
            <Route path="/article/:aId" component={ ArticlePage } />
            <Route path="/admin-login" component={ AdministratorLogin } />
            <Route exact path="/administrator/dashboard" component={ AdministratorDashboard } />
            <Route path="/administrator/dashboard/category" component={ AdministratorDashboardCategory } />
            <Route path="/administrator/dashboard/feature/:cId" component={ AdministratorDashboardFeature } />
            <Route path="/administrator/dashboard/article" component={ AdministratorDashboardArticle } />
            <Route path="/administrator/dashboard/order" component={ AdministratorDashboardOrder } />
          </Switch>
        </AuthProvider>
      </HashRouter>
      </div>
      
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
