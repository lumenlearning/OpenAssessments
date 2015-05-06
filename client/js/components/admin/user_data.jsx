"use strict";

import React                                            from "react";
import User                                             from "../../stores/user";
import { Paper, FlatButton, RaisedButton, FontIcon, Dialog }    from "material-ui";
import AdminActions                                     from "../../actions/admin";

export default React.createClass({
  
  editButtonClicked(){
    // open dialog to edit information  
  },

  resetButtonClicked(){
    //
    this.refs.password.show();
  },

  resetPassword(){
    //Generate an action to reset the password and email the user to sign in again.
    this.refs.password.dismiss();
    console.log("Password Reset");
  },

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
        marginBottom: "250px",
      },

      labelStyle: {
        padding: "10px",
      }
    }

    var standardActions = [
      { text: 'Cancel' },
      { text: 'Submit', onClick: this.resetPassword, ref: 'submit' }
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
            <RaisedButton className="edit-roles-button" label="Edit Role" secondary={true} onClick={this.editButtonClicked}/>
            <RaisedButton className="edit-roles-button" label="Reset Password" primary={true} onClick={this.resetButtonClicked}/>
          </div>
        </Paper>
        <Dialog ref="password" title="Reset Password?" actions={standardActions} actionFocus="submit" modal={true} dismissOnClickAway={false}>
          Are you sure you would like to reset the password for this user?
        </Dialog>
      </div>
    )
  }
});
