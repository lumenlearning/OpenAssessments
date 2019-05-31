"use strict";

"use strict";

import React                                                                            from "react";
import { Link }                                                                         from "react-router";
import Validator                                                                        from "validator";
import UserActions                                                                      from "../../actions/user";
import _                                                                                from "lodash";
import assign                                                                           from "object-assign";
import { Paper, TextField, FlatButton, RaisedButton, FontIcon}                          from "material-ui";
import AdminToolBar                                                                     from "./tool_bar";
import AdminActions                                                                     from "../../actions/admin";
import ApplicationStore                                                                 from "../../stores/application";
import AccountsStore                                                                    from "../../stores/accounts";

export default React.createClass({

  propTypes: {
    params: React.PropTypes.object.isRequired
  },

  getState(){
    return {
      users: AccountsStore.currentUsers(),
      currentAccount: AccountsStore.accountById(this.props.params.accountId)
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

  render(){

    var userList = this.state.users.map(function(account){
      return(<h2>{account.name}</h2>);
    });

    return (
      <div>
        <h3>{this.state.currentAccount.name}</h3>
        {userList}
      </div>
      )
  }

});
