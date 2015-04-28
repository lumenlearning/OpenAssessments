"use strict";

import React                from "react";
import Messages             from "./common/messages";
import {RouteHandler}       from "react-router";

export default React.createClass({

  render(){
    return (
      <RouteHandler {...this.props} />
    );
  }

});