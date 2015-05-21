"use strict";

import React                from "react";
import Messages             from "./common/messages";
import {RouteHandler}       from "react-router";
import BaseComponent        from "./base_component";
import SettingsStore        from "../stores/settings";

export default class Index extends BaseComponent{

  constructor(){
    super();
    this.stores = [SettingsStore];
    this.state = this.getState();
  }

  getState(){
    return {
      settings: SettingsStore.current()
    }
  }

  componentDidMount(){  
    super.componentDidMount();
    var style = this.state.settings.style;
    if(style && style.indexOf('.css') < 0){
      style = '/assets/themes/' + style + '.css?body=1';
      $('head').append('<link href="' + style + '" media="all" rel="stylesheet">');
    }
  }

  render(){
    return (
      <RouteHandler {...this.props} />
    );
  }

}