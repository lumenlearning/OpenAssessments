"use strict";

import React            from "react";
import BaseComponent    from "../base_component";
import { Link }         from "react-router";
import Validator        from "validator";
import UserActions      from "../../actions/user";
import _                from "lodash";
import assign           from "object-assign";
//import Checkbox         from "./checkbox";
import AdminActions     from "../../actions/admin";
import ApplicationStore from "../../stores/application";
import AccountsStore    from "../../stores/accounts";
import AdminStore       from "../../stores/admin";
import EditUserForm     from "./edit_user_form";
import Expandable       from "./expandable";
import { Toolbar, ToolbarGroup, ToolbarTitle, FontIcon, RaisedButton, Paper, IconButton, Checkbox} from "material-ui";
import Defines          from "../defines";
// import { Table, Column }        from "fixed-data-table";

class Users extends BaseComponent {

  constructor(props, context){
    super(props);
    this.state = this.getState(props.params.accountId);
    this.state.currentUser = {name: "", email: "", role: ""};
    this.stores = [AccountsStore, ApplicationStore, AdminStore];
    AdminActions.loadUsers(props.params.accountId);
  }

  getState(accountId){
    return {
      users          : AccountsStore.currentUsers(),
      currentAccount : AccountsStore.accountById(accountId),
      selectedUsers  : AccountsStore.getSelectedUsers(),
      navStatus      : AdminStore.navStatus()
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

  getStyles(status){
    var marginLeft = status ? "256px" : "0px";
    return {
      toolbarStyle: {
        backgroundColor: Defines.colors.lightGrey
      },
      titleStyle:{
        color: Defines.colors.black
      },
      div: {
        marginLeft: marginLeft,
        transition: "margin .3s"
      },
      table: {
        width: "100%"
      },
      paper: {
        margin: "auto 20px",
        marginRight: "48px"
      },
      row: {
        height: "60px"
      },
      id: {
        borderBottom: "1px solid " + Defines.colors.lightGrey,
        borderRight: "1px solid " + Defines.colors.lightGrey, 
        width: "8%",
      },
      avatar: {
        borderBottom: "1px solid " + Defines.colors.lightGrey,
        borderRight: "1px solid " + Defines.colors.lightGrey, 
        width: "8%",
      },
      username: {
        borderBottom: "1px solid " + Defines.colors.lightGrey,
        borderRight: "1px solid " + Defines.colors.lightGrey, 
        width: "20%",
      },
      role: {
        borderBottom: "1px solid " + Defines.colors.lightGrey,
        borderRight: "1px solid " + Defines.colors.lightGrey, 
        width: "10%",
      },
      sCount: {
        borderBottom: "1px solid " + Defines.colors.lightGrey,
        borderRight: "1px solid " + Defines.colors.lightGrey, 
        width: "14%",
      },
      lastS: {
        borderBottom: "1px solid " + Defines.colors.lightGrey,
        borderRight: "1px solid " + Defines.colors.lightGrey, 
        width: "16%",
      },
      icons: {
        borderBottom: "1px solid " + Defines.colors.lightGrey, 
        width: "28%",
      },
      span: {
        display: "table-cell",
        verticalAlign: "middle",
      },
      button: {
        marginLeft: "15px"
      }
    }
  }

  toggle(e, id){
    var ref = id + "expandable";
    this.refs[ref].toggle()
  }

  addUser(){
    AdminActions.createUser()
  }

  render() {
    var styles = this.getStyles(this.state.navStatus);
    var headers = (
        <tr style={styles.row}>
          <th style={styles.id}>ID</th>
          <th style={styles.avatar}>Avatar</th>
          <th style={styles.username}>Username</th>
          <th style={styles.role}>Role</th>
          <th style={styles.sCount}>Sign In Count</th>
          <th style={styles.lastS}>Last Sign In</th>
          <th style={styles.icons}></th>
        </tr>
      )
    var users = this.state.users.map((user, index)=>{
      return (
        <div>
        <tr key={index + user.role} style={styles.row}>
          <td style={styles.id}>{user.id}</td>
          <td style={styles.avatar}>{user.avatar}</td>
          <td style={styles.username}>{user.email}</td>
          <td style={styles.role}>{user.role}</td>
          <td style={styles.sCount}>SIGN IN COUNT</td>
          <td style={styles.lastS}>LAST SIGN IN</td>
          <td style={styles.icons}>
            <span style={styles.span}> 
              <div >
                <RaisedButton  label="SHOW DETAILS" onClick={(e)=>{this.toggle(e, user.id)}} />
              </div>
            </span>
            <span style={styles.span}>
              <div style={styles.button}>
                <IconButton iconStyle={styles.iconStyle} iconClassName="material-icons-action-create" />
              </div>
            </span>
            <span style={styles.span}>
              <div style={styles.button}>
                <IconButton iconStyle={styles.iconStyle} iconClassName="material-icons-action-delete" />
              </div>
            </span>
            <span style={styles.span}>
              <div style={styles.button}>
                <Checkbox />
              </div>
            </span>
          </td>
        </tr>        
        <Expandable ref={user.id + "expandable"}/>
        </div>
        )
    })
    return (
      <div>
        <div style={styles.div}>
        <Toolbar style={styles.toolbarStyle}>
          <ToolbarGroup key={0} float="left">
            <ToolbarTitle style={styles.titleStyle} text="Users" />
          </ToolbarGroup>
          <ToolbarGroup key={1} float="right">
            <FontIcon className="material-icons-action-search" />
            <RaisedButton label="Create New User" onClick={()=>{addUser()}} primary={true} />
          </ToolbarGroup>
        </Toolbar>
        <Paper style={styles.paper}>
          <table style={styles.table}>
            {headers}
            {users}
          </table>
        </Paper>
        </div>
      </div>
    );
  }

}

Users.propTypes = {
  params: React.PropTypes.object.isRequired
};

module.exports = Users;