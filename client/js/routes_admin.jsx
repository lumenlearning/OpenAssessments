"use strict";
import React            from 'react';
import Router           from 'react-router';

import AdminPage        from './components/admin/page';
import Login            from './components/admin/login';
import AdminDashboard   from './components/admin/dashboard';
import Account          from './components/admin/account';

var Route         = Router.Route;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute  = Router.DefaultRoute;
var Redirect      = Router.Redirect;

var adminRoutes = (
  <Route handler={AdminPage}>
  	<DefaultRoute name="dashboard" handler={AdminDashboard}/>
    <Route name="account" path="/account/:accountId" handler={Account}/>
  </Route>
);
module.exports = adminRoutes;