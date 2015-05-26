"use strict";

import React                                                                            from "react";
import { Link }                                                                         from "react-router";
import Validator                                                                        from "validator";
import UserActions                                                                      from "../../actions/user";
import _                                                                                from "lodash";
import assign                                                                           from "object-assign";
import { Paper, TextField, FlatButton, RaisedButton, FontIcon, Menu, Dialog}            from "material-ui";
import Checkbox                                                                         from "./checkbox";
import AdminActions                                                                     from "../../actions/admin";
import ApplicationStore                                                                 from "../../stores/application";
import AccountsStore                                                                    from "../../stores/accounts";
import EditUserForm                                                                     from "./edit_user_form";

export default React.createClass({

  propTypes: {
    params: React.PropTypes.object.isRequired
  },
 
  getState(){
    return {
      users: AccountsStore.currentUsers(),
      currentAccount: AccountsStore.accountById(this.props.params.accountId),
      currentUser: {name: "", email: "", role: ""},
      selectedUsers: AccountsStore.getSelectedUsers()
    };
  },

  getInitialState(){
    var state = this.getState();
    AdminActions.loadUsers(this.props.params.accountId);
    return this.getState();
  },

  // Method to update state based upon store changes
  storeChanged(){
    this.setState(this.getState());
  },

  // Listen for changes in the stores
  componentDidMount(){
    AccountsStore.addChangeListener(this.storeChanged);
    ApplicationStore.addChangeListener(this.storeChanged);
  },

  // Remove change listers from stores
  componentWillUnmount(){
    AccountsStore.removeChangeListener(this.storeChanged);
    ApplicationStore.removeChangeListener(this.storeChanged);
  },

  onMenuItemClick(e, key, payload){
    if(this.refs[payload.ref].isChecked()){
      this.refs[payload.ref].setChecked(false);
      AdminActions.removeFromSelectedUsers(payload.user);
    } else {
      this.refs[payload.ref].setChecked(true);
      AdminActions.addToSelectedUsers(payload.user);
    }
  },

  editButtonClicked(){
    this.setState({currentUser: AccountsStore.userById(this.state.selectedUsers[0].id)});
    this.refs.editForm.editButtonClicked();
    
    for(var i=0; i<this.state.users.length; i++){
      var hash = "check-" + this.state.users[i].id;
      this.refs[hash].setChecked(false);
    }
  },

  deleteButtonClicked(){
    AdminActions.deleteUsers(this.state.selectedUsers);
    for(var i=0; i<this.state.users.length; i++){
      var hash = "check-" + this.state.users[i].id;
      this.refs[hash].setChecked(false);
    }
  },

  render() {
    var styles = {
      container: {
        width: "300px",
        margin: "auto"
      },

      menu: {
        marginTop: "10px",
        width: "300px"
      },

      block: {
        display: "inline-block"
      },

      checkbox: {
        display: "inline-block",
        float: "right",
        marginTop: "10px"
      },

      button: {
        marginLeft: "10px"
      }


    };
    
    var updateActions = [
      { text: 'Cancel' },
      { text: 'Update', onClick: this.updateInfo, ref: 'submit' }
    ];

    var dropDownItems = [
      {payload: '0', text: 'End User'},
      {payload: '1', text: 'Admin'}
    ];

    var usersList = this.state.users.map(function(user){
      
      var ref = "check-" + user.id; 
      var text = (
        <div>
          <div style={styles.block}>
            {user.name}
          </div>
          <div style={styles.checkbox}>
            <Checkbox ref={ref} />
          </div>
        </div>
      );
      return { payload: user.id.toString(), text: text, user: user, ref: ref}
      
    });

    var buttons;
    if(this.state.selectedUsers.length == 0){
      buttons = <div/>;
    } else if(this.state.selectedUsers.length == 1){
      buttons = (
        <div>
          <FlatButton style={styles.button} label="Edit User" primary={false} onClick={this.editButtonClicked} />
          <FlatButton style={styles.button} label="Delete Selected" primary={true}  onClick={this.deleteButtonClicked}/>
        </div>)
    } else {
      buttons = <FlatButton style={styles.button} label="Delete Selected" primary={true} onClick={this.deleteButtonClicked}/>
    }
    var roleId = 0;
    if(this.state.currentUser.role == "user")
      roleId = 0;
    if(this.state.currentUser.role == "instructor")
      roleId = 1;
    if(this.state.currentUser.role == "admin")
      roleId = 2;
    return (
      <div style={styles.container}>
        Users {buttons}
        <div style={styles.menu}>
          <Menu menuItems={usersList} onItemClick={this.onMenuItemClick} />
        </div>
        <EditUserForm ref="editForm" user={this.state.currentUser} selectedIndex={roleId}/>
      </div> 
    );
  }


});