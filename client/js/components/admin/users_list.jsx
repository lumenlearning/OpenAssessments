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
      <div>Users</div> 
    );
  },


  

});