"use strict";

import React                        from "react";
import User                         from "../../stores/user";
import { Router, Link }             from "react-router";
import { Menu, Paper }              from "material-ui";
import AdminActions                 from "../../actions/admin";
export default React.createClass({
  
  selectClient(e, index, payload){
    //AdminActions.loadUsers(payload.id, 1);
  },

  render: function() {
    
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

    var accountList = this.props.menuItems.map(function(account){
      //debugger;
      return <li><Link to="account" params={{accountId: account.id}}>{account.name}</Link></li>;
    })
    return (
      <div style={styles.menuStyle} className="menuBox">
        <div style={styles.menuItemStyle}>
          <ul>
            {accountList}
          </ul>
        </div>
      </div>
    );
  },

  

});