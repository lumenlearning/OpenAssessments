"use strict";

import React                                                                            from "react";
import Router                                                                           from "react-router";
import Validator                                                                        from "validator";
import UserActions                                                                      from "../../actions/user";
import _                from "lodash";
import assign           from "object-assign";
import AdminToolBar     from "./tool_bar";
import AdminActions     from "../../actions/admin";
import AccountsStore    from "../../stores/accounts";
import AccountsList     from "./accounts_list";
import UsersStore       from "../../stores/user";
import BaseComponent    from "../base_component";
import { Paper, TextField, FlatButton, RaisedButton, FontIcon}  from "material-ui";

var Link = Router.Link;

class AccountSelection extends BaseComponent {

  constructor(props, context){
    super(props, context);
    
    this.stores = [UsersStore, AccountsStore];
    this.state = this.getState();

    this._bind("getState");
    if(this.state.loggedIn){
      AdminActions.resetUsersStore();
      if(this.state.accounts.length <= 0){
        AdminActions.loadAccounts();
      }
    } else {
      context.router.transitionTo('login');
    }

  }

  getState(){
    return {
      accounts: AccountsStore.current(),
      router: this.context.router,
      loggedIn: UsersStore.loggedIn()
    };
  }

  getStyles(){
    return {
      adminDashboard: {
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: "10px"
      },
      headingStyle: {
        marginLeft: "10px",
        marginBottom: "0px"
      },
      accountBlockStyle: {
        width: '300px',
        margin: 'auto',
        marginTop: '30px'
      }
    };
  }

  render(){
    var styles = this.getStyles();
    if(this.state.loggedIn){
      return (
        <div style={styles.adminDashboard}>
          <div style={styles.adminInfoDock} className="admin-info-dock">
            <div style={styles.accountBlockStyle}>
              <h4 style={styles.headingStyle}>Accounts</h4>
              <AccountsList menuItems={this.state.accounts} />
            </div>
          </div>
        </div>
      );
    } else {
      return <div />
    }
  }

}

AccountSelection.contextTypes = {
  router: React.PropTypes.func.isRequired
};

module.exports = AccountSelection;

