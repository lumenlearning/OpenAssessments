"use strict";

import React                from "react";
import Messages             from "./common/messages";
import LeftNav              from "./layout/left_nav";
import {RouteHandler}       from "react-router";
import { AppCanvas, AppBar, IconButton } from "material-ui";

export default React.createClass({

  render(){

    return (
      <div>
        <h1>Canvas Starter App</h1>
        <RouteHandler />
        <div className="footer">
          <p>
            Built by <a href="http://www.atomicjolt.com">Atomic Jolt</a>.
          </p>
        </div>
      </div>
    );
  }

});
