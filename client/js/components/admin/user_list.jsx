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
        marginLeft: '10px',
        height: '335px',
        overflow: 'auto',
        padding: "10px",
      },

      menuItemStyle: {
        width: '250px'
      },

      wrapper: {
        display: "inline-block",
        height: "435px"
      },
      buttonStyle: {
        margin: "10px"
      },

      labelStyle: {
        marginBottom: "-10px",
        marginLeft: "15px"
      }
    };

    return (
      <div style={styles.wrapper}>
        <h4 style={styles.labelStyle}>Users</h4>
        <div style={styles.menuStyle} className="menuBox">
          <div style={styles.menuItemStyle}>
            <Menu menuItems={this.props.menuItems} zDepth='2' onItemClick={this.userMenuClicked} />
          </div>
        </div>
        <div style={styles.buttonStyle}>
          <FloatingActionButton onClick={this.deleteButtonClicked}/>
          <FloatingActionButton secondary={true} onClick={this.addButtonClicked}/>
        </div>  
      </div>
    );
  },

  addButtonClicked(){
    // generate an action to add a user
    console.log("ADD BUTTON CLICKED");
  },

  deleteButtonClicked(){
    // Generate action to delete a user
    console.log("DELETE BUTTON CLICKED");
  },

  userMenuClicked (e, index, payload){
    // Generate an action to get display all of the user information from the database.
    var user = {
      currentSelectedUser: {
        name: payload.text,
        email: "test@email.com",
        username: "myUserName",
        role: "Admin",     
      } 
    };

    AdminActions.getCurrentSelectedUser(user);
    console.log("USERMENU BUTTON CLICKED");
  }

  

});