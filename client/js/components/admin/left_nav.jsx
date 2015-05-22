"use strict";

import React                from "react";
import User                 from "../../stores/user";
import StoreKeeper          from "../mixins/store_keeper";
import Router               from "react-router";
import { LeftNav }          from "material-ui";

export default React.createClass({

  mixins: [StoreKeeper],

  contextTypes: {
    router: React.PropTypes.func
  },

  statics: {
    stores: [User],    // Subscribe to changes in the messages store
    getState: () => {  // Method to retrieve state from stores

      var loggedIn = User.loggedIn();

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
  },

  getInitialState: function() {
    return {
      selectedIndex: null
    };
  },

  render: function() {

    var styles = {
      logoStyle: {
        marginTop: '20px',
      }
    };

    var header = <div style={styles.logoStyle} className="logo">Home</div>;

    return (
      <LeftNav
        ref="leftNav"
        docked={false}
        isInitiallyOpen={false}
        header={header}
        menuItems={this.state.menuItems}
        selectedIndex={this._getSelectedIndex()}
        onChange={this._onLeftNavChange} />
    );
  },

  _getSelectedIndex: function() {
    var currentItem;

    for (var i = this.state.menuItems.length - 1; i >= 0; i--) {
      currentItem = this.state.menuItems[i];
      if (currentItem.route && this.context.router.isActive(currentItem.route)) return i;
    }
  },

  toggle: function() {
    this.refs.leftNav.toggle();
  },

  _onLeftNavChange: function(e, key, payload) {
    this.context.router.transitionTo(payload.route);
  }

});
