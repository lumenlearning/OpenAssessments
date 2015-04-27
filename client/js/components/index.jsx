"use strict";

import React                from "react";
import Messages             from "./common/messages";
import {RouteHandler}       from "react-router";

export default React.createClass({

  render(){

    var style = Settings.style();
    if(style){
      $('head').append('<link href="' + style + '" media="all" rel="stylesheet">');
    }

    return (
      <RouteHandler {...this.props} />
    );
  }

});
