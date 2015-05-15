"use strict";

import React                        from "react";
import User                         from "../../stores/user";
import { Router, Link }             from "react-router";
import { Menu, Paper }              from "material-ui";
import AdminActions                 from "../../actions/admin";
export default React.createClass({

  linkToAccount(e, index, payload){
    alert(payload.text);

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
      return { payload: account.id.toString(), text: account.name }
      // <li><Link to="account" params={{accountId: account.id}}>{account.name}</Link></li>;
    });

    var labelMenuItems = [
       { payload: '1', text: 'ID', data: '1234567890', icon: 'home' },
       { payload: '2', text: 'Type', data: 'Announcement', icon: 'home' },
       { payload: '3', text: 'Caller ID', data: '(123) 456-7890', icon: 'home' }
    ];

    return (
      <div style={styles.menuStyle} className="menuBox">
        <div style={styles.menuItemStyle}>
          <ul>
            <Menu menuItems={accountList} zDepth={0} onItemClick={this.linkToAccount} />
          </ul>
        </div>
      </div>
    );
  },



});