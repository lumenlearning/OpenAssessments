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

  getStyles(){
    return {
      resultsStyle: {
        width: "30%",
        height: "120px",
      },

      progressStyle: {
        width:"100%"
      },

      goodWork: {
        width: "30%",
        height: "120px",
        marginLeft: "22px",
      },

      improve: {
        width: "30%",
        height: "120px",
        marginLeft: "22px",

      },

      wrapperStyle:{
        //display: "inline-block"   
      }
    }
  }

  render(){
    var styles = this.getStyles(); 
    return( 
    <div>
      <div className="progress">
        <div className="progress-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={styles.progressStyle}></div>
      </div>
      <div style={styles.wrapperStyle}>
        <div style={styles.resultsStyle} className="form-group panel panel-default">
          <p>Your Score< /p>
          <h1>
            Score: {this.state.assessmentResult.score}
          </h1>
          <p>See Overall Score</p>
        </div>
        <div style={styles.goodWork} className="form-group panel panel-default">
          <div><p>You answered questions that cover these concepts correctly</p></div>
        </div>
        <div style={styles.improve} className="form-group panel panel-default">
          <div>
            <h1>
              Feedback: {this.state.assessmentResult.feedback}
            </h1>
          </div>
        </div>
      </div>
    </div>);
  }

}