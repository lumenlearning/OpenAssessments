"use strict";

import React              from 'react';
import AssessmentStore    from "../../stores/assessment";
import BaseComponent      from "../base_component";
import AssessmentActions  from "../../actions/assessment";
import ItemResult         from "./item_result";

export default class AssessmentResult extends BaseComponent{
 
  constructor(props, context){
    super(props, context);
    this._bind("getItemResults", "getStyles");
    this.stores = [AssessmentStore];
    this.state = this.getState();
  }

  getState(){
    return {
      assessmentResult : AssessmentStore.assessmentResult(),
      timeSpent        : AssessmentStore.timeSpent(),
      questions        : AssessmentStore.allQuestions()   
    }
  }

  getStyles(theme){
    return {
      assessment: {
        padding: theme.assessmentPadding,
        backgroundColor: theme.assessmentBackground,
      },
      progressStyle: {
        width:"100%"
      },
      wrapperStyle:{
        width: "100%",
        position: "relative"
      },
      yourScoreStyle: {
        backgroundColor: theme.definitelyBackgroundColor,
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
      },
      assessmentContainer:{
        marginTop: "70px",
        boxShadow: theme.assessmentContainerBoxShadow, 
        borderRadius: theme.assessmentContainerBorderRadius,
        padding: "20px"
      },
      resultsStyle: {
        padding: "20px"
      }
    }
  }

  getItemResults(){
    return this.state.questions.map((question, index)=>{
      return <ItemResult question={question} isCorrect={this.state.assessmentResult.correct_list[index]} confidence={this.state.assessmentResult.confidence_level_list[index]}/>
    })
  }

  render(){
    var styles = this.getStyles(this.context.theme); 
    var itemResults = this.getItemResults();
    return( 
    <div style={styles.assessment}>
      <div style={styles.assessmentContainer}>
        <div className="row" style={styles.wrapperStyle}>

          <div className="col-md-4" >
            <h3><strong>Your Quiz Results</strong></h3>
            <div style={styles.yourScoreStyle}>
              <h5 style={styles.center}>Your Score</h5>
              <h1 style={styles.center}>{Math.trunc(this.state.assessmentResult.score)}%</h1>
            </div>
            Time Spent: {this.state.timeSpent.minutes} mins {this.state.timeSpent.seconds} sec
            <br />
            Attempts
          </div>

          <div className="col-md-4" >
            <h3><strong>Good Work On These Concepts</strong></h3>
            <p>You answered questions that covered these concepts correctly.</p>
            <p style={styles.alignLeft}>Put Green ul here</p><i className="glyphicon glyphicon-ok" style={styles.alignRight}></i>
            <div style={{clear: 'both'}}></div>
          </div>

          <div className="col-md-4" >
            <h3 style={styles.improveScoreStyle}><strong>There is still more to learn<i styleclassName="glyphicon glyphicon-warning-sign" ></i></strong></h3>
            <p>You can retake this quiz in 1 hour - plenty of time to review these sections!</p>
            <h5>{this.state.assessmentResult.feedback}</h5>
          </div>

        </div>
        <hr />
        <div style={styles.resultsStyle}>
          {itemResults}
        </div>
      </div>
    </div>);
  }
}

AssessmentResult.contextTypes = {
  theme: React.PropTypes.object,
}