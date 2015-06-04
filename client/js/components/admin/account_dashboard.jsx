"use strict";

import React                                                                            from "react";
import { Link }                                                                         from "react-router";
import Validator                                                                        from "validator";
import UserActions                                                                      from "../../actions/user";
import _                                                                                from "lodash";
import assign                                                                           from "object-assign";
import { Paper, TextField, FlatButton, RaisedButton, FontIcon}                          from "material-ui";
import AdminActions                                                                     from "../../actions/admin";
import ApplicationStore                                                                 from "../../stores/application";
import AccountsStore                                                                    from "../../stores/accounts";

class AccountDashboard extends React.Component {

  constructor(){
    super();
    this.state = this.getState();
  }

  getState(){
    return {
      users: AccountsStore.currentUsers(),
      currentAccount: AccountsStore.accountById(this.props.params.accountId)
    };
  }

  getInitialState(){
    var state = this.getState();
    AdminActions.loadUsers(this.props.params.accountId);
    return this.getState();
  }

  // Method to update state based upon store changes
  storeChanged(){
    this.setState(this.getState());
  }

  // Listen for changes in the stores
  componentDidMount(){
    AccountsStore.addChangeListener(this.storeChanged);
    ApplicationStore.addChangeListener(this.storeChanged);
  }

  // Remove change listers from stores
  componentWillUnmount(){
    AccountsStore.removeChangeListener(this.storeChanged);
    ApplicationStore.removeChangeListener(this.storeChanged);
  }

  render(){

    var styles = {
      accountDashboard: {
        marginLeft: "300px"
      }
    };

    return (
      <div style={styles.accountDashboard}>
        <h3>{this.state.currentAccount.name}</h3>
        <h4><Link to="users-list" params={{accountId: this.props.params.accountId}}>Users</Link></h4>
      </div>
      )
  }

}

AccountDashboard.propTypes = {
  params: React.PropTypes.object.isRequired
};

module.exports = AccountDashboard;

