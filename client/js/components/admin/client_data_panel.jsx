"use strict";

import React                        from "react";
import User                         from "../../stores/user";
import Router                       from "react-router";
import { Menu, Paper }              from "material-ui";
import AdminActions                 from "../../actions/admin";
export default React.createClass({
  
  selectClient(e, index, payload){
    AdminActions.loadUsers(payload.id, 1);
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
      },
      paperStyle: {
        width: "260px"
      }
    };

    return (
      
        <div style={styles.menuStyle} className="menuBox">
          <div style={styles.menuItemStyle}>
            <Menu menuItems={this.props.menuItems} zDepth={2} onItemClick={this.selectClient}/>
          </div>
        </div>
      
    );
  },

  

});