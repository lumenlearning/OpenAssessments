"use strict";

import React                from "react";
import Messages             from "./common/messages";
import {RouteHandler}       from "react-router";
import BaseComponent        from "./base_component";
import SettingsStore        from "../stores/settings";

var mui          = require('material-ui');
var Colors       = mui.Styles.Colors;
var Typography   = mui.Styles.Typography;
var ThemeManager = new mui.Styles.ThemeManager();

class Index extends BaseComponent {

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

Index.contextTypes = {
  router: React.PropTypes.func
};

Index.childContextTypes = {
  muiTheme: React.PropTypes.object
};

module.exports = Index;