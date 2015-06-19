"use strict";

import React            from "react";
import BaseComponent    from "../base_component";
import { Link }         from "react-router";
import Validator        from "validator";
import UserActions      from "../../actions/user";
import _                from "lodash";
import assign           from "object-assign";
import Checkbox         from "./checkbox";
import AdminActions     from "../../actions/admin";
import ApplicationStore from "../../stores/application";
import AccountsStore    from "../../stores/accounts";
import EditUserForm     from "./edit_user_form";
import { Paper, TextField, FlatButton, RaisedButton, FontIcon, Menu, Dialog} from "material-ui";
// import { Table, Column }        from "fixed-data-table";

class Users extends BaseComponent {

  constructor(props, context){
    super(props);
    this.state = this.getState(props.params.accountId);
    this.state.currentUser = {name: "", email: "", role: ""};
    this._bind("rowGetter");
    this.stores = [AccountsStore, ApplicationStore];
    AdminActions.loadUsers(props.params.accountId);
  }

  getState(accountId){
    return {
      users:          AccountsStore.currentUsers(),
      currentAccount: AccountsStore.accountById(accountId),
      selectedUsers:  AccountsStore.getSelectedUsers()
    };
  }

  onMenuItemClick(e, key, payload){
    if(this.refs[payload.ref].isChecked()){
      this.refs[payload.ref].setChecked(false);
      AdminActions.removeFromSelectedUsers(payload.user);
    } else {
      this.refs[payload.ref].setChecked(true);
      AdminActions.addToSelectedUsers(payload.user);
    }
  }

  editButtonClicked(){
    this.setState({currentUser: AccountsStore.userById(this.state.selectedUsers[0].id)});
    this.refs.editForm.editButtonClicked();

    for(var i=0; i<this.state.users.length; i++){
      var hash = "check-" + this.state.users[i].id;
      this.refs[hash].setChecked(false);
    }
  }

  deleteButtonClicked(){
    AdminActions.deleteUsers(this.state.selectedUsers);
    for(var i=0; i<this.state.users.length; i++){
      var hash = "check-" + this.state.users[i].id;
      this.refs[hash].setChecked(false);
    }
  }

  getStyles(){
    return {

    }
  }

  rowGetter(index){
    return this.state.users[index];
  }

  render() {
    var styles = this.getStyles();
    
    return (
      <div >

      </div>
    );
  }

}

Users.propTypes = {
  params: React.PropTypes.object.isRequired
};

module.exports = Users;