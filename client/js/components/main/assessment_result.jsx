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
      progressStyle: {
        width:"100%"
      },
      wrapperStyle:{
        width: "100%",
        position: "relative"
      },
      resultsStyle: {
        width: "30%",
        height: "120px",
        positon: "absolute",
        top: "0",
        marginLeft: "3%",
        backgroundColor: "#c0c0c0"
      },
      goodWork: {
        width: "30%",
        height: "120px",
        position: "absolute",
        top: "0",
        left: "35%",
        backgroundColor: "#b4b4c9"
      },
      improve: {
        width: "30%",
        height: "120px",
        position: "absolute",
        top: "0",
        left: "67%",
        backgroundColor: "#f1c692"
      },
      yourScoreStyle: {
        backgroundColor: "#f19b2c",
        color: "#fff",
        borderRadius: "25px",
        marginLeft: "auto",
        marginRight: "auto"
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

        <div style={styles.resultsStyle} >
          <h3>Your Quiz Results</h3>
          <div style={styles.yourScoreStyle}>
            <h5>Your Score</h5>
            <h1>Score: {this.state.assessmentResult.score}</h1>
            <h6><a>See Overall Score</a></h6>
          </div>
        </div>

        <div style={styles.goodWork} >
          <div><p>You answered questions that cover these concepts correctly</p></div>
        </div>

        <div style={styles.improve} >
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