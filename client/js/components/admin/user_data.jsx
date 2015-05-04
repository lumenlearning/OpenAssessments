"use strict";

import React                                            from "react";
import User                                             from "../../stores/user";
import { Paper, FlatButton, RaisedButton, FontIcon, Dialog }    from "material-ui";
import AdminActions                                     from "../../actions/application";

export default React.createClass({
  
  getInitialState(){
    return {
      user: {
        name: "Joseph Ditton",
        email: "dittonjs@gmail.com",
        username: "dittonjs",
        role: "Admin"
      }
    }
  },
  
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
        height: "425px",
        display: "inline-block",
        float: "right",
        margin:  "10px"
      }
    }

    var standardActions = [
      { text: 'Cancel' },
      { text: 'Submit', onClick: this.resetPassword, ref: 'submit' }
    ];

    return(
      <Paper style={styles.wrapperStyle} className="user-data-wrapper" zDepth={2}>
        <div className="user-info-labels">
          <h2>Name: {this.props.user.name}</h2>
          <h3>email: {this.props.user.email}</h3>
          <h3>Username: {this.props.user.username}</h3>
          <h3>Role: {this.props.user.role}</h3>
        </div>
        
        <div className="user-info-buttons">
          <RaisedButton className="edit-roles-button" label="Edit Role" secondary={true} onClick={this.editButtonClicked}/>
          <RaisedButton className="edit-roles-button" label="Reset Password" primary={true} onClick={this.resetButtonClicked}/>
        </div>
        <Dialog ref="password" title="Reset Password?" actions={standardActions} actionFocus="submit" modal={true} dismissOnClickAway={false}>
          Are you sure you would like to reset the password for this user?
        </Dialog>
      </Paper>
    )
  }
});
