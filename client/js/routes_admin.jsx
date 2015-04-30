"use strict";
import React            from 'react';
import Router           from 'react-router';

import AdminPage        from './components/admin/page';
import Login            from './components/admin/adminLogin';
import AdminDashboard   from './components/admin/adminDashboard'

var Route         = Router.Route;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute  = Router.DefaultRoute;
var Redirect      = Router.Redirect;

var adminRoutes = (
  <Route handler={AdminPage}>
  	<DefaultRoute name="dashboard" handler={AdminDashboard}/>
  </Route>
);
module.exports = adminRoutes;