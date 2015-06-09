"use strict";

import React                from "react";
import UserStore            from "../../stores/user";
import BaseComponent        from "../base_component";
import Router               from "react-router";
import { LeftNav }          from "material-ui";

class LeftNavigation extends BaseComponent {

  constructor() {
    super();

    this.stores = [UserStore];
    this.state = this.getState();

    this._bind("_getSelectedIndex", "toggle", "_onLeftNavChange");
    this.selectedIndex = null;
  }

  getState(){
    var loggedIn = UserStore.loggedIn();

    var menuItems = [
      // { route: 'home', text: 'Home' }
    ];

    if(loggedIn){
      menuItems.push({ route: 'dashboard', text: 'Dashboard' });
      menuItems.push({ route: 'logout', text: 'Logout' });
    } else {
      menuItems.push({ route: 'login', text: 'Sign In' });
    }

    return {
      menuItems: menuItems
    };
  }

  _getSelectedIndex() {
    var currentItem;

    for (var i = this.state.menuItems.length - 1; i >= 0; i--) {
      currentItem = this.state.menuItems[i];
      if (currentItem.route && this.context.router.isActive(currentItem.route)) return i;
    }
  }

  toggle() {
    this.refs.leftNav.toggle();
  }

  _onLeftNavChange(e, key, payload) {
    this.context.router.transitionTo(payload.route);
  }

  getStyles() {
    return {
      logoStyle: {
        marginTop: '20px'
      }
    };
  }

  render() {

    var styles = this.getStyles();

    var header = <div style={styles.logoStyle} className="logo">Home</div>;

    return (
      <LeftNav
        ref="leftNav"
        docked={false}
        isInitiallyOpen={false}
        header={header}
        menuItems={this.state.menuItems}
        selectedIndex={this._getSelectedIndex()}
        onChange={(e, key, payload) => this._onLeftNavChange(e, key, payload)} />
    );
  }

}

LeftNavigation.contextTypes = {
  router: React.PropTypes.func.isRequired
};

module.exports = LeftNavigation;
