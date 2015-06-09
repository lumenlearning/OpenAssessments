"use strict";

import React             from 'react';
import Router            from 'react-router';
import Routes            from './routes';
import SettingsActions   from './actions/settings';
import AssessmentActions from "./actions/assessment";
import $                 from "jquery";

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();


// Set a device type based on window width, so that we can write media queries in javascript
// by calling if (this.props.deviceType === "mobile")
var deviceType;

if (window.matchMedia("(max-width: 639px)").matches){
  deviceType = "mobile";
} else if (window.matchMedia("(max-width: 768px)").matches){
  deviceType = "tablet";
} else {
  deviceType = "desktop";
}

// Initialize store singletons
SettingsActions.load(window.DEFAULT_SETTINGS);
AssessmentActions.loadAssessment(window.DEFAULT_SETTINGS, $('#srcData').text());

Router.run(Routes, (Handler, state) => {
  var params = state.params;
  return React.render(<Handler params={params} />, document.getElementById('assessment-container'));
});

// Router.run(routes, (Handler) => {
//   return React.render(<Handler routerState={state} deviceType={deviceType} environment="browser" />, document.body);
// });

// Use the HTML5 history API for cleaner URLs:
// Router.run(routes, Router.HistoryLocation, (Handler) => {
//   return React.render(<Handler/>, document.body);
// });