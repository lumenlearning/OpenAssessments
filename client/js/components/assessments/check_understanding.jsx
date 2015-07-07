"use strict";

import React              from 'react';
import AssessmentActions  from "../../actions/assessment";

export default class CheckUnderstanding extends React.Component{

  start(){
    AssessmentActions.start();
  }

  getStyles(theme){
    return {
      assessmentContainer:{
        marginTop: "70px",
        boxShadow: theme.assessmentContainerBoxShadow, 
        borderRadius: theme.assessmentContainerBorderRadius
      },
      header: {
        backgroundColor: theme.headerBackgroundColor
      },
      startButton: {
        margin: "",
        width: theme.definitelyWidth,
        backgroundColor: theme.definitelyBackgroundColor
      },
      fullQuestion:{
        backgroundColor: theme.fullQuestionBackgroundColor
      },
      buttonWrapper: {
        textAlign: "center"
      },
      attempts:{
        margin: "20px auto",
        width: "300px",
        border: "1px solid black",
        borderRadius: "4px",
        textAlign: "center"
      },
      attemptsContainer: {
        textAlign: "center"
      }

    }
  }

  getAttempts(theme, styles){
    if(!theme.shouldShowAttempts){
      return "";
    }

    return(
    <div style={styles.attemptsContainer}> 
      <div style={styles.attempts}>
        <h4>Attempt</h4>
        <h1>1</h1>
        <h3>of {this.props.maxAttempts}</h3>
        <p>This is your 1st attempt for this outcome</p>
      </div>
    </div>)
  }

  render() {
    var styles = this.getStyles(this.context.theme);
    var attempts = this.getAttempts(this.context.theme, styles);
    return (
      <div className="assessment_container" style={styles.assessmentContainer}>
        <div className="question">
          <div className="header" style={styles.header}>
            <p>{this.props.name}</p>
          </div>
          <div className="full_question" style={styles.fullQuestion}>
            {attempts}
            <div style={styles.buttonWrapper}>
              <button style={styles.startButton} className="btn btn-info" onClick={()=>{this.start()}}>Start Quiz</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

CheckUnderstanding.propTypes = {
  name: React.PropTypes.string.isRequired
};

CheckUnderstanding.contextTypes = {
  theme: React.PropTypes.object
};
