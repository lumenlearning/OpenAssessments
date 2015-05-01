"use strict";

import React                from "react";
import User                 from "../../stores/user";
import StoreKeeper          from "../mixins/store_keeper";
import Router               from "react-router";
import { LeftNav }          from "material-ui";

export default React.createClass({

  mixins: [StoreKeeper, Router.Navigation],

  statics: {
    stores: [User],    // Subscribe to changes in the messages store
    getState: () => {  // Method to retrieve state from stores

      

      let menuItems = [
        { route: 'home', text: 'Home' }
      ];

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

  

});
