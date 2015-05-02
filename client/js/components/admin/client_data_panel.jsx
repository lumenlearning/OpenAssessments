"use strict";

import React                from "react";
import User                 from "../../stores/user";
import Router               from "react-router";
import { Menu }             from "material-ui";
import AdminActions         from "../../actions/application";
export default React.createClass({
  
  selectClient(e, index, payload){
    // Create action that will get all the users for the client we have clicked on.
    //AdminActions.getUserData(payload);

    var num = Math.random();
    var user = "USER: " + num;
    console.log(user);
    var menuItems = [
        {payload: '0', text: user, data: "Atomic Jolt"},
        {payload: '1', text: "Other User", data: "Atomic Jolt"},
        {payload: '2', text: "Some Guy", data: "Atomic Jolt"},
        {payload: '3', text: "Some Other Guy", data: "Atomic Jolt"},
        {payload: '4', text: "Some Girl", data: "Atomic Jolt"},
        {payload: '5', text: "Me again", data: "Atomic Jolt"},
        {payload: '6', text: "An old man", data: "Atomic Jolt"},
        {payload: '7', text: "Crazy Person", data: "Atomic Jolt"}
      ];

    AdminActions.getUserData({userList: menuItems});
  },

  render: function() {
    
    var styles = {
      menuStyle: {
        width: '300px',
        marginLeft: '10px',
        height: '435px',
        overflow: 'auto',
        padding: "10px",
        display: "inline-block"
      },
      menuItemStyle: {
        width: '250px'
      }
    };

    return (
      <div style={styles.menuStyle} className="menuBox">
        <div style={styles.menuItemStyle}>
          <Menu menuItems={this.props.menuItems} zDepth='2' onItemClick={this.selectClient}/>
        </div>
      </div>
    );
  },

  

});