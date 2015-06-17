"use strict";

import React              from 'react';
import AssessmentStore    from "../../stores/assessment";
import BaseComponent      from "../base_component";
import AssessmentActions  from "../../actions/assessment";

export default class AssessmentResult extends BaseComponent{
 
  constructor(){
    super();
    this.stores = [AssessmentStore];
    this.state = this.getState();
  }

  getState(props, context){
    return {
      assessmentResult: AssessmentStore.assessmentResult()
    }
  }

  render(){
    var progressStyle = {width:"100%"};
    return( 
    <div>
      <div className="progress">
        <div className="progress-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={progressStyle}></div>
      </div>
      <div className="form-group panel panel-default">
        <h1>
        Score: {this.state.assessmentResult.score}
        </h1>
      </div>
      <div className="form-group panel panel-default">
        <h1>
        Feedback: {this.state.assessmentResult.feedback}
        </h1>
      </div>
      <div className="form-group panel panel-default">
        <h1>Do better at this: Studying</h1> 
      </div>
    </div>);
  }

}