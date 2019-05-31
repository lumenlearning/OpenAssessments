"use strict";

import React          from 'react';
import Router         from 'react-router';
import AdminRoutes    from './routes_admin';
import SettingsAction from './actions/settings';
import AdminActions   from "./actions/admin";

// Include the admin styling
require('../styles/styles_admin.less');

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
SettingsAction.load(window.DEFAULT_SETTINGS);


Router.run(AdminRoutes, (Handler) => {
  return React.render(<Handler />, document.body);
});


// Router.run(routes, (Handler) => {
//   return React.render(<Handler routerState={state} deviceType={deviceType} environment="browser" />, document.body);
// });

// Use the HTML5 history API for cleaner URLs:
// Router.run(routes, Router.HistoryLocation, (Handler) => {
//   return React.render(<Handler/>, document.body);
// });
