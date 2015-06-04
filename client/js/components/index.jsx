"use strict";

import React                from "react";
import Messages             from "./common/messages";
import LeftNav              from "./layout/left_nav";
import {RouteHandler}       from "react-router";

var mui = require('material-ui');
var Colors = mui.Styles.Colors;
var Typography = mui.Styles.Typography;
var ThemeManager = new mui.Styles.ThemeManager();

var { AppBar, AppCanvas, Menu, IconButton } = mui;

class Index extends React.Component {

  constructor() {
    super();
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    }
  }

  getStyles() {
    var darkWhite = Colors.darkWhite;
    return {
      footer: {
        backgroundColor: Colors.grey900,
        textAlign: 'center'
      },
      a: {
        color: darkWhite
      },
      p: {
        margin: '0 auto',
        padding: '0',
        color: Colors.lightWhite,
        maxWidth: '335px'
      },
      iconButton: {
        color: darkWhite
      }
    };
  }

  render(){

    return (
      <AppCanvas predefinedLayout={1}>
        <h1>Canvas Starter App</h1>
        <RouteHandler />
        <div className="footer">
          <p>
            Built by <a href="http://www.atomicjolt.com">Atomic Jolt</a>.
          </p>
        </div>
      </AppCanvas>
    );
  }

}

Index.contextTypes = {
  router: React.PropTypes.func
};

Index.childContextTypes = {
  muiTheme: React.PropTypes.object
};

module.exports = Index;