"use strict";

import React            from "react";
import AccountsStore    from "../../stores/accounts";
import BaseComponent    from "../base_component";
import AdminActions     from "../../actions/admin";
import { DropDownMenu } from "material-ui";
import Defines          from "../defines";
import Transitions     from "../../../node_modules/material-ui/src/styles/transitions";

class Expandable extends BaseComponent {
   constructor(props, context){
    super(props);
    this.state = this.getState();
    this._bind("open","close", "toggle");
  }

  getStyles(expanded){
    var height = expanded ? "80px" : "0px";
    var display = expanded ? "" : "none";
    var border = expanded ? "1px solid " + Defines.colors.lightGrey : ""
    return {
      row: {
        borderBottom: border
      },
      data: {
       //Transitions.easeOut(),
        overflow: 'hidden',
        height: height,
        transition: "height .5s",
      },

    };
  }

  toggle(){
    if(this.state.expanded){
      this.close();
    } else {
      this.open();
    }
  }

  open(){
    this.setState({expanded: true});
    if(this.props.onOpen){
      this.props.onClose()
    }
  }

  close(){
    this.setState({expanded: false});
    if(this.props.onClose){
      this.props.onClose();
    }
  }

  getState(){
    return {
      expanded: false
    }
  }

  render(){
    var styles = this.getStyles(this.state.expanded);
    return (
      <tr ref="expandable" >
        <td colSpan="7" style={styles.row}><div style={styles.data}>
          THIS WORKS
        </div></td>
      </tr>
      );
  }
}

Expandable.propTypes = {
  onClose: React.PropTypes.func,
  onOpen: React.PropTypes.func,
}

module.exports = Expandable;