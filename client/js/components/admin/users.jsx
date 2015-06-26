"use strict";

import React            from "react";
import BaseComponent    from "../base_component";
import { Link }         from "react-router";
import Validator        from "validator";
import UserActions      from "../../actions/user";
import _                from "lodash";
import assign           from "object-assign";
import CreateUserForm   from "./create_user_form";
import EditUserForm     from "./edit_user_form";
import AdminActions     from "../../actions/admin";
import ApplicationStore from "../../stores/application";
import AccountsStore    from "../../stores/accounts";
import AdminStore       from "../../stores/admin";
import Defines          from "../defines";
import Container        from "./container";
import Griddle          from "griddle-react";
import UserControls     from "./user_controls";
import { Toolbar, ToolbarGroup, ToolbarTitle, FontIcon, RaisedButton, Paper, IconButton, Checkbox} from "material-ui";

class Users extends BaseComponent {

  constructor(props, context){
    super(props);
    this.state = this.getState(props.params.accountId);
    this.state.currentUser = {name: "", email: "", role: ""};
    this.stores = [AccountsStore, ApplicationStore];
    AdminActions.loadUsers(props.params.accountId);
  }

  getState(accountId){
    return {
      users          : AccountsStore.currentUsers(),
      currentAccount : AccountsStore.accountById(accountId),
      selectedUsers  : AccountsStore.getSelectedUsers()
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

  getStyles(){
    return {
      toolbarStyle: {
        backgroundColor: Defines.colors.lightGrey
      },
      titleStyle:{
        color: Defines.colors.black
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

  addUser(){
    this.refs.createUserForm.show();
  }

  columnMetadata(){
    return [
      {
        columnName: "controls",
        displayName: "",
        locked: true,
        visible: true,
        styles: this.getStyles(),
        accountId: this.props.params.accountId,
        customComponent: UserControls
      }
    ];
  }

  render() {
    var styles = this.getStyles();
    var user = _.where(this.state.users, { id: this.props.params.userId });
    var editing = false;
    if(_.last(this.context.router.getCurrentRoutes()).name == "userEdit"){
      editing = true;
    }
    return (
      <div>
        <Container>
          <Toolbar style={styles.toolbarStyle}>
            <ToolbarGroup key={0} float="left">
              <ToolbarTitle style={styles.titleStyle} text="Users" />
            </ToolbarGroup>
            <ToolbarGroup key={1} float="right">
              <FontIcon className="material-icons-action-search" />
              <RaisedButton label="Create New User" onClick={()=>{this.addUser()}} primary={true} />
            </ToolbarGroup>
          </Toolbar>
          <Paper style={styles.paper}>
            <Griddle
              columnMetadata={this.columnMetadata()}
              results={this.state.users} 
              tableClassName="table" 
              showFilter={true}
              showSettings={true}
              columns={["id", "name", "email", "role", "signInCount", "lastSignIn", "controls"]} />
          </Paper>
        </Container>
        <EditUserForm user={user} editing={editing} accountId={this.props.params.accountId} />
        <CreateUserForm ref="createUserForm" accountId={this.props.params.accountId} />
      </div>
    );
  }
}

Users.propTypes = {
  params: React.PropTypes.object.isRequired
};

Users.contextTypes = {
  router: React.PropTypes.func.isRequired
};

module.exports = Users;