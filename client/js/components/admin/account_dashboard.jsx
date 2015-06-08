"use strict";

import React            from "react";
import { Link }         from "react-router";
import Validator        from "validator";
import UserActions      from "../../actions/user";
import _                from "lodash";
import assign           from "object-assign";
import BaseComponent    from "../base_component";
import AdminActions     from "../../actions/admin";
import ApplicationStore from "../../stores/application";
import AccountsStore    from "../../stores/accounts";
import { Paper, TextField, FlatButton, RaisedButton, FontIcon}  from "material-ui";

class AccountDashboard extends BaseComponent {

  constructor(props, context){
    super(props, context);

    this.stores = [ApplicationStore, AccountsStore];
    this.state = this.getState(props);

    AdminActions.loadUsers(props.params.accountId);
    if(this.state.currentAccount === undefined){
      AdminActions.loadAccounts();
    }
  }

  getState(props){
    var accountId;
    if (props) {
      accountId = props.params.accountId;
    } else {
      accountId = this.props.params.accountId;
    }

    var currentAccountName;
    var currentAccount = AccountsStore.accountById(accountId);
    if (currentAccount) {
      currentAccountName = currentAccount.name;
    }

    return {
      users: AccountsStore.currentUsers(),
      currentAccount: currentAccount,
      currentAccountName: currentAccountName
    };
  }

  getStyles() {
    return {
      accountDashboard: {
        marginLeft: "300px"
      }
    };
  }

  render(){

    var styles = this.getStyles();

    return (
      <div style={styles.accountDashboard}>
        <h3>{this.state.currentAccountName}</h3>
        <h4><Link to="users-list" params={{accountId: this.props.params.accountId}}>Users</Link></h4>
      </div>
      );
  }

}

AccountDashboard.propTypes = {
  params: React.PropTypes.object.isRequired
};

module.exports = AccountDashboard;

