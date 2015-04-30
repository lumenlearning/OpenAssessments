"use strict";

import React                from "react";
import User                 from "../../stores/user";
import StoreKeeper          from "../mixins/store_keeper";
import Router               from "react-router";
import { Menu }             from "material-ui";


export default React.createClass({
 
  getInitialState(){
      
  },

  render() {
    // Some function here that will get all of the users from the db and store them in an object
      var menuItems = [
        {payload: '0', text: "Joseph Ditton", data: "Atomic Jolt"},
        {payload: '1', text: "Other User", data: "Atomic Jolt"},
        {payload: '2', text: "Some Guy", data: "Atomic Jolt"},
        {payload: '3', text: "Some Other Guy", data: "Atomic Jolt"},
        {payload: '4', text: "Some Girl", data: "Atomic Jolt"},
        {payload: '5', text: "Me again", data: "Atomic Jolt"},
        {payload: '6', text: "An old man", data: "Atomic Jolt"},
        {payload: '7', text: "Crazy Person", data: "Atomic Jolt"}
      ];

      var styles = {
        menuStyle: {
          width: '300px',
          marginLeft: '10px',
          height: '435px',
          overflow: 'auto',
          padding: "10px",
        
        },
        menuItemStyle: {
          width: '250px'
        },
        userDataStyle:{
            display: "inline-block",

        },

      };

    return (
      <div style={styles.userDataStyle}>
        <div style={styles.menuStyle} className="menuBox">
          <div style={styles.menuItemStyle}>
            <Menu menuItems={menuItems} zDepth='2' onItemClick={this.menuClicked} />
          </div>
        </div>
          <div style={styles.userDataStyle}></div>
      </div>
     
    );
  },

  menuClicked (e, key, payload){
    //console.log(payload.text);
   // console.log(e);
    //console.log(key);
 

  }

  

});