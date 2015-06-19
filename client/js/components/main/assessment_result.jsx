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
      assessmentResult : AssessmentStore.assessmentResult(),
      timeSpent        : AssessmentStore.timeSpent()   
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
      yourScoreStyle: {
        backgroundColor: "#f19b2c",
        color: "#fff",
        borderRadius: "25px",
        textAlign: "center",
        padding: "2%"
      },
      improveScoreStyle:{
        color: "#f00"
      },
      alignLeft: {
        float: 'left',
        color: "#458B00"
      },
      alignRight: {
        float: 'right',
        color: "#458B00"
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

        <div className="col-md-4" >
          <h3><strong>Your Quiz Results</strong></h3>
          <div style={styles.yourScoreStyle}>
            <h5 style={styles.center}>Your Score</h5>
            <h1 style={styles.center}>Score: {Math.trunc(this.state.assessmentResult.score)}</h1>
            <h6 style={styles.center}><a>See Overall Score</a></h6>
          </div>
          Time Spent: {this.state.timeSpent.minutes} mins {this.state.timeSpent.seconds} sec
          <br />
          Target Time:
        </div>

        <div className="col-md-4" >
          <h3><strong>Good Work On These Concepts</strong></h3>
          <p>You answered questions that covered these concepts correctly.</p>
          <p style={styles.alignLeft}>Put Green ul here</p><i className="glyphicon glyphicon-ok" style={styles.alignRight}></i>
          <div style={{clear: 'both'}}></div>
        </div>

        <div className="col-md-4" >
          <h3 style={styles.improveScoreStyle}><strong>How To Improve your Score <i className="glyphicon glyphicon-warning-sign" ></i></strong></h3>
          <p>You can retake this quiz in 1 hour - plenty of time to review these sections!</p>
          <h5>{this.state.assessmentResult.feedback}</h5>
          <a className="btn btn-default" href="#" role="button">See Questions</a>
        </div>

      </div>
    </div>);
  }

}