"use strict";

import React                from "react";
import Messages             from "../common/messages";
import LeftNav              from "./left_nav";
import {RouteHandler}       from "react-router";
import AdminTheme           from "./admin_theme";
import Defines              from "../defines";

var mui = require('material-ui');
var Typography = mui.Styles.Typography;
var ThemeManager = new mui.Styles.ThemeManager();
var { AppCanvas, AppBar, IconButton, FullWidthSection } = mui;

var { Spacing } = mui.Styles;
var { StyleResizable } = mui.Mixins;

class Page extends React.Component {

  constructor() {
    super();
    ThemeManager.setTheme(AdminTheme);
    this._onMenuIconButtonTouchTap = this._onMenuIconButtonTouchTap.bind(this);
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }

  _onMenuIconButtonTouchTap() {
    this.refs.leftNav.toggle();
  }

  getStyles(){
    var styles = {
      root: {
        paddingTop: Spacing.desktopKeylineIncrement + 'px'
      },
      content: {
        boxSizing: 'border-box',
        padding: Spacing.desktopGutter + 'px'
      },
      a: {
        color: Defines.colors.grey
      },
      p: {
        margin: "0 auto",
        padding: "0",
        color: Defines.colors.white,
        maxWidth: "335px"
      },
      appBar: {
        position: "relative"
      }
    };

    return styles;
  }

  render(){

    var styles = this.getStyles();
    var title = "Admin";

    return <AppCanvas predefinedLayout={1}>
        <AppBar
          onLeftIconButtonTouchTap={(e) => this._onMenuIconButtonTouchTap(e)}
          title={title}
          zDepth={0}
          style={styles.appBar} />
        <LeftNav ref="leftNav" />
        <div style={styles.root}>
          <Messages />
          <div style={styles.content}>
            <RouteHandler />
          </div>
        </div>
      </AppCanvas>;
  }
}

Page.contextTypes = {
  router: React.PropTypes.func
};

Page.childContextTypes = {
  muiTheme: React.PropTypes.object
};

module.exports = Page;
