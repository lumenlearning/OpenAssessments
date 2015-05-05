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
      accounts: AccountsStore.currentAccounts(),
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
    AdminActions.getUserData({userList: []});
    AdminActions.getCurrentSelectedUser(initialUser);

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
    console.log(this.state.users);
    var styles = {
    
      adminDashboard: {
        marginLeft: "auto",
        marginRight: "auto",
        width: "1150px"
      },

      infoLabels: {
        width: '264px',
        height: '100px',
        display: 'inline-block',
      },

      infoLabelIcon: {
        width: '100px',
        height: '100px',
        borderColor: 'grey',
        borderStyle: 'solid',
        borderWidth: '1px',
        display: 'inline-block'
      },

      adminLabelData: {
        display: 'inline-block',
        margin: "auto",
      },

      graphPaper: {
        width: 'auto',
        height: '600px',
        marginTop: '20px',
      },

      graphTitleBar: {
        width: 'auto',
        height: '60px',
        
      },

      adminInfoDock: {
        width: 'auto',
        height: '450px',
        borderColor: 'grey',
        borderStyle: 'solid',
        borderTop: '0px',
        borderLeft: '0px',
        borderRight: '0px',
        borderBottom: '1px solid grey',
        
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

      spacer: {
        width: "28px",
        height: "100px",
        display: 'inline-block'
      }

    };

    var tab;
    var dataList = (<div>USERLIST</div>);
    var infoPaper;
    if(this.state.tab == 'Users'){
      tab = <UserList />;
    }
    if(this.state.tab == 'Client Info'){
      tab = <ClientDataPanel menuItems={this.state.accounts} />;
      if(this.state.users != null){
        dataList = <UserList menuItems={this.state.users} />;
      } else {
        var noUsers = [{payload: "1", text: "No Users"}];
        dataList = <UserList menuItems={noUsers} />
      }
    }
    if(this.state.tab == 'Statistics'){
      tab = <StatisticsPanel />;
    }
    console.log(this.state.selectedUser);
   
    return (
      <div style={styles.adminDashboard}>
        <div className="data-labels">
          <Paper style={styles.infoLabels} className="info-label">
            <div style={styles.infoLabelIcon} className="info-label-icon">
            </div>
            <div style={styles.adminLabelData} className="admin-label-data">
              <h3>DATA</h3>
            </div>
            </Paper>
            <div style={styles.spacer} className="spacer"></div>
            <Paper style={styles.infoLabels} className="info-label">
              <div style={styles.infoLabelIcon} className="info-label-icon">
              </div>
              <div style={styles.adminLabelData} className="admin-label-data">
                <h3>DATA</h3>
              </div>
          </Paper>
        <div style={styles.spacer} className="spacer"></div>

          <Paper style={styles.infoLabels} className="info-label">
            <div style={styles.infoLabelIcon} className="info-label-icon">
            </div>
            <div style={styles.adminLabelData} className="admin-label-data">
              <h3>DATA</h3>
            </div>
          </Paper>
          <div style={styles.spacer} className="spacer"></div>
          <Paper style={styles.infoLabels} className="info-label">
            <div style={styles.infoLabelIcon} className="info-label-icon">
            </div>
            <div style={styles.adminLabelData} className="admin-label-data">
              <h3>DATA</h3>
            </div>
          </Paper>
        </div>
        <div className="admin-report">
          <div className="admin-graphs">
            <Paper style={styles.graphPaper} className="graph-paper">
              <div style={styles.graphTitleBar} className="graph-title-bar">
                <AdminToolBar />
              </div>
              <div style={styles.adminInfoDock} className="admin-info-dock">
                <div style={{display: "inline-block"}}>
                  {tab}
                  {dataList} 
                  <UserData user={this.state.selectedUser}/>
                </div>
              </div>  
            </Paper>
          </div>
        </div>
      </div>
    );
  }
});