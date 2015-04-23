"use strict";

import React                from "react";
import Messages             from "../common/messages";
import {RouteHandler}       from "react-router";
import { AppCanvas, AppBar, IconButton } from "material-ui";
import LeftNav              from "./adminLeftNav";
export default React.createClass({

  render(){
    return (
      <AppCanvas predefinedLayout={1}>
        
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

});