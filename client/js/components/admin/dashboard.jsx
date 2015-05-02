"use strict";

import React                                                                            from "react";
import { Link }                                                                         from "react-router";
import Validator                                                                        from "validator";
import UserActions                                                                      from "../../actions/user";
import _                                                                                from "lodash";
import assign                                                                           from "object-assign";
import { Paper, TextField, FlatButton, RaisedButton, FontIcon}                          from "material-ui";
import AdminToolBar                                                                     from "./tool_bar";
import AdminActions                                                                     from "../../actions/application";
import ApplicationStore                                                                 from "../../stores/application";
import UserDataPanel                                                                    from "./user_data_panel";
import StatisticsPanel                                                                  from "./statistics_panel";
import ClientDataPanel                                                                  from "./client_data_panel";

export default React.createClass({

  getState(){
    return {
      tab : ApplicationStore.currentMainTab(),
      clients: ApplicationStore.clientDataList(),
      users: ApplicationStore.userDataList()
    };
  },

  getInitialState(){
      
      // This will eventually come from the database but for now its like this just to test how it works.
      var menuItems = [
        {payload: '0', text: "Hello!", data: "Atomic Jolt"},
        {payload: '1', text: "Other User", data: "Atomic Jolt"},
        {payload: '2', text: "Some Guy", data: "Atomic Jolt"},
        {payload: '3', text: "Some Other Guy", data: "Atomic Jolt"},
        {payload: '4', text: "Some Girl", data: "Atomic Jolt"},
        {payload: '5', text: "Me again", data: "Atomic Jolt"},
        {payload: '6', text: "An old man", data: "Atomic Jolt"},
        {payload: '7', text: "Crazy Person", data: "Atomic Jolt"}
      ];

      AdminActions.changeMainTab({action: "change_main_tab_pending", text: "Client Info"});
      AdminActions.getClientData({clientList: menuItems});
      AdminActions.getUserData({userList: ["asdfasdf"]})

    return this.getState();
  },

  // Method to update state based upon store changes
  storeChanged(){
    this.setState(this.getState());
  },

  // Listen for changes in the stores
  componentDidMount(){
    ApplicationStore.addChangeListener(this.storeChanged);
  },

  // Remove change listers from stores
  componentWillUnmount(){
    ApplicationStore.removeChangeListener(this.storeChanged);
  },
  
  render(){
    console.log(this.state.users);
    var styles = {
    
      adminDashboard: {
        margin: "auto",
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
        height: '440px',
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
      tab = <UserDataPanel />;
    }
    if(this.state.tab == 'Client Info'){
      tab = <ClientDataPanel menuItems={this.state.clients} />;
      if(this.state.users)
        dataList = <UserDataPanel menuItems={this.state.users} />;
    }
    if(this.state.tab == 'Statistics'){
      tab = <StatisticsPanel />;
    }
   
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
                {tab}
                <div style={{display:"inline"}}>
                  {dataList} 
                </div>
              </div>
              <div className="graph-data-bar">
                <div style={styles.graphData} className="graph-data">
                  <h3>DATA</h3>
                </div>

                <div style={styles.graphData} className="graph-data">
                  <h3>DATA</h3>
                </div>

                <div style={styles.graphData} className="graph-data">
                  <h3>DATA</h3>
                </div>

                <div style={styles.graphData} className="graph-data">
                  <h3>DATA</h3>
                </div>
              </div>  
            </Paper>
          </div>
        </div>
      </div>
    );
  }
});