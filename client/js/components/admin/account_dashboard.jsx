"use strict";

import React            from "react";
import BaseComponent    from "../base_component";
import AdminActions     from "../../actions/admin";
import ApplicationStore from "../../stores/application";
import AccountsStore    from "../../stores/accounts";

class AccountDashboard extends BaseComponent {

  constructor(props, context){
    super(props, context);
    this.stores = [ApplicationStore, AccountsStore];
    this.state = this.getState(props);

    if(props.params.accountId){
      AdminActions.loadUsers(props.params.accountId);
    }
  }

  getState(props){
    var accountId = props.params.accountId;
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
      </div>);
  }

}

AccountDashboard.propTypes = {
  params: React.PropTypes.object.isRequired
};

module.exports = AccountDashboard;

