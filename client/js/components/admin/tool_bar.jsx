"use strict";

import React                                                                  from "react";
import User                                                                   from "../../stores/user";
import StoreKeeper                                                            from "../mixins/store_keeper";
import Router                                                                 from "react-router";
import { Toolbar, ToolbarGroup, DropDownMenu, RaisedButton, TextField, Paper} from "material-ui";
import AdminActions                                                           from "../../actions/admin";

export default React.createClass({

  onToolbarChange(e, index, payload){
    // Generate an action
    AdminActions.changeMainTab(payload);
  },

  render() {
    var dropDownItems = [
      {payload: '0', text: 'Client Info'},
    ];

    var styles = {
      searchBarStyle: {
        marginTop: '9px',
        display: 'inline-block',
      },

      graphPaper: {
        width: 'auto',
        minHeight: '60px',
        background: 'white'
      },

      graphTitleBar: {
        width: 'auto'
      },

      leftFloat: {
        float: 'left'
      },

      rightFloat: {
        paddingRight: '20px',
        float: 'right'
      }
    };

    return (
      <Paper style={styles.graphPaper} className="graph-paper">
        <div style={styles.leftFloat}>
          <DropDownMenu menuItems={dropDownItems} onChange={this.onToolbarChange}/>
        </div>
        <div style={styles.rightFloat}>
          <div style={styles.searchBarStyle}>
            <TextField hintText="Search..." />
          </div>
          <RaisedButton label="Search" secondary={true} />
        </div>
      </Paper>
    );
  }

});