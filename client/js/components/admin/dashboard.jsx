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
import UserList                                                                         from "./user_list";
import StatisticsPanel                                                                  from "./statistics_panel";
import ClientDataPanel                                                                  from "./client_data_panel";
import UserData                                                                         from "./user_data";


export default React.createClass({

  getState(){
    return {
      tab : ApplicationStore.currentMainTab(),
      accounts: AccountsStore.current(),
      users: AccountsStore.currentUsers(),
      selectedUser: ApplicationStore.currentSelectedUser(),
    };
  },

  getInitialState(){

    var state = this.getState();

    var initialUser = {
      currentSelectedUser:
      {
        name: " ", email: " ", username: " ", role: " "
      }
    };

    AdminActions.changeMainTab({action: "change_main_tab_pending", text: "Client Info"});
    AdminActions.setCurrentSelectedUser(initialUser);

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

      graphData:{
        width: '285px',
        height: '100px',
        borderColor: 'grey',
        borderStyle: 'solid',
        borderTop: '0px',
        borderLeft: '0px',
        borderBottom: '0px',
        borderRight: '1px solid grey',
        display: 'inline-block'
      },

      graphDataBar: {
        marginTop: "10px"
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

    var tab;
    var dataList = (<div>USERLIST</div>);
    // For now this will always be true but incase we need to
    // Add another tab to the admin page in the future we can do that.
    if(this.state.tab == 'Client Info'){
      tab = <ClientDataPanel menuItems={this.state.accounts} />;
      if(this.state.users != null){
        dataList = <UserList menuItems={this.state.users} />;
      } else {
        var noUsers = [{payload: "1", text: "No Users"}];
        dataList = <UserList menuItems={noUsers} />
      }
    }

    return (
      <div style={styles.adminDashboard}>
        <AdminToolBar />
        <div style={styles.adminInfoDock} className="admin-info-dock">
          <div style={styles.accountBlockStyle}>
            <h4 style={styles.headingStyle}>Accounts</h4>
            {tab}
          </div>
        </div>
      </div>
    );
  }
});