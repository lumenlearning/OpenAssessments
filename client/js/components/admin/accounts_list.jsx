"use strict";

import React                        from "react";
import User                         from "../../stores/user";
import {Link}                       from "react-router";
import { Menu, Paper }              from "material-ui";
import AdminActions                 from "../../actions/admin";

export default React.createClass({

  propTypes:{
    menuItems: React.PropTypes.array.isRequired
  },

  // There is a better way to do this.
  handleClick(e, key, payload){
    // pass the click event to the Link tag 
    this.refs[payload.ref].handleClick(e);
  },

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
      var ref = "linkTo" + account.id;
      var link = (<Link ref={ref} to="account" params={param}>{account.name}</Link>);
      return { payload: account.id.toString(), text: link, ref: ref}
      
    });


    return (
      <div style={styles.menuStyle} className="menuBox">
        <div style={styles.menuItemStyle}>
          <Menu className="accounts-menu" menuItems={accountList} zDepth={0} onItemClick={this.handleClick}/>
        </div>
      </div>
    );
  }



});