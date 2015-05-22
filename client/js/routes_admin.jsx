"use strict";
import React              from 'react';
import Router             from 'react-router';
import AdminPage          from './components/admin/page';
import Login              from './components/admin/login';
import AccountSelection   from './components/admin/account_selection';
import AccountDashboard   from './components/admin/account_dashboard';
import UsersList          from './components/admin/users_list';
import Logout             from './components/admin/logout';

var Route         = Router.Route;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute  = Router.DefaultRoute;
var Redirect      = Router.Redirect;

var adminRoutes = (
  <Route handler={AdminPage}>
    <DefaultRoute name="dashboard" handler={AccountSelection}/>
  	<Route name="login" handler={Login}/>
    <Route name="account" path="/account/:accountId" handler={Account}/>
    <Route name="account" path="/account/:accountId" handler={AccountDashboard}/>
    <Route name="users-list" path="/users/:accountId" handler={UsersList}/>
    <Route name="logout" path="/logout/" handler={Logout}/>
  </Route>
);
module.exports = adminRoutes;
