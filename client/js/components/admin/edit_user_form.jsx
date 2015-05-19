"use strict";

import React                                                                              from "react";
import User                                                                               from "../../stores/user";
import { Paper, FlatButton, RaisedButton, FontIcon, Dialog, DropDownMenu, TextField }     from "material-ui";
import AdminActions                                                                       from "../../actions/admin";

export default React.createClass({
  
  editButtonClicked(){
    // open dialog to edit information 
    this.refs.information.show(); 
  },

  updateInfo(){
    //Generate an action to reset the password and email the user to sign in again.

    var payload = {}
    //
    var role = this.refs.newRole.state.selectedIndex + 1;
    var payload = {user: {name: this.refs.name.getValue(), email: this.refs.name.getValue, role: role}};
    AdminActions.updateUser(this.props.user.account_id, this.props.user.id, payload);
    AdminActions.loadUsers(this.props.user.account_id, 1);
    this.refs.information.dismiss();
  },

  render(){
    var styles = {
    
    };

    var updateActions = [
      { text: 'Cancel' },
      { text: 'Update', onClick: this.updateInfo, ref: 'submit' }
    ];

    var dropDownItems = [
      {payload: '0', text: 'End User'},
      {payload: '1', text: 'Admin'},
    ];

    var title = "Edit Info for " + this.props.user.name;
    
    return(
        <Dialog ref="information" title={title} actions={updateActions} actionFocus="submit" modal={true} dismissOnClickAway={false}>
          <div>
            <h4>Name</h4>
            <TextField hintText={this.props.user.name} floatingLabelText="Name" ref="name" />
          </div>
          <div>
            <h4>Email</h4>
            <TextField hintText={this.props.user.email} floatingLabelText="Email" ref="email" />
          </div>
          <div>
            <h4>Role</h4>
            <DropDownMenu ref="newRole" menuItems={dropDownItems} />
          </div>
        </Dialog>
    )
  }
});