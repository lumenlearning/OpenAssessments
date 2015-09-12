"use strict";

import React              from 'react';
import Router             from 'react-router';
import Index              from './components/index';
import Assessment         from './components/main/assessment';
import Start              from './components/main/start';
import Attempts           from './components/main/attempts';
import AssessmentResult   from './components/main/assessment_result';
import Login              from './components/sessions/login';
import Logout             from './components/sessions/logout';
import Register           from './components/users/register';
import NotFound           from './components/not_found';
import About              from './components/main/about';
// For IE Promise support
require('es6-promise').polyfill();

var Route         = Router.Route;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute  = Router.DefaultRoute;
var Redirect      = Router.Redirect;

var routes = (
  <Route handler={Index}>
    <DefaultRoute name="start" handler={Start} />
    <Route name="assessment" handler={Assessment}/>
    <Route name="assessment-result" handler={AssessmentResult}/>
    <Route name="login" handler={Login}/>
    <Route name="register" handler={Register}/>
    <Route name="logout" handler={Logout}/>
    <Route name="about" handler={About}/>
    <Route name="attempts" handler={Attempts} path="attempts/:assessmentId/:contextId" />
    <NotFoundRoute handler={NotFound}/>
  </Route>
);

module.exports = routes;
