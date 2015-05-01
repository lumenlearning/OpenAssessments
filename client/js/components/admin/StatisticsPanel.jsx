"use strict";

import React                from "react";
import User                 from "../../stores/user";
import StoreKeeper          from "../mixins/store_keeper";
import Router               from "react-router";
import { Menu }             from "material-ui";

export default React.createClass({
 
  render: function() {
    // Some function here that will get all of the users from the db and store them in an object
      let menuItems = [
        {payload: '0', text: "Statistics", data: "Atomic Jolt"},
        {payload: '1', text: "Statistics", data: "Atomic Jolt"},
        {payload: '2', text: "Statistics", data: "Atomic Jolt"},
        {payload: '3', text: "Statistics", data: "Atomic Jolt"},
        {payload: '4', text: "Statistics", data: "Atomic Jolt"},
        {payload: '5', text: "Statistics", data: "Atomic Jolt"},
        {payload: '6', text: "Statistics", data: "Atomic Jolt"},
        {payload: '7', text: "Statistics", data: "Atomic Jolt"}
      ];

      let styles = {
        menuStyle: {
          width: '300px',
          marginLeft: '10px',
          height: '435px',
          overflow: 'auto',
          padding: "10px"
        },
        menuItemStyle: {
          width: '250px'
        }
      };

    return (
      <div style={styles.menuStyle} className="menuBox">
        <div style={styles.menuItemStyle}>
          <Menu menuItems={menuItems} zDepth='2'/>
        </div>
      </div>
    );
  },

  

});