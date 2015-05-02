"use strict";

import React                                                                  from "react";
import User                                                                   from "../../stores/user";
import StoreKeeper                                                            from "../mixins/store_keeper";
import Router                                                                 from "react-router";
import { Toolbar, ToolbarGroup, DropDownMenu, RaisedButton, TextField, Paper} from "material-ui";
import AdminActions                                                           from "../../actions/application";

export default React.createClass({

  onToolbarChange(e, index, payload){
    // Generate an action
    AdminActions.changeMainTab(payload);
  },

  render() {
    var dropDownItems = [
      {payload: '0', text: 'Client Info'},
      {payload: '1', text: 'Users'},
      {payload: '2', text: 'Statistics'}
    ];

    var styles = {
      searchBarStyle: {
        marginTop: '9px',
        display: 'inline-block',
      }
    };

    return (
      <Toolbar>
        <ToolbarGroup key={0} float="left">
          <DropDownMenu menuItems={dropDownItems} onChange={this.onToolbarChange}/>
        </ToolbarGroup>
        <ToolbarGroup key={1} float="right">
          <div style={styles.searchBarStyle}>
            <TextField hintText="Search..." />
          </div>
          <RaisedButton label="Search" secondary={true} />
        </ToolbarGroup>
      </Toolbar>
    );
  }

});