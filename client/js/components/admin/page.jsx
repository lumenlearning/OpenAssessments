"use strict";

import React                from "react";
import Messages             from "../common/messages";
import LeftNav              from "./left_nav";
import {RouteHandler}       from "react-router";
//import { AppCanvas, AppBar, IconButton } from "material-ui";

var mui = require('material-ui');
var Colors = mui.Styles.Colors;
var Typography = mui.Styles.Typography;
var ThemeManager = new mui.Styles.ThemeManager();
var { AppCanvas, AppBar, IconButton } = mui;

class Page extends React.Component {

  constructor() {
    super();
    this._onMenuIconButtonTouchTap = this._onMenuIconButtonTouchTap.bind(this);
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

    var title = "Admin";

    var githubButton = (
      <IconButton
        className="github-icon-button"
        iconClassName="muidocs-icon-custom-github"
        href="https://github.com/atomicjolt/canvas_starter_app"
        linkButton={true} />
    );

    return (
      <AppCanvas predefinedLayout={1}>

        <AppBar
          className="mui-dark-theme"
          onMenuIconButtonTouchTap={this._onMenuIconButtonTouchTap}
          title={title}
          zDepth={1}>
          {githubButton}
        </AppBar>

        <LeftNav ref="leftNav" />

        <div className="mui-app-content-canvas page-with-nav">
          <Messages/>
          <div className="page-with-nav-content">
            <RouteHandler />
          </div>
        </div>
      </AppCanvas>

    );
  }

  _onMenuIconButtonTouchTap() {
    this.refs.leftNav.toggle();
  }

}

Page.contextTypes = {
  router: React.PropTypes.func
};

Page.childContextTypes = {
  muiTheme: React.PropTypes.object
};

module.exports = Page;