"use strict";
import React              from 'react';
import Router             from 'react-router';
import AccountsList       from './components/admin/accounts_list';
import AdminPage          from './components/admin/page';
import Login              from './components/admin/login';
import AccountDashboard   from './components/admin/account_dashboard';
import UsersList          from './components/admin/users';
import Logout             from './components/admin/logout';

var Route         = Router.Route;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute  = Router.DefaultRoute;
var Redirect      = Router.Redirect;

var adminRoutes = (
  <Route name="root" path="/" handler={AdminPage}>
    <DefaultRoute name="login" handler={Login}/>
  	<Route name="home" handler={AccountsList}/>
    <Route name="account" path="/account/:accountId" handler={AccountDashboard}/>
    <Route name="users" path="/users/:accountId" handler={UsersList}/>
    <Route name="logout" path="/logout/" handler={Logout}/>
  </Route>
);
module.exports = adminRoutes;
