"use strict";

import React        from "react";
import { Link }     from "react-router";
import Validator    from "validator";
import UserActions  from "../../actions/user";
import _            from "lodash";
import assign       from "object-assign";
import { Paper, TextField, FlatButton, RaisedButton, FontIcon } from "material-ui";
import AdminToolBar from "./adminToolBar";

export default React.createClass({

  
  
  render: function(){
    let styles = {
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
      borderBottom: '1px solid grey'
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
    },

  };

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

              <div style={styles.adminInfoDock} id = "admin-info-mount" className="admin-info-dock">

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