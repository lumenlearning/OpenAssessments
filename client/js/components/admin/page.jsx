"use strict";

import React                from "react";
import Messages             from "../common/messages";
import LeftNav              from "./left_nav";
import {RouteHandler}       from "react-router";
import { AppCanvas, AppBar, IconButton } from "material-ui";

export default React.createClass({

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
  },

  _onMenuIconButtonTouchTap: function() {
    this.refs.leftNav.toggle();
  }

});
