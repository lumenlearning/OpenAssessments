"use strict";

import React              from 'react';
import AssessmentActions  from "../../actions/assessment";

export default class CheckUnderstanding extends React.Component{

  start(){
    AssessmentActions.start();
  }

  render() {
    return (
      <div id="enable_start">
        <div className="panel panel-primary">
          <div className="header">
            {this.props.name}
          </div>
          <div className="enable_start">
            <button className="btn btn-info" onClick={this.start}>Check Your Understanding </button>
          </div>
        </div>
      </div>
    );
  }

}