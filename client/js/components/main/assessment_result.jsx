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
      },
      goodWork: {
        width: "30%",
        height: "120px",
        position: "absolute",
        top: "0",
        left: "35%",
      },
      improve: {
        width: "30%",
        height: "120px",
        position: "absolute",
        top: "0",
        left: "67%",
      },
      yourScoreStyle: {
        backgroundColor: "#f19b2c",
        color: "#fff",
        borderRadius: "25px",
        textAlign: "center",
        padding: "2%"
      },
      improveScoreStyle:{
        color: "#f00"
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
            <h5 style={styles.center}>Your Score</h5>
            <h1 style={styles.center}>Score: {Math.trunc(this.state.assessmentResult.score)}</h1>
            <h6 style={styles.center}><a>See Overall Score</a></h6>
          </div>
          <p>Time Spent:</p>
          <p>Target Time:</p>
        </div>

        <div style={styles.goodWork} >
          <h3>Good Work On These Concepts</h3>
          <p>You answered questions that covered these concepts correctly.</p>
          <p>Put Green ul here</p>
        </div>

        <div style={styles.improve} >
          <h3 style={styles.improveScoreStyle}>How To Improve your Score <i className="glyphicon glyphicon-warning-sign" ></i></h3>
          <p>You can retake this quiz in 1 hour - plenty of time to review these sections!</p>
          <h5>{this.state.assessmentResult.feedback}</h5>
          <a className="btn btn-default" href="#" role="button">See Questions</a>
        </div>

      </div>
    </div>);
  }

}