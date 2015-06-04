"use strict";

import React                                                                              from "react";
import User                                                                               from "../../stores/user";
import { Paper, FlatButton, RaisedButton, FontIcon, Dialog, DropDownMenu, TextField }     from "material-ui";
import AdminActions                                                                       from "../../actions/admin";

class UserData extends React.Component{

  editButtonClicked(){
    // open dialog to edit information 
    this.refs.information.show(); 
  }

  resetButtonClicked(){
    //
    this.refs.password.show();
  }

  deleteButtonClicked(){
    this.refs.deleteUser.show();
  }

  deleteUser(){
    this.refs.deleteUser.dismiss();
  }

  resetPassword(){
    //Generate an action to reset the password and email the user to sign in again.
    this.refs.password.dismiss();
  }

  updateInfo(){
    //Generate an action to reset the password and email the user to sign in again.
    var newInfo = {
      user: {
        name: this.refs.name.text,
        email: this.refs.email.text,
        role: "1"
      }
    };

    AdminActions.updateUser(this.props.user.accountID, this.props.user.userID, newInfo);
    this.refs.information.dismiss();
  }

  render(){
    var styles = {
      wrapperStyle: {
        width: "510px",
        height: "435px",
        padding: "10px"
      },

      paperStyle: {
        height: "435",
        width: "480px",
        marginBottom: "250px"
      },

      labelStyle: {
        padding: "10px"
      }
    };

    var deleteActions = [
      { text: 'Cancel' },
      { text: 'Delete', onClick: this.deleteUser, ref: 'submit' }
    ];

    var resetActions = [
      { text: 'Cancel' },
      { text: 'Reset', onClick: this.resetPassword, ref: 'submit' }
    ];

    var updateActions = [
      { text: 'Cancel' },
      { text: 'Update', onClick: this.updateInfo, ref: 'submit' }
    ];

    var dropDownItems = [
      {payload: '0', text: 'End User'},
      {payload: '1', text: 'Admin'}
    ];

    return(
      <div style={styles.wrapperStyle}>
        <Paper style={styles.paperStyle} className="user-data-wrapper" zDepth={2}>
          <div style={styles.labelStyle} className="user-info-labels">
            <h2>Name: {this.props.user.name}</h2>
            <h3>email: {this.props.user.email}</h3>
            <h3>Role: {this.props.user.role}</h3>
          </div>
          <div style={styles.labelStyle} className="user-info-buttons">
            <div>
              <RaisedButton className="edit-roles-button" label="Edit User" secondary={true} onClick={this.editButtonClicked}/>
            </div>
            <div>
              <RaisedButton className="edit-roles-button" label="Reset Password" secondary={true} onClick={this.resetButtonClicked}/>
            </div>
            <div>
              <RaisedButton className="edit-roles-button" label="Delete User" secondary={true} onClick={this.deleteButtonClicked}/>
            </div>
          </div>
        </Paper>
        <Dialog ref="password" title="Reset Password?" actions={resetActions} actionFocus="submit" modal={true} dismissOnClickAway={false}>
          Are you sure you would like to reset the password for this user?
        </Dialog>
        <Dialog ref="deleteUser" title="Delete User?" actions={deleteActions} actionFocus="submit" modal={true} dismissOnClickAway={false}>
          Are you sure you would like to delete this user?
        </Dialog>
        <Dialog ref="information" title="Edit Info" actions={updateActions} actionFocus="submit" modal={true} dismissOnClickAway={false}>
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
      </div>
    )
  }
}

UserData.propTypes = {
  user: React.PropTypes.object.isRequired
};

module.exports = UserData;

  