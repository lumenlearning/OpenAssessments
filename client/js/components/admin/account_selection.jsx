"use strict";

import React                                                                            from "react";
import Router                                                                           from "react-router";
import Validator                                                                        from "validator";
import UserActions                                                                      from "../../actions/user";
import _                                                                                from "lodash";
import assign                                                                           from "object-assign";
import { Paper, TextField, FlatButton, RaisedButton, FontIcon}                          from "material-ui";
import AdminToolBar                                                                     from "./tool_bar";
import AdminActions                                                                     from "../../actions/admin";
import ApplicationStore                                                                 from "../../stores/application";
import AccountsStore                                                                    from "../../stores/accounts";
import AccountsList                                                                     from "./accounts_list";
import UsersStore                                                                       from "../../stores/user";

var Link = Router.Link;


export default React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  getState(){
    return {
      accounts: AccountsStore.current(),
    };
  },

  getInitialState(){
    if(!UsersStore.loggedIn()){
      this.context.router.transitionTo('login');
      return null;
    }

    var state = this.getState();
    AdminActions.resetUsersStore();
    if(state.accounts.length <= 0){
      AdminActions.loadAccounts();
    }
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

  render(){
    var styles = {

      adminDashboard: {
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: "10px",
      },


      headingStyle: {
        marginLeft: "10px",
        marginBottom: "0px"
      },

      accountBlockStyle: {
        width: '300px',
        margin: 'auto',
        marginTop: '30px',
      }

    };

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
  }
});
