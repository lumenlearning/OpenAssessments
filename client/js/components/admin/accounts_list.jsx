"use strict";

import React                        from "react";
import User                         from "../../stores/user";
import {Link}                       from "react-router";
import { Menu, Paper }              from "material-ui";
import AdminActions                 from "../../actions/admin";
export default React.createClass({

  render: function() {

    var styles = {
      menuStyle: {
        width: '300px',
        height: '435px',
        overflow: 'auto',
        padding: "10px"
      },
      menuItemStyle: {
        width: '250px'
      }
    };

    var accountList = this.props.menuItems.map(function(account){
      var param = {accountId: account.id}
      var link = (<Link to="account" params={param}>{account.name}</Link>);
      return { payload: account.id.toString(), text: link}
      
    });


    return (
      <div style={styles.menuStyle} className="menuBox">
        <div style={styles.menuItemStyle}>
            <Menu menuItems={accountList} zDepth={0} />
        </div>
      </div>
    );
  }



});