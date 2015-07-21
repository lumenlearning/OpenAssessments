"use strict";

import React              from 'react';
import AssessmentActions  from "../../actions/assessment";

export default class CheckUnderstanding extends React.Component{

  start(eid, assessmentId){
    AssessmentActions.start(eid, assessmentId);
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
      tips:{
        paddingLeft: "-20px !important",
        margin: "20px auto",
        width: "300px",
        textAlign: "start",
      },
      attemptsContainer: {
        textAlign: "center"
      }

    }
  }

  getAttempts(theme, styles, props){
    if(!theme.shouldShowAttempts){
      return "";
    } 
    
    if (props.userAttempts >= props.maxAttempts){
      return (
        <div style={styles.attemptsContainer}> 
          <div style={{...styles.attempts, ...{border: null}}}>
          <h1>Oops!</h1>
          <h3>You have already taken this quiz the maximum number of times</h3>  
        </div>
        <h4><u>TIPS:</u></h4>
        <div style={styles.tips}>
          <ul>
            <li>{"Right now you can do three things to make sure you are ready for the next performance assessment: review the material in this module, use the self-checks to see if you're getting it, and ask your peers or instructor for help if you need it."}</li>
            <li>{"In the future, allow enough time between your first and last quiz attempts to get help from your instructor before the last attempt!"}</li>
          </ul>
        </div>
      </div>
        )
    }
    
    return(
      <div style={styles.attemptsContainer}> 
        <div style={styles.attempts}>
          <h4>Attempt</h4>
          <h1>{this.props.userAttempts + 1}</h1>
          <h3>of {this.props.maxAttempts}</h3>
          <p>This is your 1st attempt for this outcome</p>
        </div>
      </div>)
  }

  render() {
    var styles = this.getStyles(this.context.theme);
    var attempts = this.getAttempts(this.context.theme, styles, this.props);
    var startButton = (
      <div style={styles.buttonWrapper}>
        <button style={styles.startButton} className="btn btn-info" onClick={()=>{this.start(this.props.eid, this.props.assessmentId)}}>Start Quiz</button>
      </div>)
    if (this.props.userAttempts == this.props.maxAttempts){
      startButton = "";
    }
    return (
      <div className="assessment_container" style={styles.assessmentContainer}>
        <div className="question">
          <div className="header" style={styles.header}>
            <p>{this.props.name}</p>
          </div>
          <div className="full_question" style={styles.fullQuestion}>
            {attempts}
            {startButton}
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
