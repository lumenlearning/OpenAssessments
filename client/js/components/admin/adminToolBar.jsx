"use strict";

import React                from "react";
import User                 from "../../stores/user";
import StoreKeeper          from "../mixins/store_keeper";
import Router               from "react-router";
import { Toolbar, ToolbarGroup, DropDownMenu } from "material-ui";

export default React.createClass({
 
  render: function() {
     let dropDownItems = [
    {payload: '1', text: 'Users'},
    {payload: '2', text: 'Client Info'},
    {payload: '3', text: 'Statistics'}
    ];

    return (
      <Toolbar>
        <ToolbarGroup key={0} float="left">
          <DropDownMenu menuItems={dropDownItems} />
        </ToolbarGroup>
      </Toolbar>
    );
  },

  

});