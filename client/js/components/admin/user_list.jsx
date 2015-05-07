"use strict";

import React                                      from "react";
import User                                       from "../../stores/user";
import StoreKeeper                                from "../mixins/store_keeper";
import Router                                     from "react-router";
import { Menu,FloatingActionButton }              from "material-ui";
import AdminActions                               from "../../actions/admin";


export default React.createClass({
 
  

  render() {

    var styles = {
      
      menuStyle: {
        width: '300px',
        height: '435px',
        overflow: 'auto',
        padding: "10px",
      },

      menuItemStyle: {
        width: '250px'
      },
    };

    return (
      <div style={styles.menuStyle} className="menuBox">
        <div style={styles.menuItemStyle}>
          <Menu menuItems={this.props.menuItems} zDepth={2} onItemClick={this.userMenuClicked} />
        </div>
      </div>  
    );
  },

  userMenuClicked (e, index, payload){
    // Generate an action to get display all of the user information from the database.
    var user = {
      currentSelectedUser: {
        name: payload.text,
        email: payload.data,
        role: (payload.email == 1) ? "Admin" : "End User",     
      } 
    };

    AdminActions.setCurrentSelectedUser(user);
  }

  

});