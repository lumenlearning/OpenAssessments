"use strict";

import React                                                                            from "react";
import { Link }                                                                         from "react-router";
import Validator                                                                        from "validator";
import UserActions                                                                      from "../../actions/user";
import _                                                                                from "lodash";
import assign                                                                           from "object-assign";
import { Paper, TextField, FlatButton, RaisedButton, FontIcon, Menu, Dialog}            from "material-ui";
import AdminActions                                                                     from "../../actions/admin";
import ApplicationStore                                                                 from "../../stores/application";
import AccountsStore                                                                    from "../../stores/accounts";
import EditUserForm                                                                     from "./edit_user_form";

export default React.createClass({
 
  getState(){
    return {
      users: AccountsStore.currentUsers(),
      currentAccount: AccountsStore.accountById(this.props.params.accountId),
      currentUser: {name: "", email: "", role: ""}
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
    console.log(payload);
    this.setState({currentUser: AccountsStore.userById(payload.user.id)});
    this.refs.editForm.editButtonClicked();
  },

  render() {

    // We are going to need this later so dont delete it even though its empty
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

    var usersList = this.state.users.map(function(user){
      
      return { payload: user.id.toString(), text: user.name, user: user}
      
    });

    return (
      <div>
        Users
        <Menu menuItems={usersList} onItemClick={this.onMenuItemClick}/>
        <EditUserForm ref="editForm" user={this.state.currentUser}/>
      </div> 
    );
  },


  

});