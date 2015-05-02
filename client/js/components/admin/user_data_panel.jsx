"use strict";

import React                                      from "react";
import User                                       from "../../stores/user";
import StoreKeeper                                from "../mixins/store_keeper";
import Router                                     from "react-router";
import { Menu,FloatingActionButton }              from "material-ui";
import AdminActions                               from "../../actions/application";


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
        display: "block",
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
            <Menu menuItems={this.props.menuItems} zDepth='2' onItemClick={this.menuClicked} />
          </div>
        </div>
        <div style={styles.buttonStyle}>
          <FloatingActionButton />
          <FloatingActionButton secondary={true}/>
        </div>  
      </div>
    );
  },

  menuClicked (e, key, payload){
    //console.log(payload.text);
   // console.log(e);
    //console.log(key);
 

  }

  

});